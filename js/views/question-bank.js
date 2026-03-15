/**
 * Question Bank view — browse all questions with frequency control
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadQuestions, getTopics } from '../data/questions.js';
import { FrequencyStore } from '../models/frequency-store.js';
import { RecordStore } from '../models/record-store.js';
import { triText, tr } from '../utils/i18n.js';
import { showToast } from '../components/toast.js';

const MODULES = ['bcp', 'comgi', 'pgi', 'hi'];
const FREQ_LEVELS = ['high', 'medium', 'low', 'none'];
const FREQ_LABELS = { high: '\u9AD8', medium: '\u4E2D', low: '\u4F4E', none: '\u7121' };
const FREQ_COLORS = {
  high: 'var(--c-success)',
  medium: 'var(--c-warning)',
  low: 'var(--c-danger)',
  none: 'var(--c-muted, #888)',
};
const DIFF_COLORS = {
  1: 'var(--c-success)',
  2: 'var(--c-warning)',
  3: 'var(--c-danger)',
};
const DIFF_LABELS = { 1: 'Easy', 2: 'Med', 3: 'Hard' };

registerRoute('#question-bank', async (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  let currentModule = params.get('module') || 'bcp';
  let currentTopic = params.get('topic') || '';
  let currentFreqFilter = 'all';
  let currentDiffFilter = 'all';
  let currentSort = 'default'; // default, diff-asc, diff-desc, acc-asc, acc-desc

  // Back button (top-left, same pattern as other views)
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.append('\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  // Header
  const h1 = el('h1', { className: 'text-center mt-md' });
  h1.appendChild(triText('qbank.title', 'Question Bank'));
  app.appendChild(h1);

  // Module selector
  const moduleSeg = el('div', { className: 'seg-control mb-sm' });
  for (const mod of MODULES) {
    const btn = el('button', {
      className: `seg-control__item ${mod === currentModule ? 'seg-control__item--active' : ''}`,
    }, mod.toUpperCase());
    btn.addEventListener('click', () => {
      currentModule = mod;
      currentTopic = '';
      render();
    });
    moduleSeg.appendChild(btn);
  }
  app.appendChild(moduleSeg);

  // Filters container
  const filterRow = el('div', { className: 'qbank-filters' });
  app.appendChild(filterRow);

  // Stats summary
  const statsRow = el('div', { className: 'qbank-stats' });
  app.appendChild(statsRow);

  // Bulk actions
  const bulkRow = el('div', { className: 'qbank-bulk' });
  app.appendChild(bulkRow);

  // Question list container
  const listContainer = el('div', { className: 'qbank-list' });
  app.appendChild(listContainer);

  async function render() {
    // Update module selector active state
    moduleSeg.querySelectorAll('.seg-control__item').forEach((btn, i) => {
      btn.classList.toggle('seg-control__item--active', MODULES[i] === currentModule);
    });

    const questions = await loadQuestions(currentModule);
    const topics = getTopics(questions);
    const records = RecordStore.getRecords();

    // Build per-question stats from records
    const qStats = {};
    for (const r of records) {
      if (r.module !== currentModule) continue;
      if (!qStats[r.questionId]) qStats[r.questionId] = { attempts: 0, correct: 0 };
      qStats[r.questionId].attempts++;
      if (r.isCorrect) qStats[r.questionId].correct++;
    }

    // ─── Filters ───
    filterRow.innerHTML = '';

    // Topic filter
    const topicSelect = el('select', { className: 'qbank-topic-select' });
    topicSelect.appendChild(el('option', { value: '' }, tr('qbank.allTopics', 'All Topics')));
    for (const t of topics.sort()) {
      topicSelect.appendChild(el('option', { value: t, selected: t === currentTopic }, t));
    }
    topicSelect.addEventListener('change', () => { currentTopic = topicSelect.value; renderList(); });
    filterRow.appendChild(topicSelect);

    // Frequency filter
    const freqSelect = el('select', { className: 'qbank-freq-select' });
    const freqOpts = [
      ['all', tr('qbank.allFreq', 'All Frequencies')],
      ['high', `${FREQ_LABELS.high} (High)`],
      ['medium', `${FREQ_LABELS.medium} (Medium)`],
      ['low', `${FREQ_LABELS.low} (Low)`],
      ['none', `${FREQ_LABELS.none} (None)`],
    ];
    for (const [val, label] of freqOpts) {
      freqSelect.appendChild(el('option', { value: val, selected: val === currentFreqFilter }, label));
    }
    freqSelect.addEventListener('change', () => { currentFreqFilter = freqSelect.value; renderList(); });
    filterRow.appendChild(freqSelect);

    // Difficulty filter
    const diffSelect = el('select', { className: 'qbank-diff-select' });
    const diffOpts = [
      ['all', tr('qbank.allDiff', 'All Difficulties')],
      ['1', `${DIFF_LABELS[1]}`],
      ['2', `${DIFF_LABELS[2]}`],
      ['3', `${DIFF_LABELS[3]}`],
      ['none', tr('qbank.noDiff', 'No Difficulty')],
    ];
    for (const [val, label] of diffOpts) {
      diffSelect.appendChild(el('option', { value: val, selected: val === currentDiffFilter }, label));
    }
    diffSelect.addEventListener('change', () => { currentDiffFilter = diffSelect.value; renderList(); });
    filterRow.appendChild(diffSelect);

    // Sort
    const sortSelect = el('select', { className: 'qbank-sort-select' });
    const sortOpts = [
      ['default', tr('qbank.sortDefault', 'Default Order')],
      ['diff-asc', tr('qbank.sortDiffAsc', 'Difficulty \u2191')],
      ['diff-desc', tr('qbank.sortDiffDesc', 'Difficulty \u2193')],
      ['acc-asc', tr('qbank.sortAccAsc', 'Accuracy \u2191')],
      ['acc-desc', tr('qbank.sortAccDesc', 'Accuracy \u2193')],
    ];
    for (const [val, label] of sortOpts) {
      sortSelect.appendChild(el('option', { value: val, selected: val === currentSort }, label));
    }
    sortSelect.addEventListener('change', () => { currentSort = sortSelect.value; renderList(); });
    filterRow.appendChild(sortSelect);

    function getFilteredQuestions() {
      let filtered = questions;
      if (currentTopic) filtered = filtered.filter(q => q.topic === currentTopic);
      if (currentFreqFilter !== 'all') {
        filtered = filtered.filter(q => FrequencyStore.get(q.id) === currentFreqFilter);
      }
      if (currentDiffFilter !== 'all') {
        if (currentDiffFilter === 'none') {
          filtered = filtered.filter(q => !q.difficulty);
        } else {
          const d = parseInt(currentDiffFilter);
          filtered = filtered.filter(q => q.difficulty === d);
        }
      }

      // Sort
      if (currentSort !== 'default') {
        filtered = [...filtered].sort((a, b) => {
          if (currentSort === 'diff-asc') return (a.difficulty || 0) - (b.difficulty || 0);
          if (currentSort === 'diff-desc') return (b.difficulty || 0) - (a.difficulty || 0);
          const accA = qStats[a.id] ? (qStats[a.id].correct / qStats[a.id].attempts) : -1;
          const accB = qStats[b.id] ? (qStats[b.id].correct / qStats[b.id].attempts) : -1;
          if (currentSort === 'acc-asc') return accA - accB;
          if (currentSort === 'acc-desc') return accB - accA;
          return 0;
        });
      }

      return filtered;
    }

    function renderList() {
      const filtered = getFilteredQuestions();

      // Stats
      const counts = FrequencyStore.getCounts(questions.map(q => q.id));
      statsRow.innerHTML = '';
      statsRow.appendChild(el('span', { className: 'qbank-stat' }, `${tr('qbank.total', 'Total')}: ${questions.length}`));
      statsRow.appendChild(el('span', { className: 'qbank-stat qbank-stat--success' }, `${FREQ_LABELS.high}: ${counts.high}`));
      statsRow.appendChild(el('span', { className: 'qbank-stat qbank-stat--warning' }, `${FREQ_LABELS.medium}: ${counts.medium}`));
      statsRow.appendChild(el('span', { className: 'qbank-stat qbank-stat--danger' }, `${FREQ_LABELS.low}: ${counts.low}`));
      statsRow.appendChild(el('span', { className: 'qbank-stat qbank-stat--muted' }, `${FREQ_LABELS.none}: ${counts.none}`));
      if (currentTopic || currentFreqFilter !== 'all' || currentDiffFilter !== 'all') {
        statsRow.appendChild(el('span', { className: 'qbank-stat' }, `${tr('qbank.showing', 'Showing')}: ${filtered.length}`));
      }

      // Bulk actions
      bulkRow.innerHTML = '';
      if (filtered.length > 0) {
        for (const level of FREQ_LEVELS) {
          const btn = el('button', {
            className: 'btn btn--sm btn--outline',
            title: `Set all ${filtered.length} shown questions to ${level}`,
          }, `${tr('qbank.setAll', 'Set All')} \u2192 ${FREQ_LABELS[level]}`);
          btn.addEventListener('click', () => {
            for (const q of filtered) FrequencyStore.set(q.id, level);
            showToast(`${filtered.length} questions \u2192 ${level}`, 'success');
            renderList();
          });
          bulkRow.appendChild(btn);
        }
      }

      // Question list
      listContainer.innerHTML = '';
      if (filtered.length === 0) {
        const emptyDiv = el('div', { className: 'empty-state' });
        const emptyText = el('div', { className: 'empty-state__text' });
        emptyText.appendChild(triText('qbank.noQuestions', 'No questions match the current filter.'));
        emptyDiv.appendChild(emptyText);
        listContainer.appendChild(emptyDiv);
        return;
      }

      for (let idx = 0; idx < filtered.length; idx++) {
        const q = filtered[idx];
        const stat = qStats[q.id];
        const accuracy = stat ? Math.round((stat.correct / stat.attempts) * 100) : null;
        const row = el('div', { className: 'qbank-row' });

        // Left side: question info (clickable → practice)
        const info = el('div', { className: 'qbank-row__info', style: 'cursor:pointer;' });
        const preview = q.question.length > 80 ? q.question.slice(0, 80) + '...' : q.question;
        info.appendChild(el('div', { className: 'qbank-row__question' }, preview));
        const meta = el('div', { className: 'qbank-row__meta' });
        meta.appendChild(el('span', { className: 'badge badge--sm' }, q.topic));
        if (accuracy !== null) {
          const accColor = accuracy >= 70 ? 'var(--c-success)' : accuracy >= 50 ? 'var(--c-warning)' : 'var(--c-danger)';
          meta.appendChild(el('span', { className: 'text-sm', style: `color:${accColor};` }, `${accuracy}% (${stat.attempts})`));
        }
        if (q.difficulty) {
          const d = q.difficulty;
          const color = DIFF_COLORS[d] || 'var(--c-text-secondary)';
          meta.appendChild(el('span', { className: 'text-sm', style: `color:${color};font-weight:600;` }, DIFF_LABELS[d] || `Lv${d}`));
        }
        info.appendChild(meta);

        // Click to practice this question
        info.addEventListener('click', () => {
          // Save return context so result screen can offer "Back to Question Bank"
          sessionStorage.setItem('sg_broker_qbank_return', JSON.stringify({
            module: currentModule,
            topic: currentTopic,
            // Store neighboring question IDs for "Next Question" option
            nextIds: filtered.slice(idx + 1, idx + 6).map(nq => nq.id),
          }));
          navigate(`#quiz?module=${currentModule}&mode=practice&review=${q.id}`);
        });

        row.appendChild(info);

        // Right side: frequency bar
        row.appendChild(createFrequencyBar(q.id));

        listContainer.appendChild(row);
      }
    }

    renderList();
  }

  await render();
});

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
