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

// 🌍 Command Loader
const commands = new Map();
function loadCommands() {
  const commandPath = path.join(__dirname, "commands");
  if (!fs.existsSync(commandPath)) {
    console.log("⚠️ No commands folder found");
    return;
  }

  const files = fs.readdirSync(commandPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(commandPath, file));
      if (cmd.name && typeof cmd.run === "function") {
        commands.set(cmd.name, cmd);
        console.log(`✅ Loaded command: ${cmd.name}`);
      } else {
        console.log(`⚠️ Skipped invalid command file: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err);
    }
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
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const body =
      type === "conversation"
        ? msg.message.conversation
        : type === "extendedTextMessage"
        ? msg.message.extendedTextMessage.text
        : "";

    if (!body) return;

    console.log("📩 Message from", from, ":", body);

    // 🔑 Prefix check
    const prefix = "!";
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = commands.get(cmdName);
    if (!command) return;

    try {
      await command.run({
        sock,
        chat: from,
        args,
        reply: (text) => sock.sendMessage(from, { text }),
      });
    } catch (err) {
      console.error(`❌ Error in command ${cmdName}:`, err);
      await sock.sendMessage(from, { text: "⚠️ Error while running command." });
    }
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
  loadCommands();
  startBot();
});
