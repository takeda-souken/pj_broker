/**
 * Merlion celebration animation
 * Shows when user gets a streak or masters a topic.
 */
import { el } from '../utils/dom-helpers.js';

const WATER_PARTICLES = 24;
const DISPLAY_DURATION = 3000;

/**
 * @param {object} opts
 * @param {'correct'|'streak'|'mastered'} opts.type
 * @param {number} [opts.streak] - current streak count
 * @param {string} [opts.topicName] - topic that was mastered
 */
export function showMerlionCelebration({ type, streak = 0, topicName = '' }) {
  const overlay = el('div', { className: 'merlion-overlay' });

  // Merlion SVG (simplified)
  const merlion = el('div', { className: 'merlion-sprite' });
  merlion.innerHTML = getMerlionSVG(type);
  overlay.appendChild(merlion);

  // Water spray
  const waterContainer = el('div', { className: 'merlion-water' });
  const intensity = type === 'mastered' ? 3 : type === 'streak' ? 2 : 1;
  for (let i = 0; i < WATER_PARTICLES * intensity; i++) {
    const drop = el('span', { className: `merlion-drop merlion-drop--${type}` });
    const angleDeg = -30 + Math.random() * 60;
    const angleRad = angleDeg * Math.PI / 180;
    const dist = 60 + Math.random() * (80 * intensity);
    const tx = Math.cos(angleRad) * dist;
    const ty = -Math.sin(angleRad) * dist;
    const delay = Math.random() * 0.4;
    const size = 4 + Math.random() * 6;
    drop.style.cssText = `
      --tx: ${tx}px;
      --ty: ${ty}px;
      --delay: ${delay}s;
      --size: ${size}px;
    `;
    waterContainer.appendChild(drop);
  }
  overlay.appendChild(waterContainer);

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

  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);

  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, DISPLAY_DURATION);
}

function getMerlionSVG(type) {
  const waterColor = type === 'mastered' ? '#f5a623' : '#009cde';
  return `<svg viewBox="0 0 100 120" width="80" height="96" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (fish tail) -->
    <ellipse cx="50" cy="95" rx="25" ry="20" fill="#8B9DAF" opacity="0.8"/>
    <path d="M30,80 Q25,95 35,110 L65,110 Q75,95 70,80 Z" fill="#A0B0C0"/>
    <!-- Scales -->
    <path d="M38,90 Q42,85 46,90 Q42,95 38,90Z" fill="#90A4B8" opacity="0.6"/>
    <path d="M48,88 Q52,83 56,88 Q52,93 48,88Z" fill="#90A4B8" opacity="0.6"/>
    <path d="M42,98 Q46,93 50,98 Q46,103 42,98Z" fill="#90A4B8" opacity="0.6"/>
    <!-- Torso -->
    <path d="M35,45 Q30,65 35,85 L65,85 Q70,65 65,45 Z" fill="#C8A96E"/>
    <!-- Mane -->
    <path d="M30,25 Q20,30 25,45 L35,45 Q32,35 30,25Z" fill="#D4A017"/>
    <path d="M70,25 Q80,30 75,45 L65,45 Q68,35 70,25Z" fill="#D4A017"/>
    <path d="M35,15 Q30,20 30,25 L40,30 Q38,22 35,15Z" fill="#E8B830"/>
    <path d="M65,15 Q70,20 70,25 L60,30 Q62,22 65,15Z" fill="#E8B830"/>
    <!-- Head -->
    <circle cx="50" cy="32" r="18" fill="#D4A017"/>
    <!-- Face -->
    <circle cx="43" cy="28" r="2.5" fill="#222"/>
    <circle cx="57" cy="28" r="2.5" fill="#222"/>
    <circle cx="43" cy="27" r="1" fill="#fff"/>
    <circle cx="57" cy="27" r="1" fill="#fff"/>
    <!-- Nose -->
    <ellipse cx="50" cy="33" rx="3" ry="2" fill="#B8860B"/>
    <!-- Mouth (open, spraying water) -->
    <ellipse cx="50" cy="38" rx="5" ry="3" fill="#8B0000"/>
    <!-- Water spray -->
    <path d="M50,38 Q55,20 60,5" stroke="${waterColor}" stroke-width="3" fill="none" opacity="0.7">
      <animate attributeName="d" values="M50,38 Q55,20 60,5;M50,38 Q52,18 58,3;M50,38 Q55,20 60,5" dur="0.8s" repeatCount="indefinite"/>
    </path>
    <path d="M50,38 Q45,22 42,8" stroke="${waterColor}" stroke-width="2" fill="none" opacity="0.5">
      <animate attributeName="d" values="M50,38 Q45,22 42,8;M50,38 Q47,20 44,5;M50,38 Q45,22 42,8" dur="0.6s" repeatCount="indefinite"/>
    </path>
    <!-- Crown (for mastery) -->
    ${type === 'mastered' ? `
    <polygon points="38,15 42,5 46,12 50,2 54,12 58,5 62,15" fill="#F5A623" stroke="#D4920A" stroke-width="0.5"/>
    <circle cx="50" cy="8" r="1.5" fill="#FF4444"/>
    ` : ''}
  </svg>`;
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
.merlion-sprite { animation: bounceIn 0.5s ease; }
.merlion-water { position: absolute; top: 35%; left: 50%; }
.merlion-drop {
  position: absolute;
  width: var(--size); height: var(--size);
  border-radius: 50%;
  background: var(--c-accent);
  animation: spray calc(0.6s + var(--delay)) ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}
.merlion-drop--mastered { background: var(--c-gold); }
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
@keyframes spray {
  0% { transform: translate(0,0) scale(1); opacity: 0.8; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
}
`;
document.head.appendChild(style);
