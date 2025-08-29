module.exports = {
  name: 'ping',
  help: 'Check if bot is alive',
  run: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: 'pong 🧊' });
  }
}
