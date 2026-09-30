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
    () => document.body.innerText.includes('Watch a free preview'),
    { timeout: 20000 }
  );
  await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('free preview')
    );
    heading?.closest('section')?.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1200));

  const info = await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('free preview')
    );
    const section = heading?.closest('section');
    const video = section?.querySelector('video');
    const chrome = section?.querySelector('.premium-video-chrome');
    return {
      hasVideo: Boolean(video),
      controls: video?.controls ?? null,
      controlsList: video?.getAttribute('controlslist'),
      hasChrome: Boolean(chrome),
      src: video?.currentSrc?.slice(-60) ?? null,
    };
  });
  console.log(JSON.stringify({ info, errors }, null, 2));

  const section = await page.evaluateHandle(() => {
    const heading = [...document.querySelectorAll('h2')].find((n) =>
      n.textContent.includes('free preview')
    );
    return heading?.closest('section');
  });
  await section.screenshot({ path: '.screenshots/sample-lecture.png' });
} finally {
  await browser.close();
}
