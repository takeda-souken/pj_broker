/**
 * Module select view — choose BCP, ComGI, PGI, or HI
 * Uses CSS-based i18n (triText) — language switch requires no re-render.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { triText } from '../utils/i18n.js';

registerRoute('#module-select', (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const forceMode = params.get('mode'); // 'mock' when coming from home mock exam button

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 '));
  // Back button label — trilingual
  const backBtn = app.lastChild;
  backBtn.appendChild(triText('common.back', 'Back'));

  const h1 = el('h1', { className: 'mt-md' });
  const titleKey = forceMode === 'mock' ? 'module.mockTitle' : 'module.title';
  const titleEn = forceMode === 'mock' ? 'Choose Module (Mock Exam)' : 'Choose Module';
  h1.appendChild(triText(titleKey, titleEn));
  app.appendChild(h1);

  const grid = el('div', { className: 'module-select-grid mt-md' });

  grid.appendChild(moduleCard('BCP', 'module.bcpFull', 'Basic Concepts & Principles',
    'module.bcpDetail', '40 MCQ \u2022 45 min \u2022 70% to pass', 'bcp', forceMode));
  grid.appendChild(moduleCard('ComGI', 'module.comgiFull', 'Commercial General Insurance',
    'module.comgiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass', 'comgi', forceMode));
  grid.appendChild(moduleCard('PGI', 'module.pgiFull', 'Personal General Insurance',
    'module.pgiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass', 'pgi', forceMode));
  grid.appendChild(moduleCard('HI', 'module.hiFull', 'Health Insurance',
    'module.hiDetail', '50 MCQ \u2022 75 min \u2022 70% to pass', 'hi', forceMode));

  app.appendChild(grid);
});

function moduleCard(title, subtitleKey, subtitleEn, detailKey, detailEn, module, forceMode) {
  const target = forceMode === 'mock'
    ? `#quiz?module=${module}&mode=mock`
    : `#mode-select?module=${module}`;
  const card = el('button', {
    className: 'card module-card module-card--' + module,
    onClick: () => navigate(target),
  });

  const badge = el('span', { className: `module-card__badge quiz-header__module quiz-header__module--${module}` }, title);
  card.appendChild(badge);

  const body = el('div', { className: 'module-card__body' });
  const sub = el('div', { className: 'module-card__name' });
  sub.appendChild(triText(subtitleKey, subtitleEn));
  body.appendChild(sub);

  const det = el('div', { className: 'module-card__detail' });
  det.appendChild(triText(detailKey, detailEn));
  body.appendChild(det);

  card.appendChild(body);
  return card;
}
