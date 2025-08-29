require('dotenv').config()

module.exports = {
  prefix: process.env.PREFIX || "!",
  owner: process.env.OWNER || "SATHAN",
  botName: process.env.BOT_NAME || "ELSA-2.0",
  phoneNumber: process.env.PHONE_NUMBER || "918921016567"  // string ആയി വേണം
}