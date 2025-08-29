#!/data/data/com.termux/files/usr/bin/bash
set -e
echo ">> Removing old WhatsApp session files..."
rm -rf session creds.json auth_info.json
echo ">> Done. Start the bot again to re-link."
