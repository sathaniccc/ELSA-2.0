// start.js
const fs = require("fs");

// delete old session before starting
if (fs.existsSync("./auth")) {
    fs.rmSync("./auth", { recursive: true, force: true });
    console.log("🗑️ Old auth folder cleared");
}
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { default: makeWASocket, useMultiFileAuthState, Browsers, makeInMemoryStore } = require("@whiskeysockets/baileys");
const P = require("pino");

// ------------------- MongoDB Connection -------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
connectDB();

// ------------------- Session Folder -------------------
const sessionPath = path.join(__dirname, process.env.SESSION_FOLDER || "auth");
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath);
  console.log("📂 Session folder created:", sessionPath);
} else {
  console.log("📂 Session folder exists:", sessionPath);
}

// ------------------- Express Server -------------------
const app = express();
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("✅ ELSA-2.0 Bot Running with MongoDB & Pairing Code System!");
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ------------------- WhatsApp Connection -------------------
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Safari"),
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  // Generate pairing code
  if (!sock.authState.creds.registered) {
    let phoneNumber = process.env.OWNER_NUMBER; // Example: 919778158839
    if (!phoneNumber) {
      console.log("❌ OWNER_NUMBER not set in .env file");
      return;
    }

    try {
      let code = await sock.requestPairingCode(phoneNumber);
      console.log("🔑 Pairing Code for", phoneNumber, "=>", code);
    } catch (err) {
      console.error("❌ Error generating pairing code:", err.message);
    }
  }

  // On new message
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text;

    if (textMsg) {
      console.log("💬 Message from", from, "=>", textMsg);

      if (textMsg.toLowerCase() === "ping") {
        await sock.sendMessage(from, { text: "pong ✅" });
      }
    }
  });
}

startBot();
