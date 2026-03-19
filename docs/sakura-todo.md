# さくら関連 TODO

## フェーズ遷移: 入国日との連動

- [ ] `japan → sg` 遷移を AND 条件にする
  - 現状: 50問回答のみでトリガー
  - 変更: **50問回答 AND 入国日を過ぎている**（両方満たしたとき遷移）
  - `arrivalDate`（settings-store）と `SakuraState.checkTransition()` を連動させる
  - `phaseEvents.sg_arrival` フラグは定義済み（sakura-state.js:37）→ 活用する
- [ ] 入国「当日」にするか「数日後」にするか決める
  - 当日: `diff <= 0` で遷移許可
  - 数日後: `diff <= -N` で遷移許可（Nは要検討。到着直後はバタバタしてるので2-3日後？）
- [ ] 入国日にさくらの特別メッセージを出す
  - 「シンガポールへようこそ！」的な一回限りのイベントメッセージ
  - `phaseEvents.sg_arrival` を使って既読管理

## 入国確認イベント

- [ ] 入国日当日（or 数日後）にさくらが入国を確認するイベントを設計・実装
  - 「シンガポール着いた？」的な確認ダイアログ or さくらの部屋での会話イベント
  - ユーザーが確認したら `phaseEvents.sg_arrival = true` → sg フェーズ遷移を許可
  - 入国日を設定していない場合のフォールバック（手動で「着いたよ」ボタン？）

## 台詞チェック

- [ ] **Phase 1（japan）台詞の全チェック** — `js/data/sakura-phase1.js`
  - 標準語・業務的な距離感になっているか
  - 不自然な表現、誤字脱字
- [ ] **Phase 2（sg）台詞の全チェック** — `js/data/sakura-phase2.js`
  - 博多弁が滲む表現になっているか
  - 距離感の変化が適切か
- [ ] **Phase 3（post_confession）台詞の全チェック** — `js/data/sakura-phase3.js`
  - タメ口・博多弁全開になっているか
- [ ] **ホーム画面メッセージの全チェック** — `js/data/sakura-messages.js`
  - 各フェーズのホーム挨拶メッセージ
  - 武田先生（試験当日）メッセージ
- [ ] **さくらの部屋: 会話データの全チェック** — `data/sakura-room/`
  - `phase2-early.json`, `phase2-early-b.json` — Phase2 序盤
  - `phase2-mid-a.json`, `phase2-mid-b.json` — Phase2 中盤
  - `phase2-late-a.json`, `phase2-late-b.json` — Phase2 終盤
  - `phase3-a.json`, `phase3-b.json` — Phase3
  - `closings.json` — 退室時メッセージ
  - `c-reactions.json`, `c-samples.json` — リアクション・サンプル
  - `d-time.json`, `d-samples.json` — 時間帯別・サンプル

## farewell イベントモーダル

- [ ] `result.js:24` の TODO: farewell event modal を実装
  - Mock exam 70%+ 達成時に farewell フェーズへ遷移 → モーダル表示
  - さくらからの手紙演出（`farewellLetter` フィールドは既にある）

## その他

- [ ] `gone` フェーズ後のイースターエッグ（さくらが去った後に何か残す？）
