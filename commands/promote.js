module.exports = {
  name: 'promote',
  description: 'Promote a member to admin (reply or use number)',
  category: 'admin',
  run: async ({ reply, sock, chat, m, args, isGroup }) => {
    if (!isGroup) return reply('Group only.')
    const meta = await sock.groupMetadata(chat)
    const me = meta.participants.find(p => p.id === sock.user.id)
    if (!me?.admin) return reply('I need admin rights.')
    const target = (m.message?.extendedTextMessage?.contextInfo?.participant) || (args[0] && args[0].replace(/[^0-9]/g,'') + '@s.whatsapp.net')
    if (!target) return reply('Reply to a user or pass number.')
    await sock.groupParticipantsUpdate(chat, [target], 'promote')
    await reply('Promoted ✅')
  }
}