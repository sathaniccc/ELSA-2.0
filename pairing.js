const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
require("dotenv").config();

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // QR venda
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.NUMBER; // number .env il set cheyyu
        const code = await sock.requestPairingCode(phoneNumber);
        console.log("📲 Your Pairing Code:", code);
    } else {
        console.log("✅ Already registered, no pairing needed.");
    }
}

connectToWhatsApp();
