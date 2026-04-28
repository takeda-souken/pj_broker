/**
 * Headless browser test for ViewLog tracking.
 * - Opens http://localhost:8765/ via Puppeteer (borrowed from cc-lab)
 * - Captures all POSTs to script.google.com (GAS)
 * - Simulates page navigation: home → textbook → glossary → records → home
 * - Reports which actions were sent + console errors
 *
 * Run: node scripts/test-viewlog.js
 * Requires: python -m http.server 8765 already running in this folder
 */
const puppeteer = require('c:/projects/pj47/node_modules/puppeteer');

const URL = 'http://localhost:8765/';
const DWELL_MS = 5500; // > VIEW_MIN_DURATION_MS (1000)

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage();

  const gasPosts = [];
  const consoleErrors = [];

  page.on('request', (req) => {
    if (req.method() === 'POST' && req.url().includes('script.google.com')) {
      let parsed = null;
      try { parsed = JSON.parse(req.postData() || '{}'); } catch {}
      gasPosts.push({ url: req.url().slice(-30), action: parsed?.action, payload: parsed });
    }
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  console.log(`→ open ${URL}`);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, DWELL_MS)); // dwell on home

  for (const hash of ['#textbook', '#glossary', '#records', '#home']) {
    console.log(`→ navigate ${hash}`);
    await page.evaluate((h) => { window.location.hash = h; }, hash);
    await new Promise(r => setTimeout(r, DWELL_MS));
  }

  // Trigger visibilitychange flush
  console.log('→ trigger visibilitychange:hidden');
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();

  console.log('\n=== GAS POSTs captured ===');
  if (gasPosts.length === 0) {
    console.log('(none) — fetch never fired. ViewLog logic likely not triggered.');
  } else {
    gasPosts.forEach((p, i) => {
      const sample = { ...p.payload };
      if (sample.snapshotJson) sample.snapshotJson = '[truncated]';
      console.log(`#${i + 1} action=${p.action}`);
      console.log('   ', JSON.stringify(sample));
    });
    const viewLogs = gasPosts.filter(p => p.action === 'DEV_ViewLog' || p.action === 'ViewLog');
    console.log(`\nViewLog count: ${viewLogs.length}`);
  }

  if (consoleErrors.length) {
    console.log('\n=== Console errors ===');
    consoleErrors.forEach((e) => console.log('  ', e));
  } else {
    console.log('\n(no console errors)');
  }
})();
