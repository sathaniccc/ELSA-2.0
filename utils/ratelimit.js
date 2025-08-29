const cooldowns = new Map(); // jid -> timestamp
const DEFAULT_MS = 1500;

function canUse(jid, now = Date.now(), windowMs = DEFAULT_MS) {
  const last = cooldowns.get(jid) || 0;
  if (now - last < windowMs) return false;
  cooldowns.set(jid, now);
  return true;
}

module.exports = { canUse, DEFAULT_MS };
