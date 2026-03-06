/**
 * MCQ choice grid component
 */
import { el } from '../utils/dom-helpers.js';

const LABELS = ['A', 'B', 'C', 'D'];

/**
 * @param {string[]} choices
 * @param {function} onSelect - callback(choiceIndex)
 * @returns {{ el: HTMLElement, reveal: function(correctIndex, selectedIndex) }}
 */
export function createChoiceGrid(choices, onSelect) {
  const grid = el('div', { className: 'choice-grid' });
  const buttons = [];

  choices.forEach((text, i) => {
    const btn = el('button', {
      className: 'choice-btn',
      onClick: () => onSelect(i),
    },
      el('span', { className: 'choice-btn__label' }, LABELS[i]),
      el('span', { className: 'choice-btn__text' }, text),
    );
    buttons.push(btn);
    grid.appendChild(btn);
  });

  function reveal(correctIndex, selectedIndex) {
    buttons.forEach((btn, i) => {
      btn.classList.add('choice-btn--disabled');
      if (i === correctIndex) btn.classList.add('choice-btn--correct');
      if (i === selectedIndex && i !== correctIndex) btn.classList.add('choice-btn--wrong');
    });
  }

  return { el: grid, reveal };
}
