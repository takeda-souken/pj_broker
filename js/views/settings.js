/**
 * Settings view
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { showToast } from '../components/toast.js';
import { tr } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';

registerRoute('#settings', (app) => {
  const settings = SettingsStore.load();

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('result.home', 'Back')));
  app.appendChild(el('h1', { className: 'mt-md' }, tr('settings.title', 'Settings')));

  // Language Mode (segmented control)
  const langCard = el('div', { className: 'card' });
  langCard.appendChild(el('h3', {}, tr('settings.language', 'Language Mode')));
  langCard.appendChild(createSegControl([
    { value: 'ja', label: '\u65E5\u672C\u8A9E' },
    { value: 'bilingual', label: 'EN/JA' },
    { value: 'en', label: 'English' },
  ], settings.langMode || 'bilingual', (v) => {
    SettingsStore.set('langMode', v);
    window.dispatchEvent(new CustomEvent('lang-mode-changed', { detail: { mode: v } }));
    navigate('#settings');
  }));
  app.appendChild(langCard);

  // Study Mode (segmented control)
  const modeCard = el('div', { className: 'card' });
  modeCard.appendChild(el('h3', {}, tr('settings.studyMode', 'Study Mode')));
  modeCard.appendChild(createSegControl([
    { value: 'kataoka', label: tr('settings.kataokaMode', 'Kataoka Mode') },
    { value: 'standard', label: tr('settings.standardMode', 'Standard') },
  ], settings.mode, (v) => { SettingsStore.set('mode', v); }));
  modeCard.appendChild(el('div', { className: 'text-sm text-secondary mt-sm' },
    settings.mode === 'kataoka'
      ? tr('settings.kataokaDesc', 'Personal encouragement & Kataoka-san extras')
      : tr('settings.standardDesc', 'Standard study mode')));
  app.appendChild(modeCard);

  // Theme (segmented: auto / light / dark)
  const themeCard = el('div', { className: 'card' });
  themeCard.appendChild(el('h3', {}, tr('settings.theme', 'Theme')));
  themeCard.appendChild(createSegControl([
    { value: 'auto', label: tr('settings.themeAuto', 'Auto') },
    { value: 'light', label: tr('settings.themeLight', 'Light') },
    { value: 'dark', label: tr('settings.themeDark', 'Dark') },
  ], settings.theme || 'auto', (v) => {
    SettingsStore.set('theme', v);
    window.dispatchEvent(new Event('theme-changed'));
    navigate('#settings');
  }));
  if ((settings.theme || 'auto') === 'auto') {
    themeCard.appendChild(buildTimeRangeBar(settings));
  }
  app.appendChild(themeCard);

  // Quiz options
  const quizCard = el('div', { className: 'card' });
  quizCard.appendChild(el('h3', {}, tr('settings.quizOptions', 'Quiz Options')));
  quizCard.appendChild(createToggle(tr('settings.timer', 'Per-question timer'), settings.timerEnabled, (v) => SettingsStore.set('timerEnabled', v)));
  quizCard.appendChild(createToggle(tr('settings.timerDramatic', 'Timer dramatic effects'), settings.timerDramatic !== false, (v) => SettingsStore.set('timerDramatic', v)));
  quizCard.appendChild(createToggle(tr('settings.showExplanation', 'Show explanation after answer'), settings.showExplanation, (v) => SettingsStore.set('showExplanation', v)));
  quizCard.appendChild(createToggle(tr('settings.trivia', 'SG trivia between questions'), settings.triviaEnabled, (v) => SettingsStore.set('triviaEnabled', v)));
  quizCard.appendChild(createToggle(tr('settings.weakFocus', 'Weak focus (prioritize weak topics)'), settings.weakFocusEnabled !== false, (v) => SettingsStore.set('weakFocusEnabled', v)));
  quizCard.appendChild(createToggle(tr('settings.supporter', 'Sakura (virtual supporter)'), settings.supporterEnabled, (v) => SettingsStore.set('supporterEnabled', v)));
  app.appendChild(quizCard);

  // Home screen sections
  const homeCard = el('div', { className: 'card' });
  homeCard.appendChild(el('h3', {}, tr('settings.homeScreen', 'Home Screen')));
  homeCard.appendChild(createToggle(tr('settings.showXp', 'XP Bar'), settings.homeShowXp !== false, (v) => SettingsStore.set('homeShowXp', v)));
  homeCard.appendChild(createToggle(tr('settings.showGoal', 'Daily Goal'), settings.homeShowGoal !== false, (v) => SettingsStore.set('homeShowGoal', v)));
  homeCard.appendChild(createToggle(tr('settings.showStreak', 'Study Streak'), settings.homeShowStreak !== false, (v) => SettingsStore.set('homeShowStreak', v)));
  homeCard.appendChild(createToggle(tr('settings.showStats', 'Quick Stats'), settings.homeShowStats !== false, (v) => SettingsStore.set('homeShowStats', v)));
  homeCard.appendChild(createToggle(tr('settings.showCountdown', 'Exam Countdown'), settings.homeShowCountdown !== false, (v) => SettingsStore.set('homeShowCountdown', v)));
  homeCard.appendChild(createToggle(tr('settings.showTrivia', 'SG Trivia'), settings.homeShowTrivia !== false, (v) => SettingsStore.set('homeShowTrivia', v)));
  app.appendChild(homeCard);

  // Daily goal (#13)
  const goalCard = el('div', { className: 'card' });
  goalCard.appendChild(el('h3', {}, tr('settings.dailyGoal', 'Daily Goal')));
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
  app.appendChild(goalCard);

  // Achievements link (#31)
  app.appendChild(el('button', {
    className: 'btn btn--outline btn--block mt-md',
    onClick: () => navigate('#achievements'),
  }, `\uD83C\uDFC6 ${tr('settings.achievements', 'Achievements')}`));

  // Wrong answer journal link (#16)
  app.appendChild(el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => navigate('#journal'),
  }, `\uD83D\uDCD3 ${tr('settings.journal', 'Wrong Answer Journal')}`));

  // Data
  const dataCard = el('div', { className: 'card' });
  dataCard.appendChild(el('h3', {}, tr('settings.data', 'Data')));
  dataCard.appendChild(el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => {
      if (confirm(tr('settings.clearConfirm', 'Clear all study records? This cannot be undone.'))) {
        localStorage.removeItem('sg_broker_records');
        localStorage.removeItem('sg_broker_topic_stats');
        localStorage.removeItem('sg_broker_hawker');
        localStorage.removeItem('sg_broker_saved_session');
        localStorage.removeItem('sg_broker_game');
        showToast(tr('settings.cleared', 'Records cleared'), 'info');
      }
    },
  }, tr('settings.clearRecords', 'Clear All Records')));
  app.appendChild(dataCard);

  // About / Version History
  app.appendChild(el('button', {
    className: 'btn btn--outline btn--block mt-md',
    onClick: () => navigate('#about'),
  }, tr('settings.about', 'About / Version History')));
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
  wrap.appendChild(barWrap);

  // Hour ticks
  const ticks = el('div', { className: 'time-range__ticks' });
  for (const h of [0, 6, 12, 18, 24]) {
    const tick = el('span', { className: 'time-range__tick' }, h === 24 ? '0' : String(h));
    tick.style.left = `${(h / 24) * 100}%`;
    ticks.appendChild(tick);
  }
  wrap.appendChild(ticks);

  // Sliders (dual range)
  const sliderRow = el('div', { className: 'time-range__sliders' });
  const startSlider = el('input', { type: 'range', min: '0', max: '23', step: '1', className: 'time-range__input' });
  startSlider.value = lightStart;
  const endSlider = el('input', { type: 'range', min: '1', max: '24', step: '1', className: 'time-range__input' });
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

  sliderRow.appendChild(startSlider);
  sliderRow.appendChild(endSlider);
  wrap.appendChild(sliderRow);

  return wrap;
}

function formatHour(h) {
  if (h === 0 || h === 24) return '0:00';
  return `${h}:00`;
}

function createToggle(label, value, onChange) {
  const row = el('label', { className: 'toggle-row' });
  row.appendChild(el('span', { className: 'text-sm' }, label));
  const input = el('input', { type: 'checkbox' });
  input.checked = value;
  input.addEventListener('change', () => onChange(input.checked));
  row.appendChild(input);
  return row;
}
