const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');

  cached.conn = await mongoose.connect(uri, {
    bufferCommands: false,
  });

  return cached.conn;
}

module.exports = connectDB;
