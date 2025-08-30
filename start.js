const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

const app = express();
const port = process.env.PORT || 8000;

let qrString = null; // store QR temporarily
let sock; // socket global store

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // disable terminal QR
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrString = qr;
      console.log("✅ New QR generated! Visit /qr to scan");
    }

    if (connection === "open") {
      console.log("🎉 WhatsApp connected successfully!");
      qrString = null; // clear QR after login
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("⚠️ Connection closed. Reason:", lastDisconnect?.error);

      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot(); // auto reconnect
      } else {
        console.log("❌ Logged out. Delete session and scan again.");
      }
    }
  });
}

// Home route
app.get("/", (req, res) => {
  res.send("✅ ELSA Bot Running! Visit <a href='/qr'>/qr</a> to scan QR");
});

// QR route
app.get("/qr", async (req, res) => {
  if (!qrString) {
    return res.send("⏳ QR not generated yet OR already connected. Please refresh or logout.");
  }
  try {
    const qrImage = await QRCode.toDataURL(qrString);
    res.send(`
      <div style="text-align:center">
        <h2>📱 Scan this QR with WhatsApp</h2>
        <img src="${qrImage}" />
        <p>Refresh if expired</p>
      </div>
    `);
  } catch (err) {
    res.status(500).send("❌ Error generating QR image");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  startBot();
});
