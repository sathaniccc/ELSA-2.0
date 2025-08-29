const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // QR off
    });

    // Pairing code request
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER || "918921016567"; // env file il ninnum load cheyyam
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log("✅ Your Pairing Code:", code);
        } catch (err) {
            console.error("❌ Pairing failed:", err);
        }
    }

    sock.ev.on("creds.update", saveCreds);
}

start();
