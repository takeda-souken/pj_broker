/**
 * Module select view — choose BCP or ComGI
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { tr, trNode } from '../utils/i18n.js';
import { SettingsStore } from '../models/settings-store.js';

registerRoute('#module-select', (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const forceMode = params.get('mode'); // 'mock' when coming from mock exam button

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  const titleKey = forceMode === 'mock' ? 'module.mockTitle' : 'module.title';
  const titleEn = forceMode === 'mock' ? 'Choose Module (Mock Exam)' : 'Choose Module';
  h1.appendChild(trNode(titleKey, titleEn));
  app.appendChild(h1);

  const grid = el('div', { className: 'flex-col gap-sm mt-md' });

  grid.appendChild(moduleCard('BCP', tr('module.bcpFull', 'Basic Concepts & Principles'),
    tr('module.bcpDetail', '40 MCQ \u2022 45 min \u2022 70% to pass'), 'bcp', forceMode));
  grid.appendChild(moduleCard('ComGI', tr('module.comgiFull', 'Commercial General Insurance'),
    tr('module.comgiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass'), 'comgi', forceMode));
  grid.appendChild(moduleCard('PGI', tr('module.pgiFull', 'Personal General Insurance'),
    tr('module.pgiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass'), 'pgi', forceMode));
  grid.appendChild(moduleCard('HI', tr('module.hiFull', 'Health Insurance'),
    tr('module.hiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass'), 'hi', forceMode));

  app.appendChild(grid);
});

function moduleCard(title, subtitle, detail, module, forceMode) {
  const target = forceMode === 'mock'
    ? `#quiz?module=${module}&mode=mock`
    : `#mode-select?module=${module}`;
  const card = el('button', {
    className: 'card',
    style: 'cursor:pointer;text-align:left;width:100%;border:none;',
    onClick: () => navigate(target),
  });
  const badge = el('span', { className: `quiz-header__module quiz-header__module--${module}` }, title);
  card.appendChild(badge);
  card.appendChild(el('div', { style: 'font-weight:600;font-size:1rem;margin-top:8px;' }, subtitle));
  card.appendChild(el('div', { className: 'text-secondary text-sm mt-sm' }, detail));
  return card;
}
