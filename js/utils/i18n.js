/**
 * Internationalization utility
 * Language modes:
 *   'ja'        — Japanese UI text (questions remain in English)
 *   'en'        — English only, no Japanese anywhere
 *   'bilingual' — English main + small Japanese annotation below
 */
import { SettingsStore } from '../models/settings-store.js';
import { el } from './dom-helpers.js';

const JA = {
  // Home
  'home.subtitle': 'BCP & ComGI 学習ガイド',
  'home.examIn': '試験まで',
  'home.days': '日',
  'home.examDate': '(4月30日)',
  'home.today': '今日: {0}問',
  'home.accuracy': '正答率 {0}%',
  'home.bcpAccuracy': 'BCP 正答率',
  'home.comgiAccuracy': 'ComGI 正答率',
  'home.topicsMastered': 'マスター済',
  'home.overall': '全体: {0}/{1} トピック習得 ({2}%)',
  'home.studyBcp': 'BCP を学ぶ',
  'home.bcpSub': '基本概念と原則',
  'home.studyComgi': 'ComGI を学ぶ',
  'home.comgiSub': '企業総合保険',
  'home.glossary': '用語集',
  'home.glossarySub': '保険用語 (英/日)',
  'home.mrt': 'MRT 進捗マップ',
  'home.mrtSub': '学習の旅を追跡',
  'home.records': '学習記録',
  'home.recordsSub': '学習履歴と統計',
  'home.settings': '設定',
  'home.continue': '{0} {1} を続ける',
  'home.continueDetail': '{0}/{1}問目 ({2}問回答済)',
  'home.lifeTip': 'SG 生活のコツ',
  'home.didYouKnow': '豆知識',
  'home.sightseeing': '観光スポット',
  'home.transport': '交通情報',
  'home.back': '戻る',
  'home.mixedPractice': 'ミックス練習',
  'home.mixedSub': '両モジュールからランダム出題',
  'home.trivia': 'SG 豆知識',
  'home.triviaSub': 'シンガポールの面白い事実',
  'home.studyStreak': '連続学習: {0}日',
  'home.goalDone': '今日の目標達成！ ({0}/{1})',
  'home.goalProgress': '今日: {0}/{1}問',
  'home.quickQuiz': 'クイック手習 (5問)',
  'result.share': '結果をシェア',

  // Mode select
  'mode.study': '{0} を学ぶ',
  'mode.welcome': 'ようこそ！',
  'mode.welcomeText': 'まず「練習 (10問)」で慣れましょう。慣れたら模擬試験で本番シミュレーション！',
  'mode.practice10': '練習 (10問)',
  'mode.practice10sub': 'ランダム出題、タイマーなし',
  'mode.practice20': '練習 (20問)',
  'mode.practice20sub': '拡張練習セッション',
  'mode.weakTopics': '苦手トピック',
  'mode.weakTopicsSub': '{0}つの苦手分野に集中',
  'mode.mock': '模擬試験',
  'mode.mockBcpSub': '40問 / 45分 — 本番シミュレーション',
  'mode.mockComgiSub': '50問 / 75分 — 本番シミュレーション',
  'mode.byTopic': 'トピック別練習',
  'mode.questions': '{0}問',
  'mode.accuracyPct': '正答率{0}%',

  // Quiz
  'quiz.loading': '問題を読み込み中...',
  'quiz.noQuestions': 'まだ問題がありません。',
  'quiz.backHome': 'ホームに戻る',
  'quiz.next': '次へ',
  'quiz.seeResults': '結果を見る',
  'quiz.correct': '正解！',
  'quiz.incorrect': '不正解',
  'quiz.progressSaved': '進捗を保存しました',
  'quiz.bookmark': 'ブックマーク',
  'quiz.bookmarked': 'ブックマーク済',
  'quiz.examRelevant': '試験に出る',
  'quiz.timesUp': '時間切れ！',
  'quiz.mockExamLabel': '{0} 模擬試験',

  // Result
  'result.title': '{0} {1} 結果',
  'result.mockExam': '模擬試験',
  'result.practice': '練習',
  'result.excellent': '素晴らしい！',
  'result.passed': '合格！',
  'result.almost': 'あと少し！',
  'result.keepStudying': 'もっと勉強しよう！',
  'result.correct': '正解',
  'result.wrong': '不正解',
  'result.total': '合計',
  'result.time': '時間',
  'result.avgPerQ': '平均/問',
  'result.byTopic': 'トピック別',
  'result.topic': 'トピック',
  'result.score': 'スコア',
  'result.drill': '特訓',
  'result.reviewWrong': '間違えた{0}問を復習',
  'result.studyAgain': 'もう一度学ぶ',
  'result.home': 'ホーム',

  // Settings
  'settings.title': '設定',
  'settings.studyMode': '学習モード',
  'settings.kataokaMode': '片岡モード',
  'settings.standardMode': 'スタンダード',
  'settings.kataokaDesc': '個人応援メッセージ＆片岡さん向け特別機能',
  'settings.standardDesc': '通常の学習モード',
  'settings.theme': 'テーマ',
  'settings.darkMode': 'ダークモード',
  'settings.quizOptions': '手習オプション',
  'settings.timer': '問題ごとのタイマー',
  'settings.timerDramatic': 'タイマー演出効果',
  'settings.showExplanation': '回答後に解説を表示',
  'settings.trivia': '問題の間にSGトリビア',
  'settings.weakFocus': '苦手集中（苦手トピックを優先）',
  'settings.supporter': 'さくら（バーチャルサポーター）',
  'settings.language': '言語モード',
  'settings.data': 'データ',
  'settings.clearRecords': '全記録を消去',
  'settings.clearConfirm': '学習記録をすべて削除しますか？この操作は取り消せません。',
  'settings.cleared': '記録を消去しました',
  'settings.about': 'アプリについて / バージョン履歴',

  // Glossary
  'glossary.title': '保険用語集',
  'glossary.searchBilingual': '英語または日本語で検索...',
  'glossary.searchEn': '用語を検索...',
  'glossary.noResults': '結果なし。',
  'glossary.terms': '{0}件',
  'glossary.allFilter': 'すべて',
  'glossary.bookmarks': 'ブックマーク',

  // Records
  'records.title': '学習記録',
  'records.noRecords': 'まだ記録がありません。学習を始めましょう！',
  'records.total': '全体',
  'records.attempts': '回答数',
  'records.accuracy': '正答率',
  'records.mastered': '習得済',
  'records.correctVsWrong': '正解 vs 不正解',
  'records.dailyAccuracy': '日別正答率',
  'records.topicAccuracy': 'トピック別正答率',
  'records.byModule': 'モジュール別',
  'records.weaknessAnalysis': '弱点分析',
  'records.weakTopics': '苦手トピック',
  'records.declining': '下降中',
  'records.improving': '上昇中',
  'records.chartCorrect': '正解',
  'records.chartWrong': '不正解',
  'records.chartAccuracy': '正答率 %',
  'records.chartQuestions': '問題数',
  'records.todayGoal': '今日 → 目標: 4月30日',
  'records.noData': 'データなし',
  'records.chartUnavailable': 'チャートを利用できません',
  'records.weakFocusOn': '苦手集中 ON — 練習では苦手トピックが優先されます',
  'records.weakFocusOff': '苦手集中 OFF — 練習ではランダムに出題されます',
  'records.topic': 'トピック',
  'records.acc': '正答率',
  'records.streak': '連続',
  'records.moduleSummary': '{0}回 · {1}% · {2}個習得',

  // Trivia
  'trivia.title': 'シンガポール豆知識',
  'trivia.noData': '豆知識データがありません。',
  'trivia.all': 'すべて',

  // MRT
  'mrt.title': 'MRT 進捗マップ',

  // About
  'about.title': 'アプリについて',

  // Module select
  'module.title': 'モジュールを選ぶ',
  'module.bcpFull': '基本概念と原則',
  'module.comgiFull': '企業総合保険',
  'module.bcpDetail': '40問 \u2022 45分 \u2022 70%で合格',
  'module.comgiDetail': '50問 \u2022 75分 \u2022 70%で合格',

  // Quiz extras
  'quiz.skip': 'スキップ',

  // Settings extras
  'settings.dailyGoal': '1日の目標',
  'settings.goal10': '10問/日',
  'settings.goal20': '20問/日',
  'settings.goal30': '30問/日',
  'settings.goal50': '50問/日',
  'settings.goalOff': 'オフ',
  'settings.goalUpdated': '目標を更新しました',
  'settings.achievements': '実績',
  'settings.journal': '誤答ノート',

  // Achievements
  'achievements.title': '実績',
  'achievements.unlocked': '解除済み',
  'achievements.stats': '統計データ',

  // Journal
  'journal.title': '誤答ノート',
  'journal.empty': 'まだ誤答がありません！この調子で！',

  // Common
  'common.back': '戻る',
  'common.bookmarkRemoved': 'ブックマークを削除しました',
  'common.bookmarkAdded': '{0}件ブックマーク追加',
};

