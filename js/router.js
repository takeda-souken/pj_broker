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
  '#fun': () => import('./views/fun-view.js'),
  '#records': () => import('./views/records.js'),
  '#settings': () => import('./views/settings.js'),
  '#about': () => import('./views/about.js'),
  '#achievements': () => import('./views/achievements.js'),
  '#journal': () => import('./views/journal.js'),
  '#question-bank': () => import('./views/question-bank.js'),
  '#sakura-room': () => import('./views/sakura-room.js?v=2'),
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

  // Legacy redirect: #mrt → #fun
  if (hash === '#mrt') { window.location.hash = '#fun'; return; }

  // Unlock sakura phase cache when leaving quiz
  if (hash !== '#quiz') {
    import('./models/sakura-state.js').then(m => m.SakuraState.unlockPhase()).catch(() => {});
  }
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Clean up fixed-bottom home elements on route change
  // Remove sakura-room body styling on route change
  document.body.classList.remove('sakura-room-active');
  // Keep .sakura-door-transition alive during sakura-room entry (cleaned up by the view)
  document.querySelectorAll('.home-sakura-fixed, .home-trivia-fixed, .tutorial-overlay, .sakura-bottom-popup, .sakura-door, .sakura-door--exit, .sr-debug-skip').forEach(el => el.remove());
  document.body.style.overflow = ''; // restore if tutorial was active

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

/**
 * Language switch handler.
 * Pages with triText spans get instant CSS-based switching.
 * Pages still using tr() strings (e.g. from browser cache) get a full re-render.
 */
function cascadeLangSwitch() {
  const app = document.getElementById('app');
  // If the page has enough triText spans, CSS handles everything — no re-render
  if (app && app.querySelectorAll('.i18n-en').length >= 3) return;
  // Fallback: re-render for pages still using tr() strings
  handleRoute();
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
  window.addEventListener('lang-mode-changed', () => cascadeLangSwitch());
  handleRoute();
}
