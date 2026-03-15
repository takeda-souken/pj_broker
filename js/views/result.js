/**
 * Result view — shows quiz/mock exam results
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { formatDuration } from '../utils/date-utils.js';
import { triText, tr, triContent } from '../utils/i18n.js';
import { showReportModal } from '../components/report-modal.js';
import { GamificationStore } from '../models/gamification-store.js';
import { showConfetti } from '../components/confetti.js';
import { getSupporterMessage, createSupporterBubble } from '../components/supporter.js';
import { FrequencyStore } from '../models/frequency-store.js';
import { SakuraState } from '../models/sakura-state.js';

registerRoute('#result', (app) => {
  const raw = sessionStorage.getItem('sg_broker_last_result');
  if (!raw) { navigate('#home'); return; }

  const r = JSON.parse(raw);

  // Farewell trigger: mock exam pass at post_confession phase
  if (r.mode === 'mock' && r.accuracy >= 70 && SakuraState.getPhase() === 'post_confession') {
    SakuraState.triggerFarewell();
    // TODO: sakura-story.js farewell event modal
  }

  // Confetti for perfect score (#6)
  if (r.accuracy === 100) {
    showConfetti();
  }

  // Question Bank return context (read early for back button logic)
  const qbankRaw = sessionStorage.getItem('sg_broker_qbank_return');
  const qbankCtx = qbankRaw ? JSON.parse(qbankRaw) : null;

  // Back button (top-left, same pattern as other views)
  const backBtn = el('button', { className: 'btn--back', onClick: () => {
    if (qbankCtx) {
      sessionStorage.removeItem('sg_broker_qbank_return');
      const topicParam = qbankCtx.topic ? `&topic=${encodeURIComponent(qbankCtx.topic)}` : '';
      navigate(`#question-bank?module=${qbankCtx.module}${topicParam}`);
    } else {
      navigate('#home');
    }
  }});
  backBtn.append('\u25C0 ');
  backBtn.appendChild(qbankCtx
    ? triText('result.backToQBank', 'Question Bank')
    : triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'text-center mt-xs' });
  h1.appendChild(document.createTextNode(`${r.module.toUpperCase()} `));
  h1.appendChild(r.mode === 'mock'
    ? triText('result.mockExam', 'Mock Exam')
    : triText('result.practice', 'Practice'));
  h1.appendChild(document.createTextNode(' '));
  h1.appendChild(triText('result.result', 'Result'));
  app.appendChild(h1);

  // Score with color grading
  const scoreColor = getScoreColor(r.accuracy);
  app.appendChild(el('div', { className: 'result-score', style: `color:${scoreColor};` }, `${r.accuracy}%`));
  const passDiv = el('div', { className: 'text-center text-secondary' });
  const passKey = r.accuracy >= 80 ? 'result.excellent'
    : r.passed ? 'result.passed'
    : r.accuracy >= 50 ? 'result.almost'
    : 'result.keepStudying';
  const passFallback = r.accuracy >= 80 ? 'Excellent!'
    : r.passed ? 'PASSED'
    : r.accuracy >= 50 ? 'Almost there!'
    : 'Keep studying!';
  passDiv.appendChild(triText(passKey, passFallback));
  app.appendChild(passDiv);

  // Sakura result message — inline below score, show once per result
  const sakuraKey = 'sg_broker_result_sakura_shown';
  if (!sessionStorage.getItem(sakuraKey)) {
    sessionStorage.setItem(sakuraKey, '1');
    const sakuraEvent = r.mode === 'mock' ? 'mockEnd'
      : r.accuracy === 100 ? 'perfectScore'
      : r.accuracy >= 70 ? 'highAccuracy'
      : r.accuracy < 50 ? 'lowAccuracy'
      : 'sessionEnd';
    const sakuraMsg = getSupporterMessage(sakuraEvent);
    if (sakuraMsg) {
      const bubble = createSupporterBubble(sakuraMsg, { typing: true });
      if (bubble) {
        const sakuraWrap = el('div', { className: 'result-sakura mt-sm' });
        sakuraWrap.appendChild(bubble);
        app.appendChild(sakuraWrap);
      }
    }
  }

  // New achievements (#31)
  if (r.newAchievements && r.newAchievements.length > 0) {
    const achieveSection = el('div', { className: 'card mt-xs', style: 'text-align:center;' });
    const achieveLabel = el('div', { className: 'text-sm', style: 'font-weight:700;color:var(--c-gold);margin-bottom:4px;' });
    achieveLabel.appendChild(document.createTextNode('\uD83C\uDFC6 '));
    achieveLabel.appendChild(triText('result.achievementUnlocked', 'Achievement Unlocked!'));
    achieveSection.appendChild(achieveLabel);
    for (const a of r.newAchievements) {
      const badge = el('div', { className: 'badge badge--gold', style: 'margin:4px;display:inline-flex;gap:4px;' });
      badge.appendChild(document.createTextNode(a.icon + ' '));
      badge.appendChild(triContent(a.name, a.nameJA));
      achieveSection.appendChild(badge);
    }
    app.appendChild(achieveSection);
  }

  // XP progress (#33)
  const gameData = GamificationStore.load();
  const levelInfo = GamificationStore.getLevel(gameData.xp);
  const xpBar = el('div', { className: 'xp-bar mt-xs' });
  xpBar.appendChild(el('div', { className: 'xp-bar__level' }, `Lv.${levelInfo.level}`));
  const track = el('div', { className: 'xp-bar__track' });
  const xpFill = el('div', { className: 'xp-bar__fill' });
  xpFill.style.width = `${Math.round(levelInfo.progress * 100)}%`;
  track.appendChild(xpFill);
  xpBar.appendChild(track);
  xpBar.appendChild(el('div', { className: 'xp-bar__label' }, `${gameData.xp} XP`));
  app.appendChild(xpBar);
  const levelTitle = el('div', { className: 'text-center text-sm text-secondary' });
  levelTitle.appendChild(triContent(levelInfo.title, levelInfo.titleJA));
  app.appendChild(levelTitle);

  // ─── 2-column layout (desktop: summary left, topics right) ───
  const resultLayout = el('div', { className: 'result-layout' });
  const resultSummary = el('div', { className: 'result-summary' });
  const resultTopics = el('div', { className: 'result-topics' });

  // Breakdown grid (left column on desktop)
  const grid = el('div', { className: 'result-breakdown' });
  grid.appendChild(resultStat(r.correct.toString(), 'result.correct', 'Correct'));
  grid.appendChild(resultStat((r.total - r.correct).toString(), 'result.wrong', 'Wrong'));
  grid.appendChild(resultStat(r.total.toString(), 'result.total', 'Total'));
  grid.appendChild(resultStat(formatDuration(r.elapsed), 'result.time', 'Time'));
  if (r.avgTime > 0) {
    grid.appendChild(resultStat(formatDuration(r.avgTime), 'result.avgPerQ', 'Avg/Q'));
  }
  resultSummary.appendChild(grid);

  // Topic breakdown (right column on desktop)
  if (Object.keys(r.byTopic).length > 0) {
    const h2 = el('h2', {});
    h2.appendChild(triText('result.byTopic', 'By Topic'));
    resultTopics.appendChild(h2);
    const table = el('table', { className: 'topic-table' });
    const headerRow = el('tr', {});
    const thTopic = el('th', {});
    thTopic.appendChild(triText('result.topic', 'Topic'));
    const thScore = el('th', {});
    thScore.appendChild(triText('result.score', 'Score'));
    headerRow.appendChild(thTopic);
    headerRow.appendChild(thScore);
    table.appendChild(headerRow);

    for (const [topic, data] of Object.entries(r.byTopic)) {
      const pct = Math.round((data.correct / data.total) * 100);
      const topicCell = el('td', {});
      topicCell.appendChild(el('span', {}, topic));
      if (pct < 100) {
        const drillBtn = el('button', {
          className: 'btn-drill',
          onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&topic=${encodeURIComponent(topic)}`),
        });
        drillBtn.appendChild(triText('result.drill', 'Drill'));
        topicCell.appendChild(drillBtn);
      }
      table.appendChild(el('tr', {},
        topicCell,
        el('td', {}, `${data.correct}/${data.total} `, createAccuracyBar(pct)),
      ));
    }
    resultTopics.appendChild(table);
  }

  resultLayout.appendChild(resultSummary);
  resultLayout.appendChild(resultTopics);
  app.appendChild(resultLayout);

  // ─── Per-question review with frequency control ───
  if (r.questionDetails && r.questionDetails.length > 0) {
    const qSection = el('div', { className: 'card mt-xs' });
    const qHeader = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' });
    const qHeaderH2 = el('h2', { style: 'margin:0;' });
    qHeaderH2.appendChild(triText('result.questionReview', 'Question Review'));
    qHeader.appendChild(qHeaderH2);
    const toggleBtn = el('button', { className: 'btn btn--sm btn--outline' });
    toggleBtn.appendChild(triText('result.expandAll', 'Expand All'));
    let allExpanded = false;
    toggleBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      toggleBtn.textContent = '';
      toggleBtn.appendChild(allExpanded
        ? triText('result.collapseAll', 'Collapse All')
        : triText('result.expandAll', 'Expand All'));
      qSection.querySelectorAll('.result-q-detail').forEach(d => {
        d.style.display = allExpanded ? 'block' : 'none';
      });
      qSection.querySelectorAll('.result-q-toggle').forEach(b => {
        b.textContent = allExpanded ? '\u25B2' : '\u25BC';
      });
    });
    qHeader.appendChild(toggleBtn);
    qSection.appendChild(qHeader);

    for (let i = 0; i < r.questionDetails.length; i++) {
      const qd = r.questionDetails[i];
      const row = el('div', { className: `result-q-row ${qd.isCorrect ? 'result-q-row--correct' : 'result-q-row--wrong'}` });

      // Header row: number, icon, question preview, toggle
      const rowHeader = el('div', { className: 'result-q-header' });
      rowHeader.appendChild(el('span', { className: 'result-q-num' }, `Q${i + 1}`));
      rowHeader.appendChild(el('span', { className: qd.isCorrect ? 'result-q-icon--correct' : 'result-q-icon--wrong' },
        qd.isCorrect ? '\u2713' : '\u2717'));
      const preview = qd.question.length > 60 ? qd.question.slice(0, 60) + '...' : qd.question;
      rowHeader.appendChild(el('span', { className: 'result-q-preview' }, preview));

      // Frequency bar (inline, always visible)
      const freqBar = createFrequencyBar(qd.id);
      rowHeader.appendChild(freqBar);

      const toggleArrow = el('button', { className: 'result-q-toggle' }, '\u25BC');
      rowHeader.appendChild(toggleArrow);
      row.appendChild(rowHeader);

      // Detail (collapsed by default)
      const detail = el('div', { className: 'result-q-detail', style: 'display:none;' });
      const fullTextEl = el('div', { className: 'result-q-fulltext' });
      fullTextEl.appendChild(triContent(qd.question, qd.questionJP));
      detail.appendChild(fullTextEl);
      detail.appendChild(el('div', { className: 'text-sm text-secondary', style: 'margin:4px 0;' }, qd.topic));

      // Show choices with correct/wrong marking
      if (qd.choices) {
        const choiceList = el('div', { className: 'result-q-choices' });
        qd.choices.forEach((c, ci) => {
          const isCorrectChoice = ci === qd.correctAnswer;
          const isUserChoice = ci === qd.userAnswer;
          const cls = isCorrectChoice ? 'result-q-choice--correct'
            : isUserChoice ? 'result-q-choice--wrong' : '';
          const marker = isCorrectChoice ? '\u2713' : isUserChoice ? '\u2717' : ' ';
          const choiceEl = el('div', { className: `result-q-choice ${cls}` });
          choiceEl.appendChild(document.createTextNode(`${marker} `));
          const jpChoice = qd.choicesJP ? qd.choicesJP[ci] : null;
          choiceEl.appendChild(triContent(c, jpChoice));
          choiceList.appendChild(choiceEl);
        });
        detail.appendChild(choiceList);
      }

      // Explanation
      if (qd.explanation) {
        const explDiv = el('div', { className: 'result-q-explanation mt-sm' });
        const explLabel = el('span', { style: 'font-weight:700;' });
        explLabel.appendChild(triText('result.explanation', 'Explanation'));
        explLabel.appendChild(document.createTextNode(': '));
        explDiv.appendChild(explLabel);
        const explText = el('span', {});
        explText.appendChild(triContent(qd.explanation, qd.explanationJP));
        explDiv.appendChild(explText);
        detail.appendChild(explDiv);
      }

      // Source + report
      const srcRow = el('div', { className: 'explanation__source-row mt-sm' });
      if (qd.source) {
        srcRow.appendChild(el('span', { className: 'explanation__source' }, `\uD83D\uDCD6 ${qd.source}`));
      }
      const rptBtn = el('button', {
        className: 'btn-report',
        onClick: (e) => {
          e.stopPropagation();
          showReportModal({ module: r.module, questionId: qd.id, question: qd.question });
        },
      }, '\u26A0 Report');
      srcRow.appendChild(rptBtn);
      detail.appendChild(srcRow);

      // JP Comparison (now bilingual: shows in all language modes)
      if (qd.jpComparison || qd.jpComparisonEN) {
        const jpDiv = el('div', { className: 'result-q-jp mt-sm' });
        jpDiv.appendChild(el('span', { style: 'font-weight:700;' }, '\uD83C\uDDEF\uD83C\uDDF5 '));
        const jpText = el('span', {});
        jpText.appendChild(triContent(qd.jpComparisonEN || qd.jpComparison, qd.jpComparison));
        jpDiv.appendChild(jpText);
        detail.appendChild(jpDiv);
      }

      row.appendChild(detail);

      // Toggle expand/collapse
      rowHeader.style.cursor = 'pointer';
      rowHeader.addEventListener('click', (e) => {
        // Don't toggle when clicking frequency buttons
        if (e.target.closest('.freq-bar')) return;
        const visible = detail.style.display !== 'none';
        detail.style.display = visible ? 'none' : 'block';
        toggleArrow.textContent = visible ? '\u25BC' : '\u25B2';
      });

      qSection.appendChild(row);
    }
    app.appendChild(qSection);
  }

  // Smart actions (horizontal on desktop via .result-actions)
  const actions = el('div', { className: 'result-actions flex-col gap-sm mt-sm' });

  // "Next Question" from Question Bank flow
  if (qbankCtx && qbankCtx.nextIds && qbankCtx.nextIds.length > 0) {
    const nextId = qbankCtx.nextIds[0];
    const nextBtn = el('button', {
      className: 'btn btn--accent btn--block',
      onClick: () => {
        sessionStorage.setItem('sg_broker_qbank_return', JSON.stringify({
          ...qbankCtx,
          nextIds: qbankCtx.nextIds.slice(1),
        }));
        navigate(`#quiz?module=${qbankCtx.module}&mode=practice&review=${nextId}`);
      },
    });
    nextBtn.appendChild(triText('result.nextQuestion', 'Next Question'));
    nextBtn.appendChild(document.createTextNode(' \u25B6'));
    actions.appendChild(nextBtn);
  }

  if (r.wrongIds && r.wrongIds.length > 0) {
    const reviewBtn = el('button', {
      className: 'btn btn--accent btn--block',
      onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&review=${r.wrongIds.join(',')}`),
    });
    reviewBtn.appendChild(triText('result.reviewWrong', `Review ${r.wrongIds.length} Wrong Answer${r.wrongIds.length > 1 ? 's' : ''}`, r.wrongIds.length));
    actions.appendChild(reviewBtn);
  }

  if (r.weakestTopic) {
    const drillBtn = el('button', {
      className: 'btn btn--outline btn--block',
      onClick: () => navigate(`#quiz?module=${r.module}&mode=practice&topic=${encodeURIComponent(r.weakestTopic)}`),
    });
    drillBtn.appendChild(triText('result.drill', 'Drill'));
    drillBtn.appendChild(document.createTextNode(`: ${r.weakestTopic}`));
    actions.appendChild(drillBtn);
  }

  const studyBtn = el('button', {
    className: 'btn btn--primary btn--block',
    onClick: () => navigate(`#mode-select?module=${r.module}`),
  });
  studyBtn.appendChild(triText('result.studyAgain', 'Study Again'));
  actions.appendChild(studyBtn);

  app.appendChild(actions);
});

function getScoreColor(accuracy) {
  if (accuracy >= 80) return 'var(--c-gold)';
  if (accuracy >= 70) return 'var(--c-success)';
  if (accuracy >= 50) return 'var(--c-warning)';
  return 'var(--c-danger)';
}

function resultStat(value, labelKey, labelEn) {
  const stat = el('div', { className: 'result-stat' });
  stat.appendChild(el('div', { className: 'result-stat__value' }, value));
  const labelDiv = el('div', { className: 'result-stat__label' });
  labelDiv.appendChild(triText(labelKey, labelEn));
  stat.appendChild(labelDiv);
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

const FREQ_LEVELS = ['high', 'medium', 'low', 'none'];
const FREQ_LABELS = { high: '\u9AD8', medium: '\u4E2D', low: '\u4F4E', none: '\u7121' };
const FREQ_COLORS = {
  high: 'var(--c-success)',
  medium: 'var(--c-warning)',
  low: 'var(--c-danger)',
  none: 'var(--c-muted, #888)',
};

function createFrequencyBar(questionId) {
  const bar = el('div', { className: 'freq-bar' });
  const current = FrequencyStore.get(questionId);

  for (const level of FREQ_LEVELS) {
    const btn = el('button', {
      className: `freq-btn ${level === current ? 'freq-btn--active' : ''}`,
      title: level,
    }, FREQ_LABELS[level]);
    if (level === current) {
      btn.style.background = FREQ_COLORS[level];
      btn.style.color = '#fff';
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      FrequencyStore.set(questionId, level);
      // Update all buttons in this bar
      bar.querySelectorAll('.freq-btn').forEach((b, bi) => {
        const l = FREQ_LEVELS[bi];
        const isActive = l === level;
        b.classList.toggle('freq-btn--active', isActive);
        b.style.background = isActive ? FREQ_COLORS[l] : '';
        b.style.color = isActive ? '#fff' : '';
      });
    });
    bar.appendChild(btn);
  }
  return bar;
}

