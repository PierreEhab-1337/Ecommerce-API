import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

mongoose.connection.on('error', err => {
    console.log("Connection Error:", err);
});

mongoose.connection.on('disconnected', () => {
  console.log("Database Disconnected");
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;