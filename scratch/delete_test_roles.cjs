const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const postBody = postData ? (typeof postData === 'string' ? postData : JSON.stringify(postData)) : null;
    const reqOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...(postBody ? { 'Content-Length': Buffer.byteLength(postBody) } : {}),
      },
    };
    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postBody) {
      req.write(postBody);
    }
    req.end();
  });
}

async function main() {
  console.log('Logging in as b0123456789...');
  const loginRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { username: 'b0123456789', password: 'Admin@1234', otp: '123456' }
  );

  const setCookie = loginRes.headers['set-cookie'];
  const cookieHeader = Array.isArray(setCookie) ? setCookie.map((c) => c.split(';')[0]).join('; ') : (setCookie || '');
  console.log('Login status:', loginRes.status);

  const targets = ['b1111111111', 'b6400000010', 'b9999999992', 'b9999999993'];
  for (const username of targets) {
    const delRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 8000,
      path: `/api/v1/admin/roles/${username}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    });
    console.log(`DELETE /roles/${username} -> Status:`, delRes.status, delRes.body?.message || delRes.body);
  }
}

main().catch(console.error);
