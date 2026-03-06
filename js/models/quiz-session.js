/**
 * Quiz Session — manages a single quiz/mock exam session
 */
import { shuffle } from '../utils/shuffle.js';
import { RecordStore } from './record-store.js';
import { loadQuestions } from '../data/questions.js';

export class QuizSession {
  constructor({ module, mode, questionCount = null }) {
    this.module = module;           // 'bcp' or 'comgi'
    this.mode = mode;               // 'practice', 'mock', 'weak'
    this.questions = [];
    this.currentIndex = 0;
    this.answers = [];
    this.startTime = Date.now();
    this.questionCount = questionCount;
    this.timeLimit = null;          // ms, for mock exam mode

    if (mode === 'mock') {
      this.timeLimit = module === 'bcp' ? 45 * 60 * 1000 : 75 * 60 * 1000;
    }
  }

  async init() {
    const allQ = await loadQuestions(this.module);

    if (this.mode === 'weak') {
      const weakTopics = RecordStore.getWeakTopics(this.module, 10).map(s => s.topic);
      const weak = allQ.filter(q => weakTopics.includes(q.topic));
      this.questions = shuffle(weak).slice(0, this.questionCount || 20);
    } else if (this.mode === 'mock') {
      this.questionCount = this.module === 'bcp' ? 40 : 50;
      this.questions = shuffle(allQ).slice(0, this.questionCount);
    } else {
      // practice
      const count = this.questionCount || 10;
      this.questions = shuffle(allQ).slice(0, count);
    }

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
    const record = {
      module: this.module,
      mode: this.mode,
      questionId: q.id,
      topic: q.topic,
      answer: choiceIndex,
      correctAnswer: q.answer,
      isCorrect,
    };

    this.answers.push(record);
    RecordStore.addRecord(record);

    return record;
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

    return { correct, total, accuracy, passed, elapsed, byTopic, module: this.module, mode: this.mode };
  }
}
