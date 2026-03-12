/**
 * Mode select view — choose study mode for a given module
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { loadQuestions } from '../data/questions.js';
import { tr, trNode } from '../utils/i18n.js';

registerRoute('#mode-select', async (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const module = params.get('module') || 'bcp';
  const label = module === 'bcp' ? 'BCP' : 'ComGI';

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('mode.study', `Study ${label}`, label));
  app.appendChild(h1);

  // First-time onboarding hint
  const records = RecordStore.getRecords();
  if (records.length === 0) {
    const hint = el('div', { className: 'onboarding-hint mt-sm' });
    const hintTitle = el('div', { className: 'onboarding-hint__title' });
    hintTitle.appendChild(trNode('mode.welcome', 'Welcome!'));
    hint.appendChild(hintTitle);
    const hintText = el('div', { className: 'onboarding-hint__text' });
    hintText.appendChild(trNode('mode.welcomeText', 'Start with "Practice (10 Q)" to get familiar. Once you\'ve practiced, try a Mock Exam to simulate the real thing!'));
    hint.appendChild(hintText);
    app.appendChild(hint);
  }

  const grid = el('div', { className: 'mode-select-grid mt-md' });

  grid.appendChild(modeCardBi('mode.practice10', 'Practice (10 Q)', 'mode.practice10sub', 'Random questions, no timer',
    () => navigate(`#quiz?module=${module}&mode=practice&count=10`)));

  grid.appendChild(modeCardBi('mode.practice20', 'Practice (20 Q)', 'mode.practice20sub', 'Extended practice session',
    () => navigate(`#quiz?module=${module}&mode=practice&count=20`)));

  const weakTopics = RecordStore.getWeakTopics(module, 5);
  if (weakTopics.length > 0) {
    grid.appendChild(modeCardBi('mode.weakTopics', 'Weak Topics',
      'mode.weakTopicsSub', `Focus on ${weakTopics.length} weak area(s)`,
      () => navigate(`#quiz?module=${module}&mode=weak&count=20`),
      [], [weakTopics.length]));
  }

  const mockSubKey = module === 'bcp' ? 'mode.mockBcpSub' : 'mode.mockComgiSub';
  const mockSubEn = module === 'bcp' ? '40 Q / 45 min \u2014 Full simulation' : '50 Q / 75 min \u2014 Full simulation';
  grid.appendChild(modeCardBi('mode.mock', 'Mock Exam', mockSubKey, mockSubEn,
    () => navigate(`#quiz?module=${module}&mode=mock`)));

  app.appendChild(grid);

  // Topic drill section
  try {
    const allQ = await loadQuestions(module);
    const topics = [...new Set(allQ.map(q => q.topic))].sort();
    if (topics.length > 0) {
      const h2 = el('h2', { className: 'mt-lg' });
      h2.appendChild(trNode('mode.byTopic', 'Practice by Topic'));
      app.appendChild(h2);
      const topicGrid = el('div', { className: 'mode-topic-grid' });
      const topicStats = RecordStore.getTopicStats();

      for (const topic of topics) {
        const key = `${module}::${topic}`;
        const stat = topicStats[key];
        const count = allQ.filter(q => q.topic === topic).length;
        let subtitle = tr('mode.questions', `${count} questions`, count);
        if (stat && stat.attempts > 0) {
          const pct = Math.round((stat.correct / stat.attempts) * 100);
          subtitle += ` \u00B7 ${tr('mode.accuracyPct', `${pct}% accuracy`, pct)}`;
          if (stat.mastered) subtitle += ' \u2605';
        }

        topicGrid.appendChild(modeCard(topic, subtitle,
          () => navigate(`#quiz?module=${module}&mode=practice&topic=${encodeURIComponent(topic)}`)));
      }
      app.appendChild(topicGrid);
    }
  } catch { /* questions not loaded yet */ }
});

function modeCard(title, subtitle, onClick) {
  const card = el('button', { className: 'card mode-card', onClick });
  card.appendChild(el('div', { className: 'mode-card__title' }, title));
  card.appendChild(el('div', { className: 'mode-card__subtitle' }, subtitle));
  return card;
}

function modeCardBi(titleKey, titleEn, subKey, subEn, onClick, titleArgs = [], subArgs = []) {
  const card = el('button', { className: 'card mode-card', onClick });
  const titleDiv = el('div', { className: 'mode-card__title' });
  titleDiv.appendChild(trNode(titleKey, titleEn, ...titleArgs));
  card.appendChild(titleDiv);
  const subDiv = el('div', { className: 'mode-card__subtitle' });
  subDiv.appendChild(trNode(subKey, subEn, ...subArgs));
  card.appendChild(subDiv);
  return card;
}
