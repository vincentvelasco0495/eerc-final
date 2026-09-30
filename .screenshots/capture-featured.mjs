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
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('http://localhost:3030/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForFunction(
    () => document.body.innerText.includes('Experience the learning quality'),
    { timeout: 20000 }
  );
  await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('learning quality')
    );
    heading?.closest('section')?.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('learning quality')
    );
    const section = heading.closest('section');
    const link = [...section.querySelectorAll('a')].find((a) => a.href.includes('facebook.com'));
    let el = link;
    while (el && el !== section) {
      if (getComputedStyle(el).position === 'absolute') {
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        break;
      }
      el = el.parentElement;
    }
  });
  await new Promise((r) => setTimeout(r, 900));

  const info = await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('learning quality')
    );
    const section = heading.closest('section');
    const links = [...section.querySelectorAll('a')].map((a) => ({
      href: a.href,
      text: a.textContent.trim().slice(0, 80),
    }));
    const buttons = [...section.querySelectorAll('button')].map((b) => b.textContent.trim());
    return {
      sectionText: section.innerText,
      links,
      buttons,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  console.log('pageerrors', errors);

  const section = await page.evaluateHandle(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('learning quality')
    );
    return heading?.closest('section');
  });
  await section.screenshot({ path: '.screenshots/featured-carousel.png' });
} finally {
  await browser.close();
}
