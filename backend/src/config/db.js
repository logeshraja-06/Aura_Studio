import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Disable Mongoose command buffering so queries fail fast when connection is offline
    mongoose.set('bufferCommands', false);

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MongoDB Connection Failed: MONGODB_URI is missing from environment variables.');
      return false;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[SUCCESS] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[WARNING] MongoDB connection failed: ${error.message}`);
    console.error(`Application running with offline fallback data structures & seed credentials.`);
    return false;
  }
};

export default connectDB;
