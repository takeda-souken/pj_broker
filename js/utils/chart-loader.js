/**
 * Lazy-loads Chart.js from local bundle (with CDN fallback) and returns the Chart constructor.
 * Caches the promise so the script is only loaded once.
 */
let _chartPromise = null;

export function loadChartJs() {
  if (window.Chart) return Promise.resolve(window.Chart);
  if (_chartPromise) return _chartPromise;

  _chartPromise = loadScript('lib/chart.umd.min.js')
    .catch(() => loadScript('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js'))
    .then(() => {
      if (!window.Chart) throw new Error('Chart.js not available');
      return window.Chart;
    });

  return _chartPromise;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
