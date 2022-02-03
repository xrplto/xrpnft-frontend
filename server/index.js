//require('dotenv').config();
const app = require('./app');
const xrpl = require('./lib/xrpl-ws');
//const bodyParser = require('body-parser');

//app.use(bodyParser.json());

//const PORT = process.env.PORT || 5001;
//const ADDR = process.env.ADDR || 'localhost';
//app.listen(PORT, ADDR);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

xrpl.start();