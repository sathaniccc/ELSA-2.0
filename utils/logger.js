const pino = require('pino');
const pretty = process.env.LOG_PRETTY === 'true';
module.exports = pino(pretty ? { transport: { target: 'pino-pretty' } } : {});
