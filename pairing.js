const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(process.env.SESSION_FOLDER || "auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: "silent" }),
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔗 Scan this QR:", qr);
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    } else if (connection === "close") {
      console.log("❌ Connection closed. Retrying...");
      connectToWhatsApp(); // auto retry
    }
  });
}

connectToWhatsApp();
