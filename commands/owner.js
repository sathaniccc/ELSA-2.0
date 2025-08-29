module.exports = {
  name: 'owner',
  description: 'Show owner number',
  category: 'info',
  run: async ({ reply }) => reply('Owner: ' + (process.env.OWNER_NUMBER || 'not set'))
}