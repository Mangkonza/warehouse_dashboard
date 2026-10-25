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

async function run() {
  console.log('=== Testing Part A Server-Side Rules ===\n');

  // Step 1: Login as b0123456789
  const loginAdmin = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { username: 'b0123456789', password: 'Admin@1234', otp: '123456' }
  );

  const adminCookie = loginAdmin.headers['set-cookie'];
  const adminCookieHeader = Array.isArray(adminCookie)
    ? adminCookie.map((c) => c.split(';')[0]).join('; ')
    : adminCookie || '';
  console.log('Admin login status:', loginAdmin.status);

  const adminHeaders = {
    'Content-Type': 'application/json',
    Cookie: adminCookieHeader,
  };

  // 1. List roles: should return only admin accounts
  const listRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles',
    method: 'GET',
    headers: adminHeaders,
  });
  console.log('1. List Roles status:', listRes.status, 'Total admins:', listRes.body?.total);
  console.log('   Admins:', listRes.body?.data?.map((u) => `${u.username} (protected: ${u.isProtected})`));

  // 2. Try to revoke protected account b6520503525 -> must fail 403
  const revokeProtected = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles/b6520503525',
    method: 'DELETE',
    headers: adminHeaders,
  });
  console.log('2. Revoke Protected Account b6520503525 -> Status:', revokeProtected.status, '(Expected 403)', revokeProtected.body?.message);

  // 3. Try to revoke self account b0123456789 -> must fail 403
  const revokeSelf = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles/b0123456789',
    method: 'DELETE',
    headers: adminHeaders,
  });
  console.log('3. Revoke Self Account b0123456789 -> Status:', revokeSelf.status, '(Expected 403)', revokeSelf.body?.message);

  // 4. Try to grant admin with invalid format -> must fail 400
  const grantInvalid = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/admin/roles',
      method: 'POST',
      headers: adminHeaders,
    },
    { username: 'invalid_user', role: 'admin' }
  );
  console.log('4. Grant Invalid Format -> Status:', grantInvalid.status, '(Expected 400)', grantInvalid.body?.message);

  // 5. Grant valid admin b7777777777 -> must succeed 201
  const grantValid = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/admin/roles',
      method: 'POST',
      headers: adminHeaders,
    },
    { username: 'b7777777777', role: 'admin', displayName: 'อาจารย์ผู้ดูแลระบบทดสอบ' }
  );
  console.log('5. Grant Valid Admin b7777777777 -> Status:', grantValid.status, '(Expected 201)', grantValid.body?.message);

  // 6. Revoke newly created admin b7777777777 -> must succeed 200
  const revokeValid = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles/b7777777777',
    method: 'DELETE',
    headers: adminHeaders,
  });
  console.log('6. Revoke Admin b7777777777 -> Status:', revokeValid.status, '(Expected 200)', revokeValid.body?.message);

  // 7. Check audit logs to verify everything recorded
  const auditRes = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles/audit-logs?limit=5',
    method: 'GET',
    headers: adminHeaders,
  });
  console.log('\n7. Latest Audit Logs:');
  console.table(
    auditRes.body?.data?.map((l) => ({
      actor: l.actorUsername,
      action: l.action,
      target: l.targetUsername,
      oldRole: l.oldRole,
      newRole: l.newRole,
    }))
  );

  // 8. Test user role permissions (login as normal user b6400000001)
  const loginUser = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { username: 'b6400000001' }
  );
  const userCookie = loginUser.headers['set-cookie'];
  const userCookieHeader = Array.isArray(userCookie)
    ? userCookie.map((c) => c.split(';')[0]).join('; ')
    : userCookie || '';
  console.log('\n8. Normal User Login Status:', loginUser.status, 'Role:', loginUser.body?.user?.role);

  const userHeaders = {
    'Content-Type': 'application/json',
    Cookie: userCookieHeader,
  };

  // Normal user accessing overview -> 200 OK
  const userOverview = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/dashboard/overview',
    method: 'GET',
    headers: userHeaders,
  });
  console.log('   User accessing /dashboard/overview -> Status:', userOverview.status, '(Expected 200)');

  // Normal user accessing personnel -> 403 Forbidden
  const userPersonnel = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/data/personnel',
    method: 'GET',
    headers: userHeaders,
  });
  console.log('   User accessing /data/personnel -> Status:', userPersonnel.status, '(Expected 403)');

  // Normal user accessing admin roles -> 403 Forbidden
  const userAdminRoles = await makeRequest({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/api/v1/admin/roles',
    method: 'GET',
    headers: userHeaders,
  });
  console.log('   User accessing /admin/roles -> Status:', userAdminRoles.status, '(Expected 403)');
}

run().catch(console.error);
