/**
 * Settings view
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { showToast } from '../components/toast.js';

registerRoute('#settings', (app) => {
  const settings = SettingsStore.load();

  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'Settings'));

  // Study Mode
  const modeCard = el('div', { className: 'card' });
  modeCard.appendChild(el('h3', {}, 'Study Mode'));
  modeCard.appendChild(createSelect('mode', [
    { value: 'kataoka', label: 'Kataoka Mode (JP comparison)' },
    { value: 'standard', label: 'Standard (English only)' },
  ], settings.mode, (v) => { SettingsStore.set('mode', v); }));
  app.appendChild(modeCard);

  // Theme
  const themeCard = el('div', { className: 'card' });
  themeCard.appendChild(el('h3', {}, 'Theme'));
  themeCard.appendChild(createSelect('theme', [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ], settings.theme, (v) => {
    SettingsStore.set('theme', v);
    document.documentElement.setAttribute('data-theme', v === 'dark' ? 'dark' : '');
  }));
  app.appendChild(themeCard);

  // Quiz options
  const quizCard = el('div', { className: 'card' });
  quizCard.appendChild(el('h3', {}, 'Quiz Options'));
  quizCard.appendChild(createToggle('Per-question timer', settings.timerEnabled, (v) => SettingsStore.set('timerEnabled', v)));
  quizCard.appendChild(createToggle('Show explanation after answer', settings.showExplanation, (v) => SettingsStore.set('showExplanation', v)));
  quizCard.appendChild(createToggle('Show JP comparison (Kataoka mode)', settings.showJpComparison, (v) => SettingsStore.set('showJpComparison', v)));
  quizCard.appendChild(createToggle('Show SG trivia', settings.triviaEnabled, (v) => SettingsStore.set('triviaEnabled', v)));
  app.appendChild(quizCard);

  // User
  const userCard = el('div', { className: 'card' });
  userCard.appendChild(el('h3', {}, 'User'));
  const nameInput = el('input', {
    className: 'search-box',
    type: 'text',
    placeholder: 'Your name',
    value: settings.userName,
  });
  nameInput.addEventListener('change', () => SettingsStore.set('userName', nameInput.value.trim()));
  userCard.appendChild(nameInput);
  app.appendChild(userCard);

  // Data
  const dataCard = el('div', { className: 'card' });
  dataCard.appendChild(el('h3', {}, 'Data'));
  dataCard.appendChild(el('button', {
    className: 'btn btn--outline btn--block mt-sm',
    onClick: () => {
      if (confirm('Clear all study records? This cannot be undone.')) {
        localStorage.removeItem('sg_broker_records');
        localStorage.removeItem('sg_broker_topic_stats');
        localStorage.removeItem('sg_broker_hawker');
        localStorage.removeItem('sg_broker_saved_session');
        showToast('Records cleared', 'info');
      }
    },
  }, 'Clear All Records'));
  app.appendChild(dataCard);
});

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

function createToggle(label, value, onChange) {
  const row = el('label', { className: 'flex-row', style: 'justify-content:space-between;padding:8px 0;cursor:pointer;' });
  row.appendChild(el('span', { className: 'text-sm' }, label));
  const input = el('input', { type: 'checkbox' });
  input.checked = value;
  input.addEventListener('change', () => onChange(input.checked));
  row.appendChild(input);
  return row;
}
