
const registerUser = async (role) => {
    const user = {
        username: `test_${role}_${Date.now()}`,
        email: `${role}_${Date.now()}@example.com`,
        password: "password123",
        role: role,
        phoneNumber: "1234567890"
    };

    console.log(`\n--- Registering ${role} ---`);
    console.log("Payload:", user);

    try {
        const response = await fetch('http://localhost:8000/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();

        try {
            const data = JSON.parse(text);
            console.log("Response (JSON):", JSON.stringify(data, null, 2));
            if (response.ok) {
                console.log(`✅ ${role} registered successfully!`);
            } else {
                console.log(`❌ Failed to register ${role}`);
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
    // Wait a bit for server to settle if needed
    console.log("Starting Registration Tests...");

    // Test Tenant Registration
    await registerUser("tenant");

    // Test Owner Registration
    await registerUser("owner");
};

runTests();
