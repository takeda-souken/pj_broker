/**
 * SG Broker Exam — Main Entry Point
 */
import { initRouter } from './router.js';
import { SettingsStore } from './models/settings-store.js';
import { RecordStore } from './models/record-store.js';
import { showToast } from './components/toast.js';

// Apply saved theme
const settings = SettingsStore.load();
if (settings.theme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Boot
initRouter();
