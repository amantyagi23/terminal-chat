import mongoose from "mongoose";
import { appLogger } from "../../../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env["MONGO_URI"]!);
    appLogger.info("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};
