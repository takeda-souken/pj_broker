/**
 * Result view — shows quiz/mock exam results
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { formatDuration } from '../utils/date-utils.js';
import { SettingsStore } from '../models/settings-store.js';
import { getEncouragement } from '../data/kataoka-messages.js';
import { tr, trNode } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';
import { showConfetti } from '../components/confetti.js';

registerRoute('#result', (app) => {
  const raw = sessionStorage.getItem('sg_broker_last_result');
  if (!raw) { navigate('#home'); return; }

  const r = JSON.parse(raw);
  const isKataoka = SettingsStore.isKataokaMode();

  // Confetti for perfect score (#6)
  if (r.accuracy === 100) {
    showConfetti();
  }

  const modeLabel = r.mode === 'mock' ? tr('result.mockExam', 'Mock Exam') : tr('result.practice', 'Practice');
  const h1 = el('h1', { className: 'text-center mt-md' });
  h1.appendChild(trNode('result.title', `${r.module.toUpperCase()} ${modeLabel} Result`, r.module.toUpperCase(), modeLabel));
  app.appendChild(h1);

  // Score with color grading
  const scoreColor = getScoreColor(r.accuracy);
  app.appendChild(el('div', { className: 'result-score', style: `color:${scoreColor};` }, `${r.accuracy}%`));
  const passLabel = r.accuracy >= 80 ? tr('result.excellent', 'Excellent!')
    : r.passed ? tr('result.passed', 'PASSED')
    : r.accuracy >= 50 ? tr('result.almost', 'Almost there!')
    : tr('result.keepStudying', 'Keep studying!');
  app.appendChild(el('div', { className: 'text-center text-secondary' }, passLabel));

  // Kataoka encouragement
  if (isKataoka) {
    const msg = getEncouragement(r.passed ? 'resultPass' : 'resultFail');
    app.appendChild(el('div', { className: `encouragement encouragement--${r.passed ? 'correct' : 'wrong'} mt-sm text-center` }, msg));
  }

  // New achievements (#31)
  if (r.newAchievements && r.newAchievements.length > 0) {
    const achieveSection = el('div', { className: 'card mt-md', style: 'text-align:center;' });
    achieveSection.appendChild(el('div', { className: 'text-sm', style: 'font-weight:700;color:var(--c-gold);margin-bottom:8px;' }, '\uD83C\uDFC6 Achievement Unlocked!'));
    for (const a of r.newAchievements) {
      const badge = el('div', { className: 'badge badge--gold', style: 'margin:4px;display:inline-flex;' });
      badge.textContent = `${a.icon} ${a.name}`;
      achieveSection.appendChild(badge);
    }
    app.appendChild(achieveSection);
  }

  // XP progress (#33)
  const gameData = GamificationStore.load();
  const levelInfo = GamificationStore.getLevel(gameData.xp);
  const xpBar = el('div', { className: 'xp-bar mt-sm' });
  xpBar.appendChild(el('div', { className: 'xp-bar__level' }, `Lv.${levelInfo.level}`));
  const track = el('div', { className: 'xp-bar__track' });
  const xpFill = el('div', { className: 'xp-bar__fill' });
  xpFill.style.width = `${Math.round(levelInfo.progress * 100)}%`;
  track.appendChild(xpFill);
  xpBar.appendChild(track);
  xpBar.appendChild(el('div', { className: 'xp-bar__label' }, `${gameData.xp} XP`));
  app.appendChild(xpBar);
  app.appendChild(el('div', { className: 'text-center text-sm text-secondary' }, levelInfo.title));

  // Breakdown grid
  const grid = el('div', { className: 'result-breakdown' });
  grid.appendChild(resultStat(r.correct.toString(), tr('result.correct', 'Correct')));
  grid.appendChild(resultStat((r.total - r.correct).toString(), tr('result.wrong', 'Wrong')));
  grid.appendChild(resultStat(r.total.toString(), tr('result.total', 'Total')));
  grid.appendChild(resultStat(formatDuration(r.elapsed), tr('result.time', 'Time')));
  if (r.avgTime > 0) {
    grid.appendChild(resultStat(formatDuration(r.avgTime), tr('result.avgPerQ', 'Avg/Q')));
  }
  app.appendChild(grid);

  // Topic breakdown
  if (Object.keys(r.byTopic).length > 0) {
    const h2 = el('h2', { className: 'mt-lg' });
    h2.appendChild(trNode('result.byTopic', 'By Topic'));
    app.appendChild(h2);
    const table = el('table', { className: 'topic-table' });
    table.appendChild(el('tr', {},
      el('th', {}, tr('result.topic', 'Topic')),
      el('th', {}, tr('result.score', 'Score')),
    ));

    for (const [topic, data] of Object.entries(r.byTopic)) {
      const pct = Math.round((data.correct / data.total) * 100);
      const topicCell = el('td', {});
      topicCell.appendChild(el('span', {}, topic));
      if (pct < 100) {
        topicCell.appendChild(el('button', {
          className: 'btn-drill',
          onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&topic=${encodeURIComponent(topic)}`),
        }, tr('result.drill', 'Drill')));
      }
      table.appendChild(el('tr', {},
        topicCell,
        el('td', {}, `${data.correct}/${data.total} `, createAccuracyBar(pct)),
      ));
    }
    app.appendChild(table);
  }

  // Smart actions
  const actions = el('div', { className: 'flex-col gap-sm mt-lg' });

  if (r.wrongIds && r.wrongIds.length > 0) {
    const reviewBtn = el('button', {
      className: 'btn btn--accent btn--block',
      onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&review=${r.wrongIds.join(',')}`),
    });
    reviewBtn.appendChild(trNode('result.reviewWrong', `Review ${r.wrongIds.length} Wrong Answer${r.wrongIds.length > 1 ? 's' : ''}`, r.wrongIds.length));
    actions.appendChild(reviewBtn);
  }

  if (r.weakestTopic) {
    actions.appendChild(el('button', {
      className: 'btn btn--outline btn--block',
      onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&topic=${encodeURIComponent(r.weakestTopic)}`),
    }, `${tr('result.drill', 'Drill')}: ${r.weakestTopic}`));
  }

  // Share button (#43)
  if (navigator.share || navigator.clipboard) {
    actions.appendChild(el('button', {
      className: 'btn btn--outline btn--block',
      onClick: () => shareResult(r),
    }, `\uD83D\uDCE4 ${tr('result.share', 'Share Result')}`));
  }

  const studyBtn = el('button', {
    className: 'btn btn--primary btn--block',
    onClick: () => navigate(`#mode-select?module=${r.module}`),
  });
  studyBtn.appendChild(trNode('result.studyAgain', 'Study Again'));
  actions.appendChild(studyBtn);

  const homeBtn = el('button', {
    className: 'btn btn--outline btn--block',
    onClick: () => navigate('#home'),
  });
  homeBtn.appendChild(trNode('result.home', 'Home'));
  actions.appendChild(homeBtn);

  app.appendChild(actions);
});

function getScoreColor(accuracy) {
  if (accuracy >= 80) return 'var(--c-gold)';
  if (accuracy >= 70) return 'var(--c-success)';
  if (accuracy >= 50) return 'var(--c-warning)';
  return 'var(--c-danger)';
}

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

async function shareResult(r) {
  const text = `BrokerPass SG \u2014 ${r.module.toUpperCase()} ${r.mode === 'mock' ? 'Mock Exam' : 'Practice'}\n\uD83C\uDFAF ${r.accuracy}% (${r.correct}/${r.total})\n\u23F1 ${formatDuration(r.elapsed)}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'BrokerPass SG Result', text });
    } catch { /* user cancelled */ }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    import('../components/toast.js').then(({ showToast }) => showToast('Copied to clipboard!', 'success'));
  }
}
