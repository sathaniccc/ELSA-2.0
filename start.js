const express = require("express");
const qrcode = require("qrcode");
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

const app = express();
const port = process.env.PORT || 8000;

let qrCodeData = ""; // save current QR string

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on("connection.update", (update) => {
    const { qr } = update;
    if (qr) {
      qrCodeData = qr; // save qr code string
      console.log("✅ QR generated!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

// Web route to show QR as image
app.get("/qr", async (req, res) => {
  if (!qrCodeData) {
    return res.send("⏳ QR not generated yet. Please refresh after few seconds.");
  }
  try {
    const qrImage = await qrcode.toDataURL(qrCodeData);
    const html = `<h2>📱 Scan this QR with WhatsApp</h2><img src="${qrImage}" />`;
    res.send(html);
  } catch (err) {
    res.send("❌ Error generating QR");
  }
});

app.get("/", (req, res) => {
  res.send("✅ ELSA Bot Running! Visit /qr to scan QR");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  startBot();
});
