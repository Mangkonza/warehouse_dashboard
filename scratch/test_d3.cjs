const assert = require('assert');

const BASE_URL = 'http://localhost:8000/api/v1';

async function runTests() {
  console.log('--- เริ่มการทดสอบ D3: Guard ครบทุก Endpoint (401 / 403) ---');

  const { prisma } = await import('../backend/dist/db/prisma.js');

  // -------------------------------------------------------------
  // Test 1: Unauthenticated requests without session cookie -> 401
  // -------------------------------------------------------------
  console.log('Step 1: ทดสอบยิงทุก Endpoint โดยไม่ล็อกอิน...');

  // Public endpoints (must NOT return 401)
  {
    const h1 = await fetch('http://localhost:8000/health');
    assert.strictEqual(h1.status, 200, 'Public /health must be 200');

    const h2 = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(h2.status, 200, 'Public /api/v1/health must be 200');

    const lUrl = await fetch(`${BASE_URL}/auth/login-url`);
    assert.strictEqual(lUrl.status, 200, 'Public /auth/login-url must be 200');
  }

  // Protected endpoints: ALL must return 401
  const endpointsToCheck401 = [
    { method: 'GET', url: `${BASE_URL}/auth/me` },
    { method: 'GET', url: `${BASE_URL}/dashboard/overview` },
    { method: 'GET', url: `${BASE_URL}/dashboard/research` },
    { method: 'GET', url: `${BASE_URL}/data/research` },
    { method: 'GET', url: `${BASE_URL}/data/academic` },
    { method: 'GET', url: `${BASE_URL}/data/publications` },
    { method: 'GET', url: `${BASE_URL}/data/service` },
    { method: 'GET', url: `${BASE_URL}/data/ip` },
    { method: 'GET', url: `${BASE_URL}/data/personnel` },
    { method: 'GET', url: `${BASE_URL}/ip` },
    { method: 'GET', url: `${BASE_URL}/services` },
    { method: 'GET', url: `${BASE_URL}/personnel` },
    { method: 'GET', url: `${BASE_URL}/evaluation` },
    { method: 'GET', url: `${BASE_URL}/lookups/departments` },
    { method: 'GET', url: `${BASE_URL}/lookups/courses` },
    { method: 'GET', url: `${BASE_URL}/lookups/funding-sources` },
    { method: 'POST', url: `${BASE_URL}/data/research`, body: { title: 'hacker' } },
    { method: 'POST', url: `${BASE_URL}/ip`, body: { title: 'hacker' } },
    { method: 'POST', url: `${BASE_URL}/services`, body: { title: 'hacker' } },
    { method: 'POST', url: `${BASE_URL}/personnel`, body: { name: 'hacker' } },
    { method: 'POST', url: `${BASE_URL}/evaluation`, body: { status: 'passed' } },
    { method: 'GET', url: `${BASE_URL}/admin/roles` },
  ];

  for (const ep of endpointsToCheck401) {
    const opts = {
      method: ep.method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (ep.body) opts.body = JSON.stringify(ep.body);

    const res = await fetch(ep.url, opts);
    assert.strictEqual(
      res.status,
      401,
      `Endpoint ${ep.method} ${ep.url} must return 401 when unauthenticated, got ${res.status}`
    );
  }
  console.log(`✅ 1. ป้องกันสมบูรณ์: ทั้ง ${endpointsToCheck401.length} Endpoints คืนค่า 401 เมื่อไม่ได้ล็อกอิน`);

  // -------------------------------------------------------------
  // Test 2: Role-Based Authorization Checks (user, management, admin, super_admin)
  // -------------------------------------------------------------
  console.log('Step 2: ทดสอบการแยกสิทธิ์ตามบทบาท (403 Forbidden)...');

  // Helper to create test user session
  async function getSessionForUser(username, role) {
    await prisma.userRole.upsert({
      where: { username },
      create: { username, role, displayName: `Test ${role}` },
      update: { role },
    });

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: 'password123' }),
    });
    return res.headers.get('set-cookie').split(';')[0];
  }

  const userCookie = await getSessionForUser('b6400000001', 'user');
  const mgmtCookie = await getSessionForUser('b6400000002', 'management');
  const adminCookie = await getSessionForUser('b6400000003', 'admin');
  const superCookie = await getSessionForUser('b6520503525', 'super_admin');

  // A. User level
  {
    // Can access user resources
    const r1 = await fetch(`${BASE_URL}/dashboard/overview`, { headers: { Cookie: userCookie } });
    assert.strictEqual(r1.status, 200, 'User must access /dashboard/overview');

    const r2 = await fetch(`${BASE_URL}/data/research`, { headers: { Cookie: userCookie } });
    assert.strictEqual(r2.status, 200, 'User must access /data/research');

    // CANNOT access management resources -> 403
    const r3 = await fetch(`${BASE_URL}/data/personnel`, { headers: { Cookie: userCookie } });
    assert.strictEqual(r3.status, 403, 'User must be 403 on /data/personnel');

    const r4 = await fetch(`${BASE_URL}/evaluation`, { headers: { Cookie: userCookie } });
    assert.strictEqual(r4.status, 403, 'User must be 403 on /evaluation');

    // CANNOT perform admin write -> 403
    const r5 = await fetch(`${BASE_URL}/data/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: userCookie },
      body: JSON.stringify({ title: 'hack' }),
    });
    assert.strictEqual(r5.status, 403, 'User must be 403 on POST /data/research');

    // CANNOT access roles -> 403
    const r6 = await fetch(`${BASE_URL}/admin/roles`, { headers: { Cookie: userCookie } });
    assert.strictEqual(r6.status, 403, 'User must be 403 on /admin/roles');

    console.log('✅ 2.1 ผู้ใช้ทั่วไป (user): เข้าแดชบอร์ด/งานวิจัยได้ แต่ถูกสกัด 403 เมื่อเข้าบุคลากร, การประเมิน, แก้ไขข้อมูล หรือจัดการสิทธิ์');
  }

  // B. Management level
  {
    // Can access personnel and evaluation
    const r1 = await fetch(`${BASE_URL}/data/personnel`, { headers: { Cookie: mgmtCookie } });
    assert.strictEqual(r1.status, 200, 'Management must access /data/personnel');

    const r2 = await fetch(`${BASE_URL}/evaluation`, { headers: { Cookie: mgmtCookie } });
    assert.strictEqual(r2.status, 200, 'Management must access /evaluation');

    // CANNOT write data -> 403
    const r3 = await fetch(`${BASE_URL}/data/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: mgmtCookie },
      body: JSON.stringify({ title: 'hack' }),
    });
    assert.strictEqual(r3.status, 403, 'Management must be 403 on POST /data/research');

    // CANNOT access roles -> 403
    const r4 = await fetch(`${BASE_URL}/admin/roles`, { headers: { Cookie: mgmtCookie } });
    assert.strictEqual(r4.status, 403, 'Management must be 403 on /admin/roles');

    console.log('✅ 2.2 ฝ่ายบริหาร (management): เข้าดูบุคลากรและการประเมินได้ แต่ถูกสกัด 403 เมื่องดเขียนข้อมูลและจัดการสิทธิ์');
  }

  // C. Admin level
  {
    // CANNOT access super_admin roles -> 403
    const r1 = await fetch(`${BASE_URL}/admin/roles`, { headers: { Cookie: adminCookie } });
    assert.strictEqual(r1.status, 403, 'Admin must be 403 on /admin/roles');

    console.log('✅ 2.3 ผู้ดูแลระบบ (admin): ถูกสกัด 403 เมื่อพยายามเข้าถึง endpoint จัดการสิทธิ์ (user_roles)');
  }

  // D. Super Admin level
  {
    // CAN access roles -> 200
    const r1 = await fetch(`${BASE_URL}/admin/roles`, { headers: { Cookie: superCookie } });
    assert.strictEqual(r1.status, 200, 'Super admin must access /admin/roles');

    console.log('✅ 2.4 ผู้ดูแลระบบสูงสุด (b6520503525 super_admin): เข้าถึงได้ทุกฟังก์ชันรวมถึง /admin/roles');
  }

  // Cleanup test users
  await prisma.userRole.deleteMany({
    where: { username: { in: ['b6400000001', 'b6400000002', 'b6400000003'] } },
  });

  console.log('--- สรุปการทดสอบ D3: ผ่าน 100% ครบทุกข้อ ---');
  await prisma.$disconnect();
}

runTests().catch(async (e) => {
  console.error('❌ D3 Test Error:', e);
  process.exit(1);
});
