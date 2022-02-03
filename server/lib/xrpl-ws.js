const WebSocket = require('ws');
const streams = require('./streams');
const log = require('./logger')({ name: 'xrpl-ws.js ' });

/*const WebSocket = require('ws')

return await new Promise((resolve, reject) => {
    console.log('Connecting')
    const Client = new WebSocket('wss://xrplcluster.com')
    
    Client.on('open', e => {
      console.log('Connected, request server_info')
      Client.send(JSON.stringify({ command: 'server_info' }))
    })

    Client.on('message', data => {
      console.log('Got response')
      resolve(JSON.parse(data).result.info)
      Client.close()
    }) 
})*/

let connection;

function Connect() {
	const host = process.env.RIPPLED_HOST;
  log.info(`Connecting to wss://${host} ...`);
  const Client = new WebSocket(`wss://${host}`);

  // handle close
  Client.on('close', () => {
    log.info(`${host} closed`);
    Client.last = Date.now();
  });

  // handle error
  Client.on('error', e => {
    log.error(`${host} error - ${e.toString()}`);
  });

  // subscribe and save new connections
  Client.on('open', () => {
    log.info(`Connected to ${host}`);
    Client.send(
      JSON.stringify({
        command: 'subscribe',
        streams: ['ledger', 'validations', 'server'],
      })
    );
  });

  // handle messages
  Client.on('message', message => {
    Client.last = Date.now();
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      log.error('message parse error', message);
      log.error(e);
    }

    if (data.type === 'validationReceived') {
      streams.handleValidation(data);
    } else if (data.type === 'ledgerClosed') {
      streams.handleLedger(data);
    } else if (data.type === 'serverStatus') {
      streams.handleLoadFee(data);
    }
  });

  return Client;
};

const checkHeartbeat = () => {
	log.info('checkHeartbeat');
	if (Date.now() - connection.last > 10000) {
		connection.terminate();
		log.info(`Attempting to reconnect`);
		connection = Connect();
	}
};

setInterval(checkHeartbeat, 2000);

module.exports.start = () => {
	log.info('START!!!!');
	connection = Connect();
};
