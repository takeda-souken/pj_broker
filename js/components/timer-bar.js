/**
 * Timer bar component for quiz questions
 * Supports dramatic mode (color transitions) and calm mode (plain bar).
 */
import { el } from '../utils/dom-helpers.js';

export function createTimerBar(durationMs, onTimeUp, { dramatic = true } = {}) {
  const wrapper = el('div', { className: 'timer-bar-wrapper' });
  const bar = el('div', { className: 'timer-bar' });
  const fill = el('div', { className: 'timer-bar__fill' });
  const timeLabel = el('span', { className: 'timer-bar__time' });
  fill.style.width = '100%';
  bar.appendChild(fill);
  wrapper.appendChild(bar);
  wrapper.appendChild(timeLabel);

  let startTime = Date.now();
  let rafId = null;
  let fired = false;

  function tick() {
    if (fired) return;
    const elapsed = Date.now() - startTime;
    const ratio = Math.max(0, 1 - elapsed / durationMs);
    const remainSec = Math.ceil((durationMs - elapsed) / 1000);
    fill.style.width = `${ratio * 100}%`;
    timeLabel.textContent = remainSec > 0 ? `${remainSec}s` : '0s';

    // Color transitions (dramatic mode only)
    fill.classList.remove('timer-bar__fill--warning', 'timer-bar__fill--danger');
    timeLabel.classList.remove('timer-bar__time--warning', 'timer-bar__time--danger');
    if (dramatic) {
      if (ratio < 0.2) {
        fill.classList.add('timer-bar__fill--danger');
        timeLabel.classList.add('timer-bar__time--danger');
      } else if (ratio < 0.4) {
        fill.classList.add('timer-bar__fill--warning');
        timeLabel.classList.add('timer-bar__time--warning');
      }
    }

    if (ratio <= 0) {
      fired = true;
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
    fired = false;
    fill.style.width = '100%';
    timeLabel.textContent = `${Math.ceil(durationMs / 1000)}s`;
    fill.classList.remove('timer-bar__fill--warning', 'timer-bar__fill--danger');
    timeLabel.classList.remove('timer-bar__time--warning', 'timer-bar__time--danger');
  }

  return { el: wrapper, start, stop, reset };
}
