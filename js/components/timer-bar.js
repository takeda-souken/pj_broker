/**
 * Timer bar component for quiz questions
 */
import { el } from '../utils/dom-helpers.js';

export function createTimerBar(durationMs, onTimeUp) {
  const bar = el('div', { className: 'timer-bar' });
  const fill = el('div', { className: 'timer-bar__fill' });
  fill.style.width = '100%';
  bar.appendChild(fill);

  let startTime = Date.now();
  let rafId = null;

  function tick() {
    const elapsed = Date.now() - startTime;
    const ratio = Math.max(0, 1 - elapsed / durationMs);
    fill.style.width = `${ratio * 100}%`;

    // Color transitions
    fill.classList.remove('timer-bar__fill--warning', 'timer-bar__fill--danger');
    if (ratio < 0.2) fill.classList.add('timer-bar__fill--danger');
    else if (ratio < 0.4) fill.classList.add('timer-bar__fill--warning');

    if (ratio <= 0) {
      onTimeUp?.();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    startTime = Date.now();
    tick();
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
  }

  function reset() {
    stop();
    fill.style.width = '100%';
    fill.classList.remove('timer-bar__fill--warning', 'timer-bar__fill--danger');
  }

  return { el: bar, start, stop, reset };
}
