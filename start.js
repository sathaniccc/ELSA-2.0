const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const express = require("express");
const qrcode = require("qrcode");

// 🔑 Direct values
const PHONE_NUMBER = "919778158839";
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

// 🗑️ Clear old session
const sessionPath = path.join(__dirname, SESSION_FOLDER);
if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log("🗑️ Old auth folder cleared");
}
fs.mkdirSync(sessionPath, { recursive: true });

// 🔗 WhatsApp Connect
let latestQR = null;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,  // terminal QR venda
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update;

        if (qr) {
            latestQR = await qrcode.toDataURL(qr); // save QR as base64 image
            console.log("🌐 QR generated → visit /qr to scan");
        }

        if (connection === "open") console.log("✅ Connected to WhatsApp");
        else if (connection === "close") console.log("❌ Connection closed");
    });

    if (!sock.authState.creds.registered) {
        try {
            console.log("⏳ Waiting for QR scan...");
        } catch (err) {
            console.error("❌ Error:", err.message);
        }
    }
}

connectDB();
connectToWhatsApp();

// 🌐 Express server
const app = express();
const PORT = 8000;

app.get("/", (req, res) => res.send("✅ ELSA Bot Running! Visit /qr to scan QR"));

app.get("/qr", (req, res) => {
    if (latestQR) {
        res.send(`<h2>📲 Scan this QR in WhatsApp</h2><img src="${latestQR}" />`);
    } else {
        res.send("⏳ QR not generated yet. Please wait...");
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
