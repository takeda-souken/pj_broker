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
  'home.examDate': '(試験日)',
  'home.sakuraAskExam': 'ねえ、試験の日もう決まった？ 設定しとくと、うちがカウントダウンするけん！',
  'home.setExamDate': '試験日を設定する',
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
  'home.studyPgi': 'PGI を学ぶ',
  'home.pgiSub': '個人総合保険',
  'home.studyHi': 'HI を学ぶ',
  'home.hiSub': '健康保険',
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
  'home.mixedSub': '全モジュールからランダム出題',
  'home.trivia': 'SG 豆知識',
  'home.triviaSub': 'シンガポールの面白い事実',
  'home.studyStreak': '連続学習: {0}日',
  'home.goalDone': '今日の目標達成！ ({0}/{1})',
  'home.goalProgress': '今日: {0}/{1}問',
  'home.quickQuiz': 'クイック手習 (5問)',
  'home.practice': '練習',
  'home.practiceSub': 'モジュールを選んで学習',
  'home.mock': '模擬試験',
  'home.mockSub': '本番形式のタイマー付き',
  'home.fun': 'お楽しみ',
  'home.funSub': 'MRT・ホーカーなど',
  'home.questionBank': '問題一覧',
  'home.questionBankSub': '出題頻度の管理',

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
  'mode.mockPgiSub': '50問 / 75分 — 本番シミュレーション',
  'mode.mockHiSub': '50問 / 75分 — 本番シミュレーション',
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
  'result.result': '結果',
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
  'result.questionReview': '問題レビュー',
  'result.expandAll': 'すべて展開',
  'result.collapseAll': 'すべて折りたたむ',
  'result.nextQuestion': '次の問題',
  'result.backToQBank': '問題一覧に戻る',
  'result.explanation': '解説',
  'result.achievementUnlocked': '実績解除！',

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
  'records.trophies': 'トロフィー',
  'records.studyDays': '学習日数',
  'records.bestDailyStreak': '最長連続 (日)',
  'records.unlockedTrophies': '解除済み',
  'records.viewAllAchievements': 'すべての実績を見る',

  // Achievement descriptions
  'ach.first_quiz': '初めてのクイズを完了',
  'ach.ten_quizzes': 'クイズを10回完了',
  'ach.fifty_quizzes': 'クイズを50回完了',
  'ach.streak_5': '5問連続正解',
  'ach.streak_10': '10問連続正解',
  'ach.streak_20': '20問連続正解',
  'ach.perfect_10': '10問クイズで満点',
  'ach.mock_pass': '模擬試験に合格 (70%+)',
  'ach.mock_ace': '模擬試験で90%以上',
  'ach.both_modules': '全4モジュールを学習',
  'ach.five_topics': '5つのトピックを習得',
  'ach.all_topics': '全トピックを習得',
  'ach.hundred_correct': '100問正解',
  'ach.five_hundred': '合計500問に回答',

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
  'module.mockTitle': 'モジュールを選ぶ（模擬試験）',
  'module.bcpFull': '基本概念と原則',
  'module.comgiFull': '企業総合保険',
  'module.pgiFull': '個人総合保険',
  'module.hiFull': '健康保険',
  'module.bcpDetail': '40問 \u2022 45分 \u2022 70%で合格',
  'module.comgiDetail': '50問 \u2022 75分 \u2022 70%で合格',
  'module.pgiDetail': '50問 \u2022 75分 \u2022 70%で合格',
  'module.hiDetail': '50問 \u2022 75分 \u2022 70%で合格',

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
  'settings.examDate': '試験日',
  'settings.examDateUpdated': '試験日を更新しました',
  'settings.examDaysLeft': '試験まであと{0}日',
  'settings.examToday': '今日は試験日！ がんばって！',
  'settings.examDateHint': '試験日を設定するとカウントダウン＆特別メッセージが届きます',
  'settings.mockExam': '模試設定',
  'settings.mockExamDesc': 'デフォルト: すべてOFF（実際のCSE試験と同じ — 1問ごとのフィードバックなし）',
  'settings.mockShowResult': '1問ごとの正誤表示',
  'settings.mockShowExplanation': '1問ごとの解説表示',
  'settings.mockShowEffects': 'マスター演出（マーライオン等）',
  'settings.achievements': '実績',
  'settings.journal': '誤答ノート',

  // Achievements
  'achievements.title': '実績',
  'achievements.unlocked': '解除済み',
  'achievements.stats': '統計データ',

  // Journal
  'journal.title': '誤答ノート',
  'journal.empty': 'まだ誤答がありません！この調子で！',

  // Report
  'report.title': '問題を報告',
  'report.placeholder': '問題の内容を記入してください...',
  'report.send': '送信',
  'report.cancel': 'キャンセル',
  'report.sent': '報告を送信しました。ありがとうございます！',

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
 * Now delegates to triText() for CSS-based i18n — no re-render needed on language switch.
 *
 * Usage: parent.appendChild(trNode('key', 'English text', ...args))
 * Returns a DocumentFragment with .i18n-ja / .i18n-en / .i18n-sub spans.
 */
