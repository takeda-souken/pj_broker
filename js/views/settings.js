/**
 * Settings view
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { showToast } from '../components/toast.js';
import { tr, triText } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';
import { DebugStore } from '../models/debug-store.js';

registerRoute('#settings', (app) => {
  const settings = SettingsStore.load();

  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.appendChild(document.createTextNode('\u25C0 '));
  backBtn.appendChild(triText('result.home', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-sm' });
  h1.appendChild(triText('settings.title', 'Settings'));
  app.appendChild(h1);

  // ─── Settings grid (2-column on desktop) ───
  const grid = el('div', { className: 'settings-grid' });

  // Language Mode (segmented control)
  const langCard = el('div', { className: 'card' });
  const langH3 = el('h3', {});
  langH3.appendChild(triText('settings.language', 'Language Mode'));
  langCard.appendChild(langH3);
  langCard.appendChild(createSegControl([
    { value: 'ja', label: '\u65E5\u672C\u8A9E' },
    { value: 'bilingual', label: 'EN/JA' },
    { value: 'en', label: 'English' },
  ], settings.langMode || 'bilingual', (v) => {
    SettingsStore.set('langMode', v);
    document.documentElement.setAttribute('data-lang', v);
    window.dispatchEvent(new CustomEvent('lang-mode-changed', { detail: { mode: v } }));
  }));
  grid.appendChild(langCard);

  // Theme (segmented: auto / light / dark)
  const themeCard = el('div', { className: 'card' });
  const themeH3 = el('h3', {});
  themeH3.appendChild(triText('settings.theme', 'Theme'));
  themeCard.appendChild(themeH3);
  themeCard.appendChild(createSegControl([
    { value: 'auto', label: tr('settings.themeAuto', 'Auto') },
    { value: 'light', label: tr('settings.themeLight', 'Light') },
    { value: 'dark', label: tr('settings.themeDark', 'Dark') },
  ], settings.theme || 'auto', (v) => {
    SettingsStore.set('theme', v);
    window.dispatchEvent(new Event('theme-changed'));
  }));
  if ((settings.theme || 'auto') === 'auto') {
    themeCard.appendChild(buildTimeRangeBar(settings));
  }
  grid.appendChild(themeCard);

  // Quiz options
  const quizCard = el('div', { className: 'card' });
  const quizH3 = el('h3', {});
  quizH3.appendChild(triText('settings.quizOptions', 'Quiz Options'));
  quizCard.appendChild(quizH3);
  quizCard.appendChild(createToggle(triText('settings.timer', 'Per-question timer'), settings.timerEnabled, (v) => SettingsStore.set('timerEnabled', v)));
  quizCard.appendChild(createToggle(triText('settings.timerDramatic', 'Timer dramatic effects'), settings.timerDramatic !== false, (v) => SettingsStore.set('timerDramatic', v)));
  quizCard.appendChild(createToggle(triText('settings.showExplanation', 'Show explanation after answer'), settings.showExplanation, (v) => SettingsStore.set('showExplanation', v)));
  quizCard.appendChild(createToggle(triText('settings.trivia', 'SG trivia between questions'), settings.triviaEnabled, (v) => SettingsStore.set('triviaEnabled', v)));
  quizCard.appendChild(createToggle(triText('settings.weakFocus', 'Weak focus (prioritize weak topics)'), settings.weakFocusEnabled !== false, (v) => SettingsStore.set('weakFocusEnabled', v)));
  grid.appendChild(quizCard);

  // Mock exam options
  const mockCard = el('div', { className: 'card' });
  const mockH3 = el('h3', {});
  mockH3.appendChild(triText('settings.mockExam', 'Mock Exam'));
  mockCard.appendChild(mockH3);
  const mockDesc = el('div', { className: 'text-sm text-secondary', style: 'margin-bottom:8px;' });
  mockDesc.appendChild(triText('settings.mockExamDesc', 'Default: all OFF (matches real CSE exam — no per-question feedback)'));
  mockCard.appendChild(mockDesc);
  mockCard.appendChild(createToggle(triText('settings.mockShowResult', 'Show correct/incorrect per question'), settings.mockShowResult, (v) => SettingsStore.set('mockShowResult', v)));
  mockCard.appendChild(createToggle(triText('settings.mockShowExplanation', 'Show explanation per question'), settings.mockShowExplanation, (v) => SettingsStore.set('mockShowExplanation', v)));
  mockCard.appendChild(createToggle(triText('settings.mockShowEffects', 'Show mastery celebrations'), settings.mockShowEffects, (v) => SettingsStore.set('mockShowEffects', v)));
  grid.appendChild(mockCard);

  // Home screen sections
  const homeCard = el('div', { className: 'card' });
  const homeH3 = el('h3', {});
  homeH3.appendChild(triText('settings.homeScreen', 'Home Screen'));
  homeCard.appendChild(homeH3);
  homeCard.appendChild(createToggle(triText('settings.showXp', 'XP Bar'), settings.homeShowXp !== false, (v) => SettingsStore.set('homeShowXp', v)));
  homeCard.appendChild(createToggle(triText('settings.showGoal', 'Daily Goal'), settings.homeShowGoal !== false, (v) => SettingsStore.set('homeShowGoal', v)));
  homeCard.appendChild(createToggle(triText('settings.showStats', 'Quick Stats'), settings.homeShowStats !== false, (v) => SettingsStore.set('homeShowStats', v)));
  homeCard.appendChild(createToggle(triText('settings.showCountdown', 'Exam Countdown'), settings.homeShowCountdown !== false, (v) => SettingsStore.set('homeShowCountdown', v)));
  homeCard.appendChild(createToggle(triText('settings.showTrivia', 'SG Trivia'), settings.homeShowTrivia !== false, (v) => SettingsStore.set('homeShowTrivia', v)));
  grid.appendChild(homeCard);

  // Exam date
  const examCard = el('div', { className: 'card' });
  const examH3 = el('h3', {});
  examH3.appendChild(triText('settings.examDate', 'Exam Date'));
  examCard.appendChild(examH3);
  const examInput = el('input', { type: 'date', className: 'search-box mt-sm' });
  examInput.value = settings.examDate || '';
  examInput.addEventListener('change', () => {
    SettingsStore.set('examDate', examInput.value);
    showToast(tr('settings.examDateUpdated', 'Exam date updated'), 'success');
  });
  examCard.appendChild(examInput);
  if (settings.examDate) {
    const d = new Date(settings.examDate + 'T00:00:00');
    const now = DebugStore.now();
    const days = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (days > 0) {
      const daysEl = el('div', { className: 'text-sm text-secondary mt-sm' });
      daysEl.appendChild(triText('settings.examDaysLeft', `${days} days until exam`, days));
      examCard.appendChild(daysEl);
    } else if (days === 0) {
      const todayEl = el('div', { className: 'text-sm mt-sm', style: 'color:var(--c-warning);font-weight:700;' });
      todayEl.appendChild(triText('settings.examToday', 'Today is exam day! Good luck!'));
      examCard.appendChild(todayEl);
    }
  } else {
    const hintEl = el('div', { className: 'text-sm text-secondary mt-sm' });
    hintEl.appendChild(triText('settings.examDateHint', 'Set your exam date for countdown & special messages'));
    examCard.appendChild(hintEl);
  }
  grid.appendChild(examCard);

  // Extra modules (PGI & HI)
  const extraCard = el('div', { className: 'card' });
  const extraH3 = el('h3', {});
  extraH3.appendChild(triText('settings.extraModules', 'Extra Modules'));
  extraCard.appendChild(extraH3);
  extraCard.appendChild(createToggle(triText('settings.extraModulesToggle', 'PGI & HI modules'), settings.extraModules, (v) => SettingsStore.set('extraModules', v)));
  const extraDesc = el('div', { className: 'text-sm text-secondary mt-sm' });
  extraDesc.appendChild(triText('settings.extraModulesDesc', 'Show Personal General Insurance & Health Insurance modules'));
  extraCard.appendChild(extraDesc);
  grid.appendChild(extraCard);

  // Daily goal (#13)
  const goalCard = el('div', { className: 'card' });
  const goalH3 = el('h3', {});
  goalH3.appendChild(triText('settings.dailyGoal', 'Daily Goal'));
  goalCard.appendChild(goalH3);
  const gameData = GamificationStore.load();
  goalCard.appendChild(createSelect('dailyGoal', [
    { value: '10', label: tr('settings.goal10', '10 questions/day') },
    { value: '20', label: tr('settings.goal20', '20 questions/day') },
    { value: '30', label: tr('settings.goal30', '30 questions/day') },
    { value: '50', label: tr('settings.goal50', '50 questions/day') },
    { value: '0', label: tr('settings.goalOff', 'Off') },
  ], (gameData.dailyGoal || 20).toString(), (v) => {
    GamificationStore.setDailyGoal(parseInt(v));
    showToast(tr('settings.goalUpdated', 'Daily goal updated'), 'success');
  }));
  grid.appendChild(goalCard);

  app.appendChild(grid);

  // ─── Full-width action buttons (below the grid) ───

  // Wrong answer journal link (#16)
  const journalBtn = el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => navigate('#journal'),
  });
  journalBtn.appendChild(document.createTextNode('\uD83D\uDCD3 '));
  journalBtn.appendChild(triText('settings.journal', 'Wrong Answer Journal'));
  app.appendChild(journalBtn);

  // Clear All Records (no wrapper card)
  const clearBtn = el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => {
      if (!confirm(tr('settings.clearConfirm', 'Clear all study records? This cannot be undone.'))) return;
      if (!confirm('ちょ、ちょっと待って！！ほんっとに全部消すと！？\nホーカーもMRTもXPも全部なくなるっちゃけど！？\n……ほんなこつ、よかと？')) return;
      localStorage.removeItem('sg_broker_records');
      localStorage.removeItem('sg_broker_topic_stats');
      localStorage.removeItem('sg_broker_hawker');
      localStorage.removeItem('sg_broker_saved_session');
      localStorage.removeItem('sg_broker_game');
      showToast(tr('settings.cleared', 'Records cleared'), 'info');
    },
  });
  clearBtn.appendChild(triText('settings.clearRecords', 'Clear All Records'));
  app.appendChild(clearBtn);

  // About / Version History
  const aboutBtn = el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => navigate('#about'),
  });
  aboutBtn.appendChild(triText('settings.about', 'About / Version History'));
  app.appendChild(aboutBtn);
});

function createSegControl(options, current, onChange) {
  const seg = el('div', { className: 'seg-control mt-sm' });
  for (const opt of options) {
    const btn = el('button', {
      className: 'seg-control__item' + (opt.value === current ? ' seg-control__item--active' : ''),
      onClick: () => {
        seg.querySelectorAll('.seg-control__item').forEach(b => b.classList.remove('seg-control__item--active'));
        btn.classList.add('seg-control__item--active');
        onChange(opt.value);
      },
    }, opt.label);
    seg.appendChild(btn);
  }
  return seg;
}

function createSelect(name, options, current, onChange) {
  const select = el('select', { className: 'search-box mt-sm', name });
  for (const opt of options) {
    const option = el('option', { value: opt.value }, opt.label);
    if (opt.value === current) option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener('change', () => onChange(select.value));
  return select;
}

function buildTimeRangeBar(settings) {
  const lightStart = settings.themeLightStart ?? 6;
  const lightEnd = settings.themeLightEnd ?? 17;

  const wrap = el('div', { className: 'time-range mt-sm' });

  // Label
  const label = el('div', { className: 'text-sm text-secondary', style: 'margin-bottom:8px;' });
  const updateLabel = (s, e) => {
    label.textContent = `${formatHour(s)} - ${formatHour(e)}`;
  };
  updateLabel(lightStart, lightEnd);
  wrap.appendChild(label);

  // Track container (bar + sliders overlaid)
  const track = el('div', { className: 'time-range__track' });

  // Visual bar
  const barWrap = el('div', { className: 'time-range__bar' });
  const darkLeft = el('div', { className: 'time-range__dark' });
  const lightZone = el('div', { className: 'time-range__light' });
  const darkRight = el('div', { className: 'time-range__dark' });

  const updateBar = (s, e) => {
    const sp = (s / 24) * 100;
    const ep = (e / 24) * 100;
    darkLeft.style.width = `${sp}%`;
    lightZone.style.width = `${ep - sp}%`;
    darkRight.style.width = `${100 - ep}%`;
  };
  updateBar(lightStart, lightEnd);

  barWrap.appendChild(darkLeft);
  barWrap.appendChild(lightZone);
  barWrap.appendChild(darkRight);
  track.appendChild(barWrap);

  // Sliders (overlaid on bar)
  const startSlider = el('input', { type: 'range', min: '0', max: '24', step: '1', className: 'time-range__input time-range__input--dawn' });
  startSlider.value = lightStart;
  const endSlider = el('input', { type: 'range', min: '0', max: '24', step: '1', className: 'time-range__input time-range__input--dusk' });
  endSlider.value = lightEnd;

  startSlider.addEventListener('input', () => {
    let s = parseInt(startSlider.value);
    let e = parseInt(endSlider.value);
    if (s >= e) { s = e - 1; startSlider.value = s; }
    updateBar(s, e);
    updateLabel(s, e);
  });
  startSlider.addEventListener('change', () => {
    SettingsStore.set('themeLightStart', parseInt(startSlider.value));
    window.dispatchEvent(new Event('theme-changed'));
  });
  endSlider.addEventListener('input', () => {
    let s = parseInt(startSlider.value);
    let e = parseInt(endSlider.value);
    if (e <= s) { e = s + 1; endSlider.value = e; }
    updateBar(s, e);
    updateLabel(s, e);
  });
  endSlider.addEventListener('change', () => {
    SettingsStore.set('themeLightEnd', parseInt(endSlider.value));
    window.dispatchEvent(new Event('theme-changed'));
  });

  track.appendChild(startSlider);
  track.appendChild(endSlider);
  wrap.appendChild(track);

  // Hour ticks
  const ticks = el('div', { className: 'time-range__ticks' });
  for (const h of [0, 6, 12, 18, 24]) {
    const tick = el('span', { className: 'time-range__tick' }, h === 24 ? '0' : String(h));
    tick.style.left = `${(h / 24) * 100}%`;
    ticks.appendChild(tick);
  }
  wrap.appendChild(ticks);

  return wrap;
}

function formatHour(h) {
  if (h === 0 || h === 24) return '0:00';
  return `${h}:00`;
}

function createToggle(label, value, onChange) {
  const row = el('label', { className: 'toggle-row' });
  const span = el('span', { className: 'text-sm' });
  if (label instanceof DocumentFragment || label instanceof Node) {
    span.appendChild(label);
  } else {
    span.textContent = label;
  }
  row.appendChild(span);
  const input = el('input', { type: 'checkbox' });
  input.checked = value;
  input.addEventListener('change', () => onChange(input.checked));
  row.appendChild(input);
  return row;
}
