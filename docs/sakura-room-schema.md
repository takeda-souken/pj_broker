# さくらの部屋 — 会話データ JSONスキーマ仕様

> **Version**: 1.0（2026-03-14）
> **関連**: [sakura-character-sheet.md](sakura-character-sheet.md) §さくらの部屋

---

## 概要

さくらの部屋の会話データは、1会話＝1 JSONオブジェクトとして管理する。
全会話は `data/sakura-room/` 配下にフェーズ別ファイルで格納する。

| ファイル | 内容 |
|---------|------|
| `phase2-early.json` | フェーズ2前半の会話（配列） |
| `phase2-mid.json` | フェーズ2中盤の会話 |
| `phase2-late.json` | フェーズ2後半の会話 |
| `phase3.json` | フェーズ3の会話 |
| `closings.json` | 締めパターン30種 |
| `tracker.md` | テーマ・エピソード管理表 |

---

## 会話オブジェクト（Conversation）

```jsonc
{
  // === 識別 ===
  "id": "a01_first_room",        // ユニークID。種別プレフィックス + 連番 + スラッグ
  "type": "A",                    // A=手書き, B=テーマ, C=リアクション, D=時間帯
  "phase": "2-early",             // 2-early, 2-mid, 2-late, 3-early, 3-mid, 3-late
  "title": "はじめまして、さくらの部屋",  // 管理用タイトル（UIには表示しない）

  // === アンロック条件 ===
  "unlock": {
    "minAnswered": 50,            // 累計回答数の最低ライン
    "daysSincePhase2": 0,         // フェーズ2開始日からの最低経過日数
    "requiredFlags": [],          // 必須フラグ（AND条件）例: ["knows_laksa"]
    "requiredConversations": [],  // 完了必須の会話ID 例: ["a01_first_room"]
    "timeWindow": null,           // 時間帯制限 例: {"from":"22:00","to":"01:59"} null=制限なし
    "dayOfWeek": null             // 曜日制限 例: [5]=金曜のみ, [0,6]=土日 null=制限なし
  },

  // === 会話本体 ===
  "nodes": [
    // ... 後述のNode仕様を参照
  ],

  // === 締め ===
  "closing": "auto",              // "auto"=closings.jsonから時間帯で自動選択
                                  // 文字列指定=固定テキスト（ストーリー会話用）
                                  // 配列指定=固定候補からランダム

  // === メタ情報 ===
  "category": "daily",            // daily, past, romance, family, dream,
                                  // nickname, story, surprise, reaction
  "tags": ["food", "hawker"],     // 同系統連続回避用。直前2会話と同タグを避ける
  "image": null,                  // 画像パス 例: "img/sakura/hawker-rice.jpg"
  "priority": 100                 // 高いほどアンロック候補として優先
                                  // A種:100, B種:50, C種:70(記憶感重要), D種:30
}
```

---

## Node仕様

会話は `nodes` 配列で構成される。各nodeは以下のいずれかの `speaker` を持つ。

### `speaker: "sakura"` — さくらの台詞

```jsonc
{
  "id": "n1",
  "speaker": "sakura",
  "lines": [                      // 配列の各要素が1つの吹き出しとして表示
    "あ、来てくれたっちゃ！",
    "ここ、うちの部屋……っていうか、チャットの部屋ね。"
  ],
  "next": "n2"                    // 次のnodeのID。省略時は配列の次の要素へ
}
```

**`lines` のルール**:
- 配列の各要素が1つのチャット吹き出しになる
- `{name}` プレースホルダーは表示時に現在のニックネームに置換
- 1〜3吹き出しが基本。重要シーンではもっと長くてもOK

### `speaker: "choice"` — 片岡くんの選択肢

```jsonc
{
  "id": "n3",
  "speaker": "choice",
  "choices": [
    {
      "label": "ホーカーによく行くよ",    // 選択肢のテキスト
      "next": "n4a",                       // 選択後に進むnodeのID
      "flags": { "eats_hawker": true },    // セットするフラグ（省略可）
      "axes": { "warmth": 1 }              // 蓄積軸への加算（省略可）
    },
    {
      "label": "自炊が多いかな",
      "next": "n4b",
      "flags": { "cooks_self": true },
      "axes": { "honesty": 1 }
    }
  ]
}
```

**選択肢のルール**:
- 2〜3個。シンプルな短文
- 片岡くんのキャラクター（大阪弁ベースだが標準語寄り、37歳の落ち着き）に合う口調
- `flags` はlocalStorage + スプシに蓄積
- `axes` はwarmth/honestyに加算。各選択肢±0〜2程度

### `speaker: "image"` — さくらが画像を送る

