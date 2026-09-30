import fs from 'fs';
import path from 'path';

import puppeteer from 'puppeteer-core';

const src = process.argv[2];
const dest = process.argv[3];
if (!src || !dest) {
  throw new Error('Usage: node process-eerc-logo.mjs <src> <dest>');
}

const executablePath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => fs.existsSync(p));

const input = fs.readFileSync(src);
const dataUrl = `data:image/png;base64,${input.toString('base64')}`;

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage();
  const result = await page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;

    const isCornerWhite = (i) => {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      return r > 242 && g > 242 && b > 242;
    };

    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        if (!isCornerWhite(i)) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const radius = Math.max(maxX - minX, maxY - minY) / 2 - 8;

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist > radius + 1.5) {
          d[i + 3] = 0;
        } else if (dist > radius - 1) {
          const t = (radius + 1.5 - dist) / 2.5;
          d[i + 3] = Math.round(d[i + 3] * Math.max(0, Math.min(1, t)));
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const pad = 2;
    const size = Math.ceil(radius * 2) + pad * 2;
    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const octx = out.getContext('2d');
    octx.drawImage(
      canvas,
      Math.round(cx - radius) - pad,
      Math.round(cy - radius) - pad,
      size,
      size,
      0,
      0,
      size,
      size
    );

    const target = 512;
    const scaled = document.createElement('canvas');
    scaled.width = target;
    scaled.height = target;
    const sctx = scaled.getContext('2d');
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(out, 0, 0, target, target);

    return {
      dataUrl: scaled.toDataURL('image/png'),
      source: { w, h, minX, minY, maxX, maxY, cx, cy, radius, size },
    };
  }, dataUrl);

  const base64 = result.dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(base64, 'base64'));
  console.log(JSON.stringify(result.source, null, 2));
  console.log('wrote', dest, fs.statSync(dest).length);
} finally {
  await browser.close();
}
