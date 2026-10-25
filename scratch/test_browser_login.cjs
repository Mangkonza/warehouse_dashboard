const { chromium } = require('../warehouse_dashboard/node_modules/playwright');

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('response', res => {
    if (res.url().includes('/api/')) {
      console.log('API_RES:', res.url(), res.status());
    }
  });

  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Fill inside the TOPMOST form
  const topForm = page.locator('form').last();
  await topForm.locator('input[type="text"]').fill('b0123456789');
  await topForm.locator('input[type="password"]').fill('Admin@1234');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(1000);

  // Now fill OTP in topForm (now at step 2)
  console.log('Top form text after step 1:', await topForm.innerText());
  await topForm.locator('input[type="text"]').fill('123456');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(2500);

  console.log('Final URL:', page.url());
  const cookies = await page.context().cookies();
  console.log('Cookies:', cookies.map(c => c.name));

  await browser.close();
}

test().catch(console.error);
