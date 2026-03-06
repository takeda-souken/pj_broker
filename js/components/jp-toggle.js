/**
 * JP Toggle Button — floating top-right button to toggle Japanese text display
 */
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';

let toggleEl = null;

export function initJpToggle() {
  if (toggleEl) return;

  toggleEl = el('button', { className: 'jp-toggle' });
  updateLabel();

  toggleEl.addEventListener('click', () => {
    const current = SettingsStore.get('showJpComparison');
    SettingsStore.set('showJpComparison', !current);
    updateLabel();
    // Dispatch event so quiz view can react
    window.dispatchEvent(new CustomEvent('jp-toggle-changed', { detail: { enabled: !current } }));
  });

  document.body.appendChild(toggleEl);
}

function updateLabel() {
  const enabled = SettingsStore.get('showJpComparison');
  toggleEl.textContent = enabled ? 'JP ON' : 'JP OFF';
  toggleEl.classList.toggle('jp-toggle--off', !enabled);
}

export function showJpToggle(visible) {
  if (toggleEl) toggleEl.style.display = visible ? '' : 'none';
}
