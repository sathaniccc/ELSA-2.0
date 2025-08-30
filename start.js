const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

let qrString = null; // QR temporary store
let sock; // global socket

// 🔥 Auto-restore creds.json from backup
const backupPath = path.join(__dirname, "creds-backup.json");
const credsPath = path.join(__dirname, "auth", "creds.json");

if (fs.existsSync(backupPath) && !fs.existsSync(credsPath)) {
  fs.mkdirSync(path.dirname(credsPath), { recursive: true });
  fs.copyFileSync(backupPath, credsPath);
  console.log("♻️ Restored creds.json from backup");
}

// 🔥 Main function
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // QR only via /qr route
  });

  // session save + backup
  sock.ev.on("creds.update", async () => {
    await saveCreds();
    if (fs.existsSync(credsPath)) {
      fs.copyFileSync(credsPath, backupPath);
      console.log("✅ creds-backup.json updated (push this to GitHub)");
    }
  });

  // 🟢 Message Listener (MENU system)
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const text =
      type === "conversation"
        ? msg.message.conversation
        : type === "extendedTextMessage"
        ? msg.message.extendedTextMessage.text
        : "";

    console.log("📩 Message from", from, ":", text);

    // ✅ Menu trigger
    if (text.toLowerCase() === "menu") {
      const menuText = `
✨ *ELSA BOT MENU* ✨

1️⃣ .ping   - Check bot alive  
2️⃣ .owner  - Owner details  
3️⃣ .repo   - GitHub repository  
4️⃣ .help   - Show menu again  

💠 _Type a command to use_
`;

      await sock.sendMessage(from, { text: menuText });
    }

    // ✅ Other commands
    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(from, { text: "🏓 Pong! Bot is alive." });
    }

    if (text.toLowerCase() === ".owner") {
      await sock.sendMessage(from, {
        text: "👑 Owner: *SATHAN*\n📞 Number: wa.me/919778158839\n🌐 Repo: https://github.com/sathaniccc",
      });
    }

    if (text.toLowerCase() === ".repo") {
      await sock.sendMessage(from, {
        text: "📂 GitHub: https://github.com/sathaniccc/ELSA-2.0",
      });
    }

    if (text.toLowerCase() === ".help") {
      await sock.sendMessage(from, { text: "⚡ Type *menu* to see all commands." });
    }
  });

  // connection updates
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrString = qr;
      console.log("✅ New QR generated! Visit /qr to scan");
    }

    if (connection === "open") {
      console.log("🎉 WhatsApp connected successfully!");
      qrString = null; // QR clear after login
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("⚠️ Connection closed. Reason:", lastDisconnect?.error);

      if (shouldReconnect) {
        console.log("🔄 Reconnecting...");
        startBot(); // auto reconnect
      } else {
        console.log("❌ Logged out. Delete auth folder and scan again.");
      }
    }
  });
}

// 🌍 Home route
app.get("/", (req, res) => {
  res.send("✅ ELSA Bot Running! Visit <a href='/qr'>/qr</a> to scan QR");
});

// 📱 QR route
app.get("/qr", async (req, res) => {
  if (!qrString) {
    return res.send("⏳ QR not generated yet OR already connected. Please refresh or logout.");
  }
  try {
    const qrImage = await QRCode.toDataURL(qrString);
    res.send(`
      <div style="text-align:center; font-family:sans-serif;">
        <h2>📱 Scan this QR with WhatsApp</h2>
        <img src="${qrImage}" />
        <p>Refresh if expired</p>
      </div>
    `);
  } catch (err) {
    res.status(500).send("❌ Error generating QR image");
  }
});

// 🚀 Start server + bot
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  startBot();
});
