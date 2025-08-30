const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

// --- MongoDB Connection ---
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}
connectDB();

// --- Ensure session folder ---
const sessionPath = path.join(__dirname, "auth");
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath);
  console.log("📂 Session folder created:", sessionPath);
} else {
  console.log("📂 Session folder exists:", sessionPath);
}

// --- WhatsApp Connection ---
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // QR venda, pairing code use cheyyu
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });

  sock.ev.on("creds.update", saveCreds);

  // Generate pairing code if not registered
  if (!sock.authState.creds.registered) {
    try {
      const phoneNumber = process.env.NUMBER; // .env file il NUMBER=91XXXXXXXX
      const code = await sock.requestPairingCode(phoneNumber);
      console.log("📲 Your Pairing Code:", code);
    } catch (err) {
      console.error("❌ Error generating pairing code:", err.message);
    }
  }

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") {
      console.log("✅ WhatsApp Connected!");
    }
  });
}

connectToWhatsApp();

// --- Simple Express server (for Koyeb health checks) ---
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("✅ ELSA-2.0 Bot Running with MongoDB & Pairing Code System!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
