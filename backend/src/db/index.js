import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // Debug environment variables
    console.log("🔍 Environment Debug:");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("MONGODB_URI value:", process.env.MONGODB_URI ? "Set (hidden for security)" : "NOT SET");
    console.log("DB_NAME:", DB_NAME);
    
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI environment variable is not set. Please check your .env file.");
    }

    // MongoDB connection options for production
    const connectionOptions = {
      // Remove retryWrites and w as they should be in connection string
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      connectionOptions
    );

    console.log(`✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    console.log(`📊 Database Name: ${DB_NAME}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
