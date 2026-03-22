# Sakura System Audit — 2026-03-22
**Auditor**: 篠崎もも (implementation takeover)
**Scope**: arrivalDate gate bypass類似の設計穴を全探索
**Status**: Research only. コード変更なし。

---

## CRITICAL: arrivalDate 自動クリアによるフェーズ永久ロック

### 概要
`home.js` の `buildDateBadges()` が、入国日の **翌日** に `arrivalDate` を空文字にクリアする。
一方 `SakuraState._isBeforeArrival()` は `arrivalDate` が空のとき `true`（=未到着）を返す。
結果、**入国翌日以降、フェーズが永久に japan にロックされる**。

### 再現手順
1. arrivalDate = '2026-04-01' を設定
2. 4/1 当日: `_isBeforeArrival()` = false。正常にsg_early遷移可能
3. 4/2: home画面を開く → `buildDateBadges()` が `diff < 0` を検出 → `arrivalDate` を `''` にクリア
4. 以降: `_isBeforeArrival()` で `arrivalDate` が falsy → `return true` → **永久japan**

### 該当コード
- **クリア側**: `js/views/home.js:434-435`
  ```js
  if (diff < 0) {
    SettingsStore.set('arrivalDate', '');
  }
  ```
- **ゲート側**: `js/models/sakura-state.js:146-148`
  ```js
  const arrivalDate = SettingsStore.get('arrivalDate');
  if (!arrivalDate) return true; // no date = hasn't arrived yet
  ```

### 修正案
`_isBeforeArrival()` に「arrivalDate が空でも、一度でも sg_early 以降に遷移済みなら false を返す」ロジックを追加。
または `buildDateBadges()` でクリアする代わりに別のフラグ（`arrivalPassed: true`）を立てて、`_isBeforeArrival()` がそれを参照する。

### 深刻度: **S1 (Critical)**
片岡くんが4/2以降アプリを開いた瞬間に発火する。さくらの部屋も、SG系メッセージも、すべてjapanに戻る。

---

## HIGH: sakura-room-engine の getAvailableConversations() がフェーズを見ていない

### 概要
`getAvailableConversations()` は `unlock` 条件（minAnswered, daysSincePhase2, requiredFlags, etc.）のみでフィルタしており、
会話JSONに定義されている `"phase"` フィールド（"2-early", "2-mid", "3" 等）を **一切チェックしていない**。

### 影響
現時点では unlock 条件の数値（minAnswered, daysSincePhase2）が事実上のフェーズゲートとして機能しているため、
Phase 3 の会話が Phase 2-early で解放されることは **実質的にはない**（daysSincePhase2: 31 等の高い閾値がガード）。

ただし:
- **明示的なフェーズフィルタがない** ことは設計上の脆弱性
- unlock条件のチューニング次第でフェーズ飛び越えが起き得る
- heartbreak/ending 会話が phase3-a.json にあり、`requiredFlags: ["wife_revealed"]` でガードされてはいるが、
  フェーズそのものの確認（「現在heartbreakフェーズか？」）は行われていない

### 該当コード
- `js/models/sakura-room-engine.js:76-133` — `getAvailableConversations()`
- `data/sakura-room/*.json` — 各会話の `"phase"` フィールド（未使用）

### 修正案
`getAvailableConversations()` 内で `conv.phase` と現在のフェーズを照合するフィルタを追加。

### 深刻度: **M (Medium)** — 現時点では unlock 条件が事実上のガードとして機能

---

## HIGH: sakura-notices がフェーズゲートを一切持たない

### 概要
`sakura-notices.js` の `getUnseenNotice()` は localStorage の seen フラグのみをチェック。
SakuraState.getPhase() を参照せず、**どのフェーズでも表示される**。

`home.js:214-219` で `getUnseenNotice()` を呼び出し、unseen なら即表示。
フェーズ確認なし。

### 影響
現在の通知内容（2026-03-21-question-fix）は「問題の修正報告」であり、フェーズに依存しないため **実害なし**。

しかし、今後フェーズ依存の通知（例: SG到着祝い、heartbreak 後の励まし等）を追加する場合、
フェーズゲートがないと不適切なタイミングで表示される。

### 該当コード
- `js/data/sakura-notices.js:30-38` — `getUnseenNotice()`
- `js/views/home.js:214-219` — 呼び出し箇所

### 修正案
notice オブジェクトに `phase` フィールド（または `minPhase` / `maxPhase`）を追加し、
`getUnseenNotice()` 内で `SakuraState.getPhase()` と照合。

### 深刻度: **L (Low)** — 現在の通知内容では問題なし。将来のリスク。

---

## MEDIUM: SakuraRoomStore.initRoomUnlock() の呼び出しタイミング

