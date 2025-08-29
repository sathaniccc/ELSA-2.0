const log = require('./logger');
let mongoose = null;

async function connectMongo(uri) {
  if (!uri) return null;
  try {
    mongoose = require('mongoose');
    await mongoose.connect(uri, { dbName: 'elsa' });
    log.info('✅ MongoDB connected');
    return mongoose;
  } catch (e) {
    log.error(e, 'MongoDB connection failed');
    return null;
  }
}

module.exports = { connectMongo };
