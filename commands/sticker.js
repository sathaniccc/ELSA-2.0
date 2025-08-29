const Jimp = require('jimp')

module.exports = {
  name: 'sticker',
  description: 'Create sticker from an image (send image with caption !sticker or reply to image with !sticker)',
  category: 'media',
  run: async ({ reply, m, getQuoted, downloadMedia, sock, chat }) => {
    let target = m
    const quoted = getQuoted()
    if (quoted) target = quoted

    const hasImg = target.message?.imageMessage
    if (!hasImg) return reply('Send/reply to an image with caption !sticker')

    try {
      const { buffer } = await downloadMedia(target)
      const image = await Jimp.read(buffer)

      // Resize max 512x512 for sticker
      image.scaleToFit(512, 512)

      const webpBuffer = await image.getBufferAsync('image/webp')

      await sock.sendMessage(chat, { sticker: webpBuffer })
    } catch (err) {
      console.error('sticker error:', err)
      reply('❌ Failed to create sticker.')
    }
  }
}
