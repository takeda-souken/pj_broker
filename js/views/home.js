/**
 * Home view — main landing page
 * Redesigned: compact header, fixed-bottom sakura/trivia, first-launch tutorial
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { RecordStore } from '../models/record-store.js';
import { getRandomTrivia, loadTrivia } from '../data/trivia.js';
import { getSavedSessionInfo } from './quiz.js';
import { tr, trNode, showJp as shouldShowJp, getLangMode } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';
import { getHomeGreeting, recordVisit, createSupporterBubble } from '../components/supporter.js';

const FIRST_LAUNCH_KEY = 'sg_broker_first_launch_done';

registerRoute('#home', (app) => {
  const settings = SettingsStore.load();

  // ─── Header row: Title + Countdown (desktop: side by side) ───
  const headerRow = el('div', { className: 'home-header-row' });

  const titleBlock = el('div', { className: 'home-title-block' });
  const titleEl = el('h1', { className: 'home-title' });
  titleEl.innerHTML = 'Broker<span class="home-title__accent">Pass</span> SG';
  titleBlock.appendChild(titleEl);
  const sub = el('p', { className: 'home-subtitle home-subtitle--compact' });
  sub.appendChild(trNode('home.subtitle', 'CGI Exam Study Guide'));
  titleBlock.appendChild(sub);
  headerRow.appendChild(titleBlock);

  // Countdown beside title on desktop
  if (settings.homeShowCountdown !== false) {
    const countdown = buildCountdown();
    if (countdown) {
      countdown.classList.add('home-countdown--header');
      headerRow.appendChild(countdown);
    }
  }

  app.appendChild(headerRow);

  // ─── XP / Level bar (center, below header) ───
  if (settings.homeShowXp !== false) {
    const gameData = GamificationStore.load();
    const levelInfo = GamificationStore.getLevel(gameData.xp);
    const xpSection = el('div', { className: 'xp-bar home-xp-center' });
    xpSection.appendChild(el('div', { className: 'xp-bar__level' }, `Lv.${levelInfo.level} ${levelInfo.title}`));
    const track = el('div', { className: 'xp-bar__track' });
    const xpFill = el('div', { className: 'xp-bar__fill' });
    xpFill.style.width = `${Math.round(levelInfo.progress * 100)}%`;
    track.appendChild(xpFill);
    xpSection.appendChild(track);
    const xpInLevel = gameData.xp - levelInfo.currentLevelXp;
    const xpNeeded = levelInfo.nextLevelXp - levelInfo.currentLevelXp;
    xpSection.appendChild(el('div', { className: 'xp-bar__label' }, `${xpInLevel}/${xpNeeded} XP`));
    const xpWrap = el('div', { className: 'home-xp-wrap' });
    xpWrap.appendChild(xpSection);
    app.appendChild(xpWrap);
  }

  // Resume banner
  const saved = getSavedSessionInfo();
  if (saved) {
    const banner = el('div', { className: 'resume-banner mt-sm', onClick: () => navigate('#quiz?resume=1') });
    const titleDiv = el('div', { className: 'resume-banner__title' });
    titleDiv.appendChild(trNode('home.continue', `Continue ${saved.module.toUpperCase()} ${saved.mode}`, saved.module.toUpperCase(), saved.mode));
    banner.appendChild(titleDiv);
    const detailDiv = el('div', { className: 'resume-banner__detail' });
    detailDiv.appendChild(trNode('home.continueDetail',
      `Question ${saved.currentIndex + 1} of ${saved.total} (${saved.answered} answered)`,
      saved.currentIndex + 1, saved.total, saved.answered));
    banner.appendChild(detailDiv);
    app.appendChild(banner);
  }

  // ─── Menu grid ───
  // PC middle row: 練習, 模試, 単語集 (3 cols)
  // PC bottom row: 記録, おたのしみ, 設定 (3 cols)
  // Mobile: vertical stack
  const menuUpper = el('div', { className: 'home-menu-row' });
  menuUpper.appendChild(menuBtn('home.practice', 'Practice', 'home.practiceSub', 'Choose module & study', 'practice', () => navigate('#module-select')));
  menuUpper.appendChild(menuBtn('home.mock', 'Mock Exam', 'home.mockSub', 'Timed exam simulation', 'mock', () => navigate('#module-select?mode=mock')));
  menuUpper.appendChild(menuBtn('home.glossary', 'Glossary', 'home.glossarySub', 'Insurance Terms (EN/JP)', 'glossary', () => navigate('#glossary')));

  const menuLower = el('div', { className: 'home-menu-row' });
  menuLower.appendChild(menuBtn('home.records', 'Records', 'home.recordsSub', 'Study history & stats', 'records', () => navigate('#records')));
  menuLower.appendChild(menuBtn('home.fun', 'Fun', 'home.funSub', 'MRT map, hawker & more', 'fun', () => navigate('#mrt')));
  menuLower.appendChild(menuBtn('home.settings', 'Settings', null, '', 'settings', () => navigate('#settings')));

  app.appendChild(menuUpper);
  app.appendChild(menuLower);

  // ─── Quick stats (compact, below menu) ───
  if (settings.homeShowStats !== false) {
    const modules = ['bcp', 'comgi', 'pgi', 'hi'];
    const allStats = modules.map(m => RecordStore.getModuleStats(m));
    const totalAttempts = allStats.reduce((s, st) => s + st.attempts, 0);

    if (totalAttempts > 0) {
      const statsWrap = el('div', { className: 'home-stats-section' });
      const stats = el('div', { className: 'stats-grid' });
      for (let i = 0; i < modules.length; i++) {
        if (allStats[i].attempts > 0) {
          stats.appendChild(statCard(allStats[i].accuracy + '%', `${modules[i].toUpperCase()} Accuracy`));
        }
      }
      const totalMastered = allStats.reduce((s, st) => s + st.mastered, 0);
      stats.appendChild(statCard(totalMastered.toString(), tr('home.topicsMastered', 'Topics Mastered')));
      statsWrap.appendChild(stats);

      const totalTopics = allStats.reduce((s, st) => s + st.topicCount, 0);
      if (totalTopics > 0) {
        const pct = Math.round((totalMastered / totalTopics) * 100);
        const progress = el('div', { className: 'home-progress mt-sm' });
        progress.appendChild(el('div', { className: 'text-sm text-secondary' },
          tr('home.overall', `Overall: ${totalMastered}/${totalTopics} topics mastered (${pct}%)`, totalMastered, totalTopics, pct)));
        const bar = el('div', { className: 'home-progress__bar' });
        const fill = el('div', { className: 'home-progress__fill' });
        fill.style.width = `${pct}%`;
        bar.appendChild(fill);
        progress.appendChild(bar);
        statsWrap.appendChild(progress);
      }
      app.appendChild(statsWrap);
    }
  }

  recordVisit();

  // ─── First launch tutorial (LINE-style) ───
  if (!localStorage.getItem(FIRST_LAUNCH_KEY)) {
    localStorage.setItem(FIRST_LAUNCH_KEY, '1');
    showFirstLaunchTutorial();
    return; // don't show sakura/trivia on first launch
  }

  // ─── Fixed-bottom: Sakura popup ───
  if (settings.supporterEnabled) {
    setTimeout(() => {
      showSakuraPopup(settings);
    }, 1000);
  } else if (settings.homeShowTrivia !== false) {
    // If sakura is OFF, show trivia after 1s
    setTimeout(() => {
      showTriviaSlide(settings);
    }, 1000);
  }
});

// ─── Fixed-bottom Sakura popup ────────────────────────────────────
function showSakuraPopup(settings) {
  // Remove existing if any
  const existing = document.querySelector('.home-sakura-fixed');
  if (existing) existing.remove();

  const sakuraGreeting = getHomeGreeting();
  if (!sakuraGreeting) {
    // No greeting (50% chance skip) — show trivia instead
    if (settings.homeShowTrivia !== false) {
      setTimeout(() => showTriviaSlide(settings), 500);
    }
    return;
  }

  const container = el('div', { className: 'home-sakura-fixed' });
  const bubble = createSupporterBubble(sakuraGreeting, { typing: true });
  if (!bubble) return;

  container.appendChild(bubble);
  document.body.appendChild(container);

  // Animate in from bottom
  requestAnimationFrame(() => container.classList.add('home-sakura-fixed--visible'));

  // Tap to dismiss, then show trivia
  container.addEventListener('click', () => {
    container.classList.remove('home-sakura-fixed--visible');
    container.classList.add('home-sakura-fixed--hiding');
    setTimeout(() => {
      container.remove();
      if (settings.homeShowTrivia !== false) {
        setTimeout(() => showTriviaSlide(settings), 500);
      }
    }, 400);
  });
}

// ─── Fixed-bottom DID YOU KNOW slide ───────────────────────────────
function showTriviaSlide(settings) {
  loadTrivia().then(triviaList => {
    if (!triviaList) return;
    showNextTrivia(triviaList, settings);
  }).catch(() => {});
}

function showNextTrivia(triviaList, settings) {
  const existing = document.querySelector('.home-trivia-fixed');
  if (existing) {
    existing.classList.add('home-trivia-fixed--exit');
    setTimeout(() => existing.remove(), 400);
  }

  const t = getRandomTrivia(triviaList);
  if (!t) return;

  const container = el('div', { className: 'home-trivia-fixed' });

  // Close button (just hides, no more tips)
  const closeBtn = el('button', {
    className: 'home-trivia-fixed__close',
    onClick: (e) => {
      e.stopPropagation();
      container.classList.add('home-trivia-fixed--exit');
      setTimeout(() => container.remove(), 400);
    },
  }, '\u00D7');
  container.appendChild(closeBtn);

  const label = el('div', { className: 'trivia-card__label' }, triviaLabel(t.category));
  container.appendChild(label);
  container.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
  if (shouldShowJp() && t.textJp) {
    container.appendChild(el('div', { className: 'text-sm mt-sm', style: 'opacity:0.8' }, t.textJp));
  }

  document.body.appendChild(container);
  requestAnimationFrame(() => container.classList.add('home-trivia-fixed--visible'));

  // Tap the card body → slide out right, then show next
  container.addEventListener('click', (e) => {
    if (e.target === closeBtn) return;
    container.classList.add('home-trivia-fixed--exit');
    setTimeout(() => {
      container.remove();
      showNextTrivia(triviaList, settings);
    }, 400);
  });
}

// ─── First launch LINE-style tutorial ──────────────────────────────
function showFirstLaunchTutorial() {
  // Prevent scrollbar during tutorial
  document.body.style.overflow = 'hidden';

  const overlay = el('div', { className: 'tutorial-overlay' });
  const chatArea = el('div', { className: 'tutorial-chat' });
  overlay.appendChild(chatArea);

  // Hint element (below chat area, centered)
  const hintEl = el('div', { className: 'tutorial-hint', style: 'display:none' }, 'タップしてください');
  overlay.appendChild(hintEl);

  document.body.appendChild(overlay);

  const messages = [
    'はじめまして、片岡さん！',
    'お会いできるのを楽しみにしていました。',
    'わたしはあなたの試験をサポートする、エージェント「春山さくら」です 🌸',
    '精一杯サポートしていきますから、がんばってくださいね！ 💪',
  ];

  let idx = 0;
  let hintTimer = null;

  function addMessage() {
    if (idx >= messages.length) {
      // Change hint to closing prompt
      hintEl.textContent = 'タップして始める';
      hintEl.style.display = '';
      // Final tap closes tutorial
      overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 300);
      }, { once: true });
      return;
    }

    const msgEl = el('div', { className: 'tutorial-msg' });
    const avatar = el('span', { className: 'tutorial-msg__avatar' }, '\uD83C\uDF38');
    const text = el('div', { className: 'tutorial-msg__text' }, messages[idx]);
    msgEl.appendChild(avatar);
    msgEl.appendChild(text);
    chatArea.appendChild(msgEl);

    idx++;

    // Show hint after first message with delay
    if (idx === 1) {
      hintTimer = setTimeout(() => {
        if (idx === 1) hintEl.style.display = '';
      }, 3000);
    }

    // Advance on tap
    overlay.addEventListener('click', () => {
      hintEl.style.display = 'none';
      if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
      addMessage();
    }, { once: true });
  }

  // Start with first message after a short delay
  setTimeout(addMessage, 500);
}

// ─── Helpers ─────────────────────────────────────────────────────

function updateCountdownDisplay(display, examDate) {
  if (!examDate) {
    const mode = getLangMode();
    if (mode === 'ja') {
      display.innerHTML = '<span class="home-countdown__prompt">試験日をタップして設定</span>';
    } else if (mode === 'bilingual') {
      display.innerHTML = '<span class="home-countdown__prompt">Tap to set exam date</span> <span class="bilingual-sub">試験日をタップして設定</span>';
    } else {
      display.innerHTML = '<span class="home-countdown__prompt">Tap to set exam date</span>';
    }
  } else {
    const now = new Date();
    const target = new Date(examDate + 'T00:00:00');
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    const dateLabel = `${target.getMonth() + 1}/${target.getDate()}`;
    const mode = getLangMode();

    if (diff <= 0) {
      display.innerHTML = `<span class="home-countdown__days" style="color:var(--c-warning)">Today!</span> <span class="home-countdown__label">(${dateLabel})</span>`;
    } else if (mode === 'ja') {
      display.innerHTML = `試験まで <span class="home-countdown__days">${diff}</span> <span class="home-countdown__label">日</span> (${dateLabel})`;
    } else if (mode === 'bilingual') {
      display.innerHTML = `Exam in <span class="home-countdown__days">${diff}</span> <span class="home-countdown__label">${diff === 1 ? 'day' : 'days'}</span> (${dateLabel}) <span class="bilingual-sub">試験まで${diff}日</span>`;
    } else {
      display.innerHTML = `Exam in <span class="home-countdown__days">${diff}</span> <span class="home-countdown__label">${diff === 1 ? 'day' : 'days'}</span> (${dateLabel})`;
    }
  }
}

function buildCountdown() {
  const examDate = SettingsStore.get('examDate');
  const wrapper = el('div', { className: 'home-countdown', style: 'cursor:pointer;position:relative;' });

  const dateInput = el('input', { type: 'date', style: 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:0;width:1px;height:1px;pointer-events:none;' });
  dateInput.value = examDate || '';
  dateInput.addEventListener('change', () => {
    if (dateInput.value) {
      SettingsStore.set('examDate', dateInput.value);
      // Update display immediately without full re-render
      updateCountdownDisplay(display, dateInput.value);
    }
  });

  const display = el('span', {});

  updateCountdownDisplay(display, examDate);

  wrapper.appendChild(display);
  wrapper.appendChild(dateInput);
  wrapper.addEventListener('click', (e) => {
    e.preventDefault();
    if (dateInput.showPicker) {
      try { dateInput.showPicker(); } catch { dateInput.click(); }
    } else {
      dateInput.click();
    }
  });
  return wrapper;
}

function statCard(value, label) {
  const card = el('div', { className: 'stat-card' });
  card.appendChild(el('div', { className: 'stat-card__value' }, value));
  card.appendChild(el('div', { className: 'stat-card__label' }, label));
  return card;
}

function menuBtn(titleKey, titleEn, subKey, subEn, icon, onClick) {
  const btn = el('button', { className: 'menu-card', onClick });
  btn.appendChild(el('span', { className: 'menu-card__icon' }, getMenuIcon(icon)));
  const text = el('div', { className: 'menu-card__text' });
  const titleDiv = el('div', { className: 'menu-card__title' });
  titleDiv.appendChild(trNode(titleKey, titleEn));
  text.appendChild(titleDiv);
  if (subKey && subEn) {
    const subDiv = el('div', { className: 'menu-card__subtitle' });
    subDiv.appendChild(trNode(subKey, subEn));
    text.appendChild(subDiv);
  }
  btn.appendChild(text);
  btn.appendChild(el('span', { className: 'menu-card__arrow' }, '\u203A'));
  return btn;
}

function triviaLabel(category) {
  const labels = {
    life: tr('home.lifeTip', 'SG Life Tip'),
    sightseeing: tr('home.sightseeing', 'Sightseeing'),
    transport: tr('home.transport', 'Transport'),
  };
  return labels[category] || tr('home.didYouKnow', 'Did You Know?');
}

function getMenuIcon(type) {
  const icons = {
    practice: '\uD83D\uDCDD', mock: '\u23F1\uFE0F', glossary: '\uD83D\uDD0D',
    records: '\uD83D\uDCCA', fun: '\uD83C\uDF89', settings: '\u2699\uFE0F',
    bcp: '\uD83D\uDCD8', comgi: '\uD83D\uDCD5', pgi: '\uD83D\uDCD7', hi: '\uD83D\uDCD9',
    mrt: '\uD83D\uDE87', mixed: '\uD83C\uDFB2', trivia: '\uD83E\uDD81',
  };
  return icons[type] || '';
}
