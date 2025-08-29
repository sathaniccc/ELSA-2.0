module.exports = {
  name: 'help',
  aliases: ['h'],
  help: 'Command help. Usage: !help [command]',
  run: async ({ sock, jid, args, commands, prefix }) => {
    if (!args.length) {
      await sock.sendMessage(jid, { text: `Help: type ${prefix}menu to see all features or ${prefix}help <cmd>` });
      return;
    }
    const c = commands.get(args[0].toLowerCase());
    if (!c) return sock.sendMessage(jid, { text: 'Command not found.' });
    const lines = [
      `*${c.name}*`,
      c.help || 'No description',
      c.usage ? `Usage: ${prefix}${c.usage}` : ''
    ].filter(Boolean);
    await sock.sendMessage(jid, { text: lines.join('\n') });
  }
}
