
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    console.log("--- STARTING SIMPLE PROFILE TEST ---");

    const email = "tenant_1769530688797@example.com";
    const password = "password123";

    // 1. LOGIN
    console.log("1. Logging in...");
    const loginRes = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        console.error("Login Failed:", await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const accessToken = loginData.data?.accessToken;

    if (!accessToken) {
        console.log("No access token!");
        console.log("Type of data:", typeof loginData.data);
        if (loginData.data) console.log("Keys in data:", Object.keys(loginData.data));
        console.log("Full Data:", JSON.stringify(loginData, null, 2));
        return;
    }
    console.log("✅ Login Success. Token obtained.");

    // 2. GET CURRENT USER
    console.log("2. Get Current User...");
    const userRes = await fetch('http://localhost:8000/api/v1/users/current-user', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const userData = await userRes.json();
    console.log("Current User:", userData.data?.username);

    // 3. UPDATE PROFILE (TEXT ONLY)
    console.log("3. Update Profile (Text)...");
    const newUsername = "tenant_updated_" + Date.now();
    const updateRes = await fetch('http://localhost:8000/api/v1/users/update-profile', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, phoneNumber: "9876543210" })
    });

    console.log("Update Text Status:", updateRes.status);
    const updateData = await updateRes.json();
    console.log("Updated User:", updateData.data?.username);


    // 4. UPDATE PROFILE (IMAGE + PASSWORD) - Manual Multipart
    console.log("4. Update Profile (Image + Password)...");

    const imagePath = path.join(__dirname, '..', 'public', 'images', 'image.png');
    if (!fs.existsSync(imagePath)) {
        console.error("Image not found at:", imagePath);
        return;
    }
    const fileBuffer = fs.readFileSync(imagePath);

    const boundary = "--------------------------" + Date.now().toString(16);

    let bodyBuffers = [];

    // Helper to add field
    const addField = (name, value) => {
        bodyBuffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
    };

    // Helper to add file
    const addFile = (name, filename, buffer) => {
        bodyBuffers.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`));
        bodyBuffers.push(buffer);
        bodyBuffers.push(Buffer.from("\r\n"));
    };

    // Add fields
    const newPassword = "newpassword456";
    // NOTE: If we only update password, we can do it via JSON usually, but prompt asked specifically 'use dummy image... try all scenerio if use change pass'.
    // We can try to update both at once if the endpoint supports it. 
    // Usually password update is separate or sensitive fields are handled distinctly, but let's try sending it all.
    // Looking at user.controller.js (I recall verifyJWT and updateProfile logic), updateProfile handles request body.
    // Let's assume sending password here works or we do it separately.
    // The previous script tried separate calls.
    // Let's just update the Image here first.

    addFile("profileImage", "image.png", fileBuffer);

    // End boundary
    bodyBuffers.push(Buffer.from(`--${boundary}--\r\n`));

    const multipartBody = Buffer.concat(bodyBuffers);

    const imageUpdateRes = await fetch('http://localhost:8000/api/v1/users/update-profile', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: multipartBody
    });

    const text = await imageUpdateRes.text();
    console.log("Image Update Status:", imageUpdateRes.status);
    console.log("Image Update Raw:", text);

    let imageUpdateData = {};
    try {
        imageUpdateData = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response");
    }

    console.log("Image Update Result:", imageUpdateData.success ? "Success" : "Failed");
    if (imageUpdateData.data) console.log("New Avatar URL:", imageUpdateData.data.avatar);

    // 5. Update Password (JSON)
    console.log("5. Update Password...");
    const pwdUpdateRes = await fetch('http://localhost:8000/api/v1/users/update-profile', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    });

    console.log("Update Password Status:", pwdUpdateRes.status);
    const pwdData = await pwdUpdateRes.json();
    console.log("Password Update:", pwdData.success ? "Success" : "Failed");

    // 6. Update Credentials File
    if (pwdData.success) {
        console.log("Updating credentials file...");
        const credentialsPath = path.join(__dirname, '..', 'test-credentials.json');
        if (fs.existsSync(credentialsPath)) {
            const creds = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
            creds.tenant.password = newPassword;
            if (updateData.data?.username) creds.tenant.username = updateData.data.username;
            fs.writeFileSync(credentialsPath, JSON.stringify(creds, null, 2));
            console.log("File saved.");
        }
    }
};

run();
