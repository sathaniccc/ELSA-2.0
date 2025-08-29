const log = require('./logger');
process.on('unhandledRejection', (reason) => {
  log.error({ reason }, 'Unhandled Promise Rejection');
});
process.on('uncaughtException', (err) => {
  log.error({ err }, 'Uncaught Exception');
});
module.exports = {};
