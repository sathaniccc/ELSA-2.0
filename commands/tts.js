const { default: fetch } = require('node-fetch')
module.exports = {
  name: 'tts',
  description: 'Text-to-speech. Usage: !tts <text> (optional lang code: !tts en Hello)',
  category: 'media',
  run: async ({ reply, args, sock, chat }) => {
    if (!args.length) return reply('Usage: !tts <text> or !tts <lang> <text>')
    let lang = 'en'
    let text = args.join(' ')
    if (args[0].length <= 5 && /^[a-z-]+$/i.test(args[0])) {
      lang = args.shift()
      text = args.join(' ')
    }
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' }})
    if (!res.ok) return reply('TTS failed.')
    const buff = Buffer.from(await res.arrayBuffer())
    await sock.sendMessage(chat, { audio: buff, mimetype: 'audio/mpeg', ptt: false })
  }
}