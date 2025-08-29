module.exports = {
  name: 'ping',
  description: 'Latency check',
  category: 'core',
  run: async ({ reply }) => {
    const t = Date.now()
    await reply('pong…')
    await reply(`pong ✅ latency: ${Date.now()-t}ms`)
  }
}