const { chromium } = require('../warehouse_dashboard/node_modules/playwright');

async function checkUser() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const topForm = page.locator('form').last();
  await topForm.locator('input[type="text"]').fill('b6400000001');
  await topForm.locator('input[type="password"]').fill('User@1234');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(1000);

  await topForm.locator('input[type="text"]').fill('123456');
  await topForm.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  console.log('User URL after login:', page.url());
  const cookies = await context.cookies();
  console.log('User cookies:', cookies);

  // Call /api/v1/auth/me using fetch in node
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  const res = await fetch('http://localhost:8000/api/v1/auth/me', {
    headers: { Cookie: cookieHeader }
  });
  console.log('/api/v1/auth/me status:', res.status);
  const meData = await res.json();
  console.log('/api/v1/auth/me data:', meData);

  // Now in browser navigate to /manage
  await page.goto('http://localhost:3000/manage', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  console.log('Navigated to /manage in browser, current URL:', page.url());

  // Check client-side user in AuthContext
  const pageContent = await page.textContent('body');
  console.log('Page body snippet:', pageContent.substring(0, 200));

  await browser.close();
}

checkUser().catch(console.error);
