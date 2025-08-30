const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState("auth"); // same as start.js

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection } = update;
        if (connection === "open") {
            console.log("✅ Connected to WhatsApp");
        }
        if (connection === "close" && !sock.authState.creds.registered) {
            const phoneNumber = process.env.PHONE_NUMBER;
            if (!phoneNumber) {
                console.error("❌ PHONE_NUMBER missing in .env");
                return;
            }
            try {
                const code = await sock.requestPairingCode(phoneNumber);
                console.log("✅ Your Pairing Code:", code);
            } catch (err) {
                console.error("❌ Pairing failed:", err.message);
            }
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

start();
