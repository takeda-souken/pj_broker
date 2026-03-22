/**
 * Sakura State — unified phase management (single source of truth)
 *
 * Design doc: docs/sakura-phase-design.md
 *
 * 6-Phase system:
 *   japan       (0–49問)              標準語。業務的な距離感
 *   sg_early    (50問–, day 0–1)      敬語フランク・標準語。SGガイド役
 *   sg_mid      (day 2–4+)            博多弁を挟む。淡い恋心
 *   sg_late     (day 5+ & 30問+)      博多弁全開・タメ口。完全な恋心
 *   heartbreak  (wife_revealed)       悲恋モード。プロに戻る
 *   ending      (mock 70%+)           別れと出発
 *   gone        (farewell会話完了)     さくら消滅
 *
 * Message pool mapping:
 *   japan       → PHASE_JAPAN
 *   sg_early    → PHASE_SG_EARLY
 *   sg_mid      → PHASE_SG_MID
 *   sg_late     → PHASE_SG_LATE
 *   heartbreak  → PHASE_HEARTBREAK
 *   ending      → PHASE_ENDING
 *   gone        → null
 */
import { DebugStore } from './debug-store.js';
import { SettingsStore } from './settings-store.js';

const STORAGE_KEY = 'sg_broker_sakura';
const RECORDS_KEY = 'sg_broker_records';

// ─── Transition thresholds ─────────────────────────
const SG_THRESHOLD = 50;            // japan → sg_early
const SG_MID_DAYS = 2;             // sg_early → sg_mid (days since phase 2)
const SG_LATE_DAYS = 5;            // sg_mid → sg_late (days since phase 2)
const SG_LATE_ANSWERS = 30;        // sg_mid → sg_late (answers since phase 2)
// sg_late → heartbreak: triggered externally by wife_revealed flag
// heartbreak → ending: triggered externally by triggerEnding()
const FAREWELL_ACCURACY = 70;      // mock exam % for ending trigger

const DEFAULTS = {
  phase: 'japan',
  answeredAtPhase2Start: 0,    // records.length when japan→sg_early fired
  phase2StartedAt: null,       // ISO timestamp of japan→sg_early
  phaseEvents: {
    sg_arrival: false,
    wife_revealed: false,
    farewell: false,
  },
  farewellLetter: null,
};

// Session-level cache to prevent mid-session phase shifts
let _sessionLockedPhase = null;

// All valid phases (ordered)
const VALID_PHASES = ['japan', 'sg_early', 'sg_mid', 'sg_late', 'heartbreak', 'ending', 'gone'];

// Phase → numeric (for message pool selection & ordering)
const PHASE_NUMERIC = {
  japan: 1,
  sg_early: 2,
  sg_mid: 3,
  sg_late: 4,
  heartbreak: 5,
  ending: 6,
  gone: null,
};

// Debug override mapping (numeric → named)
const DEBUG_PHASE_MAP = {
  1: 'japan',
  2: 'sg_early',
  3: 'sg_mid',
  4: 'sg_late',
  5: 'heartbreak',
  6: 'ending',
};

// Migration: old phase names → new
const LEGACY_PHASE_MAP = {
  sg: 'sg_early',              // will be refined by _migrateLegacy
  post_confession: 'sg_late',  // closest match for old post_confession
  farewell: 'ending',
};

export class SakuraState {

  // ─── Core reads ──────────────────────────────────

  /** Current story phase (respects debug override & session lock) */
  static getPhase() {
    // Session lock (quiz in progress)
    if (_sessionLockedPhase) return _sessionLockedPhase;

    // Debug override
    if (DebugStore.isActive()) {
      const ov = DebugStore.get('sakuraPhaseOverride');
      if (typeof ov === 'string' && VALID_PHASES.includes(ov)) return ov;
      if (typeof ov === 'number' && DEBUG_PHASE_MAP[ov]) return DEBUG_PHASE_MAP[ov];
    }

    // Arrival gate: force japan phase until arrivalDate has passed
    if (this._isBeforeArrival()) return 'japan';

    return this._load().phase;
  }

  /** Numeric phase for ordering/comparison: 1-6 or null */
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

  /** Answers since Phase 2 (sg_early) started */
  static getAnsweredSincePhase2() {
    const state = this._load();
    if (state.phase === 'japan') return 0;
    return Math.max(0, this.getTotalAnswered() - state.answeredAtPhase2Start);
  }

