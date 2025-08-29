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

## 🚀 One-Click Deploy

<div align="center">

<!-- KOYEB -->
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/sathaniccc/ELSA-2.0&branch=main&name=elsa-2-0">
  <img height="40" src="https://img.shields.io/badge/Deploy%20to%20Koyeb-f06a00?style=for-the-badge&logo=koyeb&logoColor=white" alt="Deploy to Koyeb">
</a>

<!-- RAILWAY (generic new-project link – replace with your template link later) -->
<a href="https://railway.com/new">
  <img height="40" src="https://railway.com/button.svg" alt="Deploy on Railway">
</a>

<!-- HEROKU -->
<a href="https://www.heroku.com/deploy?template=https://github.com/sathaniccc/ELSA-2.0">
  <img height="40" src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku">
</a>

<!-- VPS via Docker -->
<a href="#-vps--docker-deploy">
  <img height="40" src="https://img.shields.io/badge/VPS%20(Docker)-1d63ed?style=for-the-badge&logo=docker&logoColor=white" alt="Deploy to VPS (Docker)">
</a>

</div>

> **Heads-up:** Termux support is intentionally removed. ELSA 2.0 targets reliable server platforms (Koyeb, Railway, Heroku, Docker/VPS). Needs Node.js **20+**.

---

## 🔑 Quick Login/Console Links

- 🔑 Koyeb: [Login](https://app.koyeb.com)
- 🚉 Railway: [Login](https://railway.com/dashboard/new)
- ☁️ Heroku: [Login](https://dashboard.heroku.com)
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
