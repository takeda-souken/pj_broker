/**
 * Quiz Session — manages a single quiz/mock exam session
 */
import { shuffle } from '../utils/shuffle.js';
import { RecordStore } from './record-store.js';
import { SettingsStore } from './settings-store.js';
import { FrequencyStore, FREQUENCY_WEIGHTS } from './frequency-store.js';
import { loadQuestions } from '../data/questions.js';

export class QuizSession {
  constructor({ module, mode, questionCount = null, topic = null, reviewIds = null }) {
    this.module = module;           // 'bcp' or 'comgi'
    this.mode = mode;               // 'practice', 'mock', 'weak', 'review', 'topic'
    this.questions = [];
    this.currentIndex = 0;
    this.answers = [];
    this.startTime = Date.now();
    this.questionCount = questionCount;
    this.topic = topic;             // specific topic filter
    this.reviewIds = reviewIds;     // specific question IDs to review
    this.timeLimit = null;          // ms, for mock exam mode

    if (mode === 'mock') {
      this.timeLimit = module === 'bcp' ? 45 * 60 * 1000 : 75 * 60 * 1000;
    }
  }

  async init() {
    let allQ;
    if (this.module === 'mixed') {
      const modules = ['bcp', 'comgi', 'pgi', 'hi'];
      const loaded = await Promise.all(modules.map(m => loadQuestions(m)));
      allQ = loaded.flatMap((qs, i) => qs.map(q => ({ ...q, _module: modules[i] })));
    } else {
      allQ = await loadQuestions(this.module);
    }

    // Build topic question count cache for mastery checks
    const topicCounts = {};
    for (const q of allQ) {
      const mod = q._module || this.module;
      const key = `${mod}::${q.topic}`;
      topicCounts[key] = (topicCounts[key] || 0) + 1;
    }
    RecordStore.setTopicQuestionCounts(topicCounts);

    // Frequency filtering: exclude "none" questions from practice/weak/topic modes
    // Review mode & mock mode bypass frequency filtering
    const isFreqFiltered = this.mode !== 'mock' && !(this.reviewIds && this.reviewIds.length > 0);
    const freqQ = isFreqFiltered ? allQ.filter(q => FrequencyStore.get(q.id) !== 'none') : allQ;

    // Review mode: specific question IDs (#4)
    if (this.reviewIds && this.reviewIds.length > 0) {
      const reviewQ = allQ.filter(q => this.reviewIds.includes(q.id));
      this.questions = shuffle(reviewQ);
    // Topic-specific practice (#7)
    } else if (this.topic) {
      const topicQ = freqQ.filter(q => q.topic === this.topic);
      this.questions = weightedSelect(shuffle(topicQ), this.questionCount || topicQ.length);
    } else if (this.mode === 'weak') {
      const weakTopics = RecordStore.getWeakTopics(this.module, 10).map(s => s.topic);
      const weak = freqQ.filter(q => weakTopics.includes(q.topic));
      this.questions = weightedSelect(shuffle(weak), this.questionCount || 20);
    } else if (this.mode === 'mock') {
      const target = this.module === 'bcp' ? 40 : 50;
      this.questionCount = Math.min(target, allQ.length);
      this.questions = shuffle(allQ).slice(0, this.questionCount);
    } else {
      // practice — with optional weak-focus bias
      const count = this.questionCount || 10;
      const settings = SettingsStore.load();

      if (settings.weakFocusEnabled) {
        const weakNames = RecordStore.getWeakTopicNames(this.module);
        if (weakNames.length > 0) {
          // 60% from weak topics, 40% from everything else
          const weakQ = shuffle(freqQ.filter(q => weakNames.includes(q.topic)));
          const otherQ = shuffle(freqQ.filter(q => !weakNames.includes(q.topic)));
          const weakCount = Math.min(Math.ceil(count * 0.6), weakQ.length);
          const otherCount = count - weakCount;
          this.questions = weightedSelect(shuffle([
            ...weakQ.slice(0, weakCount),
            ...otherQ.slice(0, otherCount),
          ]), count);
        } else {
          this.questions = weightedSelect(shuffle(freqQ), count);
        }
      } else {
        this.questions = weightedSelect(shuffle(freqQ), count);
      }
    }

    // Spaced repetition: deprioritize recently-correct questions (#11)
    if (this.mode === 'practice' || this.mode === 'weak') {
      this.questions = applySpacedRepetition(this.questions, this.module);
    }

    // Difficulty ordering: start easier, get harder (#12)
    if (this.mode === 'practice' && this.questions.length > 5) {
      this.questions = orderByDifficulty(this.questions);
    }

    // Shuffle choices for each question (preserving correct answer mapping)
    this.questions = this.questions.map(q => shuffleChoices(q));

    return this;
  }

  get current() {
    return this.questions[this.currentIndex] || null;
  }

  get total() {
    return this.questions.length;
  }

  get progress() {
    return this.total ? this.currentIndex / this.total : 0;
  }

  get isFinished() {
    return this.currentIndex >= this.total;
  }

  get elapsed() {
    return Date.now() - this.startTime;
  }

  get remaining() {
    if (!this.timeLimit) return null;
    return Math.max(0, this.timeLimit - this.elapsed);
  }

