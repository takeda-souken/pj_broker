/**
 * Kataoka-mode encouragement messages
 * Personal messages that appear at key moments to keep Kataoka motivated.
 */

const ENCOURAGEMENT = {
  // After correct answer
  correct: [
    'Nice one, Kataoka-san!',
    'You got this!',
    'Singapore is waiting for you!',
    'One step closer to that license!',
    'Keep it rolling!',
    'That\'s the way!',
    'Solid knowledge right there.',
    'April is yours.',
    'Textbook answer!',
    'MAS-certified brain right there!',
    'That\'s how professionals do it.',
    'Another brick in the wall of knowledge!',
    'You\'re becoming an expert.',
    'Raffles would be proud!',
  ],
  // After wrong answer
  wrong: [
    'No worries, now you know!',
    'This one trips everyone up.',
    'You\'ll nail it next time.',
    'Learn it now, ace it on exam day.',
    'Even MAS examiners get confused sometimes.',
    'Review the explanation \u2014 it\'ll stick.',
    'Wrong answers are the best teachers.',
    'Better to make mistakes here than on exam day.',
    'This is exactly why we practice!',
    'Commit this to memory \u2014 it won\'t get you again.',
    'The brain remembers mistakes more vividly. Silver lining!',
  ],
  // Starting a quiz session
  sessionStart: [
    'Let\'s do this, Kataoka-san!',
    'Focus mode: ON',
    'Every question counts toward April.',
    'Time to level up!',
    'Your Singapore chapter starts here.',
  ],
  // Streak milestones
  streak: [
    'You\'re on fire! {n} in a row!',
    '{n} consecutive! Unstoppable!',
    'Streak: {n}! Kataoka-san is in the zone!',
  ],
  // Result page
  resultPass: [
    'Congratulations! You\'re exam-ready!',
    'MAS would be proud!',
    'April pass: looking very likely.',
    'Outstanding work, Kataoka-san!',
  ],
  resultFail: [
    'Not quite yet — but you\'re close!',
    'Every attempt makes you stronger.',
    'Focus on the weak areas and try again!',
    'April has room for growth. Keep going!',
  ],
  // Rare messages from Takeda-sensei
  takeda: [
    '\u7247\u5CA1\u304F\u3093\u3001\u304C\u3093\u3070\u308C\uFF01\u3000\uFF42\uFF59\u6B66\u7530',
    '\u7247\u5CA1\u3001\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB\u3067\u5F85\u3063\u3066\u308B\u305E\uFF01\u3000\uFF42\uFF59\u6B66\u7530',
    '\u52C9\u5F37\u306E\u5408\u9593\u306B\u30E9\u30FC\u30E1\u30F3\u98DF\u3079\u3066\u3053\u3044\u3000\uFF42\uFF59\u6B66\u7530',
    '\u53D7\u304B\u3063\u305F\u3089\u795D\u676F\u3060\u306A\uFF01\u3000\uFF42\uFF59\u6B66\u7530',
    '\u6BCE\u65E5\u30B3\u30C4\u30B3\u30C4\u3001\u305D\u308C\u304C\u4E00\u756A\u5F37\u3044\u3000\uFF42\uFF59\u6B66\u7530',
    '\u5FDC\u63F4\u3057\u3066\u308B\u305C\u3000\uFF42\uFF59\u6B66\u7530',
  ],
  // Home page greeting (time-based)
  greeting: {
    morning: [
      'Good morning! Early study = strong results.',
      'Morning session! Fresh brain, fresh start.',
    ],
    afternoon: [
      'Afternoon study session \u2014 let\'s keep the momentum.',
      'Post-lunch learning! Stay sharp.',
    ],
    evening: [
      'Evening grind! Consistency wins exams.',
      'Night owl mode! Tomorrow you\'ll be glad you studied.',
    ],
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Cooldown for Takeda messages: at most once per 10 minutes (#28)
const TAKEDA_COOLDOWN_KEY = 'sg_broker_takeda_last';
const TAKEDA_COOLDOWN_MS = 10 * 60 * 1000;

export function shouldShowTakedaMessage() {
  try {
    const last = parseInt(localStorage.getItem(TAKEDA_COOLDOWN_KEY) || '0', 10);
    if (Date.now() - last < TAKEDA_COOLDOWN_MS) return false;
    if (Math.random() >= 0.15) return false;
    localStorage.setItem(TAKEDA_COOLDOWN_KEY, Date.now().toString());
    return true;
  } catch { return false; }
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export function getEncouragement(type, opts = {}) {
  if (type === 'greeting') {
    return pick(ENCOURAGEMENT.greeting[getTimeOfDay()]);
  }
  if (type === 'streak' && opts.n) {
    return pick(ENCOURAGEMENT.streak).replace('{n}', opts.n);
  }
  const pool = ENCOURAGEMENT[type];
  return pool ? pick(pool) : '';
}
