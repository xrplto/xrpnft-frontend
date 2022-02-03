const streams = require('../lib/streams');
const rippled = require('../lib/rippled');
const { formatAccountInfo } = require('../lib/utils');
const log = require('../lib/logger')({ name: 'iou' });

module.exports = async (req, res) => {
  const { currency: currencyCode, accountId: issuer } = req.params;

  try {
    log.info('Fetching gateway_balances from rippled (token.js)');
    const balances = await rippled.getBalances(issuer);
    const obligations = balances.obligations[currencyCode.toUpperCase()];
    if (!obligations) {
      throw new Error('Currency not issued by account');
    }

    log.info('Fetching account info from rippled (token.js)');
    const info = await rippled.getAccountInfo(issuer);

    const {
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      previousTxn,
      previousLedger,
    } = formatAccountInfo(info, streams.getReserve());

    return res.status(200).send({
      name,
      reserve,
      sequence,
      rate,
      domain,
      emailHash,
      balance,
      flags,
      gravatar,
      obligations,
      previousTxn,
      previousLedger,
    });
  } catch (error) {
    log.error(error.toString());
    return res.status(error.code || 500).json({ message: error.message });
  }
};