  get isTimeUp() {
    return this.timeLimit != null && this.remaining <= 0;
  }

  answer(choiceIndex) {
    const q = this.current;
    if (!q) return null;

    const isCorrect = choiceIndex === q.answer;
    const answerTime = this._questionStartTime ? Date.now() - this._questionStartTime : 0;
    const record = {
      module: q._module || this.module,
      mode: this.mode,
      questionId: q.id,
      topic: q.topic,
      answer: choiceIndex,
      correctAnswer: q.answer,
      isCorrect,
      answerTime,
      originalSelected: q._shuffleMap ? q._shuffleMap[choiceIndex] : choiceIndex,
      originalCorrect: q._originalAnswer != null ? q._originalAnswer : q.answer,
    };

    this.answers.push(record);
    RecordStore.addRecord(record);

    return record;
  }

  startQuestionTimer() {
    this._questionStartTime = Date.now();
  }

  next() {
    this.currentIndex++;
  }

  getResults() {
    const correct = this.answers.filter(a => a.isCorrect).length;
    const total = this.answers.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const passed = accuracy >= 70;
    const elapsed = this.elapsed;

    // Topic breakdown
    const byTopic = {};
    for (const a of this.answers) {
      if (!byTopic[a.topic]) byTopic[a.topic] = { correct: 0, total: 0 };
      byTopic[a.topic].total++;
      if (a.isCorrect) byTopic[a.topic].correct++;
    }

    // Average answer time
    const times = this.answers.filter(a => a.answerTime > 0).map(a => a.answerTime);
    const avgTime = times.length > 0 ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0;

    return { correct, total, accuracy, passed, elapsed, byTopic, avgTime, module: this.module, mode: this.mode };
  }
}

/**
 * Shuffle choices array and remap answer index accordingly.
 * Returns a new question object (does not mutate original).
 */
function shuffleChoices(q) {
  const indices = q.choices.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newChoices = indices.map(i => q.choices[i]);
  const newAnswer = indices.indexOf(q.answer);
  // Map choiceExplanations if present
  const newChoiceExp = q.choiceExplanations
    ? indices.map(i => q.choiceExplanations[i])
    : undefined;
  // Map choicesJP in same order
  const newChoicesJP = q.choicesJP
    ? indices.map(i => q.choicesJP[i])
    : undefined;
  return { ...q, choices: newChoices, answer: newAnswer, choiceExplanations: newChoiceExp, choicesJP: newChoicesJP, _originalAnswer: q.answer, _shuffleMap: indices };
}

/**
 * Spaced repetition (#11): deprioritize questions answered correctly recently.
 * Questions with recent correct answers are moved toward the end of the pool.
 */
function applySpacedRepetition(questions, module) {
  const records = RecordStore.getRecords();
  const recent = {};
  // Look at last 7 days of records
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  for (const r of records) {
    if (module !== 'mixed' && r.module !== module) continue;
    if (!r.timestamp || new Date(r.timestamp).getTime() < cutoff) continue;
    if (r.isCorrect) {
      recent[r.questionId] = (recent[r.questionId] || 0) + 1;
    }
  }
  // Sort: questions with fewer recent correct answers first
  return [...questions].sort((a, b) => (recent[a.id] || 0) - (recent[b.id] || 0));
}

/**
 * Difficulty ordering (#12): arrange questions from easier to harder.
 * Uses the question's `difficulty` field if present, otherwise estimates from historical accuracy.
 */
function orderByDifficulty(questions) {
  const weakQ = RecordStore.getWeakQuestions(null, 999);
  const accMap = {};
  for (const w of weakQ) accMap[w.questionId] = w.accuracy;

  return [...questions].sort((a, b) => {
    const da = a.difficulty || (100 - (accMap[a.id] ?? 50));
    const db = b.difficulty || (100 - (accMap[b.id] ?? 50));
    return da - db; // easier first
  });
}

/**
 * Weighted selection based on frequency settings.
 * High-frequency questions are preferred; low-frequency are less likely to appear.
 * Questions with "none" should already be filtered out before calling this.
 */
function weightedSelect(questions, count) {
  if (questions.length <= count) return questions;

  // Build weighted pool: each question gets a weight based on frequency
  const weighted = questions.map(q => ({
    q,
    weight: FREQUENCY_WEIGHTS[FrequencyStore.get(q.id)] || 1,
  }));

  const selected = [];
  const used = new Set();

  for (let i = 0; i < count && weighted.length > used.size; i++) {
    const remaining = weighted.filter((_, idx) => !used.has(idx));
    const totalWeight = remaining.reduce((sum, w) => sum + w.weight, 0);

    if (totalWeight <= 0) {
      // All remaining have zero weight — just pick sequentially
      for (const [idx, w] of weighted.entries()) {
        if (!used.has(idx) && selected.length < count) {
          used.add(idx);
          selected.push(w.q);
        }
      }
      break;
    }

    // Weighted random pick
    let rand = Math.random() * totalWeight;
    for (const [idx, w] of weighted.entries()) {
      if (used.has(idx)) continue;
      rand -= w.weight;
      if (rand <= 0) {
        used.add(idx);
        selected.push(w.q);
        break;
      }
    }
  }

  return selected;
}
