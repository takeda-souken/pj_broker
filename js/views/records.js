/**
 * Records view — study history and statistics
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';

registerRoute('#records', (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'Study Records'));

  // Module tabs
  let activeModule = 'bcp';
  const tabRow = el('div', { className: 'flex-row gap-sm mt-md mb-md' });
  const bcpTab = el('button', { className: 'btn btn--primary', onClick: () => switchModule('bcp') }, 'BCP');
  const comgiTab = el('button', { className: 'btn btn--outline', onClick: () => switchModule('comgi') }, 'ComGI');
  tabRow.appendChild(bcpTab);
  tabRow.appendChild(comgiTab);
  app.appendChild(tabRow);

  const content = el('div', {});
  app.appendChild(content);

  function switchModule(mod) {
    activeModule = mod;
    bcpTab.className = mod === 'bcp' ? 'btn btn--primary' : 'btn btn--outline';
    comgiTab.className = mod === 'comgi' ? 'btn btn--primary' : 'btn btn--outline';
    renderStats(content, mod);
  }

  renderStats(content, activeModule);
});

function renderStats(container, module) {
  container.innerHTML = '';
  const stats = RecordStore.getModuleStats(module);

  // Summary
  const grid = el('div', { className: 'stats-grid' });
  grid.appendChild(statCard(stats.attempts.toString(), 'Attempts'));
  grid.appendChild(statCard(stats.accuracy + '%', 'Accuracy'));
  grid.appendChild(statCard(stats.mastered.toString(), 'Mastered'));
  container.appendChild(grid);

  // Topic breakdown
  const topicStats = RecordStore.getTopicStats();
  const moduleTopics = Object.values(topicStats).filter(s => s.module === module);

  if (moduleTopics.length === 0) {
    container.appendChild(el('div', { className: 'text-center text-secondary mt-lg' }, 'No study data yet. Start practicing!'));
    return;
  }

  const table = el('table', { className: 'topic-table' });
  table.appendChild(el('tr', {},
    el('th', {}, 'Topic'),
    el('th', {}, 'Acc.'),
    el('th', {}, 'Streak'),
  ));

  moduleTopics.sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts));
  for (const s of moduleTopics) {
    const pct = Math.round((s.correct / s.attempts) * 100);
    table.appendChild(el('tr', {},
      el('td', {}, s.topic + (s.mastered ? ' \u2605' : '')),
      el('td', {}, `${pct}% (${s.correct}/${s.attempts})`),
      el('td', {}, s.streak.toString()),
    ));
  }
  container.appendChild(table);

  // Weak topics
  const weak = RecordStore.getWeakTopics(module, 3);
  if (weak.length > 0) {
    container.appendChild(el('h3', { className: 'mt-lg' }, 'Focus Areas'));
    for (const w of weak) {
      const pct = Math.round((w.correct / w.attempts) * 100);
      container.appendChild(el('div', { className: 'text-sm', style: 'padding:4px 0;' },
        `${w.topic}: ${pct}% (${w.attempts} attempts)`));
    }
  }
}

function statCard(value, label) {
  const card = el('div', { className: 'stat-card' });
  card.appendChild(el('div', { className: 'stat-card__value' }, value));
  card.appendChild(el('div', { className: 'stat-card__label' }, label));
  return card;
}
