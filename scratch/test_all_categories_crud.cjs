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
  console.log('=== Starting All Categories CRUD Test ===\n');

  // Step 1: Login to get session
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
  const cookieHeader = Array.isArray(setCookie) ? setCookie.map(c => c.split(';')[0]).join('; ') : (setCookie || '');
  console.log('Login status:', loginRes.status, 'User:', loginRes.body?.user?.username || loginRes.body?.user?.nontriAccount, 'Cookie:', cookieHeader);

  const headers = {
    'Content-Type': 'application/json',
    Cookie: cookieHeader,
  };

  const categories = [
    {
      cat: 'research',
      createPayload: {
        name: '[TEST] โครงการวิจัยทดสอบอัตโนมัติ',
        code: 'TEST-RES-999',
        head: 'ดร.สมชาย ทดสอบ',
        department: 'CPE',
        budget: '150000',
        fiscal_year: '2567',
        status: 'ดำเนินการ',
        start_date: '2567-01-01',
        end_date: '2567-12-31',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        name: '[TEST] โครงการวิจัยทดสอบอัตโนมัติ (แก้ไข)',
        budget: '200000',
      }),
    },
    {
      cat: 'academic',
      createPayload: {
        name: '[TEST] โครงการบริการวิชาการ/พัฒนาวิชาการ',
        head: 'อาจารย์สมศรี ทดสอบ',
        department: 'IE',
        budget: '50000',
        fiscal_year: '2567',
        client: 'กรมพัฒนาธุรกิจ',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        name: '[TEST] โครงการบริการวิชาการ/พัฒนาวิชาการ (แก้ไข)',
        budget: '60000',
      }),
    },
    {
      cat: 'publications',
      createPayload: {
        title: '[TEST] การวิเคราะห์ระบบอัจฉริยะ',
        first_author: 'ดร.สมศักดิ์ ทดสอบ',
        department: 'ME',
        journal: 'IEEE Transactions on Testing',
        fiscal_year_be: '2567',
        type: 'วารสารวิชาการระดับนานาชาติ',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        title: '[TEST] การวิเคราะห์ระบบอัจฉริยะ (แก้ไข)',
        journal: 'IEEE Transactions on Testing Vol 2',
      }),
    },
    {
      cat: 'service',
      createPayload: {
        name: '[TEST] บรรยายพิเศษด้านปัญญาประดิษฐ์',
        service_category: 'วิทยากร/อาจารย์พิเศษ',
        person: 'ดร.สมชาย ทดสอบ',
        department: 'CPE',
        hours_spent: '6',
        attendees_count: '45',
        fiscal_year: '2567',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        name: '[TEST] บรรยายพิเศษด้านปัญญาประดิษฐ์ (แก้ไข)',
        hours_spent: '8',
      }),
    },
    {
      cat: 'ip',
      createPayload: {
        title: '[TEST] วิธีการเข้ารหัสข้อมูลแบบใหม่',
        type: 'อนุสิทธิบัตร',
        creator: 'ดร.สมชาย ทดสอบ',
        department: 'CPE',
        fiscal_year: '2567',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        title: '[TEST] วิธีการเข้ารหัสข้อมูลแบบใหม่ (แก้ไข)',
        status: 'ยื่นคำขอแล้ว',
      }),
    },
    {
      cat: 'personnel',
      createPayload: {
        name: 'นายทดสอบ ระบบอัตโนมัติ',
        department: 'CPE',
        email: 'test.auto@ku.th',
        position: 'ผู้เชี่ยวชาญ',
      },
      updatePayload: (id, dbId) => ({
        id,
        dbId,
        name: 'นายทดสอบ ระบบอัตโนมัติ (แก้ไข)',
        position: 'ผู้เชี่ยวชาญอาวุโส',
      }),
    },
  ];

  const results = [];

  for (const c of categories) {
    console.log(`\nTesting category: ${c.cat}`);

    // CREATE
    const createRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 8000,
        path: `/api/v1/data/${c.cat}`,
        method: 'POST',
        headers,
      },
      c.createPayload
    );

    const createdItem = createRes.body?.data;
    const createStatus = createRes.status;
    const targetId = createdItem?.id || createdItem?._id;
    const dbId = createdItem?.dbId;

    console.log(`  CREATE -> Status: ${createStatus}, targetId: ${targetId}, dbId: ${dbId}`);

    if (createStatus !== 201 && createStatus !== 200) {
      console.error(`  CREATE FAILED:`, createRes.body);
      results.push({ cat: c.cat, op: 'CREATE', status: createStatus, ok: false, error: createRes.body });
      continue;
    }

    // UPDATE
    const updateRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 8000,
        path: `/api/v1/data/${c.cat}`,
        method: 'PUT',
        headers,
      },
      c.updatePayload(targetId, dbId)
    );

    const updateStatus = updateRes.status;
    console.log(`  UPDATE -> Status: ${updateStatus}`);

    if (updateStatus !== 200) {
      console.error(`  UPDATE FAILED:`, updateRes.body);
      results.push({ cat: c.cat, op: 'UPDATE', status: updateStatus, ok: false, error: updateRes.body });
    }

    // DELETE
    const deleteRes = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 8000,
        path: `/api/v1/data/${c.cat}?id=${targetId}&dbId=${dbId || ''}`,
        method: 'DELETE',
        headers,
      },
      { id: targetId, dbId }
    );

    const deleteStatus = deleteRes.status;
    console.log(`  DELETE -> Status: ${deleteStatus}`);

    if (deleteStatus !== 200) {
      console.error(`  DELETE FAILED:`, JSON.stringify(deleteRes.body));
      results.push({ cat: c.cat, op: 'DELETE', status: deleteStatus, ok: false, error: deleteRes.body });
    } else {
      results.push({ cat: c.cat, op: 'ALL', status: 200, ok: true });
    }
  }

  // Also test evaluation
  console.log('\nTesting evaluation upsert...');
  const evalRes = await makeRequest(
    {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/v1/evaluation',
      method: 'POST',
      headers,
    },
    {
      category: 'research',
      recordId: 'test_eval_1',
      sdgIds: [1, 2, 3],
      iType: 'I-1',
    }
  );
  console.log('  EVALUATION UPSERT -> Status:', evalRes.status);
  results.push({ cat: 'evaluation', op: 'UPSERT', status: evalRes.status, ok: evalRes.status === 200 });

  // Cleanup evaluation test row
  const path = require('path');
  const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
  const prisma = new PrismaClient();
  await prisma.evaluation.deleteMany({ where: { recordId: 'test_eval_1' } });
  await prisma.$disconnect();

  console.log('\n=== Summary Results ===');
  console.table(results);
}

run().catch(console.error);
