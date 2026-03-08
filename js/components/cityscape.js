/**
 * Animated cityscape backgrounds — PNG silhouette images
 * - SG scene: Singapore skyline + tanker
 * - JP scene: Tokyo skyline + train
 * Both use black silhouette PNGs, tinted via CSS.
 */
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';

let containerEl = null;
let currentScene = null;
let spawnTimer = null;

/* ------------------------------------------------------------------ */
/*  Init & Scene Management                                            */
/* ------------------------------------------------------------------ */
export function initCityscape() {
  if (containerEl) return;
  containerEl = el('div', { className: 'cityscape' });
  document.body.appendChild(containerEl);

  const langMode = SettingsStore.get('langMode') || 'bilingual';
  renderScene(langMode === 'en' ? 'sg' : 'jp', false);
  spawnMovingObjects();

  window.addEventListener('lang-mode-changed', (e) => {
    const newScene = e.detail.mode === 'en' ? 'sg' : 'jp';
    if (newScene !== currentScene) renderScene(newScene, true);
  });
}

function renderScene(scene, animate) {
  const src = scene === 'jp' ? 'img/jp-skyline.png' : 'img/sg-skyline.png';

  const oldSkyline = containerEl.querySelector('.cityscape__skyline');
  const newSkyline = el('div', { className: 'cityscape__skyline' });
  newSkyline.style.backgroundImage = `url('${src}')`;

  if (animate && oldSkyline) {
    // Crossfade: insert new UNDER old, then fade old out to reveal new
    containerEl.insertBefore(newSkyline, oldSkyline);
    oldSkyline.offsetHeight; // reflow
    oldSkyline.classList.add('cityscape__skyline--fade-out');
    setTimeout(() => oldSkyline.remove(), 1500);
  } else {
    if (oldSkyline) oldSkyline.remove();
    containerEl.appendChild(newSkyline);
  }
  currentScene = scene;
}

/* ------------------------------------------------------------------ */
/*  Moving objects (tankers, planes, trains, petals, stars)             */
/* ------------------------------------------------------------------ */
function spawnMovingObjects() {
  if (spawnTimer) clearInterval(spawnTimer);
  spawnTimer = setInterval(() => {
    if (!containerEl || !containerEl.parentNode) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const isJp = currentScene === 'jp';

    // Tanker (SG) / Train (JP)
    if (Math.random() < 0.3) {
      if (isJp) {
        const train = el('div', { className: 'cityscape__train' });
        train.style.animationDuration = `${8 + Math.random() * 5}s`;
        containerEl.appendChild(train);
        setTimeout(() => train.remove(), 15000);
      } else {
        const tanker = el('img', {
          className: 'cityscape__tanker',
          src: 'img/tanker.png',
          alt: ''
        });
        tanker.style.animationDuration = `${20 + Math.random() * 15}s`;
        containerEl.appendChild(tanker);
        setTimeout(() => tanker.remove(), 38000);
      }
    }

    // Planes (both cities)
    if (Math.random() < 0.15) {
      const plane = el('img', {
        className: 'cityscape__plane',
        src: 'img/plane.png',
        alt: ''
      });
      plane.style.top = `${3 + Math.random() * 22}%`;
      plane.style.animationDuration = `${14 + Math.random() * 10}s`;
      containerEl.appendChild(plane);
      setTimeout(() => plane.remove(), 25000);
    }

    // Night effects
    if (isDark && Math.random() < 0.2) {
      const star = el('div', { className: 'cityscape__shooting-star' });
      star.style.top = `${3 + Math.random() * 20}%`;
      star.style.left = `${15 + Math.random() * 65}%`;
      containerEl.appendChild(star);
      setTimeout(() => star.remove(), 2000);
    }

    // Cherry blossom petals (JP, light mode)
    if (isJp && !isDark && Math.random() < 0.45) {
      const petal = el('div', { className: 'cityscape__petal' });
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${4 + Math.random() * 4}s`;
      containerEl.appendChild(petal);
      setTimeout(() => petal.remove(), 9000);
    }
  }, 6000);
}
