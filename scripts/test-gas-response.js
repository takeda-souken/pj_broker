/**
 * Probe GAS doPost response for DEV_ViewLog vs known-good action.
 * Tells us whether GAS rejects ViewLog (HEADERS missing on deployed version).
 */
const puppeteer = require('c:/projects/pj47/node_modules/puppeteer');

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxJQyh63-nvAK9Aspm-Y8CXO4mQYEqw0PB5cxtBMmB0k8B1lrClPN9O3xhJ9gCqM7VS7g/exec';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage();
  // Need an origin that Google permits CORS on; use localhost loaded earlier
  await page.goto('http://localhost:8765/', { waitUntil: 'networkidle2' });

  const tests = [
    { label: 'ViewLog (new)', action: 'DEV_ViewLog', extra: { view: 'home', prevView: '', durationMs: 1234 } },
    { label: 'Feedback (existing baseline)', action: 'DEV_Feedback', extra: { type: 'general', module: 'bcp', questionId: 'probe', message: 'probe' } },
    { label: 'Notice (suspect)', action: 'DEV_Notice', extra: { noticeId: 'probe', event: 'shown' } },
  ];

  for (const t of tests) {
    const result = await page.evaluate(async (url, payload) => {
      try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
        const txt = await res.text();
        return { status: res.status, body: txt.slice(0, 300) };
      } catch (e) {
        return { error: e.message };
      }
    }, GAS_URL, { action: t.action, sentAt: new Date().toISOString(), ...t.extra });
    console.log(`[${t.label}] →`, JSON.stringify(result));
  }

  await browser.close();
})();
