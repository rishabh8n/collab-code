import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(`\n\nMongoDB connected \nHost: ${connection.connection.host}`);
  } catch (err) {
    console.error("MONGODB connection error : ", err);
    process.exit(1);
  }
};

export { connectDB };
