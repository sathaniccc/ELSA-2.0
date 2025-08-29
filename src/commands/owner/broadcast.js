const { chunkText } = require('../../../utils/text');
module.exports = {
  name: 'broadcast',
  aliases: ['bc'],
  ownerOnly: true,
  help: 'Broadcast a message to recent chats (lightweight)',
  usage: 'broadcast <text>',
  run: async ({ sock, jid, args }) => {
    const text = args.join(' ').trim();
    if (!text) return sock.sendMessage(jid, { text: 'Provide text: !broadcast <text>' });
    const ids = new Set();
    const chats = await sock.store?.chats?.all() || [];
    for (const c of chats) {
      const id = c.id || c.jid || c.key?.remoteJid;
      if (id && typeof id === 'string' && id.includes('@s.whatsapp.net')) ids.add(id);
    }
    // Fallback to sending only to current chat if store unavailable
    if (ids.size === 0) ids.add(jid);
    const parts = chunkText(text);
    let sent = 0;
    for (const id of ids) {
      for (const part of parts) {
        try { await sock.sendMessage(id, { text: part }); sent++; } catch {}
      }
    }
    await sock.sendMessage(jid, { text: `Broadcast done. Messages sent: ${sent}` });
  }
}
