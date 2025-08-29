const Jimp = require('jimp')

module.exports = {
  name: 'toimg',
  description: 'Convert sticker to image (reply to sticker)',
  category: 'media',
  run: async ({ reply, getQuoted, downloadMedia, sock, chat }) => {
    const quoted = getQuoted()
    if (!quoted || !quoted.message?.stickerMessage) {
      return reply('Reply to a sticker with !toimg')
    }

    try {
      const { buffer } = await downloadMedia(quoted)
      const image = await Jimp.read(buffer)
      const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG)

      await sock.sendMessage(chat, {
        image: pngBuffer,
        caption: 'Here you go!'
      })
    } catch (err) {
      console.error('toimg error:', err)
      reply('❌ Failed to convert sticker to image.')
    }
  }
}
