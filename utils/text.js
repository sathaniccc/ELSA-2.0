function chunkText(text, size = 4000) {
  const out = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i+size));
  return out;
}
module.exports = { chunkText };
