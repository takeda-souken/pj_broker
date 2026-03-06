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
import { getRandomTrivia, loadTrivia } from '../data/trivia.js';

const SAVED_SESSION_KEY = 'sg_broker_saved_session';
let triviaData = null;

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

    app.appendChild(el('div', { className: 'text-center mt-lg' }, 'Loading questions...'));

    session = new QuizSession({ module, mode, questionCount: count });
    await session.init();
  }

  if (!triviaData && settings.triviaEnabled) {
    triviaData = await loadTrivia().catch(() => null);
  }

  if (session.total === 0) {
    app.innerHTML = '';
    app.appendChild(el('div', { className: 'text-center mt-lg' }, 'No questions available yet.'));
    app.appendChild(el('button', { className: 'btn btn--primary btn--block mt-md', onClick: () => navigate('#home') }, 'Back to Home'));
    return;
  }

  renderQuestion(app, session, settings);

  // Mock exam timer
  let examTimerCleanup = null;
  if (session.mode === 'mock') {
    examTimerCleanup = startExamTimer(app, session);
  }

  // Listen for JP toggle changes
  const onJpToggle = (e) => {
    settings = SettingsStore.load();
  };
  window.addEventListener('jp-toggle-changed', onJpToggle);

  return () => {
    if (examTimerCleanup) examTimerCleanup();
    window.removeEventListener('jp-toggle-changed', onJpToggle);
  };
});

function renderQuestion(app, session, settings) {
  app.innerHTML = '';
  const q = session.current;
  if (!q || session.isFinished || session.isTimeUp) {
    clearSavedSession();
    showResults(app, session);
    return;
  }

  // Save session state for resume
  saveSession(session);

  const moduleLabel = session.module.toUpperCase();

  // Header with home button
  const header = el('div', { className: 'quiz-header' });
  const headerLeft = el('div', { style: 'display:flex;align-items:center;gap:8px;' });
  headerLeft.appendChild(el('button', {
    className: 'quiz-home-btn',
    onClick: () => {
      saveSession(session);
      showToast('Progress saved', 'info');
      navigate('#home');
    },
  }, '\u25C0'));
  headerLeft.appendChild(el('span', { className: `quiz-header__module quiz-header__module--${session.module}` }, moduleLabel));
  header.appendChild(headerLeft);
  header.appendChild(el('span', { className: 'quiz-header__count' }, `${session.currentIndex + 1} / ${session.total}`));
  app.appendChild(header);

  // Progress bar
  const progress = el('div', { className: 'progress-bar' });
  const progressFill = el('div', { className: 'progress-bar__fill' });
  progressFill.style.width = `${session.progress * 100}%`;
  progress.appendChild(progressFill);
  app.appendChild(progress);

  // Timer bar (per-question, practice mode)
  let timerBar = null;
  if (settings.timerEnabled && session.mode !== 'mock') {
    const timePerQ = session.module === 'bcp' ? 67000 : 90000; // ms
    timerBar = createTimerBar(timePerQ, () => handleAnswer(-1));
    app.appendChild(timerBar.el);
    timerBar.start();
  }

  // Topic
  app.appendChild(el('div', { className: 'quiz-topic' }, q.topic));

  // Question
  app.appendChild(el('div', { className: 'quiz-question' }, q.question));

  // Choices
  const choiceGrid = createChoiceGrid(q.choices, (idx) => handleAnswer(idx));
  app.appendChild(choiceGrid.el);

  function handleAnswer(choiceIndex) {
    if (timerBar) timerBar.stop();

    const record = session.answer(choiceIndex === -1 ? -1 : choiceIndex);
    const isCorrect = record && record.isCorrect;

    // Reveal correct/wrong
    choiceGrid.reveal(q.answer, choiceIndex);

    // Merlion celebration for streaks
    if (isCorrect) {
      const topicStats = RecordStore.getTopicStats()[`${session.module}::${q.topic}`];
      if (topicStats && topicStats.mastered && topicStats.streak === 5) {
        const dish = getDishForTopic(q.topic);
        if (dish) RecordStore.addHawkerItem(dish.id);
        showMerlionCelebration({ type: 'mastered', topicName: q.topic });
      } else if (topicStats && topicStats.streak >= 3 && topicStats.streak % 3 === 0) {
        showMerlionCelebration({ type: 'streak', streak: topicStats.streak });
      }
    }

    // Explanation with keyword highlighting
    const currentSettings = SettingsStore.load();
    if (currentSettings.showExplanation && q.explanation) {
      const expPanel = el('div', { className: 'explanation mt-md' });
      expPanel.appendChild(el('div', { className: 'explanation__title' },
        isCorrect ? 'Correct!' : 'Incorrect'));

      const expText = el('div', {});
      expText.innerHTML = highlightKeywords(q.explanation, q.keywords);
      expPanel.appendChild(expText);

      // JP comparison (kataoka mode)
      if (currentSettings.mode === 'kataoka' && currentSettings.showJpComparison && q.jpComparison) {
        const jpEl = el('div', { className: 'explanation__jp-comparison' });
        jpEl.innerHTML = highlightKeywords(q.jpComparison, q.keywords);
        expPanel.appendChild(jpEl);
      }

      // Keywords
      if (q.keywords && q.keywords.length) {
        const kw = el('div', { className: 'explanation__keywords' });
        q.keywords.forEach(k => kw.appendChild(el('span', { className: 'keyword-tag' }, k)));
        expPanel.appendChild(kw);
      }

      app.appendChild(expPanel);
    }

    // Trivia (between questions, sometimes)
    if (triviaData && currentSettings.triviaEnabled && Math.random() < 0.3) {
      const t = getRandomTrivia(triviaData);
      if (t) {
        const card = el('div', { className: 'trivia-card mt-md' });
        card.appendChild(el('div', { className: 'trivia-card__label' }, t.category === 'life' ? 'SG Life Tip' : 'Did You Know?'));
        card.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
        app.appendChild(card);
      }
    }

    // Next button
    const nextBtn = el('button', {
      className: 'btn btn--primary btn--block mt-md',
      onClick: () => { session.next(); renderQuestion(app, session, currentSettings); },
    }, session.currentIndex + 1 >= session.total ? 'See Results' : 'Next');
    app.appendChild(nextBtn);
  }
}

/**
 * Highlight keywords in text by wrapping them in <span class="keyword-highlight">
 */
function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return escapeHtml(text);
  let html = escapeHtml(text);
  for (const kw of keywords) {
    const escaped = escapeHtml(kw);
    const regex = new RegExp(`(${escapeRegex(escaped)})`, 'gi');
    html = html.replace(regex, '<span class="keyword-highlight">$1</span>');
  }
  return html;
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
  sessionStorage.setItem('sg_broker_last_result', JSON.stringify(results));
  navigate(`#result`);
}

function startExamTimer(app, session) {
  const timerEl = el('div', { className: 'exam-timer' });
  const timeDisplay = el('span', { className: 'exam-timer__time' });
  timerEl.appendChild(el('span', {}, `${session.module.toUpperCase()} Mock Exam`));
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
      showToast('Time\'s up!', 'error');
      showResults(app, session);
    }
  }, 1000);

  return () => { clearInterval(interval); timerEl.remove(); };
}
