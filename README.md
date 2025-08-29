<!--
  E L S A   2 . 0   –  Server-Grade WhatsApp MD Bot
  Fancy README (2025 Ready)
-->

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=32&duration=2500&pause=1200&color=00E5FF&center=true&vCenter=true&width=1000&lines=ELSA+2.0+-+Server+Grade+WhatsApp+MD+Bot;Deploy+to+Koyeb+%7C+Railway+%7C+Heroku+%7C+VPS;2025+Ready+%7C+Node.js+20%2B" alt="Typing SVG"/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-2ea44f?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-2025%20READY-8a2be2?style=for-the-badge">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D%2020.x-3c873a?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/Platform-Server%20Only-444?style=for-the-badge">
</p>

---



---

## 🔑 Quick_Login / Console_Links  

✨ Click the icons below to go directly to your platform login!  

- 🟡 **Koyeb** → [🔑](https://app.koyeb.com/auth/login)  
- 🚂 **Railway** → [🚀](https://railway.app/login)  
- ☁️ **Heroku** → [☁️](https://id.heroku.com/login)  
- 🖥️ **VPS / Console** → [💻](https://your-vps-link-here.com)  

---

## ⚙️ Required Environment

Create a `.env` (or set these in your platform’s variables):

```ini
# WhatsApp / Baileys
SESSION_JSON=            # paste your session (if using pre-auth)
ALLOWED_OWNER=           # your WhatsApp number(s), comma-separated, e.g. 9198XXXXXXXX

# Bot
BOT_NAME=ELSA 2.0
LOG_LEVEL=info
PORT=3000

# Webhook (optional)
WEBHOOK_URL=
WEBHOOK_SECRET=
```

> Tip: For first-time auth, run locally once to generate the session QR, then move the produced session/creds to your server (or paste into SESSION_JSON if you export it as JSON).




---

🧭 Platform Guides

Koyeb

1. Click Deploy to Koyeb above.


2. Select your GitHub repo (pre-filled), pick a region, and set env vars.


3. Build & run command (if not auto-detected):

Build: npm ci

Start: npm start




Railway

Use the Deploy on Railway button → New Project → Deploy from GitHub repo → pick this repo → set env vars.

(Optional, best UX) Publish a Railway Template later and replace the link with your template:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/YOUR_TEMPLATE_ID)


Heroku

Button above opens the auto-setup using app.json from this repo.

If it asks for commands:

Buildpack: Node.js

Build: npm ci

Start: npm start



VPS / Docker Deploy

## 🚀 One-Click Deploy

[![Deploy on Koyeb](https://img.shields.io/badge/⚡_Deploy_to_Koyeb-FF6F00?style=for-the-badge&logo=koyeb&logoColor=white)](https://app.koyeb.com)
[![Deploy on Railway](https://img.shields.io/badge/🚄_Deploy_to_Railway-7B68EE?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/dashboard/new)
[![Deploy on Heroku](https://img.shields.io/badge/☁️_Deploy_to_Heroku-6762A6?style=for-the-badge&logo=heroku&logoColor=white)](https://dashboard.heroku.com)
[![VPS Deploy](https://img.shields.io/badge/🖥️_Deploy_on_VPS-0088CC?style=for-the-badge&logo=docker&logoColor=white)](#)

---

## 🔑 Quick Console Links

- 🔥 **Koyeb Console** → [![Open Koyeb](https://img.shields.io/badge/🔗_Open_Koyeb_App-FF6F00?style=flat-square&logo=koyeb&logoColor=white)](https://app.koyeb.com)
- 🚄 **Railway Console** → [![Open Railway](https://img.shields.io/badge/🔗_Railway_Dashboard-7B68EE?style=flat-square&logo=railway&logoColor=white)](https://railway.app/dashboard/new)
- ☁️ **Heroku Console** → [![Open Heroku](https://img.shields.io/badge/🔗_Heroku_Dashboard-6762A6?style=flat-square&logo=heroku&logoColor=white)](https://dashboard.heroku.com)

---

## ✨ Features
✔ 999+ Commands  
✔ Auto-Reconnect + Graceful Shutdown  
✔ Multi-Deploy (Koyeb / Railway / Heroku / VPS / Docker)



---

❓ FAQ

Q: Railway button doesn’t open my repo directly.
A: Railway’s official 1-click flow uses a Template ID. Use the button above to open New Project and choose your GitHub repo, or publish a template and swap the link later.

Q: Heroku button says app.json missing.
A: Add a minimal app.json at repo root or deploy via Heroku GitHub integration.


---

📝 License

MIT — feel free to fork & improve.


---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=130&color=0:00d4ff,100:7a00ff&text=ELSA%202.0&fontColor=ffffff&fontAlign=50&fontAlignY=35&section=footer" />
</p>
```Notes / what I changed