### 概要
`initRoomUnlock()` は `sakura-room.js:40` でのみ呼ばれる。
sakura-room のルートハンドラは **まず `getPhase() === 'gone'` チェック（L34）** を行い、
gone でなければ `initRoomUnlock()` を呼ぶ（L40）。

### 分析
`isRoomAvailable()` が false（japan or gone）の場合、home.js でさくらドアが表示されないため、
ユーザーが sakura-room に到達すること自体がない。

ただし、**URLの直接入力** `#sakura-room` で到達可能。
その場合:
1. japan フェーズ → `getPhase() === 'gone'` は false → `initRoomUnlock()` が発火
2. roomUnlockDate が japan フェーズ中に記録される

これは **arrivalDate ゲートが効いている限り** 問題にならない（japan フェーズでは sg_early の会話は unlock されない）。
しかし上記 Critical バグとの複合で、予期しない状態が生まれ得る。

### 該当コード
- `js/views/sakura-room.js:32-40`
- `js/models/sakura-room-store.js:74-79`

### 修正案
`sakura-room.js` のルートハンドラ先頭で `!SakuraState.isRoomAvailable()` ならリダイレクト。

### 深刻度: **M (Medium)** — URL直打ちのエッジケース

---

## LOW: supporter.js (quiz encouragement) の設計確認

### 概要
`supporter.js` の `getSupporterMessage()` は `getActiveMessages()` 経由で
`SakuraState.getPhase()` を参照し、フェーズに応じたメッセージプールを返す。

### 分析
- `getActiveMessages()` (`sakura-messages.js:42-44`) は `SakuraState.getPhase()` を使用 → **arrivalDate ゲートが効く**
- gone フェーズでは `null` を返す → メッセージなし → 正常
- `getHomeGreeting()` (`supporter.js:149-158`) も `getSupporterMessage()` 経由 → ゲート済み

### 結論
supporter.js は **問題なし**。getPhase() を正しく使用している。

---

## LOW: debug-panel.js の直接 localStorage 読み書き

### 概要
`debug-panel.js:327, 345-358, 426-438` で `localStorage.getItem('sg_broker_sakura')` を直接読み書きしている。
`SakuraState` の `_load()` / `_save()` を経由していない。

### 影響
デバッグパネルはデバッグモードのみで使用されるため、本番への影響なし。
ただし、今後 `_load()` にバリデーションや追加ロジックを入れた場合、debug-panel がそれをバイパスする。

### 深刻度: **L (Low)** — デバッグ専用。本番影響なし。

---

## sakura-todo.md の更新状況

### 解決済み（チェック可能）
| TODO項目 | 状態 |
|---|---|
| japan → sg 遷移を AND 条件にする | **実装済み** — `_isBeforeArrival()` ゲートが checkTransition() に組み込まれている (sakura-state.js:193) |
| 入国「当日」にするか「数日後」にするか | **当日で実装** — `now < arrival` なので arrival day 当日は通過 |
| 入国日にさくらの特別メッセージ | **未実装** — `phaseEvents.sg_arrival` は定義のみ、使われていない |
| 入国確認イベント | **未実装** |
| Phase1 台詞チェック | **要確認** — Phase1メッセージにSG準備系の台詞あり (sakura-phase1.js:81-90)。japan フェーズで「シンガポールで使う知識」等。内容的には準備文脈なので問題ないが、白石さんの台詞チェックは未完了の模様 |
| farewell イベントモーダル | **未実装** — result.js:24 に TODO コメントが残っている |
| 6フェーズ化 | **実装済み** — ファイル名や TODO 内のフェーズ名が旧体系のまま（"sg", "post_confession"）。更新推奨 |

### sakura-todo.md 自体の更新推奨事項
1. フェーズ名を旧名（sg, post_confession, farewell）から新名（sg_early/sg_mid/sg_late, heartbreak, ending）に更新
2. 解決済み項目にチェックマークを入れる
3. 本監査で発見した Critical バグ（arrivalDate 自動クリア問題）を追加
4. `getAvailableConversations()` のフェーズフィルタ未実装を追加
5. sakura-notices のフェーズゲート対応を追加

---

## 発見事項サマリ（優先度順）

| # | 深刻度 | 概要 | ファイル |
|---|--------|------|----------|
| 1 | **S1** | arrivalDate 自動クリア → フェーズ永久ロック | home.js:434 + sakura-state.js:147 |
| 2 | **M** | getAvailableConversations() がフェーズ未チェック | sakura-room-engine.js:76-133 |
| 3 | **M** | sakura-room URL直打ちで initRoomUnlock() 発火 | sakura-room.js:40 |
| 4 | **L** | sakura-notices にフェーズゲートなし（将来リスク） | sakura-notices.js:30-38 |
| 5 | **L** | debug-panel が localStorage 直接操作 | debug-panel.js:327,345,426 |

---

*監査完了。コード変更はなし。上記を元に修正作業に入るけん。*
