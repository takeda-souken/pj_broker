/**
 * Quiz view — main quiz screen
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { QuizSession } from '../models/quiz-session.js';
import { SettingsStore } from '../models/settings-store.js';
import { createChoiceGrid } from '../components/choice-grid.js';
import { createTimerBar } from '../components/timer-bar.js';
import { showMerlionCelebration } from '../components/merlion.js';
import { RecordStore } from '../models/record-store.js';
import { getDishForTopic } from '../data/hawker.js';
import { showToast } from '../components/toast.js';
import { formatDuration } from '../utils/date-utils.js';
import { getEncouragement } from '../data/kataoka-messages.js';
import { BookmarkStore } from '../models/bookmark-store.js';
import { loadGlossary } from '../data/glossary.js';
import { getSupporterMessage, createSupporterBubble } from '../components/supporter.js';
import { showJp as shouldShowJp, tr, trNode } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';

const SAVED_SESSION_KEY = 'sg_broker_saved_session';
let glossaryData = null;
let answered = false;

registerRoute('#quiz', async (app) => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const resume = params.get('resume') === '1';

  let session;
  let settings = SettingsStore.load();

  if (resume) {
    session = restoreSession();
    if (!session) {
      navigate('#home');
      return;
    }
  } else {
    const module = params.get('module') || 'bcp';
    const mode = params.get('mode') || 'practice';
    const count = params.get('count') ? parseInt(params.get('count')) : null;
    const topic = params.get('topic') || null;
    const reviewIds = params.get('review') ? params.get('review').split(',') : null;

    app.appendChild(el('div', { className: 'text-center mt-lg' },
      el('div', { className: 'spinner spinner--lg', style: 'margin:0 auto;' }),
      el('div', { className: 'text-sm text-secondary mt-sm' }, tr('quiz.loading', 'Loading questions...')),
    ));

    session = new QuizSession({ module, mode, questionCount: count, topic, reviewIds });
    await session.init();
  }

  if (!glossaryData) {
    glossaryData = await loadGlossary().catch(() => null);
  }

  if (session.total === 0) {
    app.innerHTML = '';
    app.appendChild(el('div', { className: 'text-center mt-lg' }, tr('quiz.noQuestions', 'No questions available yet.')));
    app.appendChild(el('button', { className: 'btn btn--primary btn--block mt-md', onClick: () => navigate('#home') }, tr('quiz.backHome', 'Back to Home')));
    return;
  }

  renderQuestion(app, session, settings);

  // Mock exam timer
  let examTimerCleanup = null;
  if (session.mode === 'mock') {
    examTimerCleanup = startExamTimer(app, session);
  }

  // Keyboard shortcuts (#41)
  answered = false;
  const onKeyDown = (e) => {
    if (answered) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const nextBtn = app.querySelector('.quiz-next-btn');
        if (nextBtn) nextBtn.click();
      }
      return;
    }
    const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const idx = keyMap[e.key.toLowerCase()];
    if (idx !== undefined) {
      e.preventDefault();
      const btns = app.querySelectorAll('.choice-btn:not(.choice-btn--disabled)');
      if (btns[idx]) btns[idx].click();
    }
  };
  window.addEventListener('keydown', onKeyDown);

  // Swipe gestures (#42)
  let touchStartX = 0;
  let touchStartY = 0;
  const onTouchStart = (e) => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return; // not a horizontal swipe
    if (dx < -60 && answered) {
      // Swipe left = next question (when answered)
      const nextBtn = app.querySelector('.quiz-next-btn');
      if (nextBtn) nextBtn.click();
    }
  };
  app.addEventListener('touchstart', onTouchStart, { passive: true });
  app.addEventListener('touchend', onTouchEnd, { passive: true });

  // Listen for language mode changes
  const onLangChange = () => { settings = SettingsStore.load(); };
  window.addEventListener('lang-mode-changed', onLangChange);

  return () => {
    if (examTimerCleanup) examTimerCleanup();
    app.removeEventListener('touchstart', onTouchStart);
    app.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('lang-mode-changed', onLangChange);
    window.removeEventListener('keydown', onKeyDown);
  };
});

function renderQuestion(app, session, settings) {
  app.innerHTML = '';
  answered = false;
  const q = session.current;
  if (!q || session.isFinished || session.isTimeUp) {
    clearSavedSession();
    showResults(app, session);
    return;
  }

  // Save session state for resume
  saveSession(session);

  // Start per-question timer for time tracking (#13)
  session.startQuestionTimer();

  const moduleLabel = session.module.toUpperCase();

  // Header: ◀ [left] | MODULE BADGE [center] | count [right]
  const header = el('div', { className: 'quiz-header' });
  header.appendChild(el('button', {
    className: 'quiz-home-btn',
    onClick: () => {
      saveSession(session);
      showToast(tr('quiz.progressSaved', 'Progress saved'), 'info');
      navigate('#home');
    },
  }, '\u25C0'));
  header.appendChild(el('span', { className: `quiz-header__module quiz-header__module--${session.module}` }, moduleLabel));

  const headerRight = el('div', { style: 'display:flex;align-items:center;gap:8px;' });
  const currentStreak = getCurrentStreak(session);
  if (currentStreak >= 2) {
    headerRight.appendChild(el('span', { className: 'quiz-streak' }, `\uD83D\uDD25 ${currentStreak}`));
  }
  if (session.startTime && session.mode !== 'mock') {
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    headerRight.appendChild(el('span', { className: 'text-sm text-secondary' }, `${mins}:${secs.toString().padStart(2, '0')}`));
  }
  headerRight.appendChild(el('span', { className: 'quiz-header__count' }, `${session.currentIndex + 1} / ${session.total}`));
  header.appendChild(headerRight);
  app.appendChild(header);

  // Progress dots
  const dotsRow = el('div', { className: 'quiz-dots' });
  for (let i = 0; i < session.total; i++) {
    const dot = el('div', { className: 'quiz-dot' });
    if (i < session.currentIndex) {
      const ans = session.answers[i];
      dot.classList.add(ans && ans.isCorrect ? 'quiz-dot--correct' : 'quiz-dot--wrong');
    } else if (i === session.currentIndex) {
      dot.classList.add('quiz-dot--current');
    }
    dotsRow.appendChild(dot);
  }
  app.appendChild(dotsRow);

  // Timer bar (per-question, practice mode)
  let timerBar = null;
  if (settings.timerEnabled && session.mode !== 'mock') {
    const timePerQ = session.module === 'bcp' ? 67000 : 90000; // ms
    timerBar = createTimerBar(timePerQ, () => handleAnswer(-1), { dramatic: settings.timerDramatic !== false });
    app.appendChild(timerBar.el);
    timerBar.start();
  }

  // Topic + difficulty indicator (#19)
  const topicRow = el('div', { style: 'display:flex;align-items:center;gap:8px;' });
  topicRow.appendChild(el('div', { className: 'quiz-topic' }, q.topic));
  if (q.difficulty) {
    const diffLabel = q.difficulty <= 1 ? 'Easy' : q.difficulty <= 2 ? 'Medium' : 'Hard';
    const diffColor = q.difficulty <= 1 ? 'var(--c-success)' : q.difficulty <= 2 ? 'var(--c-warning)' : 'var(--c-danger)';
    topicRow.appendChild(el('span', { className: 'badge', style: `color:${diffColor};font-size:0.65rem;` }, diffLabel));
  }
  app.appendChild(topicRow);

  // Question
  app.appendChild(el('div', { className: 'quiz-question' }, q.question));

  // Choices with keyboard hints (#41)
  const choiceGrid = createChoiceGrid(q.choices, (idx) => handleAnswer(idx));
  // Add keyboard hints
  const choiceBtns = choiceGrid.el.querySelectorAll('.choice-btn');
  choiceBtns.forEach((btn, i) => {
    const hint = el('span', { className: 'kbd-hint' }, `[${i + 1}]`);
    btn.appendChild(hint);
  });
  app.appendChild(choiceGrid.el);

  // Track if answered for keyboard handler
  let localAnswered = false;

  function handleAnswer(choiceIndex) {
    if (localAnswered) return;
    localAnswered = true;
    answered = true; // signal to keyboard/swipe handlers

    if (timerBar) timerBar.stop();

    const record = session.answer(choiceIndex === -1 ? -1 : choiceIndex);
    const isCorrect = record && record.isCorrect;

    // Vibration feedback (#5)
    if (!isCorrect && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    // Update gamification (#33)
    const topicStats = RecordStore.getTopicStats()[`${session.module}::${q.topic}`];
    const streak = topicStats ? topicStats.streak : 0;
    GamificationStore.addAnswer(isCorrect, session.module, streak);

    // Reveal correct/wrong
    choiceGrid.reveal(q.answer, choiceIndex);

    // Merlion celebration for streaks
    if (isCorrect) {
      if (topicStats && topicStats.mastered && topicStats.streak === 5) {
        const dish = getDishForTopic(q.topic);
        if (dish) RecordStore.addHawkerItem(dish.id);
        GamificationStore.addMastery();
        showMerlionCelebration({ type: 'mastered', topicName: q.topic });
      } else if (topicStats && topicStats.streak >= 3 && topicStats.streak % 3 === 0) {
        showMerlionCelebration({ type: 'streak', streak: topicStats.streak });
      }
    }

    // Encouragement (Kataoka mode)
    const currentSettings = SettingsStore.load();
    if (currentSettings.mode === 'kataoka') {
      const msg = getEncouragement(isCorrect ? 'correct' : 'wrong');
      const encourageEl = el('div', { className: `encouragement encouragement--${isCorrect ? 'correct' : 'wrong'} mt-sm` }, msg);
      app.appendChild(encourageEl);
    }

    // Virtual supporter (Sakura)
    const supporterMsg = streak >= 3
      ? getSupporterMessage('streak', { n: streak })
      : getSupporterMessage(isCorrect ? 'correct' : 'wrong');
    const bubble = createSupporterBubble(supporterMsg);
    if (bubble) app.appendChild(bubble);

    // Explanation with keyword highlighting
    if (currentSettings.showExplanation && q.explanation) {
      const expPanel = el('div', { className: 'explanation mt-md' });
      expPanel.appendChild(el('div', { className: 'explanation__title' },
        isCorrect ? tr('quiz.correct', 'Correct!') : tr('quiz.incorrect', 'Incorrect')));

      const showJp = shouldShowJp();
      const expText = el('div', {});
      expText.innerHTML = highlightKeywords(q.explanation, q.keywords, showJp);
      expPanel.appendChild(expText);

      // Per-choice explanations (#5)
      if (q.choiceExplanations && q.choiceExplanations.length > 0) {
        const choiceExpEl = el('div', { className: 'explanation__choices mt-sm' });
        q.choices.forEach((choice, i) => {
          if (!q.choiceExplanations[i]) return;
          const isCorrectChoice = i === q.answer;
          const wasSelected = i === choiceIndex;
          const marker = isCorrectChoice ? '\u2713' : wasSelected ? '\u2717' : '\u2022';
          const cls = isCorrectChoice ? 'explanation__choice--correct' : wasSelected ? 'explanation__choice--wrong' : '';
          const line = el('div', { className: `explanation__choice ${cls}` });
          line.textContent = `${marker} ${choice}: ${q.choiceExplanations[i]}`;
          choiceExpEl.appendChild(line);
        });
        expPanel.appendChild(choiceExpEl);
      }

      // JP comparison (shown when JP toggle is ON, independent of mode)
      if (showJp && q.jpComparison) {
        const jpEl = el('div', { className: 'explanation__jp-comparison' });
        jpEl.innerHTML = highlightKeywords(q.jpComparison, q.keywords, showJp);
        expPanel.appendChild(jpEl);
      }

      // Keywords — tap to bookmark individual, Bookmark All on the right
      if (q.keywords && q.keywords.length) {
        const kwSection = el('div', { className: 'explanation__keywords' });
        kwSection.appendChild(el('div', { className: 'text-sm text-secondary', style: 'width:100%;margin-bottom:4px;' },
          tr('quiz.tapToBookmark', 'Tap to bookmark')));

        const kwRow = el('div', { style: 'display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;' });
        const tagsWrap = el('div', { style: 'display:flex;flex-wrap:wrap;gap:4px;flex:1;' });

        q.keywords.forEach(k => {
          const tag = el('span', { className: 'keyword-tag' }, k);
          const tooltip = getKeywordTooltip(k, showJp);
          if (tooltip) {
            tag.setAttribute('data-tooltip', tooltip);
            tag.setAttribute('tabindex', '0');
          }
          if (BookmarkStore.has(k)) tag.classList.add('keyword-tag--bookmarked');
          tag.addEventListener('click', () => {
            const added = BookmarkStore.toggle(k);
            tag.classList.toggle('keyword-tag--bookmarked', added);
            showToast(added ? `Bookmarked "${k}"` : `Removed "${k}"`, 'info');
          });
          tag.style.cursor = 'pointer';
          tagsWrap.appendChild(tag);
        });
        kwRow.appendChild(tagsWrap);

        // Bookmark All button
        const bmAllBtn = el('button', {
          className: 'btn-bookmark',
          style: 'white-space:nowrap;flex-shrink:0;',
          onClick: () => {
            const allTerms = [q.topic, ...q.keywords];
            const allBookmarked = allTerms.every(t => BookmarkStore.has(t));
            if (allBookmarked) {
              allTerms.forEach(t => BookmarkStore.remove(t));
              bmAllBtn.textContent = '\u2606 All';
              bmAllBtn.classList.remove('btn-bookmark--active');
              showToast('Bookmarks removed', 'info');
            } else {
              allTerms.forEach(t => BookmarkStore.add(t));
              bmAllBtn.textContent = '\u2605 All';
              bmAllBtn.classList.add('btn-bookmark--active');
              showToast(`${allTerms.length} keywords bookmarked`, 'info');
            }
            tagsWrap.querySelectorAll('.keyword-tag').forEach(tag => {
              tag.classList.toggle('keyword-tag--bookmarked', BookmarkStore.has(tag.textContent));
            });
          },
        });
        const allTerms = [q.topic, ...q.keywords];
        const allBm = allTerms.every(t => BookmarkStore.has(t));
        bmAllBtn.textContent = allBm ? '\u2605 All' : '\u2606 All';
        if (allBm) bmAllBtn.classList.add('btn-bookmark--active');
        kwRow.appendChild(bmAllBtn);

        kwSection.appendChild(kwRow);
        expPanel.appendChild(kwSection);
      }

      app.appendChild(expPanel);
    }

    // Next button (after answering) — guard against duplicates
    if (app.querySelector('.quiz-next-btn')) return;
    const nextBtn = el('button', {
      className: 'btn btn--primary btn--block quiz-next-btn',
      onClick: () => { session.next(); renderQuestion(app, session, currentSettings); },
    });
    const isLast = session.currentIndex + 1 >= session.total;
    nextBtn.appendChild(trNode(isLast ? 'quiz.seeResults' : 'quiz.next', isLast ? 'See Results' : 'Next'));
    nextBtn.appendChild(document.createTextNode(' \u25B6'));
    const kbdHint = el('span', { className: 'kbd-hint', style: 'margin-left:8px;' }, '[Enter]');
    nextBtn.appendChild(kbdHint);
    // Insert after choice grid, before explanation
    const choiceEl = app.querySelector('.choice-grid');
    if (choiceEl && choiceEl.nextSibling) {
      app.insertBefore(nextBtn, choiceEl.nextSibling);
    } else {
      app.appendChild(nextBtn);
    }
  }
}

function getCurrentStreak(session) {
  let streak = 0;
  for (let i = session.answers.length - 1; i >= 0; i--) {
    if (session.answers[i].isCorrect) streak++;
    else break;
  }
  return streak;
}

/**
 * Highlight keywords in text by wrapping them in <span class="keyword-highlight">
 * If glossary data is available, adds tooltip via data-tooltip attribute.
 */
