/**
 * Sakura State — unified phase management (single source of truth)
 *
 * Design doc: docs/sakura-character-sheet.md §技術実装メモ
 *
 * Phases:
 *   japan            (0–49問)   標準語。業務的な距離感
 *   sg               (50問–)   博多弁が滲む。距離が近くなる
 *   post_confession  (200問 AND 直近20問正答率60%+) タメ口・博多弁全開
 *   farewell         (Mock 70%+) 最後の会話
 *   gone             (farewell モーダル完了) さくら消滅
 *
 * Message pool mapping:
 *   japan            → PHASE1
 *   sg               → PHASE2
 *   post_confession  → PHASE3
 *   farewell         → PHASE3
 *   gone             → null (no messages)
 */
import { DebugStore } from './debug-store.js';

const STORAGE_KEY = 'sg_broker_sakura';
const RECORDS_KEY = 'sg_broker_records';

// Transition thresholds
const SG_THRESHOLD = 50;
const CONFESSION_THRESHOLD = 200;
const CONFESSION_ACCURACY = 0.6;   // 60% of last 20
const CONFESSION_WINDOW = 20;
const FAREWELL_ACCURACY = 70;      // mock exam %

const DEFAULTS = {
  phase: 'japan',
  answeredAtPhase2Start: 0,    // records.length when japan→sg fired
  phase2StartedAt: null,       // ISO timestamp of japan→sg
  phaseEvents: {
    sg_arrival: false,
    confession: false,
    farewell: false,
  },
  farewellLetter: null,
};

// Session-level cache to prevent mid-session phase shifts
let _sessionLockedPhase = null;

// Phase → numeric (for message pool selection)
const PHASE_NUMERIC = {
  japan: 1,
  sg: 2,
  post_confession: 3,
  farewell: 3,
  gone: null,
};

// Debug override mapping (numeric → named)
const DEBUG_PHASE_MAP = { 1: 'japan', 2: 'sg', 3: 'post_confession' };

export class SakuraState {

  // ─── Core reads ──────────────────────────────────

  /** Current story phase (respects debug override & session lock) */
  static getPhase() {
    // Session lock (quiz in progress)
    if (_sessionLockedPhase) return _sessionLockedPhase;

    // Debug override
    if (DebugStore.isActive()) {
      const ov = DebugStore.get('sakuraPhaseOverride');
      if (typeof ov === 'string' && ov in PHASE_NUMERIC) return ov;
      if (typeof ov === 'number' && DEBUG_PHASE_MAP[ov]) return DEBUG_PHASE_MAP[ov];
    }

    return this._load().phase;
  }

  /** Numeric phase for message pool: 1/2/3/null */
  static getPhaseNumeric() {
    return PHASE_NUMERIC[this.getPhase()] ?? null;
  }

  /** Total answers ever recorded */
  static getTotalAnswered() {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  }

  /** Answers since Phase 2 (sg) started */
  static getAnsweredSincePhase2() {
    const state = this._load();
    if (state.phase === 'japan') return 0;
    return Math.max(0, this.getTotalAnswered() - state.answeredAtPhase2Start);
  }

