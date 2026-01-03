const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not defined');
  }

  await mongoose.connect(uri, {
    bufferCommands: false,
  });

  isConnected = true;
  console.log('MongoDB connected');
}

module.exports = connectDB;
