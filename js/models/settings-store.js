/**
 * Settings Store — persists user preferences to localStorage
 */
const STORAGE_KEY = 'sg_broker_settings';

const DEFAULTS = {
  mode: 'kataoka',          // 'kataoka' (JP comparison) or 'standard' (EN only)
  theme: 'light',           // 'light' or 'dark'
  timerEnabled: true,
  showExplanation: true,
  showJpComparison: true,   // Only effective in kataoka mode
  triviaEnabled: true,      // Show SG trivia between questions
  userName: '',
};

export class SettingsStore {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  }

  static save(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  static get(key) {
    return this.load()[key];
  }

  static set(key, value) {
    const s = this.load();
    s[key] = value;
    this.save(s);
  }

  static isKataokaMode() {
    return this.load().mode === 'kataoka';
  }
}
