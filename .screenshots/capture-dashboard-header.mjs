import fs from 'fs';

import puppeteer from 'puppeteer-core';

const executablePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('theme-mode', 'light');
  });
  await page.goto('http://localhost:3030/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('input[name="email"]', { timeout: 20000 });
  await page.type('input[name="email"]', 'alex.rivera@eerc.edu');
  await page.type('input[name="password"]', 'password');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 25000 }).catch(() => null),
  ]);
  await new Promise((r) => setTimeout(r, 2800));
  if (!page.url().includes('instructor') && !page.url().includes('home')) {
    await page.goto('http://localhost:3030/instructor-home', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 2000));
  }

  const info = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (!header) return { missing: true, path: location.pathname };
    const cs = getComputedStyle(header);
    return {
      path: location.pathname,
      bg: cs.backgroundColor,
      color: cs.color,
      hasImg: Boolean(header.querySelector('img')),
    };
  });
  console.log(JSON.stringify(info, null, 2));

  const header = await page.$('header');
  if (header) {
    await header.screenshot({ path: '.screenshots/dashboard-header.png' });
  }
  await page.screenshot({ path: '.screenshots/instructor-home-header.png' });
} finally {
  await browser.close();
}
