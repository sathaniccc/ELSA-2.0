const QR = require('qrcode')
module.exports = {
  name: 'qr',
  description: 'Generate QR code image: !qr <text/url>',
  category: 'tools',
  run: async ({ reply, args, sock, chat }) => {
    const text = args.join(' ')
    if (!text) return reply('Usage: !qr <text or url>')
    const png = await QR.toBuffer(text, { margin: 1, scale: 6 })
    await sock.sendMessage(chat, { image: png, caption: 'QR generated.' })
  }
}