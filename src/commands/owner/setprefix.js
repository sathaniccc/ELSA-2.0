module.exports = {
  name: 'setprefix',
  ownerOnly: true,
  help: 'Set command prefix (one character or word)',
  usage: 'setprefix <symbol>',
  run: async ({ sock, jid, args, setPrefix }) => {
    const p = args.join(' ').trim();
    if (!p) return sock.sendMessage(jid, { text: 'Usage: setprefix <symbol>' });
    setPrefix(p);
    await sock.sendMessage(jid, { text: 'Prefix updated to: ' + p });
  }
}
