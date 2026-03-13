/**
 * Gamification Store — XP, levels, achievements, daily goals
 * (#13 daily goal, #31 achievements, #33 XP/levels)
 */
const GAME_KEY = 'sg_broker_game';

const XP_PER_CORRECT = 10;
const XP_PER_WRONG = 3;
const XP_PER_STREAK_BONUS = 5; // per streak count
const XP_PER_MASTERY = 100;

const LEVELS = [
  { level: 1, xp: 0, title: 'Intern' },
  { level: 2, xp: 50, title: 'Junior Associate' },
  { level: 3, xp: 150, title: 'Associate' },
  { level: 4, xp: 300, title: 'Senior Associate' },
  { level: 5, xp: 500, title: 'Assistant VP' },
  { level: 6, xp: 800, title: 'Vice President' },
  { level: 7, xp: 1200, title: 'Senior VP' },
  { level: 8, xp: 1800, title: 'Director' },
  { level: 9, xp: 2500, title: 'Managing Director' },
  { level: 10, xp: 3500, title: 'MAS-Certified Expert' },
];

const ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'First Steps', desc: 'Complete your first quiz', icon: '\uD83D\uDC63', check: (g) => g.totalQuizzes >= 1 },
  { id: 'ten_quizzes', name: 'Getting Started', desc: 'Complete 10 quizzes', icon: '\uD83D\uDCDA', check: (g) => g.totalQuizzes >= 10 },
  { id: 'fifty_quizzes', name: 'Dedicated', desc: 'Complete 50 quizzes', icon: '\uD83C\uDFC5', check: (g) => g.totalQuizzes >= 50 },
  { id: 'streak_5', name: 'Hot Streak', desc: '5 correct answers in a row', icon: '\uD83D\uDD25', check: (g) => g.bestStreak >= 5 },
  { id: 'streak_10', name: 'Unstoppable', desc: '10 correct answers in a row', icon: '\u26A1', check: (g) => g.bestStreak >= 10 },
  { id: 'streak_20', name: 'Machine', desc: '20 correct answers in a row', icon: '\uD83E\uDD16', check: (g) => g.bestStreak >= 20 },
  { id: 'perfect_10', name: 'Perfect 10', desc: 'Score 100% on a 10-question quiz', icon: '\uD83D\uDCAF', check: (g) => g.perfectQuizzes >= 1 },
  { id: 'mock_pass', name: 'Exam Ready', desc: 'Pass a mock exam (70%+)', icon: '\uD83C\uDF93', check: (g) => g.mockPasses >= 1 },
  { id: 'mock_ace', name: 'Ace', desc: 'Score 90%+ on a mock exam', icon: '\uD83C\uDFC6', check: (g) => g.mockAces >= 1 },
  { id: 'both_modules', name: 'Well-Rounded', desc: 'Practice all 4 modules', icon: '\uD83C\uDF0F', check: (g) => g.bcpAttempts > 0 && g.comgiAttempts > 0 && (g.pgiAttempts || 0) > 0 && (g.hiAttempts || 0) > 0 },
  { id: 'five_topics', name: 'Explorer', desc: 'Master 5 topics', icon: '\uD83D\uDDFA\uFE0F', check: (g) => g.topicsMastered >= 5 },
  { id: 'all_topics', name: 'Completionist', desc: 'Master all topics', icon: '\u2B50', check: (g) => g.topicsMastered >= 17 },
  { id: 'hundred_correct', name: 'Century', desc: 'Answer 100 questions correctly', icon: '\uD83D\uDCAA', check: (g) => g.totalCorrect >= 100 },
  { id: 'five_hundred', name: 'Marathon', desc: 'Answer 500 questions total', icon: '\uD83C\uDFC3', check: (g) => g.totalAnswered >= 500 },
];

export class GamificationStore {
  static load() {
    try {
      const raw = localStorage.getItem(GAME_KEY);
      return raw ? JSON.parse(raw) : this._defaults();
    } catch { return this._defaults(); }
  }

