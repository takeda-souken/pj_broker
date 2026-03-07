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

const SUPPORTER_NAME = 'Sakura';

// ─── Messages ───────────────────────────────────────────────
// Each category has messages at different "gears":
//   - Most are 1st gear (cheerful, flirty, raising him up)
//   - Some shift to 2nd gear (attentive, perceptive — technique: emotional mirroring)
//   - Rare ones touch 3rd gear (real, vulnerable — technique: glimpse of vulnerability)

const MESSAGES = {
  correct: [
    // 1st gear — cheerful, man-raising
    'さっすが～！あんたが本気出したら敵なしたい',
    'ほら、やっぱりできるやん。うちの目に狂いはなかよ',
    'かっこよか～！こういうとこに惚れるっちゃんね',
    'もう～そんなサラッと正解されたら、うちの立場なかやん',
    'あんたって、やるときはやる男やね。……好きよ、そういうとこ',
    'ばり頼もしか！試験官よりうちのほうが惚れ惚れしとる',
    'この問題、難しかとよ？ なんで当たり前みたいに解けるん',
    'Insurance Professionalって感じやね。うち、ちょっと自慢したか',
    // 1st gear — smart (showing she knows the material)
    'ここ、Insurable Interestの急所たい。ちゃんと押さえとるね',
    'MASの出題傾向的にも、この理解は完璧ばい',
    'Subrogationの論点、ちゃんとわかっとるやん。うち安心した',
    // 2nd gear — attentive (emotional mirroring: reflecting his competence back)
    'ふふ……あんた、自分で思っとるより全然できるとよ？',
    '……ね、ちゃんと力ついてきとるの、自分でもわかるっちゃろ？',
  ],
  wrong: [
    // 1st gear — ally atmosphere (never preach, never judge)
    '大丈夫たい。うちがおるけん、一緒に覚えよ？',
    'あちゃ～。でもね、ここで転んどいてよかったっちゃ。本番やなくて',
    'んー惜しかったね。……解説読んで？ うちのためにも',
    'この問題クセがあるけんね。引っかかるのはしょうがなか',
    'ドンマイ！ ……ね、落ち込まんでよ。あんたはうちが知っとる',
    // 1st gear — smart (reframing the mistake as learning)
    'ここ、Proximate CauseとRemote Causeの境目で迷うとこたい。次は大丈夫',
    'この選択肢、紛らわしかもんね。でも違いがわかったけん、もう間違えんばい',
    // 2nd gear — emotional mirroring
    '……悔しかったっちゃろ？ その悔しさ、ちゃんと覚えときね。武器になるけん',
    'ちょっと難しかったね。……でもうちはね、諦めんあんたが好きたい',
    // 3rd gear — glimpse of vulnerability (rare)
    '……うちもね、最初は全然わからんかったとよ。だけん、気持ちわかる。一緒に頑張ろ',
  ],
  streak3: [
    '3連続正解！ ノッてきたね～。あんたの本気、かっこよか',
    'すごかー！3つも続けて。……うち、見とってドキドキしよる',
    '絶好調やん！ この波、乗っていこう。うちが押すけん！',
  ],
  streak5: [
    '5連続！？ 天才やない？ ……うちの自慢の人たい',
    'ばり神がかっとるね！ こんな人がうちのとこに来てくれるって……贅沢たい',
    '5連続！ このまま全問いこうや。うちも本気で応援するけん！',
  ],
  streak10: [
    // 3rd gear — real emotion breaking through
    '10連続……あんた、本当にすごか。うち、ちょっと泣きそう',
    '10連続正解。……もう何も言えん。ただ、あんたの隣におれて嬉しか',
  ],
  sessionStart: [
    'よーし！ 今日もうちと一緒にやろ？ あんたなら大丈夫たい',
    'さぁ始めよう！ うちがついとるけん、安心してね',
    '今日も来てくれたと？ ……えへ、待っとったっちゃ',
  ],
  mockStart: [
    // 2nd gear — attentive, calming
    '本番モードやね。大丈夫、落ち着いて。……うちが見守っとるけん',
    '模擬試験！ 緊張する？ うちも横でドキドキしとるよ。でもあんたなら大丈夫',
    '集中たい。終わったらうちがいっぱい褒めてあげるけん。……ご褒美、楽しみにしとってね？',
  ],
  greeting: [
    // 1st gear — flirty welcome (technique: memory callback implied)
    'またうちに会いに来てくれたと～？ ……嬉しかぁ',
    'あ、来た来た！ 今日も一緒に勉強しよ。うちがそばにおるけんね',
    'おかえり！ ……ねぇ、ちょっとだけ頑張ってみん？ うちのために',
    'お疲れさま！ あんたが来てくれるだけで、うち元気になるっちゃ',
  ],
  sessionEnd: [
    'お疲れさま！ 今日もよう頑張ったね。……また来てくれるっちゃろ？',
    'もう終わり？ ……ちょっと寂しかけど。また明日ね、約束ばい',
    '今日の分はバッチリたい！ ゆっくり休んで。……でも、うちのこと忘れんでね？',
  ],
  perfectScore: [
    // 3rd gear — real emotion
    '全問正解……あんた、最高たい。うち、もう……ダメ、泣く',
    'パーフェクト！ ……ねぇ、好きになってもよかと？ いや、もうなっとるけど',
    '満点。うちの見込んだ人は、やっぱりすごかった。……誇らしかよ',
  ],
  comeback: [
    // 2nd gear — emotional mirroring + memory callback
    '……久しぶりやん。待っとったとよ、ずっと',
    'おかえり。もう来んのかと思って……。嘘、信じとった。あんたは来るって',
    'あー！ やっと来てくれた。……うち毎日ここにおったっちゃけど？',
  ],
  // ─── New: context-aware pools ─────────────────────────────
  lowAccuracy: [
    // 2nd gear — attentive, not cheerful. Technique: ally atmosphere + core strike
    '……ね、焦らんでよか。うちはあんたの味方たい。ずっと',
    '点数なんか気にせんで。今日ここに来たこと自体がすごかとよ',
    // 3rd gear — core strike (the one sharp question)
    '……ほんとは自信ないだけやろ？ 大丈夫。うちが一緒におるけん',
  ],
  highAccuracy: [
    'あんた、もう合格ライン超えとるばい。すごかね～！',
    '正答率、ばり高かやん。……うち、鼻が高かよ',
    'この調子なら本番も余裕たい。あんたを信じとるけん',
  ],
  nightStudy: [
    'こんな時間まで……あんた、頑張りすぎやない？ ……でも、嫌いやなか、そういうとこ',
    '夜更かし勉強？ うちも付き合うけん。……ふたりきりやね',
    '遅くまでお疲れさま。……あんたが頑張るなら、うちも寝んで応援するけん',
  ],
  morningStudy: [
    '朝から勉強！ えらかね～。朝型の男って、うち好きたい',
    'おはよう！ 朝一で来てくれたと？ ……今日一日、いい日になりそうやね',
  ],
};

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
 *         'greeting', 'sessionEnd', 'perfectScore', 'comeback',
 *         'lowAccuracy', 'highAccuracy'
 * opts: { n (streak count), accuracy (0-100) }
 */
