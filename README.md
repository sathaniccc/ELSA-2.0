<div align="center">

<img src="docs/assets/elsa-banner.gif" alt="ELSA 2.0 – Next‑Gen WhatsApp MD Bot" width="100%"/>

<h1>ELSA 2.0 – Server‑Grade WhatsApp MD Bot</h1>

<p>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-00bcd4?style=for-the-badge"/>
  <img alt="Status" src="https://img.shields.io/badge/status-2025%20READY-7c4dff?style=for-the-badge"/>
  <img alt="Node" src="https://img.shields.io/badge/Node.js-%3E%3D20.x-8bc34a?style=for-the-badge"/>
  <img alt="Platform" src="https://img.shields.io/badge/Deploy-Koyeb%20%7C%20Railway%20%7C%20Heroku%20%7C%20VPS-ff9800?style=for-the-badge"/>
</p>

<!-- Typing SVG (animated headline). Replace the gist link with your own if you want custom text) -->

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=32&duration=2500&pause=1200&color=00E5FF&center=true&vCenter=true&width=1000&lines=ELSA+2.0+-+Next+Gen+WhatsApp+MD+Bot;999%2B+Features+%7C+Owner+Only+Commands;Deploy+on+Koyeb+%7C+Railway+%7C+Heroku+%7C+VPS" alt="Typing SVG"/>
</p>
</div>

> **Heads‑up**: Termux support is intentionally **removed**. ELSA 2.0 targets reliable server platforms (Koyeb, Railway, Heroku, Docker/VPS).
> **Baileys** multi‑device library with autoreconnect + graceful shutdown.

---

## ✨ Highlights

* 🔐 Owner‑only + fine‑grained admin controls
* ⚡ Fast cold start, pre‑built Docker image, healthchecks
* ♻️ Auto‑reconnect & session backup (`/auth` persisted)
* 🧩 Modular commands (`/commands`), hot‑reload dev script
* 📈 Metrics endpoint (optional), structured logs
* 🛡️ Anti‑crash wrapper + panic recovery
* 🧰 Ready for Key‑Value cache, queue, and S3 backups (optional)

---

## 📁 Project Layout

```
_backup_originals/   # (internal backups; safe to ignore)
auth/                # WhatsApp MD auth/session files
commands/            # Feature modules/commands
docs/                # README assets, diagrams, How‑To
scripts/             # CI, build, healthcheck scripts
src/                 # Main source (entry index.js / app.mjs)
utils/               # Helpers
Dockerfile           # Multi‑stage, production image
Procfile             # Heroku process declaration
```

---

## 🔧 Requirements

* Node.js **>= 20.x** (LTS)
* Yarn or PNPM (recommended) / NPM
* Git
* A server/deploy target: **Koyeb (aka Keyob)**, **Railway**, **Heroku**, or **Docker‑ready VPS**

---

## ⚙️ Environment Variables

Create a `.env` in repo root or set these in your platform dashboard.

| Key            | Required | Example        | Notes                            |
| -------------- | :------: | -------------- | -------------------------------- |
| `SESSION_NAME` |     ✅    | `ELSA-2.0`     | Human‑friendly node name         |
| `OWNER_NUMBER` |     ✅    | `911234567890` | International format (no +)      |
| `LOG_LEVEL`    |     ❌    | `info`         | `debug`/`info`/`warn`/`error`    |
| `PORT`         |     ❌    | `3000`         | For healthcheck/metrics endpoint |
| `TZ`           |     ❌    | `Asia/Kolkata` | Container timezone               |
| `AUTO_RESTART` |     ❌    | `true`         | Let PM2/ProcManager restart app  |

> Add any extra secrets your custom commands need (e.g., API keys) the same way.

---

## 🖥️ Local Dev (quick start)

```bash
# 1) Clone your fork
git clone https://github.com/<your-username>/ELSA-2.0.git && cd ELSA-2.0

# 2) Install deps
# choose one:
yarn install
# pnpm install
# npm install

# 3) Create .env
cp .env.example .env   # (add values)

# 4) Run
yarn dev      # hot‑reload
# or: node src/index.js
```

---

## 🚀 Deploy Options (2025)

### 1) Koyeb ("Keyob") – Docker Deploy

> Works great with the included `Dockerfile`.

**Steps**

