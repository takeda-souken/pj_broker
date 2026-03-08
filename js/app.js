/**
 * SG Broker Exam — Main Entry Point
 */
import { initRouter } from './router.js';
import { SettingsStore } from './models/settings-store.js';
import { RecordStore } from './models/record-store.js';
import { showToast } from './components/toast.js';
import { initJpToggle } from './components/jp-toggle.js';
import { initCityscape } from './components/cityscape.js';

// Apply theme (auto / light / dark)
applyTheme();
setInterval(applyTheme, 60_000); // re-check every minute for auto mode
window.addEventListener('theme-changed', applyTheme);

function applyTheme() {
  const settings = SettingsStore.load();
  const theme = settings.theme || 'auto';
  let dark;
  if (theme === 'auto') {
    const h = new Date().getHours();
    const start = settings.themeLightStart ?? 6;
    const end = settings.themeLightEnd ?? 17;
    dark = h < start || h >= end;
  } else {
    dark = theme === 'dark';
  }
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
}

// JP toggle
initJpToggle();

// Animated cityscape background
initCityscape();

// Archive old records (#25)
RecordStore.archiveOldRecords(90);

// Feedback FAB (#30)
initFeedbackButton();

// Boot
initRouter();

function initFeedbackButton() {
  const btn = document.createElement('button');
  btn.className = 'feedback-fab';
  btn.textContent = '\u2709';
  btn.title = 'Report an issue';
  btn.addEventListener('click', () => {
    import('./components/modal.js').then(({ showModal }) => {
      const body = document.createElement('div');
      const textarea = document.createElement('textarea');
      textarea.className = 'search-box';
      textarea.rows = 4;
      textarea.placeholder = 'Describe the issue or suggestion...';
      textarea.style.resize = 'vertical';
      body.appendChild(textarea);

      showModal({
        title: 'Report Issue / Feedback',
        body,
        actions: [
          { label: 'Cancel', cls: 'btn btn--outline' },
          {
            label: 'Send',
            cls: 'btn btn--primary',
            handler: () => {
              const text = textarea.value.trim();
              if (!text) return;
              // Store feedback in localStorage for now
              const feedback = JSON.parse(localStorage.getItem('sg_broker_feedback') || '[]');
              feedback.push({ text, timestamp: new Date().toISOString() });
              localStorage.setItem('sg_broker_feedback', JSON.stringify(feedback));
              showToast('Feedback saved! Thank you.', 'success');
            },
          },
        ],
      });
    });
  });
  document.body.appendChild(btn);
}
