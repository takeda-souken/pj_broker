/**
 * GAS (Google Apps Script) Client
 * Sends study data to a Google Spreadsheet via GAS Web App.
 *
 * Actions: QuizLog, SessionSummary, Feedback, SyncAll
 */
import { SettingsStore } from '../models/settings-store.js';
import { DebugStore } from '../models/debug-store.js';

const QUEUE_KEY = 'sg_broker_gas_queue';

/**
 * Send data to GAS. Queues if offline or URL not set.
 * Blocked entirely when debug mode has gasSyncDisabled.
 * @param {string} action - Sheet name / action type
 * @param {object} payload - Data to send
 * @returns {Promise<boolean>} success
 */
export async function gasSend(action, payload) {
  // Block GAS sends in debug mode
  if (DebugStore.isActive() && DebugStore.get('gasSyncDisabled')) {
    return false;
  }

  const url = SettingsStore.get('gasWebAppUrl');
  const data = { action, ...payload, sentAt: new Date().toISOString() };

  if (!url) {
    enqueue(data);
    return false;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    // Offline or network error — queue for later
    enqueue(data);
    return false;
  }
}

/**
 * Send a quiz answer log (per-question)
 */
export function sendQuizLog(record) {
  return gasSend('QuizLog', {
    module: record.module,
    topic: record.topic,
    questionId: record.questionId,
    selected: record.answer,
    correct: record.correctAnswer,
    isCorrect: record.isCorrect,
    timeMs: record.answerTime,
    mode: record.mode,
  });
}

/**
 * Send session summary (end of quiz)
 */
export function sendSessionSummary(results) {
  return gasSend('SessionSummary', {
    module: results.module,
    mode: results.mode,
    score: results.correct,
    total: results.total,
    accuracy: results.accuracy,
    passed: results.passed,
    elapsedMs: results.elapsed,
    avgTimeMs: results.avgTime,
    byTopic: results.byTopic,
  });
}

/**
 * Send feedback
 */
export function sendFeedback({ type = 'general', module, questionId, message }) {
  return gasSend('Feedback', { type, module, questionId, message });
}

/**
 * Send sakura room choice log
 */
export function sendSakuraRoomLog({ conversationId, nodeId, choiceLabel, flags, axes }) {
  return gasSend('SakuraRoom', {
    conversationId,
    nodeId,
    choiceLabel,
    flags: flags || {},
    axes: axes || {},
  });
}

// ─── Offline queue ───

function enqueue(data) {
  try {
    const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    q.push(data);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch { /* storage full — drop silently */ }
}

/**
 * Flush queued items (call when URL is set or on app start)
 */
export async function gasFlushQueue() {
  const url = SettingsStore.get('gasWebAppUrl');
  if (!url) return;

  const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  if (q.length === 0) return;

  const failed = [];
  for (const data of q) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) failed.push(data);
    } catch {
      failed.push(data);
      break; // still offline, stop trying
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
}
