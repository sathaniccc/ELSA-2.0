const pkg = require('../../package.json');
module.exports = {
  name: 'menu',
  aliases: ['help', 'commands'],
  help: 'Show main menu',
  run: async ({ sock, jid, prefix }) => {
    const blocks = [
`*${pkg.name || 'ELSA'} Menu*  (999+ features \u2728)
_Use prefix: ${prefix}_

*General*
• ${prefix}ping — bot alive check
• ${prefix}help [cmd] — command help
• ${prefix}menu — this menu

*Owner Only*
• ${prefix}broadcast <text>
• ${prefix}restart
• ${prefix}setprefix <symbol>

*Coming Soon*
• ${prefix}sticker, ${prefix}toimg, ${prefix}ytmp3, ${prefix}ytmp4, ${prefix}ai, ${prefix}antilink, ${prefix}welcomer ...
`
    ];
    await sock.sendMessage(jid, { text: blocks.join('\n') });
  }
}
