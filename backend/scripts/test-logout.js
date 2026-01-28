
const testLogout = async () => {
    console.log("Starting Logout Test...");

    const tenant = {
        email: "tenant_1769530688797@example.com",
        password: "password123",
        role: "tenant"
    };

    console.log(`\n--- 1. Logging in as ${tenant.role} ---`);

    let accessToken = "";
    try {
        const loginResponse = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: tenant.email, password: tenant.password })
        });

        const loginData = await loginResponse.json();

        // Correct path based on observed API response
        // Response: { statusCode: 200, data: { user: {...}, accessToken: "...", ... } }
        if (loginData.data && loginData.data.accessToken) {
            accessToken = loginData.data.accessToken;
        }

        if (!accessToken) {
            console.error("❌ Could not find access token. Response:", JSON.stringify(loginData, null, 2));
            return;
        }
        console.log("✅ Login successful. Token received.");

    } catch (error) {
        console.error("❌ Network Error during login:", error.message);
        return;
    }

    // 3. Logout using the Token
    console.log(`\n--- 2. Logging out ---`);
    try {
        const logoutResponse = await fetch('http://localhost:8000/api/v1/users/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const logoutData = await logoutResponse.json();

        console.log(`Status: ${logoutResponse.status}`);
        console.log("Response:", JSON.stringify(logoutData, null, 2));

        if (logoutResponse.ok) {
            console.log("✅ Logout successful!");
        } else {
            console.log("❌ Logout failed.");
        }

    } catch (error) {
        console.error("❌ Network Error during logout:", error.message);
    }
};

testLogout();
