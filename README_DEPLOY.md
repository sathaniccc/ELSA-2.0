# ELSA 2.0 — Deploy Guide (Termux + KeyOB)

## Termux (Android)
```bash
bash install.sh
cp .env.example .env
# edit .env and set PHONE_NUMBER=91XXXXXXXXXX (no +)
npm start
```

## KeyOB
- Add env var `PHONE_NUMBER`.
- Run:
```bash
npm install --legacy-peer-deps
npm start
```
If build step available, set Build Command: `npm install --legacy-peer-deps`
Start Command: `npm start`.
