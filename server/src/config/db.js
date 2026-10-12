import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('🔌 MongoDB Disconnected');
};
