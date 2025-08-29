module.exports = {
  name: 'restart',
  ownerOnly: true,
  help: 'Restart the bot process',
  run: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: 'Restarting... ⏳' });
    setTimeout(() => process.exit(0), 500);
  }
}
