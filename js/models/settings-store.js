/**
 * Settings Store — persists user preferences to localStorage
 */
const STORAGE_KEY = 'sg_broker_settings';

const DEFAULTS = {
  mode: 'kataoka',          // 'kataoka' (personal encouragement + extras) or 'standard'
  theme: 'light',           // 'light' or 'dark'
  timerEnabled: true,
  timerDramatic: true,    // Timer bar color transitions (warning/danger). OFF = calm bar
  showExplanation: true,
  langMode: 'bilingual',    // 'ja' (JP UI, EN questions), 'en' (EN only), 'bilingual' (EN + small JP)
  triviaEnabled: true,      // Show SG trivia between questions
  weakFocusEnabled: true,   // Bias practice questions toward weak topics
  supporterEnabled: false,  // Virtual supporter character (Hakata dialect)
  // Home screen section visibility
  homeShowXp: true,
  homeShowGoal: true,
  homeShowStreak: true,
  homeShowStats: true,
  homeShowCountdown: true,
  homeShowTrivia: true,
};

export class SettingsStore {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
      // Migrate old showJpComparison boolean → langMode
      if ('showJpComparison' in s && !raw?.includes('langMode')) {
        s.langMode = s.showJpComparison ? 'bilingual' : 'en';
        delete s.showJpComparison;
        this.save(s);
      }
      return s;
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
