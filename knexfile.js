require('ts-node').register();
const config = require('./src/config/knexfile').KnexConfig;
module.exports = config