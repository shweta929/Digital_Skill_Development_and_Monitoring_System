
import fetch from 'node-fetch';

async function testSchedule() {
    try {
        console.log("🚀 Sending Test Request to localhost:5001...");
        const res = await fetch('http://localhost:5001/api/meetings/smart-auto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: '65ba...', // Fake Mongo ID to trigger sync
                email: 'test_script@example.com',
                name: 'Test Script User',
                requestedDate: new Date().toISOString(),
                note: 'Test from script'
            })
        });

        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", data);

    } catch (err) {
        console.error("❌ Request Failed:", err.message);
    }
}

testSchedule();