/**
 * Get the current language mode
 */
export function getLangMode() {
  return SettingsStore.get('langMode') || 'bilingual';
}

/**
 * Whether to show Japanese text (jp comparison, trivia JP, glossary JP)
 */
export function showJp() {
  const mode = getLangMode();
  return mode === 'ja' || mode === 'bilingual';
}

/**
 * Get translated string or fallback to English default
 * ja → Japanese, en → fallback, bilingual → fallback
 */
export function tr(key, fallback, ...args) {
  const mode = getLangMode();
  if (mode === 'ja') {
    let str = JA[key];
    if (!str) return fallback;
    for (let i = 0; i < args.length; i++) {
      str = str.replace(`{${i}}`, args[i]);
    }
    return str;
  }
  return fallback;
}

/**
 * Get Japanese annotation for bilingual mode.
 * Returns JP string in bilingual mode, null otherwise.
 */
function jpOf(key, ...args) {
  let str = JA[key];
  if (!str) return null;
  for (let i = 0; i < args.length; i++) {
    str = str.replace(`{${i}}`, args[i]);
  }
  return str;
}

/**
 * Create a bilingual-aware text node or fragment.
 * - ja mode:        returns Japanese text
 * - en mode:        returns English text
 * - bilingual mode: returns English text + small JP annotation below
 *
 * Usage: parent.appendChild(trNode('key', 'English text', ...args))
 * Returns a Node (Text or DocumentFragment)
 */
