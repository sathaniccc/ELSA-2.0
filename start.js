const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const express = require("express");

// 🔑 Direct values (env venda)
const PHONE_NUMBER = "919778158839";   // Full number with country code
const MONGODB_URI = "mongodb+srv://sathanic_elsa:3WUqzlKgkQdD3UwE@cluster0.ik3ong0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const SESSION_FOLDER = "auth";

// ✅ Connect MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
    }
}

// 🗑️ Clear old session every deploy
const sessionPath = path.join(__dirname, SESSION_FOLDER);
if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log("🗑️ Old auth folder cleared");
}
fs.mkdirSync(sessionPath, { recursive: true });

// 🔗 WhatsApp Connect
let latestPairingCode = null;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection } = update;
        if (connection === "open") console.log("✅ Connected to WhatsApp");
        else if (connection === "close") console.log("❌ Connection closed");
    });

    try {
        if (!sock.authState.creds.registered) {
            console.log("⏳ Requesting Pairing Code...");
            latestPairingCode = await sock.requestPairingCode(PHONE_NUMBER);
            console.log("📲 Your Pairing Code:", latestPairingCode);
        }
    } catch (err) {
        console.error("❌ Error generating pairing code:", err.message);
    }
}

connectDB();
connectToWhatsApp();

// 🌐 Express server
const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
    if (latestPairingCode) {
        res.send(`<h2>📲 Pairing Code: <b>${latestPairingCode}</b></h2>`);
    } else {
        res.send("⏳ Pairing Code not generated yet. Refresh after a few seconds.");
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
