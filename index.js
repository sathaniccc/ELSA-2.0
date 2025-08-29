
const makeWASocket = require('@whiskeysockets/baileys').default
const { fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore, DisconnectReason, downloadContentFromMessage } = require('@whiskeysockets/baileys')
const Pino = require('pino')
const path = require('path')
const fs = require('fs')
const { prefix, owner, botName, phoneNumber } = require('./config')
const { formatUptime } = require('./util')

const commands = new Map()

// 🔹 Command Loader
function loadCommands() {
  commands.clear()
  const dir = path.join(__dirname, 'commands')
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    delete require.cache[path.join(dir, file)]
    try {
      const cmd = require(path.join(dir, file))
      if (cmd && cmd.name && typeof cmd.run === 'function') {
        commands.set(cmd.name.toLowerCase(), cmd)
      }
    } catch (e) {
      console.error('❌ Failed loading command', file, e)
    }
  }

  // 🔹 Core virtual commands
  commands.set('menu', {
    name: 'menu',
    description: 'Show command menu',
    category: 'core',
    run: async ({ reply }) => reply(generateMenu())
  })
  commands.set('list', {
    name: 'list',
    description: 'List all commands',
    category: 'core',
    run: async ({ reply }) => reply(generateMenu())
  })
  commands.set('alive', {
    name: 'alive',
    description: 'Show bot status',
    category: 'core',
    run: async ({ reply, startedAt }) =>
      reply(`🤖 ${botName} is alive!\n⏱ Uptime: ${formatUptime(Date.now() - startedAt)}\n👑 Owner: ${owner || 'not set'}\nPrefix: ${prefix}`)
  })
}

// 🔹 Menu Generator
function generateMenu() {
  const byCat = {}
  for (const [name, cmd] of commands) {
    const cat = (cmd.category || 'misc').toLowerCase()
    if (!byCat[cat]) byCat[cat] = []
    if (name === 'menu' || name === 'list') continue
    byCat[cat].push({ name, description: cmd.description || '' })
  }
  const lines = [`🌟 *${botName}* — Command Menu`, `Prefix: \`${prefix}\`\n`]
  for (const cat of Object.keys(byCat).sort()) {
    lines.push(`*${cat.toUpperCase()}*`)
    for (const c of byCat[cat].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`• \`${prefix}${c.name}\` — ${c.description}`)
    }
    lines.push('')
  }
  lines.push(`Total commands: ${commands.size}`)
  return lines.join('\n')
}

// 🔹 Main Start Function
async function start() {
  loadCommands()
  const startedAt = Date.now()
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'))
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: Pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'silent' }))
    },
    browser: [botName, "Chrome", "2.1"]
  })

  // Save creds on update
  sock.ev.on('creds.update', saveCreds)

// === Robust connection handler (auto-retry on 428) ===
sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
  const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== 401);
  if (connection === 'close') {
    const status = lastDisconnect?.error?.output?.statusCode;
    console.log('⚠️ Connection closed. Code:', status, ' Reconnect:', shouldReconnect);
    if (status === 428) {
      setTimeout(async () => {
        try {
          const clean = String(process.env.PHONE_NUMBER || phoneNumber || '').replace(/\D/g, '');
          if (!clean) return console.log('⚠️ PHONE_NUMBER missing; cannot request pairing code.');
          const code = await sock.requestPairingCode(clean);
          console.log('📲 New pairing code:', code);
        } catch (e) {
          console.error('❌ Pairing retry failed:', e?.message || e);
        }
      }, 1500);
    }
    if (shouldReconnect) start();
  } else if (connection === 'open') {
    console.log('✅ Connected as', sock.user?.id);
  }
});

  // 🔹 Pairing Code Fix
  if (!state.creds.registered && phoneNumber) {
    try {
      let code = await sock.requestPairingCode(phoneNumber)
      console.log("📲 Pair this bot using code:", code)
    } catch (err) {
      console.error("❌ Failed to get pairing code:", err)
    }
  }

  // 🔹 Connection Updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('⚠️ Connection closed. Reconnect:', shouldReconnect)
      if (shouldReconnect) start()
    } else if (connection === 'open') {
      console.log('✅ Connected as', sock.user?.id)
    }
  })

  // 🔹 Message Handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages[0]
      if (!m?.message || m.key.fromMe) return

      const chat = m.key.remoteJid
      const type = Object.keys(m.message)[0]
      const text = (m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        m.message.videoMessage?.caption || '').trim()

      const isGroup = chat.endsWith('@g.us')
      const sender = isGroup ? (m.key.participant || '') : m.key.remoteJid

      const reply = (txt) => sock.sendMessage(chat, { text: String(txt) }, { quoted: m })

      // 🔹 Quoted Media
      const getQuoted = () => {
        const ctx = m.message?.extendedTextMessage?.contextInfo || m.message?.imageMessage?.contextInfo || m.message?.videoMessage?.contextInfo
        return ctx?.quotedMessage
          ? { key: { remoteJid: chat, id: ctx.stanzaId, fromMe: false }, message: ctx.quotedMessage }
          : null
      }

      // 🔹 Download Media
      const downloadMedia = async (msg) => {
        const msgType = Object.keys(msg.message)[0]
        const stream = await downloadContentFromMessage(msg.message[msgType], msgType.replace('Message', ''))
        let buff = Buffer.from([])
        for await (const chunk of stream) buff = Buffer.concat([buff, chunk])
        return { buffer: buff, type: msgType }
      }

      if (!text.startsWith(prefix)) return
      const [raw, ...args] = text.slice(prefix.length).split(/\s+/)
      const name = raw.toLowerCase()
      const cmd = commands.get(name)
      if (!cmd) return reply(`❓ Unknown command: ${name}\n👉 Try \`${prefix}menu\``)

      await cmd.run({ sock, m, chat, args, reply, startedAt, isGroup, sender, getQuoted, downloadMedia })
    } catch (e) {
      console.error('❌ Handler error:', e)
    }
  })
}

// Start Bot
start().catch(e => console.error('🔥 Fatal error:', e))