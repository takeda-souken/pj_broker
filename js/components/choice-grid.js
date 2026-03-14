/**
 * MCQ choice grid component
 */
import { el } from '../utils/dom-helpers.js';
import { triContent } from '../utils/i18n.js';

const LABELS = ['A', 'B', 'C', 'D'];

/**
 * @param {string[]} choices
 * @param {function} onSelect - callback(choiceIndex)
 * @param {string[]} [choicesJP] - optional Japanese translations
 * @returns {{ el: HTMLElement, reveal: function(correctIndex, selectedIndex) }}
 */
export function createChoiceGrid(choices, onSelect, choicesJP) {
  const grid = el('div', { className: 'choice-grid' });
  const buttons = [];

  choices.forEach((text, i) => {
    const textSpan = el('span', { className: 'choice-btn__text' });
    const jpText = choicesJP ? choicesJP[i] : null;
    textSpan.appendChild(triContent(text, jpText));
    const btn = el('button', {
      className: 'choice-btn',
      onClick: () => onSelect(i),
    },
      el('span', { className: 'choice-btn__label' }, LABELS[i]),
      textSpan,
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