  /** Days since Phase 2 (sg) transition */
  static getDaysSincePhase2() {
    const state = this._load();
    if (!state.phase2StartedAt) return 0;
    const now = DebugStore.now();
    const start = new Date(state.phase2StartedAt);
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  // ─── Transition logic ───────────────────────────

  /**
   * Check and execute phase transitions.
   * Call after each answer is recorded.
   * Returns { transitioned, from, to } or { transitioned: false }.
   */
  static checkTransition() {
    // Don't transition during debug override or session lock
    if (_sessionLockedPhase) return { transitioned: false };
    if (DebugStore.isActive()) {
      const ov = DebugStore.get('sakuraPhaseOverride');
      if (ov && ov !== 0) return { transitioned: false };
    }

    const state = this._load();
    const total = this.getTotalAnswered();

    // japan → sg
    if (state.phase === 'japan' && total >= SG_THRESHOLD) {
      const from = state.phase;
      state.phase = 'sg';
      state.answeredAtPhase2Start = total;
      state.phase2StartedAt = DebugStore.now().toISOString();
      this._save(state);
      return { transitioned: true, from, to: 'sg' };
    }

    // sg → post_confession
    if (state.phase === 'sg' && total >= CONFESSION_THRESHOLD) {
      const records = this._getRecords();
      const last = records.slice(-CONFESSION_WINDOW);
      const correctCount = last.filter(r => r.isCorrect).length;
      if (correctCount / Math.min(last.length, CONFESSION_WINDOW) >= CONFESSION_ACCURACY) {
        const from = state.phase;
        state.phase = 'post_confession';
        this._save(state);
        return { transitioned: true, from, to: 'post_confession' };
      }
    }

    // post_confession → farewell is triggered externally by triggerFarewell()
    // farewell → gone is triggered externally by markEventSeen('farewell')

    return { transitioned: false };
  }

  /**
   * Trigger farewell phase (mock exam pass ≥ 70%).
   * Called from result.js when a mock exam is passed.
   */
  static triggerFarewell() {
    const state = this._load();
    if (state.phase !== 'post_confession') return false;
    state.phase = 'farewell';
    this._save(state);
    return true;
  }

  // ─── Event tracking ─────────────────────────────

  static markEventSeen(event) {
    const state = this._load();
    state.phaseEvents[event] = true;
    // farewell event viewed → transition to gone
    if (event === 'farewell' && state.phase === 'farewell') {
      state.phase = 'gone';
    }
    this._save(state);
  }

  static isEventSeen(event) {
    return !!this._load().phaseEvents[event];
  }

  static setFarewellLetter(text) {
    const state = this._load();
    state.farewellLetter = text;
    this._save(state);
  }

  static getFarewellLetter() {
    return this._load().farewellLetter;
  }

  // ─── Session cache ──────────────────────────────

  /** Freeze phase for quiz session duration */
  static lockPhaseForSession() {
    _sessionLockedPhase = this.getPhase();
  }

  /** Release phase lock (call on route change / session end) */
  static unlockPhase() {
    _sessionLockedPhase = null;
  }

  // ─── Persistence ────────────────────────────────

  static _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this._migrate();
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { return { ...DEFAULTS }; }
  }

  static _save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  static _getRecords() {
    try {
      return JSON.parse(localStorage.getItem(RECORDS_KEY)) || [];
    } catch { return []; }
  }

  /**
   * One-time migration: infer phase from existing records for returning users.
   */
  static _migrate() {
    const state = { ...DEFAULTS };
    const total = this.getTotalAnswered();

    if (total >= SG_THRESHOLD) {
      state.phase = 'sg';
      state.answeredAtPhase2Start = SG_THRESHOLD; // best guess
      // Try to use roomUnlockDate from SakuraRoomStore as phase2StartedAt
      try {
        const roomRaw = localStorage.getItem('sg_broker_sakura_room');
        if (roomRaw) {
          const room = JSON.parse(roomRaw);
          if (room.roomUnlockDate) {
            state.phase2StartedAt = new Date(room.roomUnlockDate + 'T00:00:00').toISOString();
          }
        }
      } catch { /* ignore */ }
      if (!state.phase2StartedAt) {
        state.phase2StartedAt = DebugStore.now().toISOString();
      }

      // Check if should be post_confession (200+ with accuracy)
      if (total >= CONFESSION_THRESHOLD) {
        const records = this._getRecords();
        const last = records.slice(-CONFESSION_WINDOW);
        const correctCount = last.filter(r => r.isCorrect).length;
        if (correctCount / Math.min(last.length, CONFESSION_WINDOW) >= CONFESSION_ACCURACY) {
          state.phase = 'post_confession';
        }
      }
    }

    this._save(state);
    return state;
  }
}