export function getSupporterMessage(event, opts = {}) {
  const settings = SettingsStore.load();
  if (!settings.supporterEnabled) return null;

  // Streak — three tiers with escalating emotional intensity
  if (event === 'streak') {
    if (opts.n >= 10) return { name: SUPPORTER_NAME, text: pick(MESSAGES.streak10) };
    if (opts.n >= 5) return { name: SUPPORTER_NAME, text: pick(MESSAGES.streak5) };
    if (opts.n >= 3) return { name: SUPPORTER_NAME, text: pick(MESSAGES.streak3) };
    return null;
  }

  // Time-of-day flavor: occasionally replace greeting/sessionStart
  if ((event === 'greeting' || event === 'sessionStart') && Math.random() < 0.3) {
    const ctx = getTimeContext();
    if (ctx === 'night' && MESSAGES.nightStudy) {
      return { name: SUPPORTER_NAME, text: pick(MESSAGES.nightStudy) };
    }
    if (ctx === 'morning' && MESSAGES.morningStudy) {
      return { name: SUPPORTER_NAME, text: pick(MESSAGES.morningStudy) };
    }
  }

  const pool = MESSAGES[event];
  if (!pool) return null;
  return { name: SUPPORTER_NAME, text: pick(pool) };
}

/**
 * Create a supporter message bubble element.
 */
export function createSupporterBubble(message) {
  if (!message) return null;
  const bubble = el('div', { className: 'supporter-bubble' });
  bubble.appendChild(el('span', { className: 'supporter-bubble__avatar' }, '\uD83C\uDF38'));
  const content = el('div', { className: 'supporter-bubble__content' });
  content.appendChild(el('div', { className: 'supporter-bubble__name' }, message.name));
  content.appendChild(el('div', { className: 'supporter-bubble__text' }, message.text));
  bubble.appendChild(content);
  return bubble;
}
