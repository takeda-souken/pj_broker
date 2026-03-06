/**
 * Result view — shows quiz/mock exam results
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { formatDuration } from '../utils/date-utils.js';

registerRoute('#result', (app) => {
  const raw = sessionStorage.getItem('sg_broker_last_result');
  if (!raw) { navigate('#home'); return; }

  const r = JSON.parse(raw);

  app.appendChild(el('h1', { className: 'text-center mt-md' },
    `${r.module.toUpperCase()} ${r.mode === 'mock' ? 'Mock Exam' : 'Practice'} Result`));

  // Score
  const scoreClass = r.passed ? 'result-score--pass' : 'result-score--fail';
  app.appendChild(el('div', { className: `result-score ${scoreClass}` }, `${r.accuracy}%`));
  app.appendChild(el('div', { className: 'text-center text-secondary' },
    r.passed ? 'PASSED' : 'Not yet — keep going!'));

  // Breakdown
  const grid = el('div', { className: 'result-breakdown' });
  grid.appendChild(resultStat(r.correct.toString(), 'Correct'));
  grid.appendChild(resultStat((r.total - r.correct).toString(), 'Wrong'));
  grid.appendChild(resultStat(r.total.toString(), 'Total'));
  grid.appendChild(resultStat(formatDuration(r.elapsed), 'Time'));
  app.appendChild(grid);

  // Topic breakdown
  app.appendChild(el('h2', { className: 'mt-lg' }, 'By Topic'));
  const table = el('table', { className: 'topic-table' });
  const thead = el('tr', {},
    el('th', {}, 'Topic'),
    el('th', {}, 'Score'),
  );
  table.appendChild(thead);

  for (const [topic, data] of Object.entries(r.byTopic)) {
    const pct = Math.round((data.correct / data.total) * 100);
    const row = el('tr', {},
      el('td', {}, topic),
      el('td', {},
        `${data.correct}/${data.total} `,
        createAccuracyBar(pct),
      ),
    );
    table.appendChild(row);
  }
  app.appendChild(table);

  // Actions
  const actions = el('div', { className: 'flex-col gap-sm mt-lg' });
  actions.appendChild(el('button', {
    className: 'btn btn--primary btn--block',
    onClick: () => navigate(`#mode-select?module=${r.module}`),
  }, 'Study Again'));
  actions.appendChild(el('button', {
    className: 'btn btn--outline btn--block',
    onClick: () => navigate('#home'),
  }, 'Home'));
  app.appendChild(actions);
});

function resultStat(value, label) {
  const stat = el('div', { className: 'result-stat' });
  stat.appendChild(el('div', { className: 'result-stat__value' }, value));
  stat.appendChild(el('div', { className: 'result-stat__label' }, label));
  return stat;
}

function createAccuracyBar(pct) {
  const bar = el('span', { className: 'accuracy-bar' });
  const fill = el('span', { className: 'accuracy-bar__fill' });
  fill.style.width = `${pct}%`;
  if (pct < 70) fill.style.background = 'var(--c-danger)';
  bar.appendChild(fill);
  return bar;
}
