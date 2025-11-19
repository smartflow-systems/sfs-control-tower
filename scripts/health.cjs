const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Health check: ${res.statusCode === 200 ? '✅ OK' : '❌ FAIL'}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', (e) => {
  console.error(`Health check failed: ${e.message}`);
  process.exit(1);
});

req.end();
