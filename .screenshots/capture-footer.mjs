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

try {
  for (const mode of ['light', 'dark']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluateOnNewDocument((m) => {
      localStorage.setItem('theme-mode', m);
    }, mode);
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));

    const info = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { missing: true };
      const cs = getComputedStyle(footer);
      footer.scrollIntoView({ block: 'end' });
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        borderTop: cs.borderTopColor,
        text: footer.innerText.replace(/\s+/g, ' ').trim().slice(0, 240),
      };
    });
    console.log(mode, JSON.stringify(info, null, 2));

    const footer = await page.$('footer');
    if (footer) {
      await footer.screenshot({ path: path.join(outDir, `footer-${mode}.png`) });
    }
    await page.screenshot({ path: path.join(outDir, `home-footer-${mode}.png`) });
    await page.close();
  }

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true });
  await mobile.evaluateOnNewDocument(() => {
    localStorage.setItem('theme-mode', 'light');
  });
  await mobile.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  await mobile.evaluate(() => document.querySelector('footer')?.scrollIntoView({ block: 'end' }));
  await new Promise((r) => setTimeout(r, 400));
  await mobile.screenshot({ path: path.join(outDir, 'footer-mobile.png') });
  await mobile.close();
} finally {
  await browser.close();
}
