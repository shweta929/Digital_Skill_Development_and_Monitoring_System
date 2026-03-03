const https = require('https');

const options = {
    hostname: 'www.google.com',
    port: 443,
    path: '/',
    method: 'GET'
};

console.log("Pinging google.com...");

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
