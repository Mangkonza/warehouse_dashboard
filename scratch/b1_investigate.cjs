const http = require('http');
const crypto = require('crypto');

const AUTH_SESSION_SECRET = 'ku_warehouse_auth_session_secret_2026_dev_key';
const SESSION_COOKIE_NAME = 'ku_session';

function makeSessionCookie(username) {
  const payload = {
    username: username.toLowerCase().trim(),
    issuedAt: Date.now(),
    expiresAt: Date.now() + 8 * 3600 * 1000,
    isMock: false,
    version: 1,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SESSION_SECRET).update(payloadB64).digest('base64url');
  return `${SESSION_COOKIE_NAME}=${payloadB64}.${hmac}`;
}

function sendReq(port, method, reqPath, body, cookie) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(data);
    }
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: reqPath,
        method,
        headers,
      },
      (res) => {
        let respBody = '';
        res.on('data', (chunk) => (respBody += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(respBody);
          } catch {
            parsed = respBody;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', (err) => {
      resolve({ status: 'ERROR', body: err.message });
    });
    if (data) req.write(data);
    req.end();
  });
}

async function runB1() {
  const adminCookie = makeSessionCookie('b0123456789');

  const categories = [
    { cat: 'research', sample: { name: '[TEST] Research Test 1', status: 'In Progress', budget_internal: '10000', head: 'ทดสอบ' } },
    { cat: 'academic', sample: { name: '[TEST] Academic Test 1', status: 'ดำเนินการ', budget_total: '50000' } },
    { cat: 'publications', sample: { name: '[TEST] Pub Test 1', journal: 'IEEE Access', quartile: 'Q1' } },
    { cat: 'service', sample: { name: '[TEST] Service Test 1', service_type: 'ฝึกอบรม', status: 'เสร็จสิ้น' } },
    { cat: 'ip', sample: { name: '[TEST] IP Test 1', ip_type: 'สิทธิบัตร', request_no: '2601000001' } },
    { cat: 'personnel', sample: { name: '[TEST] Personnel Test 1', department: 'CPE', email: 'test@ku.th' } },
    { cat: 'evaluation', sample: { targetId: 'research_1', score: 5, evaluator: 'Admin' } },
    { cat: 'user_roles', sample: { username: 'b8888888888', role: 'admin' } },
  ];

  console.log('=== TESTING DIRECT TO BACKEND :8000 ===');
  for (const item of categories) {
    const postRes = await sendReq(8000, 'POST', item.cat === 'user_roles' ? '/api/v1/admin/roles' : item.cat === 'evaluation' ? '/api/v1/evaluation' : `/api/v1/data/${item.cat}`, item.sample, adminCookie);
    console.log(`[8000] POST ${item.cat} -> ${postRes.status}:`, JSON.stringify(postRes.body));

    const putRes = await sendReq(8000, 'PUT', item.cat === 'user_roles' ? `/api/v1/admin/roles/${item.sample.username}` : item.cat === 'evaluation' ? '/api/v1/evaluation' : `/api/v1/data/${item.cat}`, { ...item.sample, id: 999999, _id: 'test_999999' }, adminCookie);
    console.log(`[8000] PUT  ${item.cat} -> ${putRes.status}:`, JSON.stringify(putRes.body));

    const delRes = await sendReq(8000, 'DELETE', item.cat === 'user_roles' ? `/api/v1/admin/roles/${item.sample.username}` : item.cat === 'evaluation' ? '/api/v1/evaluation?id=test_999999' : `/api/v1/data/${item.cat}?id=test_999999`, null, adminCookie);
    console.log(`[8000] DEL  ${item.cat} -> ${delRes.status}:`, JSON.stringify(delRes.body));
  }

  console.log('\n=== TESTING VIA FRONTEND REWRITE/PROXY :3000 ===');
  for (const item of categories) {
    const postRes = await sendReq(3000, 'POST', item.cat === 'user_roles' ? '/api/v1/admin/roles' : item.cat === 'evaluation' ? '/api/v1/evaluation' : `/api/v1/data/${item.cat}`, item.sample, adminCookie);
    console.log(`[3000] POST ${item.cat} -> ${postRes.status}:`, JSON.stringify(postRes.body));

    const putRes = await sendReq(3000, 'PUT', item.cat === 'user_roles' ? `/api/v1/admin/roles/${item.sample.username}` : item.cat === 'evaluation' ? '/api/v1/evaluation' : `/api/v1/data/${item.cat}`, { ...item.sample, id: 999999, _id: 'test_999999' }, adminCookie);
    console.log(`[3000] PUT  ${item.cat} -> ${putRes.status}:`, JSON.stringify(putRes.body));

    const delRes = await sendReq(3000, 'DELETE', item.cat === 'user_roles' ? `/api/v1/admin/roles/${item.sample.username}` : item.cat === 'evaluation' ? '/api/v1/evaluation?id=test_999999' : `/api/v1/data/${item.cat}?id=test_999999`, null, adminCookie);
    console.log(`[3000] DEL  ${item.cat} -> ${delRes.status}:`, JSON.stringify(delRes.body));
  }
}

runB1().catch(console.error);
