# SG Broker Exam Study App

## Overview
Singapore insurance broker exam (BCP & ComGI) study app for Japanese brokers relocating to Singapore. Built as a vanilla JS SPA, structured after the "kana?" app (c:\pj_kana).

## Target User
- **Primary**: Kataoka-san — experienced Japanese P&C insurance broker, TOEIC near-perfect, 2 years US experience, relocating to Singapore April 2026. Must pass BCP + ComGI by end of April.
- **Secondary**: Other Japanese brokers at the same firm; potentially any insurance professional studying for CGI.

## Exam Details
| Module | Questions | Time | Pass | Administered by |
|--------|-----------|------|------|-----------------|
| BCP (Basic Concepts & Principles) | 40 MCQ | 45 min | 70% | SCI / IBF |
| ComGI (Commercial General Insurance) | 50 MCQ | 75 min | 70% | SCI / IBF |

Both are CBT (computer-based), held at IBF Assessment Centre (20 Anson Road, Singapore). Regulatory authority: MAS (Monetary Authority of Singapore).

## Design Policies

### Question Data — Fluid by Design
- Current questions (data/bcp.json, data/comgi.json) are **provisional** — created from publicly available information and general insurance knowledge
- **Once Kataoka-san provides actual study materials / SCI eBooks**, the question data should be restructured accordingly
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
3. **MRT Progress Map**: Based on real Singapore MRT. NS Line (Red) = BCP, EW Line (Green) = ComGI. Circle Line (Orange) connects both at interchange stations, lighting up as linked topics are mastered. NE (Purple) and DT (Blue) lines drawn as decorative background for atmosphere.

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
data/        bcp.json, comgi.json, glossary.json, trivia.json
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

### やらないこと
- `.gitignore` に含まれるファイルを追跡しない
- 秘密情報（GAS URL、パスワード等）をコミットしない
- 先生の作業中のブランチを勝手にリベースしない

## Permissions for this project
- File operations (read/write/create) and web search: proceed without individual confirmation
- Git operations: commit・pushは確認なしでOK。force-pushのみ確認必須
