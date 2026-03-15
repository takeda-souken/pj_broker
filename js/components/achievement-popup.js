/**
 * Achievement Unlock Popup
 *
 * Shows a full-screen modal when new achievements are unlocked,
 * similar to the MRT line tutorial modal. Silver glow effect.
 */
import { el } from '../utils/dom-helpers.js';

/**
 * Show achievement unlock popup for one or more achievements.
 * Shows them one at a time, sequentially.
 *
 * @param {Array<{icon: string, name: string, nameJA?: string, desc: string}>} achievements
 * @returns {Promise<void>}
 */
export async function showAchievementPopup(achievements) {
  for (const a of achievements) {
    await showSingle(a);
  }
}

function showSingle(a) {
  return new Promise((resolve) => {
    const overlay = el('div', { className: 'achievement-popup-overlay' });

    const card = el('div', { className: 'achievement-popup-card' });

    // Icon
    const icon = el('div', { className: 'achievement-popup-icon' }, a.icon);
    card.appendChild(icon);

    // Label
    const label = el('div', { className: 'achievement-popup-label' }, '🏆 Achievement Unlocked!');
    card.appendChild(label);

    // Name
    const name = el('div', { className: 'achievement-popup-name' });
    name.textContent = a.nameJA ? `${a.name} / ${a.nameJA}` : a.name;
    card.appendChild(name);

    // Description
    const desc = el('div', { className: 'achievement-popup-desc' }, a.desc);
    card.appendChild(desc);

    // Button
    const btn = el('button', {
      className: 'btn btn--outline achievement-popup-btn',
      onClick: () => {
        overlay.classList.add('achievement-popup-overlay--closing');
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 300);
      },
    }, 'OK!');
    card.appendChild(btn);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('achievement-popup-overlay--open'));
  });
}
