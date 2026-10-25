const { chromium } = require('../warehouse_dashboard/node_modules/playwright');
const path = require('path');
const fs = require('fs');

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
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const results = [];

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Logging in as Admin...');
    await loginAdmin(page);

    const pagesToTest = [
      { name: 'Overview', path: '/overview' },
      { name: 'Research', path: '/research' },
      { name: 'Academic', path: '/academic' },
      { name: 'Publications', path: '/publications' },
      { name: 'Academic Service', path: '/service' },
      { name: 'Intellectual Property', path: '/ip' },
      { name: 'KPI & Targets', path: '/kpi' },
      { name: 'Personnel', path: '/personnel' },
      { name: 'Report Studio', path: '/studio' },
      { name: 'Evaluation', path: '/evaluation' },
      { name: 'Monitoring', path: '/monitoring' },
      { name: 'Data Management', path: '/manage' },
    ];

    for (const p of pagesToTest) {
      const pageErrors = [];
      const pageWarnings = [];

      const consoleListener = msg => {
        const text = msg.text();
        if (msg.type() === 'error') {
          // Filter out benign browser devtools/favicon errors if any
          if (!text.includes('favicon.ico') && !text.includes('DevTools')) {
            pageErrors.push(text);
          }
        } else if (msg.type() === 'warning') {
          if (text.toLowerCase().includes('hydration') || text.toLowerCase().includes('mismatch')) {
            pageErrors.push(`[Hydration Warning]: ${text}`);
          } else {
            pageWarnings.push(text);
          }
        }
      };

      const errorListener = err => {
        pageErrors.push(`[Uncaught Page Error]: ${err.message}`);
      };

      page.on('console', consoleListener);
      page.on('pageerror', errorListener);

      console.log(`Checking page ${p.name} (${p.path})...`);
      try {
        const response = await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        const httpStatus = response ? response.status() : 200;
        const currentUrl = page.url();
        const hasCriticalError = pageErrors.length > 0 || httpStatus >= 400 || currentUrl.includes('/unauthorized');

        if (hasCriticalError) {
          const screenshotPath = path.join(reportsDir, `failure_${p.name.replace(/\s+/g, '_').toLowerCase()}.png`);
          await page.screenshot({ path: screenshotPath });
          console.log(`Saved screenshot to ${screenshotPath}`);
        }

        results.push({
          page: p.name,
          path: p.path,
          httpStatus,
          status: !hasCriticalError ? 'PASS' : 'FAIL',
          errors: pageErrors.length > 0 ? pageErrors.join(' | ') : 'None',
          notes: !hasCriticalError ? 'Loaded cleanly, 0 console errors' : `Errors: ${pageErrors.length}`
        });
      } catch (err) {
        results.push({
          page: p.name,
          path: p.path,
          httpStatus: 500,
          status: 'FAIL',
          errors: err.message,
          notes: 'Exception during navigation'
        });
      } finally {
        page.off('console', consoleListener);
        page.off('pageerror', errorListener);
      }
    }

    await context.close();
  } finally {
    await browser.close();
  }

  console.log('\n=== REGRESSION & CONSOLE ERROR TEST (ALL 12 PAGES) ===');
  console.table(results);
  return results;
}

run().catch(console.error);