```jsonc
{
  "id": "n6",
  "speaker": "image",
  "src": "img/sakura/chicken-rice.jpg",   // 画像パス
  "alt": "チキンライスの写真",             // alt属性
  "caption": "これこれ！ うちのイチオシ！", // 画像の下に表示するテキスト（省略可）
  "next": "n7"
}
```

### `speaker: "narration"` — ナレーション（ト書き）

```jsonc
{
  "id": "n10",
  "speaker": "narration",
  "text": "……さくらが少し黙った。",        // イタリック等で表示
  "next": "n11"
}
```

**用途**: 着替えイベントの暗転、沈黙の表現、時間経過の演出など。多用しない。

---

## フロー制御

### 基本フロー

```
nodes配列の順番に進む（nextを省略した場合）
  ↓
choice nodeで分岐 → 各choiceのnextで指定先へジャンプ
  ↓
分岐先が合流（複数のnodeが同じnextを指す）
  ↓
最後のnodeまで到達 → closingを表示して終了
```

### 合流パターン

```
n3 (choice)
  → n4a (sakura) → next: "n5"  ← 合流
  → n4b (sakura) → next: "n5"  ← 合流
  → n4c (sakura) → next: "n5"  ← 合流
n5 (sakura) → 共通の続き
```

### 終了判定

- nodeに `"end": true` があれば、そこで会話終了 → closing表示
- 最後のnodeに `next` がなければ自動終了
- `closing: "auto"` の場合、closings.jsonから現在時刻に合った締めを選択

---

## 締めパターン（closings.json）

```jsonc
{
  "closings": [
    {
      "id": "cl_morning_01",
      "timeWindow": { "from": "07:00", "to": "11:59" },
      "dayOfWeek": null,
      "lines": ["じゃ、仕事行ってくるね！ またね！"]
    },
    // ... 30パターン
  ]
}
```

締めはさくらの最後の台詞として、会話本体のあとに自動付与される。

---

## フラグ管理

### localStorage構造

```jsonc
// localStorage key: 'sg_broker_sakura_room'
{
  "completedConversations": ["a01_first_room", "b03_chicken_rice"],
  "flags": {
    "eats_hawker": true,
    "knows_laksa": false,
    "visited_bugis": true
  },
  "axes": {
    "warmth": 12,
    "honesty": 8
  },
  "lastConversationId": "b03_chicken_rice",
  "lastConversationTags": ["food", "hawker"],  // 直前会話のtags（連続回避用）
  "prevConversationTags": ["area", "mrt"],     // 2つ前の会話のtags
  "changeEncounterDone": false                  // 着替えイベント済みフラグ
}
```

### スプレッドシート連携

選択肢が選ばれるたびに以下をGAS経由でスプシに送信:

```jsonc
{
  "timestamp": "2026-04-02T22:15:30+08:00",
  "conversationId": "b03_chicken_rice",
  "nodeId": "n3",
  "choiceLabel": "ホーカーによく行くよ",
  "flagsSet": { "eats_hawker": true },
  "axesAdded": { "warmth": 1 },
  "totalWarmth": 12,
  "totalHonesty": 8
}
```

---

## 会話選択アルゴリズム

さくらの部屋を開いたとき、未読の会話候補から1つを選ぶロジック:

```
1. 全会話からアンロック条件を満たすものを抽出
2. completedConversationsに含まれるものを除外
3. 同系統連続回避: lastConversationTags, prevConversationTags と
   tagsが被るものの優先度を下げる（除外はしない）
4. priority順にソート
5. 同priorityの中からランダムに1つ選択
6. 候補が0件 → 「部屋を閉じる」（会話ストック切れ）
```

---

## 種別ごとの作成ガイドライン

### A種（手書き）
- 全ノードを手書き。テンプレート使用禁止
- ストーリー上の重要イベントは `closing` を固定テキストにする
- priority: 100（最優先でアンロック候補に入る）

### B種（テーマ）
- テーマプール（tracker.md）から選んで作成
- 各会話に「さくらの個人エピソード」を最低1つ含める
- 接続パターン（直球/前回接続/写真/質問返し/思い出/脈絡なし）を記録
- 同カテゴリの連続を避けるためtagsを必ず設定
- priority: 50

### C種（リアクション）
- `unlock.requiredFlags` で発火条件を定義
- `unlock.daysSincePhase2` で「数日後」のタイミングを制御
- 元の会話IDを `unlock.requiredConversations` に含める
- priority: 70（記憶感を出すため、B種より優先）

### D種（時間帯）
- `unlock.timeWindow` と `unlock.dayOfWeek` で制限
- 短め（3〜5ターン）でOK
- priority: 30（他に候補がないときに出る）
