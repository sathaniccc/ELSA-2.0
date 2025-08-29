const { default: fetch } = require('node-fetch')
module.exports = {
  name: 'weather',
  description: 'Weather info: !weather <city>',
  category: 'tools',
  run: async ({ reply, args }) => {
    const city = args.join(' ') || 'Kochi'
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    const res = await fetch(url)
    if (!res.ok) return reply('Failed to fetch weather.')
    const data = await res.json()
    const cur = data.current_condition?.[0]
    const area = data.nearest_area?.[0]?.areaName?.[0]?.value || city
    const temp = cur?.temp_C, feels = cur?.FeelsLikeC, desc = cur?.weatherDesc?.[0]?.value
    return reply(`🌤 Weather – ${area}\nTemp: ${temp}°C (feels ${feels}°C)\n${desc}`)
  }
}