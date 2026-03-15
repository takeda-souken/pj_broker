/**
 * Record Store — tracks quiz answers and topic-level stats
 */
import { DebugStore } from './debug-store.js';

const RECORDS_KEY = 'sg_broker_records';
const STATS_KEY = 'sg_broker_topic_stats';

export class RecordStore {
  // --- Individual records ---
  static getRecords() {
    try {
      return JSON.parse(localStorage.getItem(RECORDS_KEY)) || [];
    } catch { return []; }
  }

  static addRecord(record) {
    const records = this.getRecords();
    records.push({
      ...record,
      timestamp: DebugStore.now().toISOString(),
    });
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    this._updateTopicStats(record);
  }

  // --- Topic stats (aggregated) ---
  static getTopicStats() {
    try {
      return JSON.parse(localStorage.getItem(STATS_KEY)) || {};
    } catch { return {}; }
  }

  static _updateTopicStats(record) {
    const stats = this.getTopicStats();
    const key = `${record.module}::${record.topic}`;
    if (!stats[key]) {
      stats[key] = { module: record.module, topic: record.topic, attempts: 0, correct: 0, streak: 0, mastered: false };
    }
    const s = stats[key];
    s.attempts++;
    if (record.isCorrect) {
      s.correct++;
      s.streak++;
      if (s.streak >= 5 && !s.mastered) {
        s.mastered = true;
        s.masteredAt = DebugStore.now().toISOString();
      }
    } else {
      s.streak = 0;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return s;
  }

  static getAccuracy(module, topic) {
    const stats = this.getTopicStats();
    const key = `${module}::${topic}`;
    const s = stats[key];
    if (!s || s.attempts === 0) return null;
    return Math.round((s.correct / s.attempts) * 100);
  }

  static getModuleStats(module) {
    const stats = this.getTopicStats();
    let attempts = 0, correct = 0, mastered = 0, total = 0;
    for (const [key, s] of Object.entries(stats)) {
      if (s.module === module) {
        attempts += s.attempts;
        correct += s.correct;
        if (s.mastered) mastered++;
        total++;
      }
    }
    return { attempts, correct, mastered, topicCount: total, accuracy: attempts ? Math.round((correct / attempts) * 100) : 0 };
  }

  static getWeakTopics(module, limit = 5) {
    const stats = this.getTopicStats();
    return Object.values(stats)
      .filter(s => s.module === module && s.attempts >= 3)
      .sort((a, b) => (a.correct / a.attempts) - (b.correct / b.attempts))
      .slice(0, limit);
  }

  // --- Weakness analysis ---

  /**
   * Get per-question accuracy stats.
   * Returns array of { questionId, topic, module, attempts, correct, accuracy }
   * sorted by accuracy ascending (weakest first).
   */
  static getWeakQuestions(module, limit = 10) {
    const records = this.getRecords();
    const byQ = {};
    for (const r of records) {
      if (module && r.module !== module) continue;
      const key = r.questionId;
      if (!key) continue;
      if (!byQ[key]) byQ[key] = { questionId: key, topic: r.topic, module: r.module, attempts: 0, correct: 0 };
      byQ[key].attempts++;
      if (r.isCorrect) byQ[key].correct++;
    }
    return Object.values(byQ)
      .filter(q => q.attempts >= 2)
      .map(q => ({ ...q, accuracy: Math.round((q.correct / q.attempts) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
      .slice(0, limit);
  }

  /**
   * Get wrong answer patterns — which wrong choices are most commonly selected.
   * Returns array of { topic, wrongAnswer, count } sorted by count descending.
   */
  static getWrongPatterns(module, limit = 10) {
    const records = this.getRecords();
    const patterns = {};
    for (const r of records) {
      if (module && r.module !== module) continue;
      if (r.isCorrect || r.answer === -1) continue;
      const key = `${r.topic}||${r.answer}`;
      if (!patterns[key]) patterns[key] = { topic: r.topic, wrongAnswer: r.answer, count: 0 };
      patterns[key].count++;
    }
    return Object.values(patterns)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get topic accuracy trend — whether topics are improving or declining.
   * Returns array of { topic, module, recentAcc, overallAcc, trend }
   * where trend is 'improving', 'declining', or 'stable'.
   */
  static getTopicTrends(module) {
    const records = this.getRecords();
    const byTopic = {};
    for (const r of records) {
      if (module && r.module !== module) continue;
      if (!r.topic) continue;
      if (!byTopic[r.topic]) byTopic[r.topic] = { topic: r.topic, module: r.module, all: [], recent: [] };
      byTopic[r.topic].all.push(r.isCorrect ? 1 : 0);
    }
    const result = [];
    for (const t of Object.values(byTopic)) {
      if (t.all.length < 4) continue;
      const half = Math.floor(t.all.length / 2);
      const recentArr = t.all.slice(half);
      const overallArr = t.all;
      const recentAcc = Math.round((recentArr.reduce((s, v) => s + v, 0) / recentArr.length) * 100);
      const overallAcc = Math.round((overallArr.reduce((s, v) => s + v, 0) / overallArr.length) * 100);
      const diff = recentAcc - overallAcc;
      let trend = 'stable';
      if (diff >= 10) trend = 'improving';
      else if (diff <= -10) trend = 'declining';
      result.push({ ...t, recentAcc, overallAcc, trend, all: undefined, recent: undefined });
    }
    return result;
  }

  /**
   * Get list of weak topic names for adaptive quiz weighting.
   * Returns topic names where accuracy < 70% and at least 3 attempts.
   */
  static getWeakTopicNames(module) {
    const stats = this.getTopicStats();
    const names = [];
    for (const [key, s] of Object.entries(stats)) {
      if (s.module !== module) continue;
      if (s.attempts < 3) continue;
      const acc = (s.correct / s.attempts) * 100;
      if (acc < 70) names.push(s.topic);
    }
    return names;
  }

  // --- Archive old records (#25) ---
  static archiveOldRecords(daysOld = 90) {
    const records = this.getRecords();
    const cutoff = DebugStore.now();
    cutoff.setDate(cutoff.getDate() - daysOld);
    const cutoffStr = cutoff.toISOString();

    const keep = [];
    let archived = 0;
    for (const r of records) {
      if (r.timestamp && r.timestamp < cutoffStr) {
        archived++;
      } else {
        keep.push(r);
      }
    }
    if (archived === 0) return 0;
    localStorage.setItem(RECORDS_KEY, JSON.stringify(keep));
    return archived;
  }

  // --- Unique correct count (for MRT progress) ---

  /**
   * Count distinct questionIds answered correctly at least once for a module.
   */
  static getUniqueCorrectCount(module) {
    const records = this.getRecords();
    const seen = new Set();
    for (const r of records) {
      if (r.module === module && r.isCorrect && r.questionId) {
        seen.add(r.questionId);
      }
    }
    return seen.size;
  }

  // --- Hawker collection ---
  static getHawkerCollection() {
    try {
      return JSON.parse(localStorage.getItem('sg_broker_hawker')) || [];
    } catch { return []; }
  }

  static addHawkerItem(id) {
    const collection = this.getHawkerCollection();
    if (!collection.includes(id)) {
      collection.push(id);
      localStorage.setItem('sg_broker_hawker', JSON.stringify(collection));
    }
    return collection;
  }
}
