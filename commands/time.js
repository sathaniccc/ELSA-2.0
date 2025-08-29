module.exports = {
  name: 'time',
  description: 'Current server time',
  category: 'utility',
  run: async ({ reply }) => reply(new Date().toString())
}