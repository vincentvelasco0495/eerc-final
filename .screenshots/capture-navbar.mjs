import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../.screenshots');
const BASE = process.env.BASE_URL ?? 'http://localhost:3030';

const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const executablePath = browserPaths.find((p) => fs.existsSync(p));
if (!executablePath) throw new Error('Chrome or Edge is required.');

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

function headerInfo() {
  const header = document.querySelector('header') || document.querySelector('[class*="MuiAppBar"]');
  if (!header) return { missing: true };
  const cs = getComputedStyle(header);
  const login = [...header.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Login');
  const links = [...header.querySelectorAll('a, button')].map((el) => el.textContent.trim()).filter(Boolean);
  return {
    bg: cs.backgroundColor,
    color: cs.color,
    height: cs.height,
    borderBottom: cs.borderBottomColor,
    loginBg: login ? getComputedStyle(login).backgroundColor : null,
    loginColor: login ? getComputedStyle(login).color : null,
    links,
    text: header.innerText.replace(/\s+/g, ' ').trim(),
  };
}

try {
  for (const mode of ['light', 'dark']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument((m) => {
      localStorage.setItem('theme-mode', m);
    }, mode);
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));

    const info = await page.evaluate(headerInfo);
    console.log(mode, JSON.stringify(info, null, 2));

    const header = await page.$('header.MuiAppBar-root, header');
    if (header) {
      await header.screenshot({ path: path.join(outDir, `navbar-${mode}.png`) });
    }
    await page.screenshot({ path: path.join(outDir, `home-navbar-${mode}.png`) });

    const programs = await page.evaluateHandle(() =>
      [...document.querySelectorAll('header [aria-label], header a, header button')].find(
        (el) => el.getAttribute('aria-label') === 'Programs' || el.textContent.trim().startsWith('Programs')
      )
    );
    if (programs.asElement()) {
      await programs.asElement().hover();
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: path.join(outDir, `navbar-programs-${mode}.png`) });
    }
    await page.close();
  }

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await mobile.evaluateOnNewDocument(() => {
    localStorage.setItem('theme-mode', 'light');
  });
  await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  await mobile.screenshot({ path: path.join(outDir, 'navbar-mobile-closed.png') });
  const menu = await mobile.$('header button');
  if (menu) {
    await menu.click();
    await new Promise((r) => setTimeout(r, 700));
    await mobile.screenshot({ path: path.join(outDir, 'navbar-mobile-open.png') });
  }
  await mobile.close();
} finally {
  await browser.close();
}
