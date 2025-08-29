module.exports = {
  name: 'demote',
  description: 'Demote an admin',
  category: 'admin',
  run: async ({ reply, sock, chat, m, args, isGroup }) => {
    if (!isGroup) return reply('Group only.')
    const meta = await sock.groupMetadata(chat)
    const me = meta.participants.find(p => p.id === sock.user.id)
    if (!me?.admin) return reply('I need admin rights.')
    const target = (m.message?.extendedTextMessage?.contextInfo?.participant) || (args[0] && args[0].replace(/[^0-9]/g,'') + '@s.whatsapp.net')
    if (!target) return reply('Reply to a user or pass number.')
    await sock.groupParticipantsUpdate(chat, [target], 'demote')
    await reply('Demoted ✅')
  }
}