/**
 * Sakura Room Store — persists conversation state to localStorage
 * Tracks: completed conversations, flags, warmth/honesty axes, nickname
 */
import { DebugStore } from './debug-store.js';

const STORAGE_KEY = 'sg_broker_sakura_room';

const DEFAULTS = {
  completedConversations: [],  // array of conversation IDs
  flags: {},                    // { flag_name: value }
  axes: { warmth: 0, honesty: 0 },
  roomUnlockDate: null,         // ISO date string when room was first unlocked
  totalRoomConversations: 0,
  sakuraDisabled: false,        // true after a17 farewell
};

export class SakuraRoomStore {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  }

  static save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  static get(key) {
    return this.load()[key];
  }

  static set(key, value) {
    const s = this.load();
    s[key] = value;
    this.save(s);
  }

  static completeConversation(convId) {
    const s = this.load();
    if (!s.completedConversations.includes(convId)) {
      s.completedConversations.push(convId);
      s.totalRoomConversations++;
    }
    this.save(s);
  }

  static isCompleted(convId) {
    return this.load().completedConversations.includes(convId);
  }

  static setFlag(name, value) {
    const s = this.load();
    s.flags[name] = value;
    this.save(s);
  }

  static getFlag(name) {
    return this.load().flags[name];
  }

  static addAxes(axes) {
    if (!axes) return;
    const s = this.load();
    for (const [key, val] of Object.entries(axes)) {
      s.axes[key] = (s.axes[key] || 0) + val;
    }
    this.save(s);
  }

  static initRoomUnlock() {
    const s = this.load();
    if (!s.roomUnlockDate) {
      s.roomUnlockDate = DebugStore.today();
      this.save(s);
    }
  }

  static daysSinceUnlock() {
    const s = this.load();
    if (!s.roomUnlockDate) return 0;
    const now = DebugStore.now();
    const unlock = new Date(s.roomUnlockDate + 'T00:00:00');
    return Math.floor((now - unlock) / (1000 * 60 * 60 * 24));
  }

  static disableSakura() {
    this.set('sakuraDisabled', true);
  }
}
