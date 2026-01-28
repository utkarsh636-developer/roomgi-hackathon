
import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    console.log("--- STARTING CLOUDINARY DEBUG TEST ---");

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log(`Cloud Name: ${cloudName ? cloudName : "MISSING"}`);
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 4) + "****" : "MISSING"}`);
    console.log(`API Secret: ${apiSecret ? apiSecret.substring(0, 4) + "****" : "MISSING"}`);

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("❌ Missing environment variables!");
        return;
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    try {
        const imagePath = path.join(__dirname, '..', 'public', 'images', 'image.png');
        if (!fs.existsSync(imagePath)) {
            console.error("❌ Test image not found at:", imagePath);
            return;
        }

        console.log("Attempting upload...");
        const response = await cloudinary.uploader.upload(imagePath, {
            resource_type: "auto"
        });

        console.log("✅ Upload Successful!");
        console.log("URL:", response.secure_url);

    } catch (error) {
        console.error("❌ Upload Failed!");
        console.error("Error Message:", error.message);
        console.error("Full Error:", JSON.stringify(error, null, 2));
    }
};

run();
