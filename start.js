const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const express = require("express");

// 🔑 Direct values (env venda)
const PHONE_NUMBER = "+919778158839";   // ✅ +91 format
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

// 📂 Ensure session folder exists (no auto-delete now)
const sessionPath = path.join(__dirname, SESSION_FOLDER);
fs.mkdirSync(sessionPath, { recursive: true });

// 🔗 WhatsApp Connect
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") console.log("✅ Connected to WhatsApp");
        else if (connection === "close") {
            console.log("❌ Connection closed:", lastDisconnect?.error?.message);
        }
    });

    if (!sock.authState.creds.registered) {
        try {
            console.log("⏳ Requesting Pairing Code...");
            const code = await sock.requestPairingCode(PHONE_NUMBER);
            console.log("📲 Your Pairing Code:", code);
        } catch (err) {
            console.error("❌ Error generating pairing code:", err.message);
        }
    }
}

connectDB();
connectToWhatsApp();

// 🌐 Simple Express server (for Koyeb health check)
const app = express();
const PORT = 8000;
app.get("/", (req, res) => res.send("✅ ELSA Bot Running!"));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
