/**
 * Wrong Answer Journal — review past mistakes grouped by topic
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { triText, tr } from '../utils/i18n.js';

registerRoute('#journal', (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#settings') });
  backBtn.appendChild(document.createTextNode('\u25C0 '));
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('journal.title', 'Wrong Answer Journal'));
  app.appendChild(h1);

  const records = RecordStore.getRecords();
  const wrongRecords = records.filter(r => !r.isCorrect && r.answer !== -1);

  if (wrongRecords.length === 0) {
    const emptyEl = el('div', { className: 'text-center mt-lg' });
    emptyEl.appendChild(el('div', { style: 'font-size:3rem;' }, '\uD83C\uDF89'));
    const emptyText = el('div', { className: 'text-secondary mt-sm' });
    emptyText.appendChild(triText('journal.empty', 'No wrong answers yet! Keep it up!'));
    emptyEl.appendChild(emptyText);
    app.appendChild(emptyEl);
    return;
  }

  // Stats summary
  const totalWrong = wrongRecords.length;
  const uniqueQuestions = new Set(wrongRecords.map(r => r.questionId)).size;
  const summary = el('div', { className: 'card', style: 'text-align:center;' });
  summary.appendChild(el('div', { style: 'font-size:1.5rem;font-weight:800;color:var(--c-danger);' }, totalWrong.toString()));
  summary.appendChild(el('div', { className: 'text-sm text-secondary' },
    `wrong answers across ${uniqueQuestions} questions`));
  app.appendChild(summary);

  // Group by topic
  const byTopic = {};
  for (const r of wrongRecords) {
    const key = `${r.module || 'unknown'}::${r.topic || 'Unknown'}`;
    if (!byTopic[key]) byTopic[key] = { module: r.module, topic: r.topic, items: [] };
    byTopic[key].items.push(r);
  }

  // Module filter
  let activeModule = 'all';
  const seg = el('div', { className: 'seg-control mt-md' });
  const filterBtns = ['all', 'bcp', 'comgi'].map(m =>
    el('button', {
      className: `seg-control__item${m === 'all' ? ' seg-control__item--active' : ''}`,
      onClick: () => filterModule(m),
    }, m === 'all' ? 'All' : m.toUpperCase())
  );
  filterBtns.forEach(b => seg.appendChild(b));
  app.appendChild(seg);

  const container = el('div', { className: 'mt-md' });
  app.appendChild(container);

  function filterModule(mod) {
    activeModule = mod;
    filterBtns.forEach((btn, i) => {
      const m = ['all', 'bcp', 'comgi'][i];
      btn.className = `seg-control__item${m === mod ? ' seg-control__item--active' : ''}`;
    });
    renderTopics();
  }

  function renderTopics() {
    container.innerHTML = '';
    const entries = Object.values(byTopic)
      .filter(t => activeModule === 'all' || t.module === activeModule)
      .sort((a, b) => b.items.length - a.items.length);

    if (entries.length === 0) {
      container.appendChild(el('div', { className: 'text-center text-secondary mt-md' }, 'No wrong answers in this module.'));
      return;
    }

    for (const entry of entries) {
      const card = el('div', { className: 'card' });
      const headerRow = el('div', { className: 'flex-row', style: 'justify-content:space-between;' });
      headerRow.appendChild(el('div', { style: 'font-weight:700;' },
        `${entry.module ? entry.module.toUpperCase() : ''}: ${entry.topic || 'Unknown'}`));
      headerRow.appendChild(el('div', { className: 'badge badge--danger' },
        `${entry.items.length} wrong`));
      card.appendChild(headerRow);

      // Recent wrong answers (last 5)
      const recentItems = entry.items.slice(-5).reverse();
      for (const r of recentItems) {
        const item = el('div', {
          className: 'text-sm',
          style: 'padding:6px 0;border-bottom:1px solid var(--c-surface-alt);',
        });
        const dateStr = r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '';
        item.appendChild(el('span', { className: 'text-secondary' }, dateStr + ' '));
        if (r.question) {
          item.appendChild(el('span', {}, truncate(r.question, 80)));
        }
        if (r.answer !== undefined && r.correctAnswer !== undefined) {
          const ansRow = el('div', { style: 'margin-top:2px;' });
          ansRow.appendChild(el('span', { style: 'color:var(--c-danger);' }, `\u2717 ${r.answer}`));
          ansRow.appendChild(el('span', { className: 'text-secondary' }, ' \u2192 '));
          ansRow.appendChild(el('span', { style: 'color:var(--c-success);' }, `\u2713 ${r.correctAnswer}`));
          item.appendChild(ansRow);
        }
        card.appendChild(item);
      }

      // Drill button — uses tr() for the label since it's concatenated with topic name
      if (entry.topic && entry.module) {
        card.appendChild(el('button', {
          className: 'btn btn--accent btn--block mt-sm',
          style: 'font-size:0.85rem;',
          onClick: () => navigate(`#quiz?module=${entry.module}&mode=practice&topic=${encodeURIComponent(entry.topic)}`),
        }, `${tr('result.drill', 'Drill')}: ${entry.topic}`));
      }

      container.appendChild(card);
    }
  }

  renderTopics();
});

function truncate(text, max) {
  return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
}
