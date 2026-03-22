# さくら関連 TODO

> 最終更新: 2026-03-23（もも監査後）
> フェーズ名は6フェーズ体系（japan / sg_early / sg_mid / sg_late / heartbreak / ending / gone）に統一

---

## ✅ 解決済み

- [x] `japan → sg_early` 遷移を arrivalDate ゲートで制御（sakura-state.js `_isBeforeArrival()`）
- [x] 入国タイミング: **当日**で実装（`now < arrival` → arrival day 当日から通過）
- [x] arrivalDate 未設定時は「未到着」扱い（`_isBeforeArrival()` → true）
- [x] arrivalDate 経過後に phase2StartedAt をリセット（`_resetPhase2OnArrival()`）
- [x] getPhase() が arrivalDate 前なら強制的に japan を返す
- [x] 6フェーズ化（japan/sg_early/sg_mid/sg_late/heartbreak/ending/gone）
- [x] arrivalDate 自動クリア廃止（home.js: バッジ非表示のみに変更）
- [x] sakura-room URL直打ちガード（isRoomAvailable() チェック + #home リダイレクト）
- [x] getAvailableConversations() にフェーズフィルタ追加（conv.phase と現在フェーズを照合）

---

## 🔴 未実装（重要）

### 入国日の特別メッセージ / 入国確認
- [ ] 入国日にさくらの特別メッセージを出す
  - 「シンガポールへようこそ！」的な一回限りのイベント
  - `phaseEvents.sg_arrival` を使って既読管理（定義済み、未使用）
- [ ] 入国確認イベントの設計
  - さくらの部屋での会話イベント or お知らせとして実装？
  - ユーザーが確認したら `phaseEvents.sg_arrival = true`
  - **白石さんのテキスト作成が必要** — 条件タグ: arrivalDate当日〜数日以内、sg_earlyフェーズ

### farewell イベントモーダル
- [ ] `result.js:24` の TODO: farewell event modal を実装
  - Mock exam 70%+ 達成時に ending フェーズへ遷移 → モーダル表示
  - さくらからの手紙演出（`farewellLetter` フィールドは定義済み）
  - **白石さんのテキスト作成が必要**

---

## 🟡 台詞チェック（白石さん担当）

> 全テキストは白石さんが条件タグ付きで作成・監修する。
> 実装側（もも）は条件タグを正しくコードに反映する責任。

- [ ] **japanフェーズ台詞** — `js/data/sakura-phase1.js`
  - 標準語・業務的な距離感。SGに言及する場合は「準備」文脈のみ
- [ ] **sg_earlyフェーズ台詞** — `js/data/sakura-phase2.js`
  - 敬語フランク・標準語。SGガイド役
- [ ] **sg_mid / sg_lateフェーズ台詞** — `js/data/sakura-phase3.js`
  - sg_mid: 博多弁が滲む、淡い恋心
  - sg_late: 博多弁全開・タメ口、完全な恋心
- [ ] **ホーム画面メッセージ** — `js/data/sakura-messages.js`
  - 各フェーズのホーム挨拶。フェーズゲートは getPhase() 経由で正常動作中
- [ ] **さくらの部屋: 全会話データ** — `data/sakura-room/`
  - phase2-early / phase2-mid / phase2-late / phase3 の各 a/b ファイル
  - closings.json / c-reactions.json / d-time.json
  - **先生の承認が未完了の台詞がデプロイされている** — 要確認

---

## 🟢 将来対応（Low priority）

- [ ] sakura-notices にフェーズゲート追加（将来フェーズ依存通知を追加するとき）
- [ ] debug-panel の localStorage 直接操作を Store 経由に統一（デバッグ専用なので低優先）
- [ ] `gone` フェーズ後のイースターエッグ（さくらが去った後に何か残す？）
- [ ] 入国日を設定していない場合のフォールバックUI（手動で「着いたよ」ボタン？）

---

## 役割分担

| 領域 | 担当 |
|------|------|
| テキスト・台詞・条件タグ | 白石真夏 |
| 実装・フェーズ制御・UIロジック | 篠崎もも |
| 最終承認 | 先生 |
