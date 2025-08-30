const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

async function connectToWhatsApp() {
  // ensure auth folder
  const sessionPath = path.join(__dirname, "auth");
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath);
    console.log("📂 Session folder created:", sessionPath);
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // no QR in logs
    browser: ["ELSA-Bot", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  if (!sock.authState.creds.registered) {
    try {
      const phoneNumber = process.env.NUMBER; // add NUMBER in .env
      const code = await sock.requestPairingCode(phoneNumber);
      console.log("📲 Your Pairing Code:", code);
    } catch (err) {
      console.error("❌ Error generating pairing code:", err.message);
    }
  }

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ WhatsApp connected");
    } else if (connection === "close") {
      console.log("⚠️ WhatsApp connection closed, restarting...");
      connectToWhatsApp();
    }
  });
}

async function startApp() {
  await connectDB();
  await connectToWhatsApp();

  const app = express();
  const PORT = process.env.PORT || 8000;

  app.get("/", (req, res) => {
    res.send("✅ ELSA-2.0 Bot Running with MongoDB & Pairing Code!");
  });

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startApp();
