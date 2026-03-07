/**
 * Hash-based SPA Router
 * Enhanced: lazy route loading (#27) — non-core views imported on first navigation
 */
const routes = {};
let currentCleanup = null;

// Routes loaded lazily on first visit
const LAZY_ROUTES = {
  '#glossary': () => import('./views/glossary-view.js'),
  '#trivia': () => import('./views/trivia-view.js'),
  '#mrt': () => import('./views/mrt-view.js'),
  '#records': () => import('./views/records.js'),
  '#settings': () => import('./views/settings.js'),
  '#about': () => import('./views/about.js'),
  '#achievements': () => import('./views/achievements.js'),
  '#journal': () => import('./views/journal.js'),
};

export function registerRoute(hash, handler) {
  routes[hash] = handler;
}

export function navigate(hash) {
  window.location.hash = hash;
}

async function handleRoute() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const raw = window.location.hash || '#home';
  const hash = raw.split('?')[0];
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Scroll to top on route change (#4)
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Lazy-load route module if not yet registered
  if (!routes[hash] && LAZY_ROUTES[hash]) {
    try {
      await LAZY_ROUTES[hash]();
    } catch (e) {
      app.innerHTML = '';
      const errDiv = document.createElement('div');
      errDiv.className = 'empty-state';
      errDiv.innerHTML = '<div class="empty-state__icon">\u26A0\uFE0F</div>' +
        '<div class="empty-state__text">Failed to load this page.<br>Please check your connection and try again.</div>';
      app.appendChild(errDiv);
      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn btn--primary btn--block';
      retryBtn.style.marginTop = '16px';
      retryBtn.textContent = 'Retry';
      retryBtn.addEventListener('click', () => handleRoute());
      app.appendChild(retryBtn);
      console.error('Lazy route load failed:', e);
      return;
    }
  }

  const handler = routes[hash] || routes['#home'];
  if (handler) {
    const result = await handler(app);
    currentCleanup = (typeof result === 'function') ? result : null;
  }
}

export async function initRouter() {
  // Core views loaded eagerly — others load on demand (#27)
  await Promise.all([
    import('./views/home.js'),
    import('./views/module-select.js'),
    import('./views/mode-select.js'),
    import('./views/quiz.js'),
    import('./views/result.js'),
  ]);

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
