/**
 * Merlion celebration animation
 * Shows when user gets a streak or masters a topic.
 */
import { el } from '../utils/dom-helpers.js';

const WATER_PARTICLES = 48;
const DISPLAY_DURATION = 10000;

/**
 * @param {object} opts
 * @param {'correct'|'streak'|'mastered'} opts.type
 * @param {number} [opts.streak] - current streak count
 * @param {string} [opts.topicName] - topic that was mastered
 */
/**
 * @returns {Promise<void>} Resolves when the celebration is dismissed (click or timeout)
 */
export function showMerlionCelebration({ type, streak = 0, topicName = '' }) {
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => { if (!resolved) { resolved = true; resolve(); } };
    const overlay = el('div', { className: 'merlion-overlay' });

    // Merlion image
    const merlion = el('div', { className: 'merlion-sprite' });
    const img = el('img', { src: 'img/merlion.png', alt: 'Merlion', className: 'merlion-img' });
    merlion.appendChild(img);
    if (type === 'mastered') {
      img.classList.add('merlion-img--mastered');
    }
    // Water spray — attached to sprite so position is relative to the image
    const waterContainer = el('div', { className: 'merlion-water' });
    const intensity = type === 'mastered' ? 3 : type === 'streak' ? 2 : 1;
    for (let i = 0; i < WATER_PARTICLES * intensity; i++) {
      const drop = el('span', { className: `merlion-drop merlion-drop--${type}` });
      // Randomize start position within 10px radius
      const ox = (Math.random() - 0.5) * 20;
      const oy = (Math.random() - 0.5) * 20;
      // Spray downward from mouth (arc left then falling)
      const angleDeg = 240 + Math.random() * 60;
      const angleRad = angleDeg * Math.PI / 180;
      const dist = 40 + Math.random() * (60 * intensity);
      const tx = Math.cos(angleRad) * dist * 0.49;
      const ty = -Math.sin(angleRad) * dist * 1.5;
      const dur = (0.6 + Math.random() * 0.4) / 0.7;
      const delay = Math.random() * dur;
      const size = 4 + Math.random() * 6;
      drop.style.cssText = `
        --ox: ${ox}px;
        --oy: ${oy}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --delay: ${delay}s;
        --dur: ${dur}s;
        --size: ${size}px;
      `;
      waterContainer.appendChild(drop);
    }
    merlion.appendChild(waterContainer);
    overlay.appendChild(merlion);

    // Message
    let msg = '';
    if (type === 'mastered') msg = `Topic Mastered!\n${topicName}`;
    else if (type === 'streak') msg = `${streak} in a row!`;
    else msg = 'Correct!';

    overlay.appendChild(el('div', { className: `merlion-msg merlion-msg--${type}` }, msg));

    // Marina Bay Sands background for mastery
    if (type === 'mastered') {
      overlay.classList.add('merlion-overlay--mastered');
    }

    overlay.addEventListener('click', () => { overlay.remove(); done(); });
    document.body.appendChild(overlay);

    setTimeout(() => { if (overlay.parentNode) overlay.remove(); done(); }, DISPLAY_DURATION);
  });
}

// CSS injected once
const style = document.createElement('style');
style.textContent = `
.merlion-overlay {
  position: fixed; inset: 0; z-index: 2000;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.6);
  animation: fadeIn 0.3s ease;
}
.merlion-overlay--mastered {
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(245,166,35,0.3) 100%);
}
.merlion-sprite { animation: bounceIn 0.5s ease; position: relative; }
.merlion-img { width: 120px; height: auto; filter: drop-shadow(0 0 12px rgba(255,255,255,0.4)); }
.merlion-img--mastered {
  filter: drop-shadow(0 0 18px rgba(255,200,50,0.8)) drop-shadow(0 0 40px rgba(255,180,0,0.5)) drop-shadow(0 0 70px rgba(255,160,0,0.3));
  animation: goldGlow 2s ease-in-out infinite alternate;
}
.merlion-water { position: absolute; top: calc(30% + 10px); left: calc(15% + 20px); }
.merlion-drop {
  position: absolute;
  width: var(--size); height: calc(var(--size) * 1.6);
  border-radius: 40% 40% 50% 50%;
  background: var(--c-accent);
  animation: spray var(--dur) ease-out infinite;
  animation-delay: var(--delay);
}
.merlion-drop--mastered { background: var(--c-accent); }
.merlion-drop--streak { background: var(--c-accent-light); }

.merlion-msg {
  margin-top: 16px; font-size: 1.3rem; font-weight: 800;
  color: #fff; text-align: center; white-space: pre-line;
  animation: fadeIn 0.5s ease 0.3s both;
}
.merlion-msg--mastered { color: var(--c-gold); font-size: 1.5rem; }
.merlion-msg--streak { color: var(--c-accent-light); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes bounceIn {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes goldGlow {
  0% { filter: drop-shadow(0 0 18px rgba(255,200,50,0.8)) drop-shadow(0 0 40px rgba(255,180,0,0.5)) drop-shadow(0 0 70px rgba(255,160,0,0.3)); }
  100% { filter: drop-shadow(0 0 24px rgba(255,215,0,1)) drop-shadow(0 0 55px rgba(255,190,0,0.7)) drop-shadow(0 0 90px rgba(255,170,0,0.4)); }
}
@keyframes spray {
  0% { transform: translate(var(--ox), var(--oy)) scale(1); opacity: 0.8; }
  100% { transform: translate(calc(var(--ox) + var(--tx)), calc(var(--oy) + var(--ty))) scale(0.3); opacity: 0; }
}
`;
document.head.appendChild(style);
