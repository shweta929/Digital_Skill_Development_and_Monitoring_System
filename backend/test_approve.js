
import fetch from 'node-fetch';

async function testApprove() {
    try {
        console.log("🚀 Testing Approval for Meeting ID 2...");
        // Approval requires correct meetingId and finalDate string format
        const res = await fetch('http://localhost:5001/api/meetings/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                meetingId: 2,
                finalDate: "2026-02-02 at 03:00 PM" // Tomorrow 3 PM
            })
        });

        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", data);

    } catch (err) {
        console.error("❌ Request Failed:", err.message);
    }
}

testApprove();