  static _defaults() {
    return {
      xp: 0,
      totalQuizzes: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      perfectQuizzes: 0,
      mockPasses: 0,
      mockAces: 0,
      bcpAttempts: 0,
      comgiAttempts: 0,
      topicsMastered: 0,
      dailyGoal: 20,
      unlockedAchievements: [],
    };
  }

  static save(g) {
    localStorage.setItem(GAME_KEY, JSON.stringify(g));
  }

  static addAnswer(isCorrect, module, streak = 0) {
    const g = this.load();
    g.totalAnswered++;
    if (isCorrect) {
      g.totalCorrect++;
      g.xp += XP_PER_CORRECT;
      if (streak > 1) g.xp += XP_PER_STREAK_BONUS;
    } else {
      g.xp += XP_PER_WRONG;
      g.currentStreak = 0;
    }
    if (isCorrect) {
      g.currentStreak++;
      if (g.currentStreak > g.bestStreak) g.bestStreak = g.currentStreak;
    }
    if (module === 'bcp') g.bcpAttempts++;
    if (module === 'comgi') g.comgiAttempts++;
    if (module === 'pgi') g.pgiAttempts = (g.pgiAttempts || 0) + 1;
    if (module === 'hi') g.hiAttempts = (g.hiAttempts || 0) + 1;

    this.save(g);
    return g;
  }

  static completeQuiz(accuracy, mode) {
    const g = this.load();
    g.totalQuizzes++;
    if (accuracy === 100) g.perfectQuizzes++;
    if (mode === 'mock' && accuracy >= 70) g.mockPasses++;
    if (mode === 'mock' && accuracy >= 90) g.mockAces++;
    this.save(g);
    return this.checkNewAchievements(g);
  }

  static addMastery() {
    const g = this.load();
    g.topicsMastered++;
    g.xp += XP_PER_MASTERY;
    this.save(g);
  }

  static setDailyGoal(n) {
    const g = this.load();
    g.dailyGoal = n;
    this.save(g);
  }

  static getLevel(xp) {
    let current = LEVELS[0];
    for (const l of LEVELS) {
      if (xp >= l.xp) current = l;
    }
    const next = LEVELS.find(l => l.xp > xp);
    return {
      level: current.level,
      title: current.title,
      xp,
      currentLevelXp: current.xp,
      nextLevelXp: next ? next.xp : current.xp,
      progress: next ? (xp - current.xp) / (next.xp - current.xp) : 1,
    };
  }

  static getTodayProgress() {
    const g = this.load();
    const today = new Date().toISOString().slice(0, 10);
    // Count today's answers from records
    try {
      const records = JSON.parse(localStorage.getItem('sg_broker_records') || '[]');
      const todayCount = records.filter(r => r.timestamp && r.timestamp.startsWith(today)).length;
      return { done: todayCount, goal: g.dailyGoal };
    } catch { return { done: 0, goal: g.dailyGoal }; }
  }

  static checkNewAchievements(g) {
    if (!g) g = this.load();
    const newOnes = [];
    for (const a of ACHIEVEMENTS) {
      if (!g.unlockedAchievements.includes(a.id) && a.check(g)) {
        g.unlockedAchievements.push(a.id);
        newOnes.push(a);
      }
    }
    if (newOnes.length > 0) this.save(g);
    return newOnes;
  }

  static getStudyDays() {
    try {
      const records = JSON.parse(localStorage.getItem('sg_broker_records') || '[]');
      const days = new Set();
      for (const r of records) {
        if (r.timestamp) days.add(r.timestamp.slice(0, 10));
      }
      return [...days].sort();
    } catch { return []; }
  }

  static getLongestDailyStreak() {
    const days = this.getStudyDays();
    if (days.length === 0) return 0;
    let longest = 1, current = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        if (current > longest) longest = current;
      } else if (diff > 1) {
        current = 1;
      }
    }
    return longest;
  }

  static getAllAchievements() {
    const g = this.load();
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: g.unlockedAchievements.includes(a.id),
    }));
  }

}
