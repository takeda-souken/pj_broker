# テキストブック日本語翻訳仕様書

> **担当**: 水無瀬杏（翻訳）、篠崎もも（パイプライン・ビュー）
> **対象**: SCI教科書4モジュール（BCP / ComGI / PGI / HI）の全文日本語翻訳
> **目的**: 日本人ブローカー（片岡くん）が教科書を日本語で参照できるようにする

---

## 1. 翻訳対象

### ファイル
| モジュール | ファイル | 章数 | セクション | パラグラフ |
|-----------|---------|------|-----------|-----------|
| BCP | `data/textbook-bcp.json` | 9 | 87 | 947 |
| ComGI | `data/textbook-comgi.json` | 9 | 83 | 1,046 |
| PGI | `data/textbook-pgi.json` | 7 | 80 | 793 |
| HI | `data/textbook-hi.json` | 15 | 95 | 987 |
| **合計** | | **40** | **345** | **3,773** |

### 翻訳対象フィールド
JSONの各レベルで以下のフィールドに日本語を追加する:

```json
// Chapter レベル
{
  "title": "THE INSURANCE AND REINSURANCE MARKET",
  "titleJP": "保険と再保険の市場",          // ← 追加
  "outline": ["Introduction", ...],
  "outlineJP": ["はじめに", ...],            // ← 追加
  "learningOutcomes": ["know the types...", ...],
  "learningOutcomesJP": ["保険の売り手の種類を...", ...],  // ← 追加
  "sections": [...]
}

// Section レベル
{
  "title": "The Insurance And Reinsurance Market",
  "titleJP": "保険と再保険の市場",          // ← 追加
  "paragraphs": [
    {
      "num": "2.1",
      "text": "Like any other market...",
      "textJP": "他の市場と同様に..."       // ← 追加
    }
  ],
  "subsections": [...]
}

// Subsection レベル（Section と同じ構造）
{
  "title": "The Sellers",
  "titleJP": "売り手",                      // ← 追加
  "paragraphs": [
    {
      "num": "2.2",
      "text": "The sellers of insurance...",
      "textJP": "シンガポールにおける保険の売り手は..."  // ← 追加
    }
  ]
}
```

---

## 2. 翻訳ルール

### 2-1. 用語統一（最重要）

`data/glossary.json` に保険用語の対訳（`term` → `jpTerm`）が定義済み。
**翻訳時は必ずこのglossaryの訳語に従うこと。**

例:
| English | glossary.json の jpTerm | 翻訳で使うべき訳 |
|---------|------------------------|----------------|
| Insurable Interest | 被保険利益 | 被保険利益 |
| Utmost Good Faith | 最大善意の原則 | 最大善意の原則 |
| Subrogation | 代位（求償権） | 代位（求償権） |
| Proximate Cause | 近因 | 近因 |
| Indemnity | 損害てん補 | 損害てん補 |
| MAS | MAS（シンガポール金融管理庁） | MAS |
| Lloyd's | ロイズ | ロイズ |

glossaryにない用語は、初出時に「英語（日本語）」形式で記載し、以降は日本語のみでOK。

### 2-2. 文体

- **です・ます調**（教科書なので）
- 原文の段落番号（2.1, 2.2, ...）はそのまま維持
- 箇条書き（▪）の構造はそのまま維持
- 原文が長い場合でも意訳より直訳寄り（試験対策なので、原文と対応関係が明確であるべき）
- ただし日本語として不自然な直訳は避ける

### 2-3. 固有名詞

- シンガポールの法律名・機関名は英語のまま残し、初出時にカッコで日本語を補足
  - 例: `Insurance Act 1966（保険法1966年）`
  - 例: `Financial Industry Disputes Resolution Centre (FIDReC)（金融業界紛争解決センター）`
- 以降は英語名でOK（片岡くんは英語が堪能なので）

### 2-4. 表・図の参照

- 原文中の「Table X.X」「Figure X.X」はそのまま英語で残す
- 前後に説明がある場合のみ日本語訳

---

## 3. 作業フロー

### Step 1: もも — JSONスキーマ拡張
`scripts/build_textbook_json.js` を更新し、各フィールドに `*JP` の空フィールドを追加してJSON再生成。

### Step 2: 杏 — 翻訳実行
モジュール単位で `data/textbook-{module}.json` を読み、各 `*JP` フィールドに翻訳を書き込む。

**作業順序**: BCP → ComGI → PGI → HI

**1回の作業単位**: 1章ずつ。JSONを直接編集してOK。

### Step 3: もも — ビュー側の日英切替対応
`js/views/textbook-view.js` でパラグラフ・見出しの表示を `triContent` 化し、アプリの言語設定に連動させる。

### Step 4: 杏 — 品質レビュー
翻訳済みの章をサンプルチェック。特に:
- glossary用語との一貫性
- 保険専門用語の正確性
- 日本語の自然さ

---

## 4. 優先度

| 優先度 | モジュール | 理由 |
|--------|-----------|------|
| 1 | BCP | 基礎。全受験者が最初に受ける |
| 2 | ComGI | 片岡くんの業務に直結 |
| 3 | PGI | 個人保険。実務頻度高い |
| 4 | HI | 健康保険。ボリューム最大 |

---

## 5. glossary.json 参照方法

```bash
# 用語検索（部分一致）
node -e "var g=JSON.parse(require('fs').readFileSync('data/glossary.json','utf8')); g.filter(function(t){return t.term.toLowerCase().includes('subroga')}).forEach(function(t){console.log(t.term+' = '+t.jpTerm)})"
```

glossaryは約300用語。`term`, `jpTerm`, `definition`, `jp`, `tags` を持つ。

---

## 6. 注意事項

- JSONの構造（id, number, num 等のメタデータフィールド）は絶対に変更しない
- 英語フィールド（title, text 等）も変更しない。`*JP` フィールドのみ追加・編集
- コミットはモジュール単位で（`fix: BCP教科書の日本語翻訳完了` 等）
