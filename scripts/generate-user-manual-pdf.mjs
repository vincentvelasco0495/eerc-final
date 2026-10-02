import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { marked } from 'marked';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const inputPath = path.join(rootDir, 'USER_MANUAL.md');
const outputPath = path.join(rootDir, 'USER_MANUAL.pdf');

const browserPaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

function resolveBrowserPath() {
  for (const candidate of browserPaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Chrome or Edge is required to generate the PDF.');
}

const markdown = fs.readFileSync(inputPath, 'utf8');
const bodyHtml = marked.parse(markdown);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>EERC Learning Center User Manual</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1a1a1a;
      max-width: 100%;
    }
    h1 {
      font-size: 20pt;
      margin: 26px 0 12px;
      page-break-after: avoid;
      color: #001632;
      border-bottom: 2px solid #E5A900;
      padding-bottom: 6px;
    }
    h1:first-of-type {
      font-size: 26pt;
      border-bottom: 3px solid #E5A900;
      margin-top: 0;
    }
    h2 {
      font-size: 15pt;
      margin: 22px 0 10px;
      page-break-after: avoid;
      color: #001632;
    }
    h3 {
      font-size: 12.5pt;
      margin: 16px 0 8px;
      page-break-after: avoid;
      color: #063B73;
    }
    p { margin: 0 0 10px; }
    ul, ol { margin: 0 0 12px 22px; padding: 0; }
    li { margin-bottom: 4px; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0 16px;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #C7D2E0;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #001632; color: #fff; font-weight: 600; }
    blockquote {
      border-left: 4px solid #E5A900;
      margin: 12px 0;
      padding: 4px 0 4px 14px;
      color: #333;
    }
    hr {
      border: none;
      border-top: 1px solid #DCE3ED;
      margin: 20px 0;
    }
    code {
      background: #F5F7FA;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 10pt;
    }
    strong { color: #001632; }
    a { color: #063B73; text-decoration: none; }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: resolveBrowserPath(),
  headless: true,
});

try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:8px;width:100%;padding:0 15mm;color:#5E7B9C;font-family:'Segoe UI',Arial,sans-serif;">EERC Learning Center — User Manual</div>`,
    footerTemplate: `<div style="font-size:8px;width:100%;padding:0 15mm;color:#5E7B9C;font-family:'Segoe UI',Arial,sans-serif;display:flex;justify-content:space-between;"><span>For students, teachers, and office staff</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
    margin: { top: '20mm', bottom: '18mm', left: '15mm', right: '15mm' },
  });
  console.log(`Created ${outputPath}`);
} finally {
  await browser.close();
}