  /** Days since Phase 2 (sg_early) transition */
  static getDaysSincePhase2() {
    const state = this._load();
    if (!state.phase2StartedAt) return 0;
    const now = DebugStore.now();
    const start = new Date(state.phase2StartedAt);
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  /** Whether the room should be accessible */
  static isRoomAvailable() {
    const phase = this.getPhase(); // already returns 'japan' before arrival
    return phase !== 'japan' && phase !== 'gone';
  }

  // ─── Arrival gate ───────────────────────────────

  /** Check if we're before the arrival date */
  static _isBeforeArrival() {
    const arrivalDate = SettingsStore.get('arrivalDate');
    if (!arrivalDate) return false;
    const now = DebugStore.now();
    const arrival = new Date(arrivalDate + 'T00:00:00');
    return now < arrival;
  }

  /**
   * Reset phase2 timing on arrival day.
   * Called from checkTransition() — when arrivalDate has just passed and
   * the stored phase is already beyond japan, reset phase2StartedAt to
   * arrival date so day-counting restarts from arrival.
   */
  static _resetPhase2OnArrival() {
    const arrivalDate = SettingsStore.get('arrivalDate');
    if (!arrivalDate) return;
    const state = this._load();
    // Only reset if phase was already advanced (pre-arrival bug)
    // and phase2StartedAt is before arrivalDate
    if (state.phase2StartedAt) {
      const p2 = new Date(state.phase2StartedAt);
      const arrival = new Date(arrivalDate + 'T00:00:00');
      if (p2 < arrival) {
        state.phase = 'sg_early';
        state.phase2StartedAt = arrival.toISOString();
        state.answeredAtPhase2Start = this.getTotalAnswered();
        this._save(state);
      }
    }
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

    // Before arrival → no transitions
    if (this._isBeforeArrival()) return { transitioned: false };

    // Reset phase2 timing if arrival just passed
    this._resetPhase2OnArrival();

    const state = this._load();
    const total = this.getTotalAnswered();
    const days = this.getDaysSincePhase2();
    const answered = this.getAnsweredSincePhase2();

    // japan → sg_early
    if (state.phase === 'japan' && total >= SG_THRESHOLD) {
      const from = state.phase;
      state.phase = 'sg_early';
      state.answeredAtPhase2Start = total;
      state.phase2StartedAt = DebugStore.now().toISOString();
      this._save(state);
      return { transitioned: true, from, to: 'sg_early' };
    }

    // sg_early → sg_mid (time-based)
    if (state.phase === 'sg_early' && days >= SG_MID_DAYS) {
      const from = state.phase;
      state.phase = 'sg_mid';
      this._save(state);
      return { transitioned: true, from, to: 'sg_mid' };
    }

    // sg_mid → sg_late (time + answer count)
    if (state.phase === 'sg_mid' && days >= SG_LATE_DAYS && answered >= SG_LATE_ANSWERS) {
      const from = state.phase;
      state.phase = 'sg_late';
      this._save(state);
      return { transitioned: true, from, to: 'sg_late' };
    }

    // sg_late → heartbreak is triggered externally by triggerHeartbreak()
    // heartbreak → ending is triggered externally by triggerEnding()

    return { transitioned: false };
  }

  /**
   * Trigger heartbreak phase (wife_revealed conversation completed).
   * Called from sakura-room when the critical conversation fires wife_revealed flag.
   */
  static triggerHeartbreak() {
    const state = this._load();
    if (state.phase !== 'sg_late') return false;
    state.phase = 'heartbreak';
    state.phaseEvents.wife_revealed = true;
    this._save(state);
    return true;
  }

  /**
   * Trigger ending phase (mock exam pass ≥ 70% in heartbreak phase).
   * Called from result.js when a mock exam is passed.
   */
  static triggerEnding() {
    const state = this._load();
    if (state.phase !== 'heartbreak') return false;
    state.phase = 'ending';
    this._save(state);
    return true;
  }

  /** @deprecated Use triggerEnding() instead. Kept for backward compat. */
  static triggerFarewell() {
    return this.triggerEnding();
  }

  // ─── Event tracking ─────────────────────────────

  static markEventSeen(event) {
    const state = this._load();
    state.phaseEvents[event] = true;
    // farewell event viewed → transition to gone
    if (event === 'farewell' && state.phase === 'ending') {
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
      const parsed = { ...DEFAULTS, ...JSON.parse(raw) };
      // Migrate legacy phase names if found
      if (parsed.phase in LEGACY_PHASE_MAP) {
        return this._migrateLegacy(parsed);
      }
      return parsed;
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
   * Migrate legacy 3-phase names to 6-phase system.
   * Called when an old phase name is detected in stored state.
   */
  static _migrateLegacy(state) {
    const oldPhase = state.phase;

    if (oldPhase === 'sg') {
      // Determine which sg sub-phase based on days/answers
      const days = this.getDaysSincePhase2();
      const answered = this.getAnsweredSincePhase2();
      if (days >= SG_LATE_DAYS && answered >= SG_LATE_ANSWERS) {
        state.phase = 'sg_late';
      } else if (days >= SG_MID_DAYS) {
        state.phase = 'sg_mid';
      } else {
        state.phase = 'sg_early';
      }
    } else if (oldPhase === 'post_confession') {
      state.phase = 'sg_late';
    } else if (oldPhase === 'farewell') {
      state.phase = 'ending';
    }

    // Ensure phaseEvents has new keys
    if (!state.phaseEvents) state.phaseEvents = {};
    if (state.phaseEvents.confession) {
      state.phaseEvents.wife_revealed = true;
      delete state.phaseEvents.confession;
    }

    this._save(state);
    return state;
  }

  /**
   * First-time migration: infer phase from existing records for returning users.
   */
  static _migrate() {
    const state = { ...DEFAULTS };
    const total = this.getTotalAnswered();

    if (total >= SG_THRESHOLD) {
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

      // Determine sub-phase
      const days = state.phase2StartedAt
        ? Math.floor((DebugStore.now() - new Date(state.phase2StartedAt)) / (1000 * 60 * 60 * 24))
        : 0;
      const answered = total - state.answeredAtPhase2Start;

      if (days >= SG_LATE_DAYS && answered >= SG_LATE_ANSWERS) {
        state.phase = 'sg_late';
      } else if (days >= SG_MID_DAYS) {
        state.phase = 'sg_mid';
      } else {
        state.phase = 'sg_early';
      }
    }

    this._save(state);
    return state;
  }
}
