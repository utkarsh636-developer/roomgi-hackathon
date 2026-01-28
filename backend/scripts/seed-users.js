import dotenv from "dotenv"
import mongoose from "mongoose"
import { DB_NAME } from "../utils/constants.js"
import { User } from "../models/user.model.js"
import fs from "fs"

dotenv.config({
    path: "./.env"
})

const seedUsers = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const uri = process.env.MONGODB_URI.endsWith('/')
            ? `${process.env.MONGODB_URI}${DB_NAME}`
            : `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(uri);
        console.log("✅ Connected.");

        const timestamp = Date.now();

        // 1. Create Owner
        const ownerData = {
            username: `owner_${timestamp}`,
            email: `owner_${timestamp}@example.com`,
            password: "password123", // Will be hashed by pre-save hook
            role: "owner",
            phoneNumber: "9876543210"
        };

        const owner = await User.create(ownerData);
        console.log(`\n✅ Created Owner:`);
        console.log(`   ID: ${owner._id}`);
        console.log(`   Email: ${owner.email}`);
        console.log(`   Role: ${owner.role}`);

        // 2. Create Tenant
        const tenantData = {
            username: `tenant_${timestamp}`,
            email: `tenant_${timestamp}@example.com`,
            password: "password123",
            role: "tenant",
            phoneNumber: "1234567890"
        };

        const tenant = await User.create(tenantData);
        console.log(`\n✅ Created Tenant:`);
        console.log(`   ID: ${tenant._id}`);
        console.log(`   Email: ${tenant.email}`);
        console.log(`   Role: ${tenant.role}`);

        console.log("\nCheck MongoDB Atlas to see these new documents in the 'users' collection.");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding Failed!");
        const errorLog = `Error: ${error.message}\nStack: ${error.stack}\nValidation: ${error.errors ? JSON.stringify(error.errors, null, 2) : 'N/A'}`;
        fs.writeFileSync("seed_error.log", errorLog);
        process.exit(1);
    }
}

seedUsers();
