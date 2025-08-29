module.exports = {
  name: 'tagall',
  description: 'Mention all group members',
  category: 'admin',
  run: async ({ reply, sock, m, chat, isGroup }) => {
    if (!isGroup) return reply('Group only.')
    const meta = await sock.groupMetadata(chat)
    const mentions = meta.participants.map(p => p.id)
    await sock.sendMessage(chat, { text: 'Tagging all members', mentions })
  }
}