/**
 * Mode select view — choose study mode for a given module
 * Uses CSS-based i18n (triText) — language switch requires no re-render.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { RecordStore } from '../models/record-store.js';
import { loadQuestions } from '../data/questions.js';
import { triText } from '../utils/i18n.js';
import { getSupporterMessage, createSupporterBubble } from '../components/supporter.js';

registerRoute('#mode-select', async (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const module = params.get('module') || 'bcp';
  const labelMap = { bcp: 'BCP', comgi: 'ComGI', pgi: 'PGI', hi: 'HI' };
  const label = labelMap[module] || module.toUpperCase();

  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('mode.study', `Study ${label}`, label));
  app.appendChild(h1);

  // First-time onboarding hint
  const records = RecordStore.getRecords();
  if (records.length === 0) {
    const hint = el('div', { className: 'onboarding-hint mt-sm' });
    const hintTitle = el('div', { className: 'onboarding-hint__title' });
    hintTitle.appendChild(triText('mode.welcome', 'Welcome!'));
    hint.appendChild(hintTitle);
    const hintText = el('div', { className: 'onboarding-hint__text' });
    hintText.appendChild(triText('mode.welcomeText', 'Start with "Practice (10 Q)" to get familiar. Once you\'ve practiced, try a Mock Exam to simulate the real thing!'));
    hint.appendChild(hintText);
    app.appendChild(hint);
  }

  const grid = el('div', { className: 'mode-select-grid mt-md' });

  // Navigate with optional Sakura greeting before quiz starts
  let goingToQuiz = false;
  function goQuiz(hash, isMock) {
    if (goingToQuiz) return;  // block double-tap
    const event = isMock ? 'mockStart' : 'sessionStart';
    const msg = getSupporterMessage(event);
    const bubble = createSupporterBubble(msg, { typing: true });
    if (!bubble) { navigate(hash); return; }

    goingToQuiz = true;
    const overlay = el('div', { className: 'sakura-center-overlay' });
    overlay.appendChild(bubble);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('sakura-center-overlay--visible'));

    let timer = setTimeout(go, 2500);
    overlay.addEventListener('click', go);

    function go() {
      if (!goingToQuiz) return;  // already dismissed
      goingToQuiz = false;
      clearTimeout(timer);
      overlay.remove();
      navigate(hash);
    }
  }

  grid.appendChild(modeCard('\uD83D\uDCDD', 'mode.practice10', 'Practice (10 Q)', 'mode.practice10sub', 'Random questions, no timer',
    () => goQuiz(`#quiz?module=${module}&mode=practice&count=10`, false)));

  grid.appendChild(modeCard('\uD83D\uDCDA', 'mode.practice20', 'Practice (20 Q)', 'mode.practice20sub', 'Extended practice session',
    () => goQuiz(`#quiz?module=${module}&mode=practice&count=20`, false)));

  const weakTopics = RecordStore.getWeakTopics(module, 5);
  if (weakTopics.length > 0) {
    grid.appendChild(modeCard('\uD83C\uDFAF', 'mode.weakTopics', 'Weak Topics',
      'mode.weakTopicsSub', `Focus on ${weakTopics.length} weak area(s)`,
      () => goQuiz(`#quiz?module=${module}&mode=weak&count=20`, false),
      [], [weakTopics.length]));
  }

  app.appendChild(grid);

  // Topic drill section
  try {
    const allQ = await loadQuestions(module);
    const topics = [...new Set(allQ.map(q => q.topic))].sort();
    if (topics.length > 0) {
      const h2 = el('h2', { className: 'mt-lg' });
      h2.appendChild(triText('mode.byTopic', 'Practice by Topic'));
      app.appendChild(h2);
      const topicGrid = el('div', { className: 'mode-topic-grid' });
      const topicStats = RecordStore.getTopicStats();

      for (const topic of topics) {
        const key = `${module}::${topic}`;
        const stat = topicStats[key];
        const count = allQ.filter(q => q.topic === topic).length;
        // Topic cards use plain text (topic names are English, no translation needed)
        let subtitle = `${count} questions`;
        if (stat && stat.attempts > 0) {
          const pct = Math.round((stat.correct / stat.attempts) * 100);
          subtitle += ` \u00B7 ${pct}% accuracy`;
          if (stat.mastered) subtitle += ' \u2605';
        }

        topicGrid.appendChild(topicCard(topic, subtitle,
          () => navigate(`#quiz?module=${module}&mode=practice&topic=${encodeURIComponent(topic)}`)));
      }
      app.appendChild(topicGrid);
    }
  } catch { /* questions not loaded yet */ }
});

function topicCard(title, subtitle, onClick) {
  const card = el('button', { className: 'card mode-card', onClick });
  card.appendChild(el('div', { className: 'mode-card__title' }, title));
  card.appendChild(el('div', { className: 'mode-card__subtitle' }, subtitle));
  return card;
}

function modeCard(icon, titleKey, titleEn, subKey, subEn, onClick, titleArgs = [], subArgs = []) {
  const card = el('button', { className: 'card mode-card', onClick });
  card.appendChild(el('div', { className: 'mode-card__icon' }, icon));
  const body = el('div', { className: 'mode-card__body' });
  const titleDiv = el('div', { className: 'mode-card__title' });
  titleDiv.appendChild(triText(titleKey, titleEn, ...titleArgs));
  body.appendChild(titleDiv);
  const subDiv = el('div', { className: 'mode-card__subtitle' });
  subDiv.appendChild(triText(subKey, subEn, ...subArgs));
  body.appendChild(subDiv);
  card.appendChild(body);
  return card;
}
