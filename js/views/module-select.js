/**
 * Module select view — choose BCP or ComGI
 * (Accessed from home, but also directly linkable)
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';

registerRoute('#module-select', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'Choose Module'));

  const grid = el('div', { className: 'flex-col gap-sm mt-md' });

  grid.appendChild(moduleCard('BCP', 'Basic Concepts & Principles',
    '40 MCQ \u2022 45 min \u2022 70% to pass', 'bcp'));
  grid.appendChild(moduleCard('ComGI', 'Commercial General Insurance',
    '50 MCQ \u2022 75 min \u2022 70% to pass', 'comgi'));

  app.appendChild(grid);
});

function moduleCard(title, subtitle, detail, module) {
  const card = el('button', {
    className: 'card',
    style: 'cursor:pointer;text-align:left;width:100%;border:none;',
    onClick: () => navigate(`#mode-select?module=${module}`),
  });
  const badge = el('span', { className: `quiz-header__module quiz-header__module--${module}` }, title);
  card.appendChild(badge);
  card.appendChild(el('div', { style: 'font-weight:600;font-size:1rem;margin-top:8px;' }, subtitle));
  card.appendChild(el('div', { className: 'text-secondary text-sm mt-sm' }, detail));
  return card;
}
