
const loginUser = async (role, email, password) => {
    const credentials = {
        email: email,
        password: password
    };

    console.log(`\n--- Logging in ${role} ---`);
    console.log("Email:", email);

    try {
        const response = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();

        try {
            const data = JSON.parse(text);
            // Hide full token for brevity if successful, but show structure
            if (data.data?.accessToken) data.data.accessToken = "HIDDEN_TOKEN...";
            if (data.data?.refreshToken) data.data.refreshToken = "HIDDEN_TOKEN...";

            console.log("Response (JSON):", JSON.stringify(data, null, 2));

            if (response.ok) {
                console.log(`✅ ${role} logged in successfully!`);
            } else {
                console.log(`❌ Failed to log in ${role}`);
            }
        } catch (e) {
            console.log("Response (Raw):", text);
            console.log("❌ Failed to parse JSON response");
        }

    } catch (error) {
        console.error("❌ Network/Script Error:", error.message);
    }
};

const runTests = async () => {
    console.log("Starting Login Tests...");

    // Credentials from previous registration test (Step 110)
    const tenantEmail = "tenant_1769530688797@example.com";
    const ownerEmail = "owner_1769530689483@example.com";
    const password = "password123";

    // Test Tenant Login
    await loginUser("tenant", tenantEmail, password);

    // Test Owner Login
    await loginUser("owner", ownerEmail, password);
};

runTests();
