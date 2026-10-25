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
    const headers = { 'Content-Type': 'application/json' };
    if (body) headers['Content-Length'] = Buffer.byteLength(data);
    if (cookie) headers['Cookie'] = cookie;

    const req = http.request({ hostname: '127.0.0.1', port, path: reqPath, method, headers }, (res) => {
      let respBody = '';
      res.on('data', (chunk) => (respBody += chunk));
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(respBody); } catch { parsed = respBody; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', (err) => resolve({ status: 'ERROR', body: err.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  const adminCookie = makeSessionCookie('b0123456789');

  console.log('--- Testing CRUD on all categories via Port 3000 ---');

  // 1. Research
  console.log('\n[1] RESEARCH:');
  const resPost = await sendReq(3000, 'POST', '/api/v1/data/research', {
    name: '[TEST] Research Test Item',
    head: 'ดร.ทดสอบ',
    department: 'CPE',
    status: 'กำลังดำเนินการ',
    budget_internal: 50000,
    fund_source: 'ทุนอุดหนุนวิจัย',
  }, adminCookie);
  console.log('  POST status:', resPost.status, resPost.body?.message || resPost.body);
  const resId = resPost.body?.data?.id || resPost.body?.data?._id;
  const resDbId = resPost.body?.data?.dbId;
  console.log('  Created with id:', resId, 'dbId:', resDbId);

  if (resId || resDbId) {
    const resPut = await sendReq(3000, 'PUT', '/api/v1/data/research', {
      id: resId,
      _id: resId,
      dbId: resDbId,
      name: '[TEST] Research Test Item (Updated)',
      budget_internal: 60000,
    }, adminCookie);
    console.log('  PUT status:', resPut.status, resPut.body?.message || resPut.body);

    const resDel = await sendReq(3000, 'DELETE', `/api/v1/data/research?id=${encodeURIComponent(resId)}`, null, adminCookie);
    console.log('  DELETE status:', resDel.status, resDel.body?.message || resDel.body);
  }

  // 2. Academic
  console.log('\n[2] ACADEMIC:');
  const acadPost = await sendReq(3000, 'POST', '/api/v1/data/academic', {
    name: '[TEST] Academic Project Test',
    head: 'ดร.ทดสอบ',
    department: 'CPE',
    budget: 30000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
  }, adminCookie);
  console.log('  POST status:', acadPost.status, acadPost.body?.message || acadPost.body);
  const acadId = acadPost.body?.data?.id || acadPost.body?.data?._id;
  const acadDbId = acadPost.body?.data?.dbId;
  if (acadId || acadDbId) {
    const acadPut = await sendReq(3000, 'PUT', '/api/v1/data/academic', {
      id: acadId,
      _id: acadId,
      dbId: acadDbId,
      name: '[TEST] Academic Project Test (Updated)',
    }, adminCookie);
    console.log('  PUT status:', acadPut.status, acadPut.body?.message || acadPut.body);

    const acadDel = await sendReq(3000, 'DELETE', `/api/v1/data/academic?id=${encodeURIComponent(acadId)}`, null, adminCookie);
    console.log('  DELETE status:', acadDel.status, acadDel.body?.message || acadDel.body);
  }

  // 3. Publications
  console.log('\n[3] PUBLICATIONS:');
  const pubPost = await sendReq(3000, 'POST', '/api/v1/data/publications', {
    name: '[TEST] Publication Test Article',
    title: '[TEST] Publication Test Article',
    type: 'วารสารวิชาการนานาชาติ',
    level: 'นานาชาติ',
    owner: 'ดร.ทดสอบ',
    department: 'CPE',
    journal: 'IEEE Access',
  }, adminCookie);
  console.log('  POST status:', pubPost.status, pubPost.body?.message || pubPost.body);
  const pubId = pubPost.body?.data?.id || pubPost.body?.data?._id;
  const pubDbId = pubPost.body?.data?.dbId;
  if (pubId || pubDbId) {
    const pubPut = await sendReq(3000, 'PUT', '/api/v1/data/publications', {
      id: pubId,
      _id: pubId,
      dbId: pubDbId,
      name: '[TEST] Publication Test Article (Updated)',
    }, adminCookie);
    console.log('  PUT status:', pubPut.status, pubPut.body?.message || pubPut.body);

    const pubDel = await sendReq(3000, 'DELETE', `/api/v1/data/publications?id=${encodeURIComponent(pubId)}`, null, adminCookie);
    console.log('  DELETE status:', pubDel.status, pubDel.body?.message || pubDel.body);
  }

  // 4. Service
  console.log('\n[4] SERVICE:');
  const srvPost = await sendReq(3000, 'POST', '/api/v1/data/service', {
    name: '[TEST] Service Project',
    service_type: 'วิชาการ', // one of 6 valid
    person: 'ดร.ทดสอบ',
    department: 'CPE',
    hours_spent: 10,
    attendees_count: 50,
  }, adminCookie);
  console.log('  POST status:', srvPost.status, srvPost.body?.message || srvPost.body);
  const srvId = srvPost.body?.data?.id || srvPost.body?.data?._id;
  const srvDbId = srvPost.body?.data?.dbId;
  if (srvId || srvDbId) {
    const srvPut = await sendReq(3000, 'PUT', '/api/v1/data/service', {
      id: srvId,
      _id: srvId,
      dbId: srvDbId,
      name: '[TEST] Service Project (Updated)',
      service_type: 'วิชาการ',
    }, adminCookie);
    console.log('  PUT status:', srvPut.status, srvPut.body?.message || srvPut.body);

    const srvDel = await sendReq(3000, 'DELETE', `/api/v1/data/service?id=${encodeURIComponent(srvId)}`, null, adminCookie);
    console.log('  DELETE status:', srvDel.status, srvDel.body?.message || srvDel.body);
  }

  // 5. IP
  console.log('\n[5] IP:');
  const ipPost = await sendReq(3000, 'POST', '/api/v1/data/ip', {
    title: '[TEST] IP Project',
    type: 'สิทธิบัตร',
    creator: 'ดร.ทดสอบ',
    department: 'CPE',
    application_number: '2601009998',
  }, adminCookie);
  console.log('  POST status:', ipPost.status, ipPost.body?.message || ipPost.body);
  const ipId = ipPost.body?.data?.id || ipPost.body?.data?._id;
  const ipDbId = ipPost.body?.data?.dbId;
  if (ipId || ipDbId) {
    const ipPut = await sendReq(3000, 'PUT', '/api/v1/data/ip', {
      id: ipId,
      _id: ipId,
      dbId: ipDbId,
      title: '[TEST] IP Project (Updated)',
      type: 'สิทธิบัตร',
    }, adminCookie);
    console.log('  PUT status:', ipPut.status, ipPut.body?.message || ipPut.body);

    const ipDel = await sendReq(3000, 'DELETE', `/api/v1/data/ip?id=${encodeURIComponent(ipId)}`, null, adminCookie);
    console.log('  DELETE status:', ipDel.status, ipDel.body?.message || ipDel.body);
  }

  // 6. Personnel
  console.log('\n[6] PERSONNEL:');
  const perPost = await sendReq(3000, 'POST', '/api/v1/data/personnel', {
    name: '[TEST] Personnel Name',
    department: 'CPE',
    email: 'test_person2@ku.th',
    position: 'อาจารย์',
  }, adminCookie);
  console.log('  POST status:', perPost.status, perPost.body?.message || perPost.body);
  const perId = perPost.body?.data?.id || perPost.body?.data?._id;
  const perDbId = perPost.body?.data?.dbId;
  if (perId || perDbId) {
    const perPut = await sendReq(3000, 'PUT', '/api/v1/data/personnel', {
      id: perId,
      _id: perId,
      dbId: perDbId,
      name: '[TEST] Personnel Name (Updated)',
    }, adminCookie);
    console.log('  PUT status:', perPut.status, perPut.body?.message || perPut.body);

    const perDel = await sendReq(3000, 'DELETE', `/api/v1/data/personnel?id=${encodeURIComponent(perId)}`, null, adminCookie);
    console.log('  DELETE status:', perDel.status, perDel.body?.message || perDel.body);
  }

  // 7. Evaluation
  console.log('\n[7] EVALUATION:');
  const evalPost = await sendReq(3000, 'POST', '/api/v1/evaluation', {
    category: 'research',
    recordId: 'res_1',
    sdg_ids: [4, 9],
  }, adminCookie);
  console.log('  POST status:', evalPost.status, evalPost.body?.data ? 'Success' : evalPost.body);

  // 8. User Roles
  console.log('\n[8] USER_ROLES:');
  const rolePost = await sendReq(3000, 'POST', '/api/v1/admin/roles', {
    username: 'b7777777777',
    role: 'admin',
    displayName: 'Test Admin B1',
  }, adminCookie);
  console.log('  POST status:', rolePost.status, rolePost.body?.message || rolePost.body);
  const roleDel = await sendReq(3000, 'DELETE', '/api/v1/admin/roles/b7777777777', null, adminCookie);
  console.log('  DELETE status:', roleDel.status, roleDel.body?.message || roleDel.body);
}

run().catch(console.error);
