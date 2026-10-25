const http = require('http');
const crypto = require('crypto');

const AUTH_SESSION_SECRET = 'ku_warehouse_auth_session_secret_2026_dev_key';
const SESSION_COOKIE_NAME = 'ku_session';

function makeSessionCookie(username, isMock = false) {
  const payload = {
    username: username.toLowerCase().trim(),
    issuedAt: Date.now(),
    expiresAt: Date.now() + 8 * 3600 * 1000,
    isMock,
    version: 1,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', AUTH_SESSION_SECRET).update(payloadB64).digest('base64url');
  return `${SESSION_COOKIE_NAME}=${payloadB64}.${hmac}`;
}

function request(method, path, body, cookie) {
  return new Promise((resolve, reject) => {
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
        port: 8000,
        path,
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
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING E1 ROLE MANAGEMENT TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Cookies for different actors
  const superAdminCookie = makeSessionCookie('b0123456789'); // super_admin
  const adminCookie = makeSessionCookie('b6520503525'); // Wait, b6520503525 is super_admin in db. Let's create an admin first!
  const userCookie = makeSessionCookie('b1234567890'); // regular user (no role record = user)

  // 1. Regular user trying to access /api/v1/admin/roles -> 403
  const res1 = await request('GET', '/api/v1/admin/roles', null, userCookie);
  assert(res1.status === 403, `User gets 403 on GET /api/v1/admin/roles (got ${res1.status})`);

  // 2. Super Admin can list roles
  const res2 = await request('GET', '/api/v1/admin/roles', null, superAdminCookie);
  assert(res2.status === 200 && res2.body.status === 'success' && Array.isArray(res2.body.data), `Super admin can GET /api/v1/admin/roles (got ${res2.status})`);

  // 3. Super Admin adds an admin user 'b1111111111'
  // Clean up first if existed
  await request('DELETE', '/api/v1/admin/roles/b1111111111', null, superAdminCookie);
  await request('DELETE', '/api/v1/admin/roles/b2222222222', null, superAdminCookie);
  await request('DELETE', '/api/v1/admin/roles/b3333333333', null, superAdminCookie);

  const res3 = await request('POST', '/api/v1/admin/roles', {
    username: 'b1111111111',
    role: 'admin',
    displayName: 'Test Admin User',
    note: 'Initial admin for testing',
  }, superAdminCookie);
  assert(res3.status === 201 && res3.body.data.role === 'admin', `Super admin can grant 'admin' role to b1111111111 (got ${res3.status})`);

  // 4. Duplicate user creation returns 409
  const res4 = await request('POST', '/api/v1/admin/roles', {
    username: 'b1111111111',
    role: 'management',
  }, superAdminCookie);
  assert(res4.status === 409 && res4.body.code === 'USER_ROLE_EXISTS', `Duplicate username returns 409 USER_ROLE_EXISTS (got ${res4.status})`);

  // 5. Invalid username regex rejects (e.g. 'baduser' or 'b123')
  const res5 = await request('POST', '/api/v1/admin/roles', {
    username: 'baduser',
    role: 'management',
  }, superAdminCookie);
  assert(res5.status === 400 && res5.body.code === 'INVALID_USERNAME_FORMAT', `Invalid username regex returns 400 INVALID_USERNAME_FORMAT (got ${res5.status})`);

  // 6. Prohibit creating super_admin via API
  const res6 = await request('POST', '/api/v1/admin/roles', {
    username: 'b2222222222',
    role: 'super_admin',
  }, superAdminCookie);
  assert(res6.status === 403 && res6.body.code === 'FORBIDDEN_SUPER_ADMIN', `Granting super_admin returns 403 FORBIDDEN_SUPER_ADMIN (got ${res6.status})`);

  // 7. Prohibit self-modification
  const res7 = await request('POST', '/api/v1/admin/roles', {
    username: 'b0123456789',
    role: 'management',
  }, superAdminCookie);
  assert(res7.status === 403, `Self-modification returns 403 (got ${res7.status})`);

  // 8. Admin Cookie (b1111111111) can grant management
  const testAdminCookie = makeSessionCookie('b1111111111');
  const res8 = await request('POST', '/api/v1/admin/roles', {
    username: 'b2222222222',
    role: 'management',
    displayName: 'Test Management User',
  }, testAdminCookie);
  assert(res8.status === 201 && res8.body.data.role === 'management', `Admin can grant 'management' role (got ${res8.status})`);

  // 9. Admin CANNOT grant admin role -> 403
  const res9 = await request('POST', '/api/v1/admin/roles', {
    username: 'b3333333333',
    role: 'admin',
  }, testAdminCookie);
  assert(res9.status === 403 && res9.body.code === 'INSUFFICIENT_PRIVILEGE', `Admin cannot grant 'admin' role -> 403 INSUFFICIENT_PRIVILEGE (got ${res9.status})`);

  // 10. Admin CANNOT revoke or modify another admin
  const res10 = await request('DELETE', '/api/v1/admin/roles/b1111111111', null, testAdminCookie);
  assert(res10.status === 403, `Admin cannot revoke self or admin (got ${res10.status})`);

  // 11. Super Admin CANNOT revoke super admin
  const res11 = await request('DELETE', '/api/v1/admin/roles/b6520503525', null, superAdminCookie);
  assert(res11.status === 403 && res11.body.code === 'FORBIDDEN_SUPER_ADMIN', `Cannot revoke super admin -> 403 FORBIDDEN_SUPER_ADMIN (got ${res11.status})`);

  // 12. Protect last admin: If b1111111111 is the only admin, revoking it should fail
  // Let's check how many admins exist. If only 1, revoking it returns 403 LAST_ADMIN_PROTECTED
  const res12 = await request('DELETE', '/api/v1/admin/roles/b1111111111', null, superAdminCookie);
  assert(res12.status === 403 && res12.body.code === 'LAST_ADMIN_PROTECTED', `Last admin protected from revocation -> 403 LAST_ADMIN_PROTECTED (got ${res12.status})`);

  // 13. Audit logs endpoint returns logs and serialized BigInt ID
  const res13 = await request('GET', '/api/v1/admin/roles/audit-logs', null, superAdminCookie);
  assert(res13.status === 200 && Array.isArray(res13.body.data) && res13.body.data.length > 0, `GET /api/v1/admin/roles/audit-logs returns log entries (got ${res13.status}, count: ${res13.body.data?.length})`);
  const firstLog = res13.body.data?.[0];
  assert(typeof firstLog.id === 'string' && firstLog.actorUsername && firstLog.action, `Audit log id is string (BigInt serialized) and has fields`);

  // Clean up b2222222222
  await request('DELETE', '/api/v1/admin/roles/b2222222222', null, superAdminCookie);

  console.log(`--- RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runTests().catch(console.error);
