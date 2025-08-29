/**
 * Simple deploy helper.
 * For platforms like KeyOB/Replit that just run `npm run deploy`.
 * It prints helpful info and validates env.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const required = ['PHONE_NUMBER'];
const missing = required.filter(k => !process.env[k] || !String(process.env[k]).trim());
if (missing.length) {
  console.log('⚠️ Missing required .env keys:', missing.join(', '));
  console.log('   Create a .env file (copy from .env.example) and fill values.');
  process.exit(1);
}

console.log('✅ Env looks good. You can now run:');
console.log('   npm start');
