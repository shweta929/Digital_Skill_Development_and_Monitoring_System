async function testAI() {
    try {
        console.log("Testing AI Backend connection...");
        const response = await fetch('http://localhost:8080/api/ai/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: "Hello, are you working?"
            })
        });

        console.log("Response Status:", response.status);
        if (response.ok) {
            const data = await response.json();
            console.log("Response Data:", data);
        } else {
            const text = await response.text();
            console.log("Response Error Text:", text);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testAI();
