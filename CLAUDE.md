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
3. **MRT Progress Map**: BCP = Blue Line (8 stations), ComGI = Red Line (9 stations). Stations light up as topics are mastered.

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

## Permissions for this project
- File operations (read/write/create) and web search: proceed without individual confirmation
- Git operations: proceed without confirmation for commits; confirm before force-push
