#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "📦 Updating packages..."
pkg update -y && pkg upgrade -y

echo "📦 Installing essentials..."
pkg install -y nodejs-lts git ffmpeg imagemagick libwebp wget yarn

echo "📦 Cleaning old modules..."
rm -rf node_modules package-lock.json

echo "📦 Installing npm deps (pinned) ..."
npm install --legacy-peer-deps

echo "✅ Done. Next steps:"
echo "1) cp .env.example .env && nano .env   # set PHONE_NUMBER etc."
echo "2) npm start"
