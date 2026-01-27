
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runProfileTests = async () => {
    console.error("DEBUG: STARTING SCRIPT");

    // 1. Get Credentials
    const credentialsPath = path.join(__dirname, '..', 'test-credentials.json');
    if (!fs.existsSync(credentialsPath)) {
        console.error("❌ credentials file not found");
        return;
    }
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    let tenant = credentials.tenant;
    console.error(`DEBUG: Credentials Loaded. Email: ${tenant.email}`);

    console.error(`\n--- 1. Login as Tenant (${tenant.email}) ---`);
    let accessToken = "";
    try {
        const loginRes = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: tenant.email, password: tenant.password })
        });

        const loginText = await loginRes.text();
        console.error("DEBUG: Login Response Status:", loginRes.status);
        console.error("DEBUG: Login Response Raw:", loginText);

        const loginData = JSON.parse(loginText);

        if (!loginRes.ok) {
            console.error("❌ Error logging in:", JSON.stringify(loginData));
            return;
        }

        if (loginData.data && loginData.data.accessToken) {
            accessToken = loginData.data.accessToken;
        } else {
            // Fallback check
            if (loginData.accessToken) accessToken = loginData.accessToken;
        }

        if (!accessToken) {
            console.error("❌ No access token found in response", JSON.stringify(loginData, null, 2));
            return;
        }
        console.error("✅ Login successful");
    } catch (e) {
        console.error("❌ Error logging in:", e.message);
        return;
    }

    // 2. Get Current User
    console.error(`\n--- 2. Get Current User ---`);
    try {
        const res = await fetch('http://localhost:8000/api/v1/users/current-user', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (res.ok) {
            console.error(`✅ Fetched User: ${data.data.username}`);
        } else {
            console.error(`❌ Failed to fetch user: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        console.error("❌ Error fetching user:", e.message);
    }

    // 3. Update Profile (Text Data)
    console.error(`\n--- 3. Update Profile (Username & Phone) ---`);
    const newUsername = `updated_tenant_${Date.now()}`;
    const newPhone = "9999999999";

    try {
        const res = await fetch('http://localhost:8000/api/v1/users/update-profile', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername, phoneNumber: newPhone })
        });

        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { console.error("Raw Response Update Profile:", text); }

        if (res.ok) {
            console.error(`✅ Updated Profile: ${data.data.username}, ${data.data.phoneNumber}`);
            tenant.username = data.data.username;
            tenant.phoneNumber = data.data.phoneNumber;
        } else {
            console.error(`❌ Failed to update profile: ${JSON.stringify(data || text)}`);
        }
    } catch (e) {
        console.error("❌ Error updating profile:", e.message);
    }

    // 4. Update Password
    console.error(`\n--- 4. Update Password ---`);
    const newPassword = "newpassword456";
    try {
        const res = await fetch('http://localhost:8000/api/v1/users/update-profile', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: newPassword })
        });
        const data = await res.json();
        if (res.ok) {
            console.error(`✅ Updated Password successfully`);
            tenant.password = newPassword;
        } else {
            console.error(`❌ Failed to update password: ${JSON.stringify(data)}`);
            // Add robust fallback for debugging
            if (data.message === "Nothing to update") {
                console.error("Warning: Maybe payload structure issue?");
            }
        }

    } catch (e) {
        console.error("❌ Error updating password:", e.message);
    }

    // Save updated credentials
    console.error(`\n--- 5. Saving Updated Credentials ---`);
    credentials.tenant = tenant;
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
    console.error("✅ test-credentials.json updated");

};

runProfileTests();
