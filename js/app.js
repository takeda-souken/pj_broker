/**
 * SG Broker Exam — Main Entry Point
 */
import { initRouter } from './router.js';
import { SettingsStore } from './models/settings-store.js';
import { RecordStore } from './models/record-store.js';
import { showToast } from './components/toast.js';
import { initJpToggle } from './components/jp-toggle.js';
import { initCityscape } from './components/cityscape.js';
import { sendFeedback, gasFlushQueue } from './utils/gas-client.js';
import { DebugStore } from './models/debug-store.js';

// Apply language attribute for CSS-based i18n
import { getLangMode } from './utils/i18n.js';
document.documentElement.setAttribute('data-lang', getLangMode());
window.addEventListener('lang-mode-changed', (e) => {
  document.documentElement.setAttribute('data-lang', e.detail?.mode || getLangMode());
});

// Apply theme (auto / light / dark)
applyTheme();
setInterval(applyTheme, 60_000); // re-check every minute for auto mode
window.addEventListener('theme-changed', applyTheme);

function applyTheme() {
  const settings = SettingsStore.load();
  const theme = settings.theme || 'auto';
  let dark;
  if (theme === 'auto') {
    const h = DebugStore.now().getHours();
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

// Sync indicator (below JP toggle)
import { initSyncIndicator } from './components/sync-indicator.js';
initSyncIndicator();

// Animated cityscape background
initCityscape();

// Archive old records (#25)
RecordStore.archiveOldRecords(90);

// Feedback FAB (#30)
initFeedbackButton();

// Flush any queued GAS data
gasFlushQueue();

// Cross-device sync: fetch latest snapshot from GAS and merge
import { fetchAndMergeSnapshot } from './utils/sync-engine.js';
fetchAndMergeSnapshot().then((merged) => {
  if (merged) {
    // Re-apply theme/lang in case settings were updated from remote
    applyTheme();
    const newLang = getLangMode();
    document.documentElement.setAttribute('data-lang', newLang);
  }
}).catch(() => {});

// Debug panel (localhost only — invisible in production)
import('./views/debug-panel.js').then(({ initDebugFab }) => initDebugFab()).catch(() => {});

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
              // Send to GAS (queues if URL not set)
              sendFeedback({ message: text });
              showToast('Feedback sent! Thank you.', 'success');
            },
          },
        ],
      });
    });
  });
  document.body.appendChild(btn);
}
