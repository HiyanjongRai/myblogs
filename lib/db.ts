import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 5000, // 5s timeout for initial connection attempt
    } as any);
    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("✅ MongoDB Connected Successfully");
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};
