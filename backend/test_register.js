
import fetch from 'node-fetch';

async function testRegister() {
    try {
        console.log("🚀 Testing Registration on Port 5000...");
        const res = await fetch('http://localhost:5000/api/students/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: "Debug User",
                gender: "Male",
                dob: "17-05-2003", // Intentionally using DD-MM-YYYY to test failure
                mobile: "9999999999",
                email: "debug_" + Date.now() + "@example.com",
                address: "Test Address",
                password: "password123"
            })
        });

        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", data);

        if (res.status === 500) {
            console.log("❌ Server Error Confirmed. Likely Date Format or SQL Issue.");
        } else if (res.status === 201) {
            console.log("✅ Success! (Maybe format was accepted due to loose parsing?)");
        }

    } catch (err) {
        console.error("❌ Request Failed:", err.message);
    }
}

testRegister();