export function trNode(key, fallback, ...args) {
  return triText(key, fallback, ...args);
}

/**
 * Create a pre-rendered trilingual node (CSS-based i18n).
 * All three language variants are in the DOM simultaneously;
 * visibility is controlled by [data-lang] on <html>.
 *
 *   ① .i18n-ja  — Japanese main text    (visible in JA mode)
 *   ② .i18n-en  — English main text     (visible in EN & bilingual)
 *   ③ .i18n-sub — Japanese sub-annotation (visible in bilingual only)
 *
 * Returns a DocumentFragment. No re-render needed on language switch.
 */
export function triText(key, enText, ...args) {
  // Resolve English text with args
  let enStr = enText;

  // Resolve Japanese text
  let jaStr = JA[key] || enText;
  for (let i = 0; i < args.length; i++) {
    jaStr = jaStr.replace(`{${i}}`, args[i]);
  }

  const wrap = document.createElement('span');
  wrap.className = 'i18n-wrap';

  // ① Japanese main
  const ja = document.createElement('span');
  ja.className = 'i18n-ja';
  ja.textContent = jaStr;
  wrap.appendChild(ja);

  // ② English main
  const en = document.createElement('span');
  en.className = 'i18n-en';
  en.textContent = enStr;
  wrap.appendChild(en);

  // ③ Japanese sub-annotation (only if JP text differs from EN)
  if (jaStr !== enStr) {
    const sub = document.createElement('span');
    sub.className = 'i18n-sub';
    sub.textContent = jaStr;
    wrap.appendChild(sub);
  }

  return wrap;
}

/**
 * Create an element with trilingual text (CSS-based i18n).
 * Wrapper around el() + triText() — no re-render needed on language switch.
 */
export function trEl(tag, attrs, key, fallback, ...args) {
  const element = el(tag, attrs);
  element.appendChild(triText(key, fallback, ...args));
  return element;
}

/**
 * Create trilingual node from dynamic content (not dictionary-keyed).
 * Same CSS-based pattern as triText but takes EN/JA strings directly.
 * If jaText is falsy, renders enText only (graceful fallback for untranslated data).
 */
export function triContent(enText, jaText) {
  if (!jaText || jaText === enText) return document.createTextNode(enText);
  const wrap = document.createElement('span');
  wrap.className = 'i18n-wrap';
  const ja = document.createElement('span');
  ja.className = 'i18n-ja';
  ja.textContent = jaText;
  wrap.appendChild(ja);
  const en = document.createElement('span');
  en.className = 'i18n-en';
  en.textContent = enText;
  wrap.appendChild(en);
  const sub = document.createElement('span');
  sub.className = 'i18n-sub';
  sub.textContent = jaText;
  wrap.appendChild(sub);
  return wrap;
}

/**
 * Like triContent but sets innerHTML instead of textContent.
 * Use for content with embedded HTML (e.g. keyword highlights).
 */
export function triHtml(enHtml, jaHtml) {
  if (!jaHtml || jaHtml === enHtml) {
    const span = document.createElement('span');
    span.innerHTML = enHtml;
    return span;
  }
  const wrap = document.createElement('span');
  wrap.className = 'i18n-wrap';
  const ja = document.createElement('span');
  ja.className = 'i18n-ja';
  ja.innerHTML = jaHtml;
  wrap.appendChild(ja);
  const en = document.createElement('span');
  en.className = 'i18n-en';
  en.innerHTML = enHtml;
  wrap.appendChild(en);
  const sub = document.createElement('span');
  sub.className = 'i18n-sub';
  sub.innerHTML = jaHtml;
  wrap.appendChild(sub);
  return wrap;
}
