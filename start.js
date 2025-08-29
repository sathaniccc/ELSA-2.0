require('dotenv').config();
const express = require('express');
const log = require('./utils/logger');
const { connectMongo } = require('./utils/db');
const { createSocket } = require('./src/connection');
const { loadCommands } = require('./src/commands');

(async () => {
  if (process.env.MONGO_URI) await connectMongo(process.env.MONGO_URI);

  const app = express();
  app.get('/', (_, res) => res.send('ELSA bot is running'));
  const port = process.env.PORT || 3000;
  app.listen(port, () => log.info('HTTP keepalive on ' + port));

  const sock = await createSocket();
    const commands = loadCommands();
  let prefix = process.env.PREFIX || '!';
  const owner = (process.env.OWNER_NUMBER || '').replace(/\D/g, ''); // e.g., 91XXXXXXXXXX

  function setPrefix(p) { prefix = p; }

  // simple anti-spam cache
  const lastText = new Map(); // jid -> text

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const m = messages[0];
    const jid = m.key?.remoteJid;
    if (!jid) return;

    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
    if (!text) return;

    // rate limit
    if (!canUse(jid)) return;

    // anti-spam: ignore exact same repeat back-to-back
    if (lastText.get(jid) === text) return;
    lastText.set(jid, text);

    if (!text.startsWith(prefix)) return;
    const [cmdName, ...args] = text.slice(prefix.length).trim().split(/\s+/);
    const cmd = commands.get((cmdName || '').toLowerCase());
    if (!cmd) return;

    // owner-only check
    if (cmd.ownerOnly) {
      const isOwner = owner && (jid.startsWith(owner) || jid.includes(owner));
      if (!isOwner) {
        await sock.sendMessage(jid, { text: '⛔ Owner-only command.' });
        return;
      }
    }

    try {
      await cmd.run({ sock, jid, args, m, commands, prefix, setPrefix });
    } catch (e) {
      log.error(e, 'Command error');
      await sock.sendMessage(jid, { text: '⚠️ Command failed.' });
    }
  });

  log.info('ELSA ready. Prefix: ' + prefix + ' (try: ' + prefix + 'ping, ' + prefix + 'menu)');

})().catch(err => {
  log.error(err, 'Fatal start error');
  process.exit(1);
});