1. Fork this repo.
2. Push at least once so your fork is public/private as you like.
3. Go to **Koyeb → Create Service → GitHub**.
4. Select your fork, **use Dockerfile** build.
5. Set **Env Vars** from the table above.
6. Expose `PORT` if you enabled health/metrics (e.g., 3000).
7. Deploy. Enable **Auto‑redeploy on push**.

**Healthcheck (optional)**: set to `/:health` or the path your app exposes.

### 2) Railway – Nixpacks or Docker

**One‑click (template)**: If you have a template URL, paste it here. Otherwise:

**Manual:**

1. **New Project → Deploy from GitHub Repo** (select your fork).
2. Railway will detect Node 20 (Nixpacks) or choose **Docker**.
3. Add **Env Vars**.
4. Set service **Start Command** (if not Docker): `node src/index.js` or `yarn start`.
5. Deploy.

### 3) Heroku – Procfile

Heroku still supports container & buildpack flows.

**Buildpacks:** `heroku/nodejs` works fine.

```bash
# Heroku CLI quick flow
heroku create elsav2-$(openssl rand -hex 2)
heroku git:remote -a <your-app-name>
heroku buildpacks:set heroku/nodejs
heroku config:set SESSION_NAME="ELSA-2.0" OWNER_NUMBER=911234567890 LOG_LEVEL=info
# optional
heroku config:set TZ="Asia/Kolkata" PORT=3000

git push heroku main
```

> Using Docker on Heroku? Add `heroku.yml` or run `heroku container:push web && heroku container:release web`.

### 4) VPS – Docker & Docker Compose (Recommended)

**Docker (single):**

```bash
docker build -t elsa:2.0 .
docker run -d \
  --name elsa \
  -p 3000:3000 \
  -e SESSION_NAME="ELSA-2.0" \
  -e OWNER_NUMBER=911234567890 \
  -e LOG_LEVEL=info \
  -v $(pwd)/auth:/app/auth \
  elsa:2.0
```

**docker-compose.yml** (drop into repo root):

```yaml
services:
  elsa:
    build: .
    container_name: elsa
    restart: unless-stopped
    environment:
      SESSION_NAME: "ELSA-2.0"
      OWNER_NUMBER: "911234567890"
      LOG_LEVEL: "info"
      TZ: "Asia/Kolkata"
      PORT: 3000
    volumes:
      - ./auth:/app/auth
    ports:
      - "3000:3000"
```

```bash
docker compose up -d --build
```

---

## 🧪 Session & QR (first run)

* On first boot, ELSA prints a **QR or pair‑code** in logs.
* Scan with your WhatsApp on the same device/account you own.
* The session is saved under `auth/`. Mount/persist this folder on servers.

> If you redeploy and lose `auth/`, you must re‑scan. Keep it mounted.

---

## 🛠️ Scripts (pkg.json)

Typical scripts you may keep:

```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

---

## 🔒 Production Hardening

* Run as **non‑root** in Docker (use `USER node` stage)
* Persist `auth/` on a mounted volume
* Add a reverse proxy (Caddy/Nginx) if you expose any HTTP port
* Turn on platform auto‑restart & healthchecks
* Keep **OWNER\_NUMBER** private; never share logs with tokens/QR

---

## 📸 Readme Art (Animated Front)

* Put your banner GIF at: `docs/assets/elsa-banner.gif`
* Suggested size: 1280×420, <3MB for fast load.
* You can export from After Effects/Canva or use a typographic GIF.

> Want a static fallback? Add `docs/assets/elsa-banner.png` and reference it in the `<img>` tag’s `srcset`.

---

## 🧰 Troubleshooting

**App boots then exits** → Missing env vars. Check logs.

**Baileys auth keeps resetting** → Ensure `auth/` is persisted (volume mount, or platform disk enabled).

**Railway/Koyeb healthcheck failing** → Disable healthcheck or set the correct path/PORT.

**Heroku dyno sleeping** → Use paid dynos or external pingers if needed.

---

## 🗺️ Roadmap

* [ ] Cloud session backup (S3/Backblaze)
* [ ] Webhook events
* [ ] Simple web UI for owner admin

---

## 🤝 Contributing

PRs are welcome. Please open an issue first to discuss major changes. Follow the code style in the repo.

---

## 📜 License

MIT © 2025 ELSA 2.0 Contributors

---

### Notes for Maintainer

* If you want **one‑click badges** (Railway/Koyeb/Heroku templates), create templates and replace this section with your generated URLs.
* If your entry file name differs, update commands accordingly.
