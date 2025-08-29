const ytdl = require('ytdl-core')
module.exports = {
  name: 'ytmp4',
  description: 'Download YouTube video: !ytmp4 <url>',
  category: 'downloader',
  run: async ({ reply, args, sock, chat }) => {
    const url = args[0]
    if (!url || !ytdl.validateURL(url)) return reply('Usage: !ytmp4 <valid YouTube URL>')
    const info = await ytdl.getInfo(url)
    const title = info.videoDetails.title
    const stream = ytdl.downloadFromInfo(info, { quality: '18', filter: 'videoandaudio' }) // 360p mp4
    const chunks = []
    await new Promise((resolve, reject)=>{
      stream.on('data', d => chunks.push(d))
      stream.on('end', resolve)
      stream.on('error', reject)
    })
    const buff = Buffer.concat(chunks)
    await sock.sendMessage(chat, { video: buff, caption: title })
  }
}