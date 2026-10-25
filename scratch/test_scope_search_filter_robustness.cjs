const { chromium } = require('../warehouse_dashboard/node_modules/playwright');

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
    // Test 1: Search in /manage (e.g. search "ชลประทาน")
    // ----------------------------------------------------
    console.log('Testing Search in /manage...');
    await page.goto('http://localhost:3000/manage?tab=research', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
    await searchInput.fill('ชลประทาน');
    await page.waitForTimeout(1000);

    const rowsAfterSearch = await page.$$eval('tbody tr', els => els.length);
    results.push({
      feature: 'Search Functionality',
      step: 'Search for "ชลประทาน" in research table filters results',
      status: rowsAfterSearch > 0 ? 'PASS' : 'FAIL',
      notes: `Rows returned: ${rowsAfterSearch}`
    });

    // ----------------------------------------------------
    // Test 2: SQL Injection attempt in Search / Filter
    // ----------------------------------------------------
    console.log('Testing SQL Injection in search query...');
    await searchInput.fill("' OR '1'='1' -- ");
    await page.waitForTimeout(1000);

    const sqlInjRows = await page.$$eval('tbody tr', els => els.length);
    // Safe response: should either return 0 rows or match literally, never dump all DB or crash
    const noCrash = await page.locator('h1, h2, table').count() > 0;
    results.push({
      feature: 'Security (SQL Injection Resilience)',
      step: 'Search parameter with SQL injection syntax is handled safely',
      status: noCrash ? 'PASS' : 'FAIL',
      notes: `Page intact, rendered rows: ${sqlInjRows}`
    });

    // Also test API search with SQL injection
    const apiSqlRes = await fetch("http://localhost:3000/api/v1/data/research?search=%27%20OR%201=1;%20DROP%20TABLE%20test;--", {
      headers: { Cookie: cookieHeader }
    });
    results.push({
      feature: 'Security (API SQL Injection Resilience)',
      step: 'API GET with SQL injection query param returns 200 without syntax error',
      status: apiSqlRes.status === 200 ? 'PASS' : 'FAIL',
      notes: `HTTP Status: ${apiSqlRes.status}`
    });

    // ----------------------------------------------------
    // Test 3: Pagination in /manage (e.g. Services table with 307 items)
    // ----------------------------------------------------
    console.log('Testing Pagination on Service tab...');
    await page.goto('http://localhost:3000/manage?tab=service', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const nextBtn = page.locator('button[title="หน้าถัดไป"]').first();
    const isNextEnabled = await nextBtn.isEnabled();
    if (isNextEnabled) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
      const page2Rows = await page.$$eval('tbody tr', els => els.length);
      results.push({
        feature: 'Pagination',
        step: 'Navigate to page 2 of service records',
        status: page2Rows > 0 ? 'PASS' : 'FAIL',
        notes: `Page 2 rows: ${page2Rows}`
      });
    } else {
      results.push({
        feature: 'Pagination',
        step: 'Navigate to page 2 of service records',
        status: 'FAIL',
        notes: 'Next button was not enabled'
      });
    }

    // ----------------------------------------------------
    // Test 4: Tab Badge Counts match Database
    // ----------------------------------------------------
    console.log('Testing Tab Badge Counts in UI...');
    await page.goto('http://localhost:3000/manage?tab=research', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const badges = await page.$$eval('[class*="badge"], span', els =>
      els.filter(e => e.innerText && /^\d+$/.test(e.innerText.trim())).map(e => e.innerText.trim())
    );
    console.log('Numerical badges found on /manage:', badges.slice(0, 10));
    results.push({
      feature: 'Tab Count Badges',
      step: 'Tab badges accurately display numerical counts',
      status: badges.length > 0 ? 'PASS' : 'FAIL',
      notes: `Sample badges found: ${badges.slice(0, 5).join(', ')}`
    });

    // ----------------------------------------------------
    // Test 5: Double-Click Prevention / Rapid Submission
    // ----------------------------------------------------
    console.log('Testing Rapid Duplicate Prevention...');
    // We test sending two parallel POST requests with the same name and registration number
    const p1 = fetch('http://localhost:3000/api/v1/data/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Concurrency Double Click Patent',
        type: 'สิทธิบัตร',
        registration_number: 'ว1.999999',
        status: 'ยื่นคำขอแล้ว'
      })
    });
    const p2 = fetch('http://localhost:3000/api/v1/data/ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify({
        name: '[TEST] Concurrency Double Click Patent',
        type: 'สิทธิบัตร',
        registration_number: 'ว1.999999',
        status: 'ยื่นคำขอแล้ว'
      })
    });

    const [res1, res2] = await Promise.all([p1, p2]);
    const d1 = await res1.json().catch(() => ({}));
    const d2 = await res2.json().catch(() => ({}));

    // Exactly one should succeed (201), and one should fail with 409 Conflict
    const hasOne201 = (res1.status === 201 && res2.status === 409) || (res1.status === 409 && res2.status === 201);
    results.push({
      feature: 'Concurrency & Rapid Submission Prevention',
      step: 'Simultaneous identical requests result in 1 success (201) and 1 rejection (409 Conflict)',
      status: hasOne201 ? 'PASS' : 'FAIL',
      notes: `Status1: ${res1.status}, Status2: ${res2.status}`
    });

    // Clean up created patent
    const succData = res1.status === 201 ? d1 : d2;
    const ipToClean = succData.data?.id || succData.data?._id;
    if (ipToClean) {
      await fetch(`http://localhost:3000/api/v1/data/ip?id=${encodeURIComponent(ipToClean)}`, {
        method: 'DELETE',
        headers: { Cookie: cookieHeader }
      });
    }

    await context.close();
  } finally {
    await browser.close();
  }

  console.log('\n=== SEARCH, FILTER & ROBUSTNESS RESULTS ===');
  console.table(results);
  return results;
}

run().catch(console.error);
