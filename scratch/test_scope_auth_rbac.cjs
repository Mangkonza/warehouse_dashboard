const { chromium } = require('../warehouse_dashboard/node_modules/playwright');
const http = require('http');

async function loginInBrowser(page, username, password, otp = '123456') {
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // If already logged in, check URL
  if (page.url().includes('/overview') || page.url().includes('/manage')) {
    return;
  }

  const topForm = page.locator('form').last();
  await topForm.locator('input[type="text"]').fill(username);
  await topForm.locator('input[type="password"]').fill(password);
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(1000);

  // Step 2 OTP
  await topForm.locator('input[type="text"]').fill(otp);
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
    // ----------------------------------------------------
    // Test 1: Admin Login & Full Access
    // ----------------------------------------------------
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const adminErrors = [];
    adminPage.on('console', msg => {
      if (msg.type() === 'error') adminErrors.push(msg.text());
    });

    console.log('--- Testing Admin Login ---');
    await loginInBrowser(adminPage, 'b0123456789', 'Admin@1234', '123456');
    const adminUrl = adminPage.url();
    const adminLoginPass = adminUrl.includes('/overview');
    results.push({
      feature: 'Authentication (Admin)',
      step: 'Login with b0123456789 and redirect to /overview',
      status: adminLoginPass ? 'PASS' : 'FAIL',
      notes: `Final URL: ${adminUrl}`
    });

    // Check all 12 pages for Admin
    const allPages = [
      '/overview',
      '/research',
      '/academic',
      '/publications',
      '/service',
      '/ip',
      '/kpi',
      '/personnel',
      '/studio',
      '/evaluation',
      '/monitoring',
      '/manage'
    ];

    console.log('--- Testing Admin Access across 12 pages ---');
    let adminAll12Pass = true;
    for (const p of allPages) {
      await adminPage.goto(`http://localhost:3000${p}`, { waitUntil: 'domcontentloaded' });
      await adminPage.waitForTimeout(800);
      const cur = adminPage.url();
      if (cur.includes('/unauthorized') || cur.includes('/login')) {
        adminAll12Pass = false;
        console.log(`Admin blocked from ${p} -> ${cur}`);
      }
    }
    results.push({
      feature: 'RBAC (Admin Access)',
      step: 'Admin can access all 12 dashboard pages without redirection to /unauthorized',
      status: adminAll12Pass ? 'PASS' : 'FAIL',
      notes: adminAll12Pass ? 'All 12 pages accessible' : 'Some pages redirected'
    });

    // ----------------------------------------------------
    // Test 2: Normal User Login & Restricted Access
    // ----------------------------------------------------
    console.log('--- Testing User Login ---');
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();
    const userErrors = [];
    userPage.on('console', msg => {
      if (msg.type() === 'error') userErrors.push(msg.text());
    });

    await loginInBrowser(userPage, 'b6400000001', 'User@1234', '123456');
    const userUrl = userPage.url();
    const userLoginPass = userUrl.includes('/overview');
    results.push({
      feature: 'Authentication (User)',
      step: 'Login with b6400000001 (role: user) and redirect to /overview',
      status: userLoginPass ? 'PASS' : 'FAIL',
      notes: `Final URL: ${userUrl}`
    });

    // Check Sidebar for Normal User: should have only 6 items
    const sidebarLinks = await userPage.$$eval('aside a[href]', els => els.map(e => e.getAttribute('href')));
    console.log('User Sidebar links:', sidebarLinks);
    const hasAdminLinks = sidebarLinks.some(h => ['/manage', '/kpi', '/personnel', '/studio', '/evaluation', '/monitoring'].includes(h));
    results.push({
      feature: 'RBAC (User Sidebar Filtering)',
      step: 'User sidebar only shows overview + 5 missions, hiding admin links',
      status: !hasAdminLinks ? 'PASS' : 'FAIL',
      notes: `Admin links in sidebar: ${hasAdminLinks ? 'Found (FAIL)' : 'None (PASS)'}`
    });

    // Check URL guard for Normal User: visiting admin pages must redirect to /unauthorized
    const adminOnlyPages = ['/manage', '/kpi', '/personnel', '/studio', '/evaluation', '/monitoring'];
    let userGuardPass = true;
    for (const p of adminOnlyPages) {
      try {
        await userPage.goto(`http://localhost:3000${p}`, { waitUntil: 'domcontentloaded' });
        await userPage.waitForURL('**/unauthorized', { timeout: 6000 });
      } catch (err) {
        userGuardPass = false;
        console.log(`User was NOT redirected from ${p} -> current URL: ${userPage.url()}`);
      }
    }
    results.push({
      feature: 'RBAC (User Route Guard)',
      step: 'Direct navigation to admin pages redirects user to /unauthorized',
      status: userGuardPass ? 'PASS' : 'FAIL',
      notes: userGuardPass ? 'All 6 admin pages redirected to /unauthorized' : 'Guard failed'
    });

    // Check ActionListCard on overview for normal user: "ดูหน้า KPI" must NOT be present
    await userPage.goto('http://localhost:3000/overview', { waitUntil: 'domcontentloaded' });
    await userPage.waitForTimeout(800);
    const hasKpiButton = await userPage.$('a[href="/kpi"], button:has-text("KPI")');
    results.push({
      feature: 'RBAC (User Overview UI Guard)',
      step: 'Overview page hides "ดูหน้า KPI" and links to admin pages',
      status: !hasKpiButton ? 'PASS' : 'FAIL',
      notes: hasKpiButton ? 'KPI link still visible' : 'Hidden for normal user'
    });

    // Check unauthenticated access: curl without session -> 401
    // And user session: curl admin endpoints -> 403
    const userCookies = await userContext.cookies();
    const userCookieHeader = userCookies.map(c => `${c.name}=${c.value}`).join('; ');

    const resUnauth = await fetch('http://localhost:8000/api/v1/data/personnel');
    results.push({
      feature: 'API Guard (Unauthenticated)',
      step: 'Unauthenticated GET /api/v1/data/personnel returns 401',
      status: resUnauth.status === 401 ? 'PASS' : 'FAIL',
      notes: `HTTP Status: ${resUnauth.status}`
    });

    const resUserAdminGet = await fetch('http://localhost:8000/api/v1/data/personnel', {
      headers: { Cookie: userCookieHeader }
    });
    results.push({
      feature: 'API Guard (User Forbidden GET)',
      step: 'User GET /api/v1/data/personnel returns 403',
      status: resUserAdminGet.status === 403 ? 'PASS' : 'FAIL',
      notes: `HTTP Status: ${resUserAdminGet.status}`
    });

    const resUserPost = await fetch('http://localhost:8000/api/v1/data/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: userCookieHeader },
      body: JSON.stringify({ name: '[TEST] Unauthorized' })
    });
    results.push({
      feature: 'API Guard (User Forbidden POST)',
      step: 'User POST /api/v1/data/research returns 403',
      status: resUserPost.status === 403 ? 'PASS' : 'FAIL',
      notes: `HTTP Status: ${resUserPost.status}`
    });

    await adminContext.close();
    await userContext.close();
  } finally {
    await browser.close();
  }

  console.log('\n=== RBAC & AUTH TEST RESULTS ===');
  console.table(results);
  return results;
}

run().catch(console.error);
