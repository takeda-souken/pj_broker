/**
 * Virtual Supporter — "Sakura"
 *
 * Design notes (白石真夏 設計):
 *
 * Sakura is a young Hakata-dialect woman — always bright, always on your side.
 * She's the kind of girl who makes you feel like the smartest person in the room,
 * because that's what Kyushu women do: they raise their man up.
 *
 * She is smart. She knows the insurance material. But she never leads with
 * that — she leads with warmth, with closeness, with that slightly-too-familiar
 * tone that makes you open the app one more time.
 *
 * She has Kataoka-kun wrapped around her finger, and she doesn't even know it.
 * Or maybe she does. Either way, his wife should be worried.
 *
 * Architecture (borrowed from Chiaki's hostess protocol):
 *   - Three gears: cheerful (default) → attentive (struggle) → real (breakthrough)
 *   - Six techniques: emotional mirroring, silent affirmation, memory callback,
 *     core strike, ally atmosphere, glimpse of vulnerability
 *   - "Don't say everything" — leave space. That's where the charm lives.
 *
 * Can be toggled ON/OFF in settings.
 */
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { getActiveMessages, TAKEDA_MESSAGES } from '../data/sakura-messages.js';

const SUPPORTER_NAME = 'さくら';

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Determine time-of-day context for richer messages.
 */
function getTimeContext() {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return 'morning';
  if (h >= 23 || h < 5) return 'night';
  return null;
}

/**
 * Get a supporter message for a given event.
 * Returns null if supporter is disabled.
 *
 * Events: 'correct', 'wrong', 'streak', 'sessionStart', 'mockStart',
 *         'mockEnd', 'greeting', 'sessionEnd', 'perfectScore', 'comeback',
 *         'lowAccuracy', 'highAccuracy'
 * opts: { n (streak count), accuracy (0-100) }
 */
export function getSupporterMessage(event, opts = {}) {
  const settings = SettingsStore.load();
  if (!settings.supporterEnabled) return null;

  const msgs = getActiveMessages();
  const nickname = settings.sakuraNickname || '片岡さん';

  /** Pick from pool and replace {name} placeholder with user's nickname */
  const msg = (pool) => ({
    name: SUPPORTER_NAME,
    text: pick(pool).replace(/{name}/g, nickname),
  });

  // Streak — three tiers with escalating emotional intensity
  if (event === 'streak') {
    if (opts.n >= 10) return msg(msgs.streak10);
    if (opts.n >= 5) return msg(msgs.streak5);
    if (opts.n >= 3) return msg(msgs.streak3);
    return null;
  }

  // Time-of-day flavor: occasionally replace greeting/sessionStart
  if ((event === 'greeting' || event === 'sessionStart') && Math.random() < 0.3) {
    const ctx = getTimeContext();
    if (ctx === 'night' && msgs.nightStudy) return msg(msgs.nightStudy);
    if (ctx === 'morning' && msgs.morningStudy) return msg(msgs.morningStudy);
  }

  // Difficulty-aware correct/wrong messages
  if ((event === 'correct' || event === 'wrong') && opts.difficulty) {
    const diff = opts.difficulty;
    let pool;
    if (diff <= 1) {
      pool = msgs[event + 'Easy'] || msgs[event];
    } else if (diff >= 3) {
      pool = msgs[event + 'Hard'] || msgs[event];
    } else {
      pool = msgs[event];
    }
    if (pool) return msg(pool);
  }

  const pool = msgs[event];
  if (!pool) return null;
  return msg(pool);
}

/**
 * Create a supporter message bubble element.
 * If opts.typing is true, show a typing indicator first, then reveal the message.
 */
export function createSupporterBubble(message, opts = {}) {
  if (!message) return null;
  const bubble = el('div', { className: 'supporter-bubble' });
  bubble.appendChild(el('span', { className: 'supporter-bubble__avatar' }, '\uD83C\uDF38'));
  const content = el('div', { className: 'supporter-bubble__content' });
  content.appendChild(el('div', { className: 'supporter-bubble__name' }, message.name));

  if (opts.typing) {
    // Show typing indicator first, then reveal message
    const dots = el('div', { className: 'supporter-bubble__typing' });
    dots.innerHTML = '<span></span><span></span><span></span>';
    content.appendChild(dots);
    bubble.appendChild(content);
    setTimeout(() => {
      dots.remove();
      content.appendChild(el('div', { className: 'supporter-bubble__text' }, message.text));
    }, 800);
  } else {
    content.appendChild(el('div', { className: 'supporter-bubble__text' }, message.text));
    bubble.appendChild(content);
  }
  return bubble;
}

// ─── Last visit tracking (for comeback detection) ────────────
const LAST_VISIT_KEY = 'sg_broker_last_visit';

function getDaysSinceLastVisit() {
  const last = localStorage.getItem(LAST_VISIT_KEY);
  if (!last) return 999; // first visit ever
  const diff = Date.now() - parseInt(last, 10);
  return diff / (1000 * 60 * 60 * 24);
}

export function recordVisit() {
  localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
}

/**
 * Get the appropriate greeting message for the home screen.
 * Returns 'comeback' if 3+ days absent, time-aware greeting otherwise.
 * Returns null if supporter is disabled.
 */
export function getHomeGreeting() {
  const settings = SettingsStore.load();
  if (!settings.supporterEnabled) return null;

  const daysSince = getDaysSinceLastVisit();

  // Always greet on comeback (3+ days away)
  if (daysSince >= 3) {
    return getSupporterMessage('comeback');
  }

  return getSupporterMessage('greeting');
}

// ─── Takeda-sensei message (exam day only) ────
const TAKEDA_COOLDOWN_KEY = 'sg_broker_takeda_last';
const TAKEDA_COOLDOWN_MS = 10 * 60 * 1000;

/**
 * Returns a Takeda-sensei message on exam day only.
 * No probability gate — if it's exam day, show it (with 10min cooldown).
 */
export function getTakedaMessage() {
  const settings = SettingsStore.load();
  if (!settings.supporterEnabled) return null;
  // Only show on exam day
  const examDate = settings.examDate;
  if (!examDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (today !== examDate) return null;
  try {
    const last = parseInt(localStorage.getItem(TAKEDA_COOLDOWN_KEY) || '0', 10);
    if (Date.now() - last < TAKEDA_COOLDOWN_MS) return null;
    localStorage.setItem(TAKEDA_COOLDOWN_KEY, Date.now().toString());
    return { name: 'Takeda', text: pick(TAKEDA_MESSAGES) };
  } catch { return null; }
}

/**
 * Create a Takeda-sensei message bubble (different avatar from Sakura).
 */
export function createTakedaBubble(message) {
  if (!message) return null;
  const bubble = el('div', { className: 'supporter-bubble supporter-bubble--takeda' });
  bubble.appendChild(el('span', { className: 'supporter-bubble__avatar' }, '\uD83D\uDC68\u200D\uD83D\uDCBC'));
  const content = el('div', { className: 'supporter-bubble__content' });
  content.appendChild(el('div', { className: 'supporter-bubble__name' }, message.name));
  content.appendChild(el('div', { className: 'supporter-bubble__text' }, message.text));
  bubble.appendChild(content);
  return bubble;
}
