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
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

try {
  const page = await browser.newPage();

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    await page.setViewport(viewport);
    await page.goto('http://localhost:3030/', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForFunction(
      () => document.body.innerText.includes('Learn from our elite lineup'),
      { timeout: 20000 }
    );
    await page.waitForFunction(
      () => {
        const heading = [...document.querySelectorAll('h2')].find((n) =>
          n.textContent.includes('elite lineup')
        );
        return Boolean(heading?.closest('section')?.querySelector('img'));
      },
      { timeout: 20000 }
    );
    await page.evaluate(() => {
      const heading = [...document.querySelectorAll('h2')].find((n) =>
        n.textContent.includes('elite lineup')
      );
      const sectionEl = heading.closest('section');
      const img = sectionEl.querySelector('img');
      img.parentElement.parentElement.scrollIntoView({ block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: `.screenshots/instructors-viewport-${viewport.name}.png`,
    });
    const sizes = await page.evaluate(() => {
      const heading = [...document.querySelectorAll('h2')].find((n) =>
        n.textContent.includes('elite lineup')
      );
      const sectionEl = heading.closest('section');
      const container = sectionEl.querySelector('.MuiContainer-root') || sectionEl;
      const cr = container.getBoundingClientRect();
      const imgs = [...sectionEl.querySelectorAll('img')];
      const boxes = imgs.map((img) => {
        const r = img.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          x: Math.round(r.x),
          y: Math.round(r.y),
        };
      });
      const firstY = boxes[0]?.y;
      const firstRow = boxes.filter((b) => Math.abs(b.y - firstY) < 8);
      const rowLeft = firstRow[0]?.x;
      const rowRight = firstRow.at(-1)?.x + firstRow.at(-1)?.w;
      return {
        firstRow: firstRow.length,
        container: { x: Math.round(cr.x), w: Math.round(cr.width) },
        row: { left: rowLeft, right: Math.round(rowRight), w: Math.round(rowRight - rowLeft) },
        sample: firstRow,
      };
    });
    console.log(viewport.name, JSON.stringify(sizes));
  }
} finally {
  await browser.close();
}
