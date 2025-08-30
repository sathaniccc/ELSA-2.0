const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");

const app = express();
const port = process.env.PORT || 8000;

let qrString = null; // store QR temporarily

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // disable terminal QR
  });

  sock.ev.on("creds.update", saveCreds);

  // QR generate cheyyumbo catch cheyyuka
  sock.ev.on("connection.update", (update) => {
    const { qr } = update;
    if (qr) {
      qrString = qr;
      console.log("✅ QR generated! Visit /qr to scan");
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
    return res.send("⏳ QR not generated yet. Please refresh in a few seconds...");
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
