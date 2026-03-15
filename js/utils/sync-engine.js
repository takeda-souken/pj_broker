/**
 * Sync Engine — cross-device state synchronization via GAS StateSnapshot
 *
 * Write: After significant actions, save a throttled state snapshot to GAS.
 * Read:  On app startup, fetch the latest snapshot and merge with localStorage.
 *
 * Synced keys (additive merge for arrays, max for counters, latest for prefs):
 *   - sg_broker_settings        (preferences — latest wins)
 *   - sg_broker_game            (XP, achievements — max/union)
 *   - sg_broker_topic_stats     (mastery — union, max streak/correct)
 *   - sg_broker_frequency       (per-question — latest wins)
 *   - sg_broker_bookmarks       (array — union)
 *   - sg_broker_hawker          (array — union)
 *   - sg_broker_sakura_room     (narrative — latest wins)
 *   - sg_broker_sakura          (phase — latest wins)
 *   - sg_broker_mrt_intro_shown (flags — union)
 */
import { SettingsStore } from '../models/settings-store.js';
import { DebugStore } from '../models/debug-store.js';

const SYNC_META_KEY = 'sg_broker_sync_meta';
const THROTTLE_MS = 30_000; // 30 seconds

// Keys to include in the snapshot
const SYNC_KEYS = [
  'sg_broker_settings',
  'sg_broker_game',
  'sg_broker_topic_stats',
  'sg_broker_frequency',
  'sg_broker_bookmarks',
  'sg_broker_hawker',
  'sg_broker_sakura_room',
  'sg_broker_sakura',
  'sg_broker_mrt_intro_shown',
  'sg_broker_first_launch_done',
];

let throttleTimer = null;
let isSyncing = false;

// ─── Sync metadata ──────────────────────────────────
function getSyncMeta() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_META_KEY) || '{}');
  } catch { return {}; }
}

function setSyncMeta(meta) {
  localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
}

// ─── Save snapshot (throttled) ──────────────────────

/** Schedule a snapshot save. Throttled to avoid spamming GAS. */
export function scheduleSnapshotSave() {
  // Don't sync on localhost with debug active + GAS blocked
  if (DebugStore.isActive() && DebugStore.get('gasSyncDisabled')) return;

  if (throttleTimer) return; // already scheduled

  throttleTimer = setTimeout(() => {
    throttleTimer = null;
    saveSnapshot();
  }, THROTTLE_MS);
}

/** Force an immediate snapshot save (e.g., on app close). */
export function saveSnapshotNow() {
  if (throttleTimer) {
    clearTimeout(throttleTimer);
    throttleTimer = null;
  }
  saveSnapshot();
}

async function saveSnapshot() {
  if (DebugStore.isActive() && DebugStore.get('gasSyncDisabled')) return;

  const url = SettingsStore.get('gasWebAppUrl');
  if (!url) return;

  const snapshot = {};
  for (const key of SYNC_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { snapshot[key] = JSON.parse(raw); }
      catch { snapshot[key] = raw; }
    }
  }

  const sentAt = new Date().toISOString();
  const action = DebugStore.isLocal() ? 'DEV_StateSnapshot' : 'StateSnapshot';

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action, snapshotJson: snapshot, sentAt }),
    });
    if (res.ok) {
      setSyncMeta({ ...getSyncMeta(), lastPush: sentAt });
      dispatchSyncEvent('saved');
    }
  } catch {
    // Silently fail — will retry on next schedule
  }
}

// ─── Fetch & merge snapshot (on startup) ────────────

/**
 * Fetch the latest snapshot from GAS and merge with local state.
 * Returns true if remote data was applied.
 */
export async function fetchAndMergeSnapshot() {
  if (DebugStore.isActive() && DebugStore.get('gasSyncDisabled')) return false;

  const url = SettingsStore.get('gasWebAppUrl');
  if (!url) return false;

  isSyncing = true;
  dispatchSyncEvent('syncing');

  try {
    const dev = DebugStore.isLocal() ? '&dev=1' : '';
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(`${url}${sep}action=getSnapshot${dev}`);
    if (!res.ok) throw new Error('fetch failed');

    const json = await res.json();
    if (!json.ok || !json.snapshot || !json.snapshot.snapshotJson) {
      dispatchSyncEvent('done');
      return false;
    }

    const remote = json.snapshot.snapshotJson;
    const remoteTime = json.snapshot.sentAt || json.snapshot.timestamp;
    const meta = getSyncMeta();

    // If our last push is the same as or newer than remote, skip merge
    if (meta.lastPush && remoteTime && meta.lastPush >= remoteTime) {
      dispatchSyncEvent('done');
      return false;
    }

    // Merge each key
    let merged = false;
    for (const key of SYNC_KEYS) {
      if (!(key in remote)) continue;
      const remoteVal = remote[key];
      const localRaw = localStorage.getItem(key);
      let localVal;
      try { localVal = localRaw ? JSON.parse(localRaw) : null; }
      catch { localVal = null; }

      const result = mergeKey(key, localVal, remoteVal);
      if (result !== undefined) {
        localStorage.setItem(key, JSON.stringify(result));
        merged = true;
      }
    }

    if (merged) {
      setSyncMeta({ ...meta, lastPull: new Date().toISOString() });
    }

    dispatchSyncEvent('done');
    return merged;
  } catch {
    dispatchSyncEvent('error');
    return false;
  } finally {
    isSyncing = false;
  }
}

