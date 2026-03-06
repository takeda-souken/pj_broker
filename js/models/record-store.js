/**
 * Record Store — tracks quiz answers and topic-level stats
 */
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
      timestamp: new Date().toISOString(),
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
        s.masteredAt = new Date().toISOString();
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
