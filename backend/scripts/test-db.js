import dotenv from "dotenv"
import mongoose from "mongoose"
import { DB_NAME } from "../utils/constants.js"

dotenv.config({
    path: "./.env"
})

const testConnection = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        // Handle slash correctly if DB_NAME is already in URI or not
        const uri = process.env.MONGODB_URI.endsWith('/')
            ? `${process.env.MONGODB_URI}${DB_NAME}`
            : `${process.env.MONGODB_URI}/${DB_NAME}`;

        console.log(`Using URI (masked): ${uri.replace(/\/\/.*@/, "//***:***@")}`);

        await mongoose.connect(uri)
        console.log("✅ MongoDB Connection Successful!");
        console.log(`Connected to host: ${mongoose.connection.host}`);
        console.log(`Database name: ${mongoose.connection.name}`);

        await mongoose.disconnect();
        console.log("Disconnected successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed!");
        console.error("Error details:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}

testConnection();
