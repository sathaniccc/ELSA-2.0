require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const mongoose = require("mongoose");

// 🔹 MongoDB connect
async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

// 🔹 WhatsApp socket create
async function createSocket() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // QR off (pairing code venam)
  });

  // Pairing code generate cheyyan
  if (!sock.authState.creds.registered) {
    try {
      const code = await sock.requestPairingCode(process.env.OWNER_NUMBER);
      console.log("📌 Your Pairing Code:", code);
    } catch (err) {
      console.error("❌ Failed to get pairing code:", err.message);
    }
  }

  sock.ev.on("creds.update", saveCreds);

  // Example handler
  sock.ev.on("messages.upsert", async (m) => {
    console.log("📩 Message received:", JSON.stringify(m, null, 2));
  });

  return sock;
}

// 🔹 Start bot
async function start() {
  await connectMongo();
  await createSocket();
}

start();
