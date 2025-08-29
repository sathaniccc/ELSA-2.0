const { formatUptime } = require('../util')
module.exports = {
  name: 'uptime',
  description: 'Show bot uptime',
  category: 'info',
  run: async ({ reply, startedAt }) => reply('Uptime: ' + formatUptime(Date.now()-startedAt))
}