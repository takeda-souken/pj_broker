# さくら 6フェーズ設計書

## フェーズ一覧

| # | phase ID | 片岡の状態 | 開始トリガー | 日数イメージ | さくらの役割 | さくらの態度 | さくらの口調 | ラスト | 部屋 |
|---|----------|-----------|-------------|-------------|-------------|-------------|-------------|-------|------|
| 1 | `japan` | 日本 | （初期） | 18〜31 | 学習支援（平坦） | AIサポーター | 敬語（ていねい）・標準語 | SGで待ってます！ | なし |
| 2 | `sg_early` | SG着任直後 | SG到着 | 2〜4 | SGの貴重な情報源 | SGのこと、教えます | 敬語（少しフランク）・標準語 | SGに慣れましょう | あり |
| 3 | `sg_mid` | 生活と勉強 | 日数経過 | 3〜11 | 学習動機 | 関心を持つ、淡い恋心 | 博多弁を挟む | 好きな人ができたかも | あり |
| 4 | `sg_late` | 勉強必死 | 日数＋回答数 | 2〜10 | 学習＋楽しみ | 完全な恋心・イチャイチャ | 博多弁全開 | 妻子持ちと知る | あり |
| 5 | `heartbreak` | 試験直前〜当日 | critical会話 | 2〜7 | 終わりの予感 | 妻子を意識 | 博多弁全開、悲恋モード | 合格 | あり |
| 6 | `ending` | 引き継ぎ開始 | 合格 | 1 | 新たな生活 | 別れと出発 | 博多弁、愛情たっぷり | 消える | あり→なし |

## 遷移トリガー

```
japan → sg_early    : totalAnswered >= 50（現行SG_THRESHOLD）
sg_early → sg_mid   : daysSincePhase2 >= 2
sg_mid → sg_late    : daysSincePhase2 >= 5 AND answeredSincePhase2 >= 30
sg_late → heartbreak: wife_revealed critical会話 completed
heartbreak → ending : mock exam 70%+ 合格
ending → gone       : farewell会話 completed
```

## タイムライン例

```
            最速着任  最速着任  最遅着任  最遅着任
            最速合格  最遅合格  最速合格  最遅合格
3/16-4/2    1         1         1         1
4/3-4/4     2e        2e        1         1
4/5-4/12    2m        2m        1         1
4/13-4/15   2l        2l        1         1
4/16-4/17   2e(*)     2l        2e        2e
4/18-4/20   2m        2l        2m        2m
4/21-4/22   2l        2l        2l        2m
4/23-4/24   3         3         3         2l
4/25        ending    3         ending    2l
4/26-4/29   -         3         -         3
4/30        -         ending    -         ending

(*) 最遅着任パターンは4/16からphase2開始
```

## メッセージプール（クイズ台詞）のマッピング

| 新Phase | 口調 | ソース | 備考 |
|---------|------|--------|------|
| `japan` | 敬語・標準語 | 現PHASE1 | そのまま |
| `sg_early` | 敬語フランク・標準語 | PHASE1ベース＋SG系抽出 | PHASE1の「一緒に学ぶ」系・SG準備系をピック、少しフランクに |
| `sg_mid` | 博多弁を挟む | 現PHASE2（家族言及削除済み） | ほぼそのまま |
| `sg_late` | 博多弁全開・タメ口 | 現PHASE3（甘い・エッチ含む） | そのまま移動 |
| `heartbreak` | 博多弁全開・悲恋 | **新規執筆** | プロに戻った系＋切なさ。家族への言及あり（触れると辛い） |
| `ending` | 博多弁・愛情 | 現farewell仕組み＋**新規** | 別れの台詞 |

### sg_early の台詞設計メモ
- PHASE1をベースに、SGネタを増やしたバリエーション
- ゼロから書くのではなく、PHASE1の「一緒に学ぶ」系＋「SG準備」系をピックアップ
- 敬語は維持しつつ、Phase1より少しだけフランクに（「ですね」→「ですよね」程度）
- 家族への言及なし（まだ知らない）

### heartbreak（Phase 3）の台詞設計メモ
- 妻子持ちと知った後。失恋の痛みを隠しつつ、プロとして支え続ける
- 博多弁全開だが、sg_lateのイチャイチャトーンとは明確に違う
- 家族への言及あり（「奥さんに〜」等）だが、さくらにとっては触れると辛い
- 時々感情が漏れる（「……ホントはすき」的な）
- 正解時の褒めは仕事モード。でも streak や perfectScore で感情が溢れる

### 部屋会話のキーイベント
- `sg_early`: 初めての部屋（a01） → critical
- `sg_mid`: 呼び方変更イベント → critical、初selfie → critical
- `sg_late`: 妻子持ち発覚 → **critical**（これがheartbreak遷移トリガー）
- `sg_late`: 「それでもサポートする」宣言
- `heartbreak`: teary-smile selfie（選択で送られてくる画像）
- `ending`: 合格・別れ → critical

## コード変更箇所

### sakura-state.js
- phase名を6つに拡張: `japan`, `sg_early`, `sg_mid`, `sg_late`, `heartbreak`, `ending`, `gone`
- `PHASE_NUMERIC` マッピング更新
- `checkTransition()` に sg_early→sg_mid→sg_late の自動遷移追加
- sg_late→heartbreak は `wife_revealed` フラグで外部トリガー
- heartbreak→ending は mock exam 70%+ で外部トリガー（現 triggerFarewell 相当）

### sakura-messages.js
- `getActiveMessages()` を6相に対応
- sg_early用プール追加（PHASE1ベースのフランク版）
- heartbreak用プール新規作成
- ending用プール新規作成

### sakura-phase2.js → 分割
- 現PHASE2 → `sg_mid` 用としてそのまま使用
- 現PHASE3 → `sg_late` 用にリネーム（実質移動）

### sakura-room-engine.js
- critical フラグ対応
- 優先選出ロジック

### home.js（さくらドア）
- 未読バッジUI
- critical時の ! パルス

### sakura-room.js
- critical会話の 📌 ヒントラベル

### sakura-room-store.js
- `wife_revealed` フラグ管理（completedConversation時に自動セット）
