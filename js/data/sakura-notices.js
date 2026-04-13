/**
 * Sakura Notices — one-time LINE-style messages from Sakura
 *
 * To add a new notice:
 *   1. Add an object to NOTICES array below
 *   2. That's it. Home view handles display, localStorage flag, and GAS logging.
 *
 * Each notice is shown once (newest first). Only one notice per app launch.
 */

const NOTICES = [
  {
    id: '2026-03-21-question-fix',
    label: 'BI/PGI translation fix + new questions',
    messages: [
      'お知らせがあります！',
      'Business Interruption と PGI の一部の問題で、日本語訳に間違いがありました……ごめんなさい🙇‍♀️',
      'フィードバックをもとに修正しました。片岡さん、報告ありがとうございます！',
      'お詫びに……BI の問題を 20問 追加しました！💪',
      '新しい問題もぜひチャレンジしてみてくださいね 🌸'
    ]
  },
  {
    id: '2026-04-11-feedback-update',
    label: 'Tooltip fix + Textbook Reference',
    messages: [
      '片岡さん！武田さんからフィードバック伺いました 🙌',
      '0.2秒……無理ですよね苦笑　早速修正しました！タップでしっかり表示されるようになっています✨',
      '他にも何かあれば遠慮せずじゃんじゃん言ってくださいね！',
      'もうひとつ、なんとご要望を受けて教科書がアプリ上で見れるようになりました！📖',
      'ホーム画面の「Textbook」からどうぞ。章立てで全文が読めて、キーワード検索もできます🔍',
      '各セクションに関連問題もリンクされているので、教科書→問題→教科書…のループで復習できますよ！',
      '試験勉強にも、試験後のリファレンスにも活用してくださいね 🌸',
    ]
  },
  {
    id: '2026-04-14-tooltip-fix-v2',
    label: 'Keyword tooltip tap-to-stay fix',
    messages: [
      '片岡さん、用語の定義の件……今度こそ直しました！🙇‍♀️',
      '前回「直した」って言ったのに、まだ0.2秒だったんですよね……本当にすみません💦',
      '今回はタップしたら定義がそのまま表示され続けるように変えました！もう一度タップするか、他の場所をタップすると閉じます 👆',
      'ダークモードで文字が読みにくかった背景色も濃くしています🌙',
      '今度こそ、じっくり読めるはずです……！ぜひ試してみてください 🌸',
    ]
  },
];

const KEY_PREFIX = 'sg_broker_notice_seen_';

/**
 * Returns the first unseen notice, or null.
 */
export function getUnseenNotice() {
  // Newest first — later entries in the array take priority
  for (let i = NOTICES.length - 1; i >= 0; i--) {
    const notice = NOTICES[i];
    if (!localStorage.getItem(KEY_PREFIX + notice.id)) {
      return notice;
    }
  }
  return null;
}

/**
 * Mark a notice as seen.
 */
export function markNoticeSeen(noticeId) {
  localStorage.setItem(KEY_PREFIX + noticeId, '1');
}
