const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const log = require('../utils/logger');
require('../utils/error-handler');

async function createSocket() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: process.env.USE_PAIRING === 'true' ? false : true,
    auth: state,
    browser: ['ELSA-Server', 'Chrome', '120'],
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  sock.ev.on('creds.update', saveCreds);

  if (process.env.USE_PAIRING === 'true') {
    const phone = (process.env.PHONE_NUMBER || '').replace(/\D/g, '');
    if (!phone) {
      log.error('USE_PAIRING is true but PHONE_NUMBER not provided.');
    } else {
      try {
        const code = await sock.requestPairingCode('+' + phone);
        log.info('Enter this pairing code (WhatsApp → Linked Devices → Link with phone number):');
        console.log('\n>>>>  ' + code + '  <<<<\n');
      } catch (e) {
        log.error(e, 'Failed to get pairing code');
      }
    }
  } else {
    sock.ev.on('connection.update', ({ qr }) => {
      if (qr) qrcode.generate(qr, { small: true });
    });
  }

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const boom = new Boom(lastDisconnect?.error);
      const status = boom.output?.statusCode;
      log.warn({ status }, 'Connection closed');

      if (status !== DisconnectReason.loggedOut && status !== 401) {
        setTimeout(() => createSocket().catch(err => log.error(err, 'Reconnect error')), 2000);
      } else {
        log.error('Logged out/Unauthorized. Delete session and relink.');
      }
    } else if (connection === 'open') {
      log.info('✅ WhatsApp connected');
    }
  });

  return sock;
}

module.exports = { createSocket };
