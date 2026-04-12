# SG Broker Exam Study App

## Overview
Singapore insurance broker exam (CGI: BCP, ComGI, PGI, HI) study app for Japanese brokers relocating to Singapore. Built as a vanilla JS SPA, structured after the "kana?" app (c:\pj_kana).

## Target User
- **Primary**: Kataoka-san — experienced Japanese P&C insurance broker, TOEIC near-perfect, 2 years US experience, relocating to Singapore April 2026. Must pass BCP + ComGI + PGI + HI by end of April.
- **Secondary**: Other Japanese brokers at the same firm; potentially any insurance professional studying for CGI.

## Exam Details
| Module | Questions | Time | Pass | Administered by |
|--------|-----------|------|------|-----------------|
| BCP (Basic Concepts & Principles) | 40 MCQ | 45 min | 70% | SCI |
| ComGI (Commercial General Insurance) | 50 MCQ | 75 min | 70% | SCI |
| PGI (Personal General Insurance) | 50 MCQ | 75 min | 70% | SCI |
| HI (Health Insurance) | 50 MCQ | 75 min | 70% | SCI |

All are CSE (Computer Screen Examination), conducted daily on weekdays. No negative marking. Unlimited resits, no waiting period.
Venue: SCI, Suntec Tower Two, 9 Temasek Boulevard, #14-01/02/03, Singapore 038989. Online proctored option also available (ProctorPlus).
Regulatory authority: MAS (Monetary Authority of Singapore).

## Design Policies

### Question Data — Fluid by Design
- Question data files: data/bcp.json (344q), data/comgi.json (500q), data/pgi.json (360q, partially placeholder), data/hi.json (500q, mostly placeholder)
- All questions are generated from SCI eBook textbooks (md/ directory). Placeholder questions are marked with [PLACEHOLDER] and will be replaced with real textbook-based content
- Question schema is intentionally flexible: new fields can be added without breaking existing code
- All questions must have: id, topic, question, choices (4), answer (0-indexed), explanation
- Optional fields: jpComparison, keywords, difficulty (1-3)
- **Do not hardcode question count or topic names** in the UI — always derive from the data

### Modes
- **Kataoka Mode**: Full JP comparison, bilingual glossary, JP trivia. For Japanese brokers.
- **Standard Mode**: English only. For local/international users.

### Singapore Gimmicks (Reward System)
1. **Merlion Animation**: Water spray on correct answers; rainbow spray + crown on topic mastery
2. **Hawker Collection**: Each mastered topic unlocks a Singaporean dish (17 dishes mapped to topics)
3. **MRT Progress Map**: Based on real Singapore MRT. NS Line (Red) = BCP, EW Line (Green) = ComGI, NE Line (Purple) = PGI, DT Line (Blue) = HI. Circle Line (Orange) connects all four at interchange stations, lighting up as linked topics are mastered. Each line unlocks outward from a central station as questions are answered correctly. First correct answer triggers a Sakura tutorial modal introducing the line.

### Sakurai-style Game Design Notes
- Refer to the game design document in the project root for reward system, feedback loop, and UX principles
- Short feedback loops: every answer gets immediate visual feedback
- Variable rewards: Merlion celebration is probabilistic for streaks, guaranteed for mastery
- Collection mechanic: Hawker dishes provide a completion drive
- Progress visualization: MRT map makes abstract progress tangible

## Tech Stack
- Vanilla JS (ES Modules), no build tools
- CSS custom properties for theming
- localStorage for persistence
- Chart.js (lib/) for statistics (lazy-loaded)
- Planned: Cloudflare Pages deployment

## File Structure
```
index.html
css/         themes, main, components, quiz, records, mrt
js/
  app.js, router.js
  data/      questions, glossary, trivia, hawker, mrt-lines
  models/    settings-store, record-store, quiz-session
  views/     home, module-select, mode-select, quiz, result, records, glossary-view, trivia-view, mrt-view, settings
  components/ toast, modal, timer-bar, merlion, choice-grid
  utils/     dom-helpers, shuffle, date-utils
data/        bcp.json, comgi.json, pgi.json, hi.json, glossary.json, trivia.json
```

## Git運用ルール

### ブランチ戦略
- **main**: 本番デプロイ対象。常にデプロイ可能な状態を保つ
- **機能ブランチ**: 大きな変更は `feature/<名前>` で切る。小さな修正は main 直コミットOK

### コミットメッセージ
- 日本語OK。簡潔に
- 形式: `v26: アカウントシステム刷新` や `fix: 同期プログレス表示修正` 等
- バージョンタグがある場合はプレフィックスに使う
- 複数の変更を一括コミットする場合は箇条書きで列挙

### 権限
- **commit**: 確認なしで実行してよい
- **push**: 通常pushは確認なしでOK
- **force-push**: 必ず先生に確認を取る
- **ブランチ削除**: マージ済みブランチの削除は確認不要。未マージは確認必須

### デプロイ判断基準（main push = 本番デプロイ）
main への push は Cloudflare Pages 経由で即本番反映される。commit は自由でも、**push は「片岡くんが今開いて大丈夫か」を基準に判断する**。

#### push してよい場合
- バグ修正（壊れてるものが直る）
- 完結した機能追加（単体で意味をなす）
- データ修正（誤字、誤答の修正等）

#### push を保留すべき場合
- **部分的な多言語対応**: あるモジュールだけ日本語が出て他は英語のまま等、ユーザーから見て「なぜここだけ？」となる状態
- **段階的データ投入の途中**: 全モジュール分のデータが揃っていない機能（翻訳、問題追加等）
- **UI変更の片側だけ**: 新UIのロジックはあるがスタイルが未適用、または逆

#### 保留時の運用
- commit は main に入れてOK（作業の記録として）
- push は全モジュール分が揃った時点、またはさくらお知らせで「一部対応」と明示できる時点で行う
- 判断に迷ったらユーザーに確認する

**原則: 「技術的に壊れない」と「出していい」は違う。UXとして完結しているかで判断する。**

### やらないこと
- `.gitignore` に含まれるファイルを追跡しない
- 秘密情報（GAS URL、パスワード等）をコミットしない
- 先生の作業中のブランチを勝手にリベースしない

## TODO

### MRT駅情報（station-info.js）
- [ ] 非インターチェンジ駅の食名所を追加（Tanjong Pagar, Tiong Bahru, Holland Village 等）
- [ ] 残り全駅の情報を段階的に埋める（現在はインターチェンジ約24駅のみ）

## Permissions for this project
- File operations (read/write/create) and web search: proceed without individual confirmation
- Git operations: commit・pushは確認なしでOK。force-pushのみ確認必須
