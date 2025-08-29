module.exports = {
  name: 'echo',
  description: 'Echo back your text',
  category: 'fun',
  run: async ({ reply, args }) => reply(args.join(' ') || 'Type something to echo')
}