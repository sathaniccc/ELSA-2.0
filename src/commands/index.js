const fs = require('fs');
const path = require('path');

function loadCommands(dir = __dirname) {
  const commands = new Map();
  function walk(p) {
    for (const file of fs.readdirSync(p)) {
      const full = path.join(p, file);
      if (fs.statSync(full).isDirectory()) { walk(full); continue; }
      if (!file.endsWith('.js')) continue;
      if (file === 'index.js') continue;
      const cmd = require(full);
      if (cmd?.name && typeof cmd.run === 'function') {
        commands.set(cmd.name.toLowerCase(), cmd);
        if (Array.isArray(cmd.aliases)) {
          for (const a of cmd.aliases) commands.set(a.toLowerCase(), cmd);
        }
      }
    }
  }
  walk(dir);
  return commands;
}

module.exports = { loadCommands };
