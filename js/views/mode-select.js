/**
 * Mode select view — choose study mode for a given module
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';

registerRoute('#mode-select', (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const module = params.get('module') || 'bcp';
  const label = module === 'bcp' ? 'BCP' : 'ComGI';

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, `Study ${label}`));

  const grid = el('div', { className: 'flex-col gap-sm mt-md' });

  grid.appendChild(modeCard(
    'Practice (10 Q)', 'Random questions, no timer',
    () => navigate(`#quiz?module=${module}&mode=practice&count=10`)
  ));

  grid.appendChild(modeCard(
    'Practice (20 Q)', 'Extended practice session',
    () => navigate(`#quiz?module=${module}&mode=practice&count=20`)
  ));

  const weakTopics = RecordStore.getWeakTopics(module, 5);
  if (weakTopics.length > 0) {
    grid.appendChild(modeCard(
      'Weak Topics', `Focus on ${weakTopics.length} weak area(s)`,
      () => navigate(`#quiz?module=${module}&mode=weak&count=20`)
    ));
  }

  grid.appendChild(modeCard(
    'Mock Exam', module === 'bcp' ? '40 Q / 45 min — Full simulation' : '50 Q / 75 min — Full simulation',
    () => navigate(`#quiz?module=${module}&mode=mock`)
  ));

  app.appendChild(grid);
});

function modeCard(title, subtitle, onClick) {
  const card = el('button', {
    className: 'card',
    style: 'cursor:pointer;text-align:left;width:100%;border:none;',
    onClick,
  });
  card.appendChild(el('div', { style: 'font-weight:700;' }, title));
  card.appendChild(el('div', { className: 'text-secondary text-sm' }, subtitle));
  return card;
}
