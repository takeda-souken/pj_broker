/**
 * Language Toggle Button — floating top-right button to cycle language modes
 * Modes: 'ja' (日本語) → 'en' (EN) → 'bilingual' (EN/JA) → 'ja' ...
 */
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';

const CYCLE = ['ja', 'bilingual', 'en'];
const LABELS = { ja: 'JA', bilingual: 'EN/JA', en: 'EN' };

let toggleEl = null;

export function initJpToggle() {
  if (toggleEl) return;

  toggleEl = el('button', { className: 'jp-toggle' });
  updateLabel();

  toggleEl.addEventListener('click', () => {
    const current = SettingsStore.get('langMode') || 'bilingual';
    const idx = CYCLE.indexOf(current);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    SettingsStore.set('langMode', next);
    document.documentElement.setAttribute('data-lang', next);   // CSS-based i18n: instant
    updateLabel();
    window.dispatchEvent(new CustomEvent('lang-mode-changed', { detail: { mode: next } }));
  });

  window.addEventListener('lang-mode-changed', () => updateLabel());

  document.body.appendChild(toggleEl);
}

function updateLabel() {
  if (!toggleEl) return;
  const mode = SettingsStore.get('langMode') || 'bilingual';
  toggleEl.textContent = LABELS[mode] || 'EN/JA';
  toggleEl.classList.toggle('jp-toggle--off', mode === 'en');
}

export function showJpToggle(visible) {
  if (toggleEl) toggleEl.style.display = visible ? '' : 'none';
}