// ─── Merge strategies ───────────────────────────────

function mergeKey(key, local, remote) {
  if (local === null || local === undefined) return remote;
  if (remote === null || remote === undefined) return local;

  switch (key) {
    case 'sg_broker_game':
      return mergeGame(local, remote);
    case 'sg_broker_topic_stats':
      return mergeTopicStats(local, remote);
    case 'sg_broker_bookmarks':
    case 'sg_broker_hawker':
      return mergeArrayUnion(local, remote);
    case 'sg_broker_mrt_intro_shown':
      return mergeObjectUnion(local, remote);
    default:
      // settings, frequency, sakura_room, sakura — latest wins (remote)
      return remote;
  }
}

/** Game data: take max for counters, union for arrays */
function mergeGame(local, remote) {
  const result = { ...local };
  const maxFields = [
    'xp', 'totalQuizzes', 'totalAnswered', 'totalCorrect',
    'bestStreak', 'perfectQuizzes', 'mockPasses', 'mockAces',
    'bcpAttempts', 'comgiAttempts', 'pgiAttempts', 'hiAttempts',
    'topicsMastered',
  ];
  for (const f of maxFields) {
    result[f] = Math.max(local[f] || 0, remote[f] || 0);
  }
  // currentStreak: take from whichever has more totalAnswered (more recent)
  result.currentStreak = (remote.totalAnswered || 0) >= (local.totalAnswered || 0)
    ? (remote.currentStreak || 0)
    : (local.currentStreak || 0);
  // Achievements: union
  const localAch = new Set(local.unlockedAchievements || []);
  const remoteAch = remote.unlockedAchievements || [];
  for (const a of remoteAch) localAch.add(a);
  result.unlockedAchievements = [...localAch];
  // dailyGoal: take remote (latest)
  if (remote.dailyGoal !== undefined) result.dailyGoal = remote.dailyGoal;
  return result;
}

/** Topic stats: for each topic, take the one with more attempts */
function mergeTopicStats(local, remote) {
  const result = { ...local };
  for (const key of Object.keys(remote)) {
    const r = remote[key];
    const l = local[key];
    if (!l || (r.attempts || 0) > (l.attempts || 0)) {
      result[key] = r;
    } else if ((r.attempts || 0) === (l.attempts || 0)) {
      // Same attempts — take the one with higher correct or mastered
      if (r.mastered && !l.mastered) result[key] = r;
      else if ((r.correct || 0) > (l.correct || 0)) result[key] = r;
    }
  }
  return result;
}

/** Array: union of unique values */
function mergeArrayUnion(local, remote) {
  if (!Array.isArray(local)) local = [];
  if (!Array.isArray(remote)) remote = [];
  return [...new Set([...local, ...remote])];
}

/** Object: union of keys (true wins over false/absent) */
function mergeObjectUnion(local, remote) {
  const result = { ...local };
  for (const [k, v] of Object.entries(remote)) {
    if (v) result[k] = v; // true flags persist
  }
  return result;
}

// ─── Events ─────────────────────────────────────────

function dispatchSyncEvent(status) {
  window.dispatchEvent(new CustomEvent('sync-status', { detail: { status } }));
}

export function isSyncInProgress() {
  return isSyncing;
}

// ─── Auto-detect localStorage writes and schedule sync ───
// Intercept localStorage.setItem for sync-relevant keys
if (typeof window !== 'undefined') {
  const originalSetItem = Storage.prototype.setItem;
  const SYNC_KEY_SET = new Set(SYNC_KEYS);

  Storage.prototype.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    // Only trigger for sync-relevant keys in localStorage (not sessionStorage)
    if (this === localStorage && SYNC_KEY_SET.has(key)) {
      scheduleSnapshotSave();
    }
  };
}

// ─── Beforeunload: save on close ────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (throttleTimer) {
      // Use sendBeacon for reliability on page close
      const url = SettingsStore.get('gasWebAppUrl');
      if (url && !(DebugStore.isActive() && DebugStore.get('gasSyncDisabled'))) {
        const snapshot = {};
        for (const key of SYNC_KEYS) {
          const raw = localStorage.getItem(key);
          if (raw !== null) {
            try { snapshot[key] = JSON.parse(raw); }
            catch { snapshot[key] = raw; }
          }
        }
        const action = DebugStore.isLocal() ? 'DEV_StateSnapshot' : 'StateSnapshot';
        navigator.sendBeacon(url, JSON.stringify({
          action,
          snapshotJson: snapshot,
          sentAt: new Date().toISOString(),
        }));
      }
    }
  });
}
