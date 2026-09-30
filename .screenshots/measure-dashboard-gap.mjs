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

async function login(page) {
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
  await new Promise((r) => setTimeout(r, 2500));
  await page.waitForFunction(
    () => document.body.innerText.includes('Analytics'),
    { timeout: 30000 }
  );
  await new Promise((r) => setTimeout(r, 800));
}

function measure() {
  const header = document.querySelector('header');
  const content = document.querySelector('.minimal__layout__main__content');
  const heading = [...document.querySelectorAll('h1, h2, h4')].find((el) =>
    el.textContent.includes('Analytics')
  );
  const sidebar = document.querySelector('aside') || heading?.closest('.MuiGrid-container')?.firstElementChild;
  if (!header || !content) return { missing: true };
  const hb = header.getBoundingClientRect();
  const cb = content.getBoundingClientRect();
  const headingTop = heading?.getBoundingClientRect().top ?? null;
  const sidebarTop = sidebar?.getBoundingClientRect().top ?? null;
  const cs = getComputedStyle(content);
  return {
    headerHeight: Math.round(hb.height),
    headerBottom: Math.round(hb.bottom),
    contentPt: cs.paddingTop,
    gapHeaderToContent: Math.round(cb.top - hb.bottom),
    gapHeaderToHeading: headingTop == null ? null : Math.round(headingTop - hb.bottom),
    gapHeaderToSidebar: sidebarTop == null ? null : Math.round(sidebarTop - hb.bottom),
    headingSidebarDelta:
      headingTop == null || sidebarTop == null ? null : Math.round(headingTop - sidebarTop),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
}

try {
  const desktop = await browser.newPage();
  await desktop.setViewport({ width: 1440, height: 900 });
  await login(desktop);
  console.log('desktop', JSON.stringify(await desktop.evaluate(measure), null, 2));
  await desktop.screenshot({ path: '.screenshots/dashboard-gap-desktop.png' });
  await desktop.close();

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await login(mobile);
  console.log('mobile', JSON.stringify(await mobile.evaluate(measure), null, 2));
  await mobile.screenshot({ path: '.screenshots/dashboard-gap-mobile.png' });
  await mobile.close();
} finally {
  await browser.close();
}
