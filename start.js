const express = require("express");
const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

let qrString = null;
let sock;

// 🔥 Auto-restore creds.json from backup
const backupPath = path.join(__dirname, "creds-backup.json");
const credsPath = path.join(__dirname, "auth", "creds.json");

if (fs.existsSync(backupPath) && !fs.existsSync(credsPath)) {
  fs.mkdirSync(path.dirname(credsPath), { recursive: true });
  fs.copyFileSync(backupPath, credsPath);
  console.log("♻️ Restored creds.json from backup");
}

// 🔥 Load commands dynamically
const commandsPath = path.join(__dirname, "commands");
let commands = {};

if (fs.existsSync(commandsPath)) {
  fs.readdirSync(commandsPath).forEach((file) => {
    if (file.endsWith(".js")) {
      const command = require(path.join(commandsPath, file));
      if (command.name && typeof command.execute === "function") {
        commands[command.name] = command;
        console.log(`✅ Loaded command: ${command.name}`);
      }
    }
  });
}

// 🔥 Command Handler
async function handleCommand(sock, m, prefix = ".") {
  try {
    const msg = m.message;
    if (!msg) return;

    const from = m.key.remoteJid;
    const type = Object.keys(msg)[0];

    let text =
      type === "conversation"
        ? msg.conversation
        : type === "extendedTextMessage"
        ? msg.extendedTextMessage.text
        : "";

    if (!text || !text.startsWith(prefix)) return;

    const args = text.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    if (commands[cmdName]) {
      console.log(`⚡ Executing command: ${cmdName}`);
      await commands[cmdName].execute(sock, m, args);
    }
  } catch (err) {
    console.error("❌ Command error:", err);
  }
}

// 🔥 Main function
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  // creds save + backup
  sock.ev.on("creds.update", async () => {
    await saveCreds();
    if (fs.existsSync(credsPath)) {
      fs.copyFileSync(credsPath, backupPath);
      console.log("✅ creds-backup.json updated (push this to GitHub)");
    }
  });

  // 🟢 Message Listener
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    await handleCommand(sock, m, ".");
  });

  // 🔥 Connection Updates
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrString = qr;
      console.log("✅ New QR generated! Visit /qr to scan");
    }

    if (connection === "open") {
      console.log("🎉 WhatsApp connected successfully!");
      qrString = null;
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠️ Connection closed. Reason:", lastDisconnect?.error);

      if (reason === DisconnectReason.loggedOut || reason === 401) {
        console.log("❌ Logged out / conflict detected. Clearing session...");
        try {
          fs.rmSync("auth", { recursive: true, force: true });
          fs.rmSync("creds-backup.json", { force: true });
        } catch {}
        console.log("♻️ Session cleared. Please rescan QR at /qr");
        startBot();
      } else {
        console.log("🔄 Reconnecting...");
        startBot();
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
