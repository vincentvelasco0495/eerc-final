/**
 * Captures the same routes in both color schemes so the light theme can be
 * eyeballed against the dark one. Requires `npm run dev` to be running.
 *
 * Run: node scripts/screenshot-schemes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../.screenshots');
const BASE = process.env.BASE_URL ?? 'http://localhost:3030';

const ROUTES = [
  { name: 'home', url: '/' },
  { name: 'sign-in', url: '/auth/jwt/sign-in' },
];

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

const consoleIssues = [];

try {
  for (const mode of ['dark', 'light']) {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleIssues.push(`[${mode} ${route.name}] ${msg.text()}`);
      });
      page.on('pageerror', (err) => {
        consoleIssues.push(`[${mode} ${route.name}] pageerror: ${err.message}`);
      });

      // Seed the persisted mode before any app code runs.
      await page.evaluateOnNewDocument((m) => {
        localStorage.setItem('theme-mode', m);
      }, mode);

      await page.goto(`${BASE}${route.url}`, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise((r) => setTimeout(r, 2500));

      const resolved = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return {
          attr: document.documentElement.getAttribute('data-color-scheme'),
          page: cs.getPropertyValue('--palette-brand-page').trim(),
          accentText: cs.getPropertyValue('--palette-brand-accentText').trim(),
          bodyBg: getComputedStyle(document.body).backgroundColor,
          bodyColor: getComputedStyle(document.body).color,
        };
      });
      console.log(`${mode.padEnd(5)} ${route.name.padEnd(9)}`, JSON.stringify(resolved));

      const file = path.join(outDir, `${route.name}-${mode}.png`);
      await page.screenshot({ path: file, fullPage: false });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

if (consoleIssues.length) {
  console.log('\n--- console errors ---');
  [...new Set(consoleIssues)].slice(0, 25).forEach((m) => console.log(m));
} else {
  console.log('\nNo console errors.');
}
console.log(`\nScreenshots in ${outDir}`);
