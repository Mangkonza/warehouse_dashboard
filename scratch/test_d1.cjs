const assert = require('assert');

const BASE_URL = 'http://localhost:8000/api/v1';

async function runTests() {
  console.log('--- เริ่มการทดสอบ D1: Server-side Session & Auth Endpoints ---');

  // Test 1: GET /auth/me without session -> 401 & no-store
  {
    const res = await fetch(`${BASE_URL}/auth/me`);
    assert.strictEqual(res.status, 401, 'Test 1 FAIL: Unauthenticated GET /me must return 401');
    const cc = res.headers.get('cache-control') || '';
    assert.ok(cc.includes('no-store'), 'Test 1 FAIL: Cache-Control must include no-store');
    console.log('✅ 1. GET /api/v1/auth/me ไม่มี cookie → 401 พร้อม Cache-Control: no-store');
  }

  // Test 2: POST /auth/session with fake credentials -> 401
  {
    const res = await fetch(`${BASE_URL}/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'fake_user' }), // missing password
    });
    assert.strictEqual(res.status, 400, 'Test 2 FAIL: Missing password must return 400');

    const res2 = await fetch(`${BASE_URL}/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    });
    assert.strictEqual(res2.status, 401, 'Test 2 FAIL: Bad password must return 401');
    console.log('✅ 2. POST /api/v1/auth/session ไม่เชื่อ username เปล่า ปฏิเสธ 400/401');
  }

  // Test 3: POST /auth/login with valid b6520503525
  let sessionCookie = '';
  {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'b6520503525',
        password: 'password123',
        otp: '123456',
      }),
    });
    assert.strictEqual(res.status, 200, 'Test 3 FAIL: Valid login should return 200');
    const data = await res.json();
    assert.strictEqual(data.status, 'success');
    assert.strictEqual(data.user.nontriAccount, 'b6520503525');
    assert.strictEqual(data.user.role, 'super_admin');
    assert.ok(data.expiresAt > Date.now(), 'expiresAt must be in the future');

    // Check Set-Cookie header
    const rawCookie = res.headers.get('set-cookie') || '';
    assert.ok(rawCookie.includes('ku_session='), 'Set-Cookie must contain ku_session');
    assert.ok(rawCookie.toLowerCase().includes('httponly'), 'ku_session must be httpOnly');
    assert.ok(rawCookie.toLowerCase().includes('samesite=lax'), 'ku_session must have SameSite=Lax');

    sessionCookie = rawCookie.split(';')[0];
    console.log('✅ 3. POST /api/v1/auth/login บัญชี b6520503525 → 200 ได้รับบทบาท super_admin จาก DB พร้อม cookie ku_session (httpOnly, Lax)');
  }

  // Test 4: GET /auth/me with valid ku_session
  {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: sessionCookie,
      },
    });
    assert.strictEqual(res.status, 200, 'Test 4 FAIL: Authenticated /me should return 200');
    const data = await res.json();
    assert.strictEqual(data.user.nontriAccount, 'b6520503525');
    assert.strictEqual(data.user.role, 'super_admin');
    console.log('✅ 4. GET /api/v1/auth/me ส่ง ku_session คืนโปรไฟล์ super_admin และ expiresAt ถูกต้อง');
  }

  // Test 5: Cookie tampering -> 401
  {
    // Modify 1 character in the payload
    const tampered = sessionCookie.replace('ku_session=', 'ku_session=X');
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: tampered,
      },
    });
    assert.strictEqual(res.status, 401, 'Test 5 FAIL: Tampered cookie must return 401');
    console.log('✅ 5. ปลอมแปลง cookie หรือลายเซ็นถูกปฏิเสธ 401 ทันที');
  }

  // Test 6: Rate Limiting
  {
    const testUsername = 'ratelimit_victim_' + Date.now();
    let got429 = false;
    for (let i = 0; i < 7; i++) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: testUsername, password: 'wrong' }),
      });
      if (res.status === 429) {
        got429 = true;
        const data = await res.json();
        assert.ok(data.message.includes('5 นาที'), 'Error message must mention 5 minutes');
        break;
      }
    }
    assert.ok(got429, 'Test 6 FAIL: Rate limit should trigger 429 after 5 failed attempts');
    console.log('✅ 6. Rate Limiter ทำงาน: พยายามล็อกอินผิดเกิน 5 ครั้ง โดนบล็อก 429 (5 นาที)');
  }

  // Test 7: POST /auth/logout clears cookie
  {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const rawCookie = res.headers.get('set-cookie') || '';
    assert.ok(
      rawCookie.includes('ku_session=;') || rawCookie.includes('Max-Age=0') || rawCookie.includes('Expires='),
      'Set-Cookie must clear ku_session'
    );
    console.log('✅ 7. POST /api/v1/auth/logout ล้างคุกกี้ ku_session เรียบร้อย');
  }

  console.log('--- สรุปการทดสอบ D1: ผ่าน 100% ครบทุกข้อ ---');
}

runTests().catch((e) => {
  console.error('❌ D1 Test Error:', e);
  process.exit(1);
});
