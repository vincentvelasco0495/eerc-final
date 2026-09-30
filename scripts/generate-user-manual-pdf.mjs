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
  <title>EERC LMS User Manual</title>
  <style>
    @page { margin: 18mm 15mm; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1a1a1a;
      max-width: 100%;
    }
    h1 {
      font-size: 22pt;
      margin: 28px 0 12px;
      page-break-after: avoid;
      border-bottom: 2px solid #222;
      padding-bottom: 6px;
    }
    h2 {
      font-size: 16pt;
      margin: 24px 0 10px;
      page-break-after: avoid;
      color: #222;
    }
    h3 {
      font-size: 13pt;
      margin: 18px 0 8px;
      page-break-after: avoid;
      color: #333;
    }
    p { margin: 0 0 10px; }
    ul, ol { margin: 0 0 12px 22px; padding: 0; }
    li { margin-bottom: 4px; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12px 0 16px;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: #f3f3f3; }
    blockquote {
      border-left: 4px solid #bbb;
      margin: 12px 0;
      padding: 4px 0 4px 14px;
      color: #444;
    }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }
    code {
      background: #f4f4f4;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 10pt;
    }
    strong { color: #111; }
    a { color: #1565c0; text-decoration: none; }
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
    margin: { top: '18mm', bottom: '18mm', left: '15mm', right: '15mm' },
  });
  console.log(`Created ${outputPath}`);
} finally {
  await browser.close();
}