export function trNode(key, fallback, ...args) {
  const mode = getLangMode();
  if (mode === 'ja') {
    let str = JA[key] || fallback;
    for (let i = 0; i < args.length; i++) {
      str = str.replace(`{${i}}`, args[i]);
    }
    return document.createTextNode(str);
  }
  if (mode === 'bilingual') {
    const jp = jpOf(key, ...args);
    if (jp && jp !== fallback) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(fallback));
      const sub = document.createElement('span');
      sub.className = 'bilingual-sub';
      sub.textContent = jp;
      frag.appendChild(sub);
      return frag;
    }
  }
  return document.createTextNode(fallback);
}

/**
 * Create an element with bilingual text support.
 * Wrapper around el() that handles language modes.
 * - ja: element with JP text
 * - en: element with EN text
 * - bilingual: element with EN text + small JP annotation
 */
export function trEl(tag, attrs, key, fallback, ...args) {
  const mode = getLangMode();
  const element = el(tag, attrs);
  if (mode === 'ja') {
    let str = JA[key] || fallback;
    for (let i = 0; i < args.length; i++) {
      str = str.replace(`{${i}}`, args[i]);
    }
    element.textContent = str;
    return element;
  }
  element.textContent = fallback;
  if (mode === 'bilingual') {
    const jp = jpOf(key, ...args);
    if (jp && jp !== fallback) {
      const sub = document.createElement('span');
      sub.className = 'bilingual-sub';
      sub.textContent = jp;
      element.appendChild(sub);
    }
  }
  return element;
}
