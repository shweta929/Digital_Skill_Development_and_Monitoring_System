const https = require('https');

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error("GROQ_API_KEY not set");
    process.exit(1);
}

const data = JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" }
    ]
});

const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    family: 4,
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
});

req.on('error', console.error);
req.write(data);
req.end();