function highlightKeywords(text, keywords, showJp) {
  if (!keywords || !keywords.length) return escapeHtml(text);
  let html = escapeHtml(text);
  for (const kw of keywords) {
    const escaped = escapeHtml(kw);
    const tooltip = getKeywordTooltip(kw, showJp);
    if (!tooltip) continue; // only highlight keywords with glossary entries
    const tooltipAttr = ` data-tooltip="${escapeHtml(tooltip)}" tabindex="0"`;
    const regex = new RegExp(`(${escapeRegex(escaped)})`, 'gi');
    html = html.replace(regex, `<span class="keyword-highlight"${tooltipAttr}>$1</span>`);
  }
  return html;
}

/**
 * Look up a keyword in glossary and return tooltip text.
 * JP mode (ja/bilingual): shows jpTerm + jp description
 * EN mode: shows English definition
 */
function getKeywordTooltip(keyword, showJp) {
  if (!glossaryData) return '';
  const kLower = keyword.toLowerCase();
  // Precision matching (#16): exact match first, then whole-word substring
  const entry = glossaryData.find(g => g.term.toLowerCase() === kLower)
    || glossaryData.find(g => {
      const term = g.term.toLowerCase();
      // Only match if the keyword or term is at least 4 chars and one contains the other as a word boundary
      if (kLower.length < 4 && term.length < 4) return false;
      return term.includes(kLower) || kLower.includes(term);
    });
  if (!entry) return '';
  if (showJp && entry.jpTerm) {
    return entry.jpTerm + (entry.jp ? ' \u2014 ' + entry.jp : '');
  }
  return entry.definition;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Save session state to localStorage for resume
 */
function saveSession(session) {
  const data = {
    module: session.module,
    mode: session.mode,
    questions: session.questions,
    currentIndex: session.currentIndex,
    answers: session.answers,
    startTime: session.startTime,
    timeLimit: session.timeLimit,
    questionCount: session.questionCount,
    savedAt: Date.now(),
  };
  localStorage.setItem(SAVED_SESSION_KEY, JSON.stringify(data));
}

/**
 * Restore session from localStorage
 */
function restoreSession() {
  try {
    const raw = localStorage.getItem(SAVED_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Don't restore sessions older than 24 hours
    if (Date.now() - data.savedAt > 24 * 60 * 60 * 1000) {
      clearSavedSession();
      return null;
    }
    const session = new QuizSession({
      module: data.module,
      mode: data.mode,
      questionCount: data.questionCount,
    });
    session.questions = data.questions;
    session.currentIndex = data.currentIndex;
    session.answers = data.answers;
    session.startTime = data.startTime;
    session.timeLimit = data.timeLimit;
    return session;
  } catch {
    clearSavedSession();
    return null;
  }
}

function clearSavedSession() {
  localStorage.removeItem(SAVED_SESSION_KEY);
}

/**
 * Check if there's a saved session (used by home view)
 */
export function getSavedSessionInfo() {
  try {
    const raw = localStorage.getItem(SAVED_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.savedAt > 24 * 60 * 60 * 1000) {
      clearSavedSession();
      return null;
    }
    return {
      module: data.module,
      mode: data.mode,
      currentIndex: data.currentIndex,
      total: data.questions.length,
      answered: data.answers.length,
    };
  } catch {
    return null;
  }
}

function showResults(app, session) {
  const results = session.getResults();
  // Collect wrong question IDs for review (#4)
  results.wrongIds = session.answers.filter(a => !a.isCorrect && a.answer !== -1).map(a => a.questionId);
  // Find weakest topic for drill suggestion (#9)
  const topicEntries = Object.entries(results.byTopic);
  if (topicEntries.length > 0) {
    const weakest = topicEntries.reduce((worst, [topic, data]) => {
      const pct = data.correct / data.total;
      return pct < worst.pct ? { topic, pct } : worst;
    }, { topic: null, pct: 1 });
    if (weakest.pct < 1) results.weakestTopic = weakest.topic;
  }

  // Complete quiz in gamification (#33)
  const newAchievements = GamificationStore.completeQuiz(results.accuracy, session.mode);
  if (newAchievements.length > 0) {
    results.newAchievements = newAchievements.map(a => ({ name: a.name, icon: a.icon, desc: a.desc }));
  }

  sessionStorage.setItem('sg_broker_last_result', JSON.stringify(results));
  navigate(`#result`);
}

function startExamTimer(app, session) {
  const timerEl = el('div', { className: 'exam-timer' });
  const timeDisplay = el('span', { className: 'exam-timer__time' });
  timerEl.appendChild(el('span', {}, tr('quiz.mockExamLabel', `${session.module.toUpperCase()} Mock Exam`, session.module.toUpperCase())));
  timerEl.appendChild(timeDisplay);
  document.body.appendChild(timerEl);

  const interval = setInterval(() => {
    const remaining = session.remaining;
    if (remaining === null) { clearInterval(interval); return; }
    timeDisplay.textContent = formatDuration(remaining);
    timeDisplay.classList.remove('exam-timer__time--warning', 'exam-timer__time--danger');
    if (remaining < 60000) timeDisplay.classList.add('exam-timer__time--danger');
    else if (remaining < 300000) timeDisplay.classList.add('exam-timer__time--warning');

    if (session.isTimeUp) {
      clearInterval(interval);
      showToast(tr('quiz.timesUp', 'Time\'s up!'), 'error');
      showResults(app, session);
    }
  }, 1000);

  return () => { clearInterval(interval); timerEl.remove(); };
}
