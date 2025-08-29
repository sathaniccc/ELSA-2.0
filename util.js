const { default: fetch } = require('node-fetch')

exports.formatUptime = (ms) => {
  const sec = Math.floor(ms / 1000) % 60
  const min = Math.floor(ms / (1000 * 60)) % 60
  const hr  = Math.floor(ms / (1000 * 60 * 60)) % 24
  const d   = Math.floor(ms / (1000 * 60 * 60 * 24))
  return `${d}d ${hr}h ${min}m ${sec}s`
}

exports.bufferFromUrl = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch: ' + res.status)
  return Buffer.from(await res.arrayBuffer())
}

exports.pickFirst = (obj) => obj && Object.values(obj)[0]