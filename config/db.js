const mongoose = require('mongoose');

const DEFAULT_URI = process.env.MONGO_URI || 'mongodb+srv://kissmark:J839d08GwhNt2Lwj@clusterkissmark.7qxpocm.mongodb.net/todoapp?retryWrites=true&w=majority&appName=clusterkissmark';

async function connectDB(uri = DEFAULT_URI) {
  try {
    const conn = await mongoose.connect(uri, {
      // modern mongoose options are defaults in v7+
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connectDB };
