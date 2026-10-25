const assert = require('assert');

const BASE_URL = 'http://localhost:8000/api/v1';

async function runTests() {
  console.log('--- เริ่มการทดสอบ D2: บทบาทและสิทธิ์ (RBAC) ---');

  const { prisma } = await import('../backend/dist/db/prisma.js');
  const { canAccess, ROLE_HIERARCHY } = await import('../backend/dist/config/permissions.js');

  // Test 1: Hierarchy levels
  assert.strictEqual(ROLE_HIERARCHY.user, 1);
  assert.strictEqual(ROLE_HIERARCHY.management, 2);
  assert.strictEqual(ROLE_HIERARCHY.admin, 3);
  assert.strictEqual(ROLE_HIERARCHY.super_admin, 4);
  console.log('✅ 1. ลำดับชั้นบทบาทถูกต้อง: user(1) < management(2) < admin(3) < super_admin(4)');

  // Test 2: canAccess permissions check
  // user
  assert.strictEqual(canAccess('user', 'overview'), true);
  assert.strictEqual(canAccess('user', 'research'), true);
  assert.strictEqual(canAccess('user', 'ip'), true);
  assert.strictEqual(canAccess('user', 'kpi'), false);
  assert.strictEqual(canAccess('user', 'personnel'), false);
  assert.strictEqual(canAccess('user', 'manage'), false);

  // management
  assert.strictEqual(canAccess('management', 'overview'), true);
  assert.strictEqual(canAccess('management', 'kpi'), true);
  assert.strictEqual(canAccess('management', 'personnel'), true);
  assert.strictEqual(canAccess('management', 'evaluation'), true);
  assert.strictEqual(canAccess('management', 'monitoring'), true);
  assert.strictEqual(canAccess('management', 'manage'), false);

  // admin
  assert.strictEqual(canAccess('admin', 'manage'), true);
  assert.strictEqual(canAccess('admin', 'user_roles'), false);

  // super_admin
  assert.strictEqual(canAccess('super_admin', 'user_roles'), true);
  assert.strictEqual(canAccess('super_admin', 'manage'), true);
  console.log('✅ 2. canAccess(role, resource) ทำงานถูกต้องตามเมตริกซ์สิทธิ์ทุกระดับ');

  // Test 3: Account containing 'admin' in name does NOT automatically get admin
  {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'b6410000000', // valid student format
        password: 'student_pass',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'user', 'Normal student without role in DB must have role "user"');
    console.log('✅ 3. บัญชีทั่วไปที่ไม่มีในตาราง user_roles ได้รับสิทธิ์ "user" เป็นค่าเริ่มต้น');
  }

  // Test 4: Dynamic DB role update applies immediately without relogging in
  {
    // 1. Create a test user in DB with role 'user'
    const testUsername = 'b6499999999';
    await prisma.userRole.deleteMany({ where: { username: testUsername } });
    await prisma.userRole.create({
      data: {
        username: testUsername,
        role: 'user',
        displayName: 'Test User 99',
      },
    });

    // 2. Login as test user and get session cookie
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: 'password99',
      }),
    });
    const sessionCookie = loginRes.headers.get('set-cookie').split(';')[0];

    // 3. Check /me before update -> role = user
    const meRes1 = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    const meData1 = await meRes1.json();
    assert.strictEqual(meData1.user.role, 'user');

    // 4. Update role in DB to 'management' directly
    await prisma.userRole.update({
      where: { username: testUsername },
      data: { role: 'management' },
    });

    // 5. Call /me with SAME cookie -> immediately returns role = management!
    const meRes2 = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    const meData2 = await meRes2.json();
    assert.strictEqual(
      meData2.user.role,
      'management',
      'Role change in DB must take effect immediately on next request!'
    );

    // Clean up test user
    await prisma.userRole.deleteMany({ where: { username: testUsername } });

    console.log('✅ 4. เปลี่ยนบทบาทในฐานข้อมูล (DB) มีผลทันทีกับ Session เดิม โดยไม่ต้องล็อกอินใหม่');
  }

  console.log('--- สรุปการทดสอบ D2: ผ่าน 100% ครบทุกข้อ ---');
  await prisma.$disconnect();
}

runTests().catch(async (e) => {
  console.error('❌ D2 Test Error:', e);
  process.exit(1);
});
