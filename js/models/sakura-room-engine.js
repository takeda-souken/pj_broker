/**
 * Sakura Room Engine — conversation runner
 * Loads JSON conversations, determines which are unlocked, plays through nodes
 */
import { SakuraRoomStore } from './sakura-room-store.js';
import { SettingsStore } from './settings-store.js';
import { SakuraState } from './sakura-state.js';
// All conversation data files
const DATA_FILES = [
  'data/sakura-room/phase2-early.json',
  'data/sakura-room/phase2-early-b.json',
  'data/sakura-room/phase2-mid-a.json',
  'data/sakura-room/phase2-mid-b.json',
  'data/sakura-room/phase2-late-a.json',
  'data/sakura-room/phase2-late-b.json',
  'data/sakura-room/phase3-a.json',
  'data/sakura-room/phase3-b.json',
  'data/sakura-room/c-reactions.json',
  'data/sakura-room/d-time.json',
  'data/sakura-room/closings.json',
];

let allConversations = null;
let closingPatterns = null;

export async function loadAllConversations() {
  if (allConversations) return allConversations;

  const results = await Promise.all(
    DATA_FILES.map(f =>
      fetch(f)
        .then(r => r.json())
        .catch(() => [])
    )
  );

  // Last file is closings (unwrap { closings: [...] } if needed)
  const raw = results.pop();
  closingPatterns = Array.isArray(raw) ? raw : (raw.closings || []);
  allConversations = results.flat();
  return allConversations;
}

export function getClosingPatterns() {
  return closingPatterns || [];
}

/**
 * Get current time window
 */
function getTimeWindow() {
  const h = new Date().getHours();
  if (h >= 2 && h < 6) return 'late_night';
  if (h >= 6 && h < 9) return 'morning';
  if (h >= 9 && h < 12) return 'late_morning';
  if (h >= 12 && h < 14) return 'afternoon';
  if (h >= 14 && h < 17) return 'afternoon';
  if (h >= 17 && h < 20) return 'evening';
  if (h >= 20 && h < 24) return 'night';
  return 'late_night'; // 0-2
}

/**
 * Check if sakura is sleeping (2:00-6:30)
 */
export function isSakuraSleeping() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  return (h >= 2 && (h < 6 || (h === 6 && m < 30)));
}

/**
 * Determine which conversations are available (unlocked + not completed)
 */
export function getAvailableConversations() {
  if (!allConversations) return [];

  const store = SakuraRoomStore.load();
  const totalAnswered = SakuraState.getAnsweredSincePhase2();
  const daysSince = SakuraState.getDaysSincePhase2();
  const currentDay = new Date().getDay(); // 0=Sun
  const timeWindow = getTimeWindow();

  return allConversations.filter(conv => {
    // Already completed
    if (store.completedConversations.includes(conv.id)) return false;

    const u = conv.unlock;
    if (!u) return true;

    // Special triggers (exam events, farewell)
    if (u.trigger) return false; // handled separately

    // Basic thresholds
    if (u.minAnswered && totalAnswered < u.minAnswered) return false;
    if (u.daysSincePhase2 && daysSince < u.daysSincePhase2) return false;

    // Required conversations
    if (u.requiredConversations && u.requiredConversations.length > 0) {
      if (!u.requiredConversations.every(id => store.completedConversations.includes(id))) return false;
    }

    // Required flags
    if (u.requiredFlags && u.requiredFlags.length > 0) {
      if (!u.requiredFlags.every(f => store.flags[f])) return false;
    }

    // Min warmth
    if (u.minWarmth && (store.axes.warmth || 0) < u.minWarmth) return false;

    // Min room conversations
    if (u.minRoomConversations && store.totalRoomConversations < u.minRoomConversations) return false;

    // Time window
    if (u.timeWindow && u.timeWindow !== timeWindow) return false;

    // Day of week
    if (u.dayOfWeek && !u.dayOfWeek.includes(currentDay)) return false;

    // Min conversations since (avoid clustering)
    if (u.minConversationsSince && u.requiredConversations) {
      const refConv = u.requiredConversations[0];
      const refIdx = store.completedConversations.indexOf(refConv);
      if (refIdx >= 0) {
        const since = store.completedConversations.length - refIdx;
        if (since < u.minConversationsSince) return false;
      }
    }

    return true;
  });
}

/**
 * Pick the next conversation to play.
 * Priority: A > E > C > B > D, then by priority field.
 * Avoids same category back-to-back.
 */
export function pickNextConversation() {
  const available = getAvailableConversations();
  if (available.length === 0) return null;

  // Sort by type priority then priority field
  const typePriority = { A: 0, E: 1, C: 2, B: 3, D: 4 };
  available.sort((a, b) => {
    const ta = typePriority[a.type] ?? 5;
    const tb = typePriority[b.type] ?? 5;
    if (ta !== tb) return ta - tb;
    return (b.priority || 50) - (a.priority || 50);
  });

  // Check last completed category and try to avoid repeat
  const store = SakuraRoomStore.load();
  const lastId = store.completedConversations[store.completedConversations.length - 1];
  if (lastId && allConversations) {
    const lastConv = allConversations.find(c => c.id === lastId);
    if (lastConv && available.length > 1) {
      const different = available.filter(c => c.category !== lastConv.category);
      if (different.length > 0) return different[0];
    }
  }

  return available[0];
}

/**
 * Replace placeholders in text
 */
export function replacePlaceholders(text) {
  if (!text) return text;
  const nickname = SettingsStore.get('sakuraNickname') || '片岡さん';
  let result = text.replace(/{name}/g, nickname);

  // {sg_days} — days since phase 2
  const days = SakuraState.getDaysSincePhase2();
  result = result.replace(/{sg_days}/g, `${days}日目`);

  return result;
}

/**
 * Pick an appropriate closing line based on time/context
 */
export function pickClosing(conv) {
  // If conversation has specific closing
  if (conv.closing === 'auto' || !conv.closing) {
    return pickClosingByTime();
  }
  if (Array.isArray(conv.closing)) {
    return conv.closing[Math.floor(Math.random() * conv.closing.length)];
  }
  if (typeof conv.closing === 'string') {
    return conv.closing;
  }
  return pickClosingByTime();
}

function pickClosingByTime() {
  if (!closingPatterns || closingPatterns.length === 0) return 'またね。';

  const now = new Date();
  const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const day = now.getDay(); // 0=Sun

  // Filter by time range and day-of-week
  const matching = closingPatterns.filter(c => {
    if (c.dayOfWeek && !c.dayOfWeek.includes(day)) return false;
    const tw = c.timeWindow;
    if (!tw || !tw.from || !tw.to) return true; // null timeWindow = anytime
    // Handle overnight ranges (e.g. 22:00 - 01:59)
    if (tw.from <= tw.to) {
      return hhmm >= tw.from && hhmm <= tw.to;
    } else {
      return hhmm >= tw.from || hhmm <= tw.to;
    }
  });

  const pool = matching.length > 0 ? matching : closingPatterns;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  // Support both `lines` array and `text` string
  if (pick.lines && pick.lines.length > 0) {
    return pick.lines[Math.floor(Math.random() * pick.lines.length)];
  }
  return pick.text || pick;
}
