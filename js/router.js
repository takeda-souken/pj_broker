/**
 * Hash-based SPA Router
 */
const routes = {};
let currentCleanup = null;

export function registerRoute(hash, handler) {
  routes[hash] = handler;
}

export function navigate(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const hash = window.location.hash || '#home';
  const app = document.getElementById('app');
  app.innerHTML = '';

  const handler = routes[hash] || routes['#home'];
  if (handler) {
    currentCleanup = handler(app) || null;
  }
}

export function initRouter() {
  // Import all views to register routes
  import('./views/home.js');
  import('./views/module-select.js');
  import('./views/mode-select.js');
  import('./views/quiz.js');
  import('./views/result.js');
  import('./views/records.js');
  import('./views/glossary-view.js');
  import('./views/trivia-view.js');
  import('./views/mrt-view.js');
  import('./views/settings.js');

  // Start routing after a tick to let views register
  setTimeout(() => {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }, 0);
}
