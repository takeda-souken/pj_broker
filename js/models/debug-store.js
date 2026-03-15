/**
 * Debug Store — debug mode settings (localStorage)
 * Only active on localhost. Completely invisible to production users.
 */
const DEBUG_KEY = 'sg_broker_debug';

export class DebugStore {
  /** True if running on localhost (dev environment) */
  static isLocal() {
    const h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '';
  }

  static _defaults() {
    return {
      enabled: false,          // master debug toggle
      autoMode: false,         // auto-answer correct + advance
      autoSpeed: 500,          // ms between auto-answers (500/1000/2000)
      autoCorrectRate: 100,    // % chance of picking correct answer (70 = 70%)
      virtualDate: '',         // 'YYYY-MM-DD' or '' for real date
      sakuraPhaseOverride: 0,  // 0 = auto, 1/2/3 = forced
      gasSyncDisabled: true,   // block GAS sends in debug (default ON)
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(DEBUG_KEY);
      return raw ? { ...this._defaults(), ...JSON.parse(raw) } : this._defaults();
    } catch { return this._defaults(); }
  }

  static save(d) {
    localStorage.setItem(DEBUG_KEY, JSON.stringify(d));
    window.dispatchEvent(new CustomEvent('debug-changed', { detail: d }));
  }

  static get(key) {
    return this.load()[key];
  }

  static set(key, value) {
    const d = this.load();
    d[key] = value;
    this.save(d);
  }

  /** Is debug mode currently active? (must be local + enabled) */
  static isActive() {
    return this.isLocal() && this.load().enabled;
  }

  // ─── Virtual date ──────────────────────────────
  /**
   * Returns a Date object — virtual date if set, otherwise real now.
   * Use this everywhere instead of `new Date()` for date-sensitive features.
   */
  static now() {
    if (this.isActive()) {
      const vd = this.load().virtualDate;
      if (vd) {
        const real = new Date();
        const virtual = new Date(vd + 'T00:00:00');
        virtual.setHours(real.getHours(), real.getMinutes(), real.getSeconds(), real.getMilliseconds());
        return virtual;
      }
    }
    return new Date();
  }

  /** Returns ISO date string (YYYY-MM-DD) for today, respecting virtual date */
  static today() {
    return this.now().toISOString().slice(0, 10);
  }

  // ─── Gamification direct edit ──────────────────
  static setGameField(key, value) {
    const GAME_KEY = 'sg_broker_game';
    try {
      const g = JSON.parse(localStorage.getItem(GAME_KEY) || '{}');
      g[key] = value;
      localStorage.setItem(GAME_KEY, JSON.stringify(g));
    } catch { /* ignore */ }
  }

  // ─── Correct count edit ────────────────────────
  static getUniqueCorrectCounts() {
    try {
      const records = JSON.parse(localStorage.getItem('sg_broker_records') || '[]');
      const modules = ['bcp', 'comgi', 'pgi', 'hi'];
      const counts = {};
      for (const m of modules) {
        const ids = new Set();
        for (const r of records) {
          if (r.module === m && r.isCorrect) ids.add(r.questionId);
        }
        counts[m] = ids.size;
      }
      return counts;
    } catch { return { bcp: 0, comgi: 0, pgi: 0, hi: 0 }; }
  }

  // ─── localStorage viewer ──────────────────────
  static getLocalStorageKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('sg_broker_')) {
        try {
          const v = localStorage.getItem(k);
          keys.push({ key: k, size: v.length, preview: v.slice(0, 80) });
        } catch { /* skip */ }
      }
    }
    return keys.sort((a, b) => a.key.localeCompare(b.key));
  }

  static clearLocalStorageKey(key) {
    localStorage.removeItem(key);
  }
}
