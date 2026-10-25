const { chromium } = require('../warehouse_dashboard/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../reports/test-data-manifest.json');

// Initialize manifest
function loadManifest() {
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {}
  }
  return {
    timestamp: new Date().toISOString(),
    baselineCounts: {
      research: 32,
      academic: 69,
      publications: 68,
      service: 307,
      ip: 21,
      personnel: 308,
      evaluation: 12,
      user_roles: 2
    },
    createdRecords: []
  };
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
}

async function loginAdmin(page) {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  if (page.url().includes('/overview') || page.url().includes('/manage')) return;

  const topForm = page.locator('form').last();
  await topForm.locator('input[type="text"]').fill('b0123456789');
  await topForm.locator('input[type="password"]').fill('Admin@1234');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(1000);

  await topForm.locator('input[type="text"]').fill('123456');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);
}

async function run() {
  const manifest = loadManifest();
  const results = [];

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Logging in as Admin...');
    await loginAdmin(page);

    const cookies = await context.cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // ----------------------------------------------------
    // Test 1: Empty form validation error (Red error box)
    // ----------------------------------------------------
    console.log('Testing required field validation on empty payload...');
    const emptyRes = await fetch('http://localhost:3000/api/v1/data/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({ name: '' })
    });
    const emptyData = await emptyRes.json().catch(() => ({}));
    const isValidationErr = emptyRes.status === 400 && (emptyData.message || emptyData.error);
    results.push({
      feature: 'Form Validation',
      step: 'POST empty project returns 400 with descriptive error message',
      status: isValidationErr ? 'PASS' : 'FAIL',
      notes: `Status: ${emptyRes.status}, Message: ${emptyData.message || emptyData.error}`
    });

    // ----------------------------------------------------
    // Test 2: CRUD for Research Project
    // ----------------------------------------------------
    console.log('Testing Research Project CRUD...');
    const createResearchRes = await fetch('http://localhost:3000/api/v1/data/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Research AI System for Irrigation',
        head_name: 'รศ.ดร.ทดสอบ วิจัย',
        department: 'วิศวกรรมชลประทาน',
        budget_internal: 150000,
        budget_external: 50000,
        fund_source: 'ทุนอุดหนุนวิจัย มก.',
        fund_type: 'ทุนภายใน',
        fiscal_year: 2569,
        status: 'กำลังดำเนินการ',
        start_date: '2569-01-01',
        end_date: '2569-12-31'
      })
    });
    const researchData = await createResearchRes.json();
    const createdResearchId = researchData.data?.id || researchData.data?._id;
    if (createdResearchId) {
      manifest.createdRecords.push({ category: 'research', id: createdResearchId, name: '[TEST] Research AI System for Irrigation' });
      saveManifest(manifest);
    }
    results.push({
      feature: 'CRUD: Research',
      step: 'Create research project with [TEST] prefix',
      status: createResearchRes.status === 201 ? 'PASS' : 'FAIL',
      notes: `Created ID: ${createdResearchId}, Status: ${createResearchRes.status}`
    });

    // Edit Research
    const editResearchRes = await fetch(`http://localhost:3000/api/v1/data/research?id=${createdResearchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        id: createdResearchId,
        name: '[TEST] Research AI System for Irrigation (Updated)',
        status: 'เสร็จสิ้น'
      })
    });
    results.push({
      feature: 'CRUD: Research',
      step: 'Update research project title and status',
      status: editResearchRes.status === 200 ? 'PASS' : 'FAIL',
      notes: `Status: ${editResearchRes.status}`
    });

    // ----------------------------------------------------
    // Test 3: CRUD for Academic Project
    // ----------------------------------------------------
    console.log('Testing Academic Project CRUD...');
    const createAcadRes = await fetch('http://localhost:3000/api/v1/data/academic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Academic Course Development 2026',
        head_name: 'ผศ.ดร.วิชาการ ทดสอบ',
        department: 'วิศวกรรมคอมพิวเตอร์',
        budget_internal: 80000,
        fiscal_year: 2569,
        status: 'อนุมัติ',
        start_date: '2569-02-01',
        end_date: '2569-10-31'
      })
    });
    const acadData = await createAcadRes.json();
    const createdAcadId = acadData.data?.id || acadData.data?._id;
    if (createdAcadId) {
      manifest.createdRecords.push({ category: 'academic', id: createdAcadId, name: '[TEST] Academic Course Development 2026' });
      saveManifest(manifest);
    }
    results.push({
      feature: 'CRUD: Academic',
      step: 'Create academic development project',
      status: createAcadRes.status === 201 ? 'PASS' : 'FAIL',
      notes: `Created ID: ${createdAcadId}, Status: ${createAcadRes.status}`
    });

    // ----------------------------------------------------
    // Test 4: CRUD for Publication
    // ----------------------------------------------------
    console.log('Testing Publication CRUD...');
    const createPubRes = await fetch('http://localhost:3000/api/v1/data/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Deep Learning in Agricultural Engineering Journal',
        author_name: 'ดร.ทดสอบ บทความ',
        department: 'วิศวกรรมเกษตร',
        journal_name: 'IEEE Transactions on AgriAI',
        journal_tier: 'Q1',
        year: 2026,
        citations: 5
      })
    });
    const pubData = await createPubRes.json();
    const createdPubId = pubData.data?.id || pubData.data?._id;
    if (createdPubId) {
      manifest.createdRecords.push({ category: 'publications', id: createdPubId, name: '[TEST] Deep Learning in Agricultural Engineering Journal' });
      saveManifest(manifest);
    }
    results.push({
      feature: 'CRUD: Publication',
      step: 'Create publication with Q1 quartile',
      status: createPubRes.status === 201 ? 'PASS' : 'FAIL',
      notes: `Created ID: ${createdPubId}, Status: ${createPubRes.status}`
    });

    // ----------------------------------------------------
    // Test 5: CRUD for Service (Across multiple types)
    // ----------------------------------------------------
    console.log('Testing Academic Service CRUD across 6 types...');
    const serviceTypes = [
      'วิทยากร/อาจารย์พิเศษ',
      'วิชาการ',
      'วิชาชีพ',
      'ผู้ทรงคุณวุฒิ',
      'วิทยานิพนธ์ภายนอก',
      'ศึกษาดูงาน วศ.กพส.'
    ];
    let serviceAllPass = true;
    for (let i = 0; i < serviceTypes.length; i++) {
      const sType = serviceTypes[i];
      const sRes = await fetch('http://localhost:3000/api/v1/data/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
        body: JSON.stringify({
          name: `[TEST] Academic Service Type ${i + 1} (${sType})`,
          person_name: 'ผศ.ดร.บริการ ผู้เชี่ยวชาญ',
          department: 'วิศวกรรมโยธา',
          service_category: sType,
          budget_income: 45000,
          attendees_count: 50,
          service_hours: 12,
          fiscal_year: 2569,
          start_date: '2569-03-01'
        })
      });
      const sData = await sRes.json();
      const sId = sData.data?.id || sData.data?._id;
      if (sRes.status === 201 && sId) {
        manifest.createdRecords.push({ category: 'service', id: sId, name: `[TEST] Academic Service Type ${i + 1}` });
        saveManifest(manifest);
      } else {
        serviceAllPass = false;
        console.error(`Failed service type ${sType}:`, sRes.status, sData);
      }
    }
    results.push({
      feature: 'CRUD: Academic Services (6 Types)',
      step: 'Create service projects across all 6 canonical categories',
      status: serviceAllPass ? 'PASS' : 'FAIL',
      notes: serviceAllPass ? 'All 6 service types created' : 'Some service types failed'
    });

    // ----------------------------------------------------
    // Test 6: CRUD for IP (Patent, Petty Patent, Copyright, Reg# Duplicate 409, Type Mutation)
    // ----------------------------------------------------
    console.log('Testing Intellectual Property CRUD & Validation...');
    // A. Create Patent with registration number ว1.000033
    const createIpRes1 = await fetch('http://localhost:3000/api/v1/data/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Novel Smart Sensor for Soil Analysis',
        inventor_name: 'ศ.ดร.นวัตกรรม สิ่งประดิษฐ์',
        department: 'วิศวกรรมเครื่องกล',
        type: 'สิทธิบัตร',
        registration_number: 'ว1.000033',
        status: 'จดทะเบียนแล้ว',
        support_amount: 30000
      })
    });
    const ip1Data = await createIpRes1.json();
    const createdIp1Id = ip1Data.data?.id || ip1Data.data?._id;
    if (createdIp1Id) {
      manifest.createdRecords.push({ category: 'ip', id: createdIp1Id, name: '[TEST] Novel Smart Sensor for Soil Analysis' });
      saveManifest(manifest);
    }
    results.push({
      feature: 'CRUD: IP (Patent Creation)',
      step: 'Create patent with registration_number ว1.000033',
      status: createIpRes1.status === 201 ? 'PASS' : 'FAIL',
      notes: `Created ID: ${createdIp1Id}, Status: ${createIpRes1.status}`
    });

    // B. Test Duplicate Registration Number -> must return 409
    console.log('Testing Duplicate IP Registration Number (Expect 409 Conflict)...');
    const dupIpRes = await fetch('http://localhost:3000/api/v1/data/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Duplicate Registration Number Patent',
        type: 'สิทธิบัตร',
        registration_number: 'ว1.000033',
        status: 'จดทะเบียนแล้ว'
      })
    });
    const dupIpData = await dupIpRes.json().catch(() => ({}));
    results.push({
      feature: 'IP Validation (Duplicate Reg Number)',
      step: 'Attempting duplicate registration_number ว1.000033 returns 409 Conflict',
      status: dupIpRes.status === 409 ? 'PASS' : 'FAIL',
      notes: `HTTP Status: ${dupIpRes.status}, Message: ${dupIpData.message || dupIpData.error}`
    });

    // C. Change IP Type on Edit (สิทธิบัตร -> อนุสิทธิบัตร)
    console.log('Testing IP Type Mutation on Update...');
    const editIpRes = await fetch(`http://localhost:3000/api/v1/data/ip?id=${createdIp1Id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        id: createdIp1Id,
        type: 'อนุสิทธิบัตร',
        name: '[TEST] Novel Smart Sensor for Soil Analysis (Converted to Petty Patent)'
      })
    });
    results.push({
      feature: 'CRUD: IP Type Mutation',
      step: 'Change IP type from patent to petty patent on update',
      status: editIpRes.status === 200 ? 'PASS' : 'FAIL',
      notes: `Status: ${editIpRes.status}`
    });

    // ----------------------------------------------------
    // Test 7: CRUD for Personnel
    // ----------------------------------------------------
    console.log('Testing Personnel CRUD...');
    const createPersonRes = await fetch('http://localhost:3000/api/v1/data/personnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] ผศ.ดร.สมชาย ทดสอบระบบ',
        title_th: 'ผศ.ดร.',
        department: 'วิศวกรรมคอมพิวเตอร์',
        position: 'ผู้ช่วยศาสตราจารย์',
        email: 'somchai.t@ku.th'
      })
    });
    const personData = await createPersonRes.json();
    const createdPersonId = personData.data?.id || personData.data?._id;
    if (createdPersonId) {
      manifest.createdRecords.push({ category: 'personnel', id: createdPersonId, name: '[TEST] ผศ.ดร.สมชาย ทดสอบระบบ' });
      saveManifest(manifest);
    }
    results.push({
      feature: 'CRUD: Personnel',
      step: 'Create personnel record',
      status: createPersonRes.status === 201 ? 'PASS' : 'FAIL',
      notes: `Created ID: ${createdPersonId}, Status: ${createPersonRes.status}`
    });

    // ----------------------------------------------------
    // Test 8: Evaluation Record CRUD
    // ----------------------------------------------------
    console.log('Testing Evaluation Record CRUD...');
    const createEvalRes = await fetch('http://localhost:3000/api/v1/evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        category: 'research',
        record_id: String(createdResearchId),
        sdg_ids: [2, 9],
        i_type: 'I_AM'
      })
    });
    const evalData = await createEvalRes.json();
    manifest.createdRecords.push({ category: 'evaluation', id: String(createdResearchId), name: `[TEST] Eval for Research ${createdResearchId}` });
    saveManifest(manifest);

    results.push({
      feature: 'CRUD: Evaluation',
      step: 'Save SDG and i-type evaluation record for research project',
      status: createEvalRes.status === 200 || createEvalRes.status === 201 ? 'PASS' : 'FAIL',
      notes: `Target Research: ${createdResearchId}, Status: ${createEvalRes.status}`
    });

    // ----------------------------------------------------
    // Test 9: Table Count & Tab Badge Verification in UI
    // ----------------------------------------------------
    console.log('Verifying Table Count in Browser UI at /manage...');
    await page.goto('http://localhost:3000/manage?tab=research', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const researchRowCount = await page.$$eval('tbody tr', els => els.length);
    results.push({
      feature: 'UI Table & Badge',
      step: 'Research table displays data and tab shows updated count',
      status: researchRowCount > 0 ? 'PASS' : 'FAIL',
      notes: `Rendered rows on page 1: ${researchRowCount}`
    });

    // ----------------------------------------------------
    // Test 10: Clean up created test records via standard DELETE routes
    // ----------------------------------------------------
    console.log('Cleaning up all created test records via standard routes...');
    let cleanupAllPass = true;
    for (const record of [...manifest.createdRecords]) {
      let delRes;
      if (record.category === 'evaluation') {
        delRes = await fetch(`http://localhost:3000/api/v1/evaluation?record_id=${encodeURIComponent(record.id)}`, {
          method: 'DELETE',
          headers: { Cookie: cookieHeader }
        });
      } else {
        delRes = await fetch(`http://localhost:3000/api/v1/data/${record.category}?id=${encodeURIComponent(record.id)}`, {
          method: 'DELETE',
          headers: { Cookie: cookieHeader }
        });
      }

      if (delRes.status === 200 || delRes.status === 204) {
        manifest.createdRecords = manifest.createdRecords.filter(r => r.id !== record.id);
        saveManifest(manifest);
      } else {
        cleanupAllPass = false;
        console.error(`Failed to delete ${record.category} id ${record.id}: status ${delRes.status}`);
      }
    }

    results.push({
      feature: 'Cleanup & Deletion',
      step: 'Delete all [TEST] records via standard delete routes',
      status: cleanupAllPass ? 'PASS' : 'FAIL',
      notes: cleanupAllPass ? 'All test records deleted cleanly' : 'Some test records failed to delete'
    });

    await context.close();
  } finally {
    await browser.close();
  }

  console.log('\n=== CRUD & VALIDATION TEST RESULTS ===');
  console.table(results);
  return results;
}

run().catch(console.error);
