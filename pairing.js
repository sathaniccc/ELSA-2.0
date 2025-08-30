const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,   // QR venda
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.NUMBER; // .env il number set cheyyu
        const code = await sock.requestPairingCode(phoneNumber);
        console.log("📲 Your Pairing Code:", code);
    }
}

connectToWhatsApp();
