/**
 * Frequency Store — per-question出題頻度の管理
 *
 * 各問題に対して high / medium / low / none の4段階を設定。
 * - high (default): 通常通り出題
 * - medium: 出題確率を下げる（重み 0.5）
 * - low: さらに低い確率（重み 0.2）
 * - none: 出題しない（重み 0）
 */
const STORAGE_KEY = 'sg_broker_frequency';

const VALID_LEVELS = ['high', 'medium', 'low', 'none'];
const DEFAULT_LEVEL = 'high';

/** Weight multipliers for question selection */
export const FREQUENCY_WEIGHTS = {
  high: 1.0,
  medium: 0.5,
  low: 0.2,
  none: 0,
};

export class FrequencyStore {
  static _cache = null;

  static _load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._cache = raw ? JSON.parse(raw) : {};
    } catch {
      this._cache = {};
    }
    return this._cache;
  }

  static _save(data) {
    this._cache = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /** Get frequency level for a question (returns DEFAULT_LEVEL if unset) */
  static get(questionId) {
    const data = this._load();
    return data[questionId] || DEFAULT_LEVEL;
  }

  /** Set frequency level for a question */
  static set(questionId, level) {
    if (!VALID_LEVELS.includes(level)) return;
    const data = this._load();
    if (level === DEFAULT_LEVEL) {
      delete data[questionId]; // don't store defaults
    } else {
      data[questionId] = level;
    }
    this._save(data);
  }

  /** Get all overrides (non-default entries) */
  static getAll() {
    return { ...this._load() };
  }

  /** Get counts per level for a set of question IDs */
  static getCounts(questionIds) {
    const data = this._load();
    const counts = { high: 0, medium: 0, low: 0, none: 0 };
    for (const id of questionIds) {
      const level = data[id] || DEFAULT_LEVEL;
      counts[level]++;
    }
    return counts;
  }

  /** Get weight for a question */
  static getWeight(questionId) {
    return FREQUENCY_WEIGHTS[this.get(questionId)];
  }

  /** Reset all frequencies back to default */
  static resetAll() {
    this._cache = {};
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Reset frequencies for a specific module prefix (e.g. 'bcp') */
  static resetModule(modulePrefix) {
    const data = this._load();
    const prefix = modulePrefix + '_';
    for (const key of Object.keys(data)) {
      if (key.startsWith(prefix)) delete data[key];
    }
    this._save(data);
  }

  /** Invalidate cache (call if localStorage was modified externally) */
  static invalidate() {
    this._cache = null;
  }
}
