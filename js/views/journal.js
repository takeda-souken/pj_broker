/**
 * Wrong Answer Journal — review past mistakes grouped by topic
 * Only shows questions whose most recent attempt was wrong.
 * Once you answer a question correctly, it disappears from the journal.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { triText, tr } from '../utils/i18n.js';

registerRoute('#journal', (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#question-bank') });
  backBtn.appendChild(document.createTextNode('\u25C0 '));
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('journal.title', 'Wrong Answer Journal'));
  app.appendChild(h1);

  const records = RecordStore.getRecords();

  // Build map: questionId → most recent record (skip timeouts)
  const latestByQ = {};
  for (const r of records) {
    if (r.answer === -1) continue; // skip timeouts
    if (!r.questionId) continue;
    const prev = latestByQ[r.questionId];
    if (!prev || (r.timestamp || 0) >= (prev.timestamp || 0)) {
      latestByQ[r.questionId] = r;
    }
  }

  // Only keep questions whose latest attempt is wrong
  const wrongRecords = Object.values(latestByQ).filter(r => !r.isCorrect);

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
  const uniqueQuestions = wrongRecords.length;
  const summary = el('div', { className: 'card', style: 'text-align:center;' });
  summary.appendChild(el('div', { style: 'font-size:1.5rem;font-weight:800;color:var(--c-danger);' }, uniqueQuestions.toString()));
  const summaryLabel = el('div', { className: 'text-sm text-secondary' });
  summaryLabel.appendChild(triText('journal.count', `${uniqueQuestions} questions to review`, uniqueQuestions));
  summary.appendChild(summaryLabel);
  app.appendChild(summary);

  // Group by topic
  const byTopic = {};
  for (const r of wrongRecords) {
    const key = `${r.module || 'unknown'}::${r.topic || 'Unknown'}`;
    if (!byTopic[key]) byTopic[key] = { module: r.module, topic: r.topic, items: [] };
    byTopic[key].items.push(r);
  }

  // Module filter — derive from data
  const modules = [...new Set(wrongRecords.map(r => r.module).filter(Boolean))].sort();
  let activeModule = 'all';
  const seg = el('div', { className: 'seg-control mt-md' });
  const filterIds = ['all', ...modules];
  const filterBtns = filterIds.map(m =>
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
      btn.className = `seg-control__item${filterIds[i] === mod ? ' seg-control__item--active' : ''}`;
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
        `${entry.items.length}`));
      card.appendChild(headerRow);

      // Show wrong answers (up to 5 most recent)
      const recentItems = entry.items
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 5);
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

      // Drill button
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
