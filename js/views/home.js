/**
 * Home view — main landing page
 * Uses CSS-based i18n (triText) — language switch requires no re-render.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { RecordStore } from '../models/record-store.js';
import { getRandomTrivia, loadTrivia } from '../data/trivia.js';
import { getSavedSessionInfo } from './quiz.js';
import { triText, tr } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';
import { getHomeGreeting, recordVisit, createSupporterBubble } from '../components/supporter.js';
import { DebugStore } from '../models/debug-store.js';
import { SakuraRoomStore } from '../models/sakura-room-store.js';

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
  sub.appendChild(triText('home.subtitle', 'CGI Exam Study Guide'));
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
    titleDiv.appendChild(triText('home.continue', `Continue ${saved.module.toUpperCase()} ${saved.mode}`, saved.module.toUpperCase(), saved.mode));
    banner.appendChild(titleDiv);
    const detailDiv = el('div', { className: 'resume-banner__detail' });
    detailDiv.appendChild(triText('home.continueDetail',
      `Question ${saved.currentIndex + 1} of ${saved.total} (${saved.answered} answered)`,
      saved.currentIndex + 1, saved.total, saved.answered));
    banner.appendChild(detailDiv);
    app.appendChild(banner);
  }

  // ─── Sakura Room button (Phase 2+ only) ───
  if (settings.supporterEnabled && !SakuraRoomStore.get('sakuraDisabled')) {
    const roomBtn = el('button', {
      className: 'home-sakura-room-btn',
      onClick: () => navigate('#sakura-room'),
    });
    roomBtn.appendChild(el('span', { className: 'home-sakura-room-btn__icon' }, '\uD83C\uDF38'));
    const textDiv = el('div', { className: 'home-sakura-room-btn__text' });
    textDiv.appendChild(el('div', { className: 'home-sakura-room-btn__name' }, '\u3055\u304F\u3089\u306E\u90E8\u5C4B'));
    textDiv.appendChild(el('div', { className: 'home-sakura-room-btn__status' }, '\u30BF\u30C3\u30D7\u3057\u3066\u4F1A\u3044\u306B\u884C\u304F'));
    roomBtn.appendChild(textDiv);
    app.appendChild(roomBtn);
  }

  // ─── Menu grid ───
  const menuUpper = el('div', { className: 'home-menu-row' });
  menuUpper.appendChild(menuBtn('home.practice', 'Practice', 'home.practiceSub', 'Choose module & study', 'practice', () => navigate('#module-select')));
  menuUpper.appendChild(menuBtn('home.mock', 'Mock Exam', 'home.mockSub', 'Timed exam simulation', 'mock', () => navigate('#module-select?mode=mock')));
  menuUpper.appendChild(menuBtn('home.glossary', 'Glossary', 'home.glossarySub', 'Insurance Terms (EN/JP)', 'glossary', () => navigate('#glossary')));

  const menuLower = el('div', { className: 'home-menu-row' });
  menuLower.appendChild(menuBtn('home.questionBank', 'Question Bank', 'home.questionBankSub', 'Browse & set frequency', 'question-bank', () => navigate('#question-bank')));
  menuLower.appendChild(menuBtn('home.records', 'Records', 'home.recordsSub', 'Study history & stats', 'records', () => navigate('#records')));
  menuLower.appendChild(menuBtn('home.fun', 'Fun', 'home.funSub', 'MRT map, hawker & more', 'fun', () => navigate('#mrt')));
  menuLower.appendChild(menuBtn('home.settings', 'Settings', null, '', 'settings', () => navigate('#settings')));

  app.appendChild(menuUpper);
  app.appendChild(menuLower);


  recordVisit();

  // ─── First launch tutorial (LINE-style) ───
  if (!localStorage.getItem(FIRST_LAUNCH_KEY)) {
    localStorage.setItem(FIRST_LAUNCH_KEY, '1');
    showFirstLaunchTutorial();
    return;
  }

  // ─── Fixed-bottom: Sakura popup ───
  if (settings.supporterEnabled) {
    setTimeout(() => showSakuraPopup(settings), 1000);
  } else if (settings.homeShowTrivia !== false) {
    setTimeout(() => showTriviaSlide(settings), 1000);
  }
});

// ─── Fixed-bottom Sakura popup ────────────────────────────────────
function showSakuraPopup(settings) {
  // Skip if user already navigated away from home
  if ((window.location.hash || '#home').split('?')[0] !== '#home') return;

  const existing = document.querySelector('.home-sakura-fixed');
  if (existing) existing.remove();

  const sakuraGreeting = getHomeGreeting();
  if (!sakuraGreeting) {
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
  requestAnimationFrame(() => container.classList.add('home-sakura-fixed--visible'));

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
  // Skip if user already navigated away from home
  if ((window.location.hash || '#home').split('?')[0] !== '#home') return;
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
  // JP text — CSS-controlled visibility (shown in JA and bilingual modes)
  if (t.textJp) {
    container.appendChild(el('div', { className: 'i18n-ja text-sm mt-sm', style: 'opacity:0.8' }, t.textJp));
    container.appendChild(el('div', { className: 'i18n-sub text-sm mt-sm', style: 'opacity:0.8' }, t.textJp));
  }

  document.body.appendChild(container);
  requestAnimationFrame(() => container.classList.add('home-trivia-fixed--visible'));

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
  document.body.style.overflow = 'hidden';

  const overlay = el('div', { className: 'tutorial-overlay' });
  const chatArea = el('div', { className: 'tutorial-chat' });
  overlay.appendChild(chatArea);

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
      hintEl.textContent = 'タップして始める';
      hintEl.style.display = '';
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

    if (idx === 1) {
      hintTimer = setTimeout(() => {
        if (idx === 1) hintEl.style.display = '';
      }, 3000);
    }

    overlay.addEventListener('click', () => {
      hintEl.style.display = 'none';
      if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
      addMessage();
    }, { once: true });
  }

  setTimeout(addMessage, 500);
}

// ─── Helpers ─────────────────────────────────────────────────────

function buildCountdown() {
  const examDate = SettingsStore.get('examDate');
  const wrapper = el('div', { className: 'home-countdown', style: 'cursor:pointer;position:relative;' });

  const dateInput = el('input', { type: 'date', style: 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:0;width:1px;height:1px;pointer-events:none;' });
  dateInput.value = examDate || '';
  dateInput.addEventListener('change', () => {
    if (dateInput.value) {
      SettingsStore.set('examDate', dateInput.value);
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

function updateCountdownDisplay(display, examDate) {
  display.innerHTML = '';
  if (!examDate) {
    // Trilingual prompt — CSS controls visibility
    display.appendChild(el('span', { className: 'i18n-ja home-countdown__prompt' }, '試験日をタップして設定'));
    display.appendChild(el('span', { className: 'i18n-en home-countdown__prompt' }, 'Tap to set exam date'));
    display.appendChild(el('span', { className: 'i18n-sub' }, '試験日をタップして設定'));
  } else {
    const now = DebugStore.now();
    const target = new Date(examDate + 'T00:00:00');
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    const dateLabel = `${target.getMonth() + 1}/${target.getDate()}`;

    if (diff <= 0) {
      display.innerHTML = `<span class="home-countdown__days" style="color:var(--c-warning)">Today!</span> <span class="home-countdown__label">(${dateLabel})</span>`;
    } else {
      // JA main
      const ja = el('span', { className: 'i18n-ja' });
      ja.innerHTML = `試験まで <span class="home-countdown__days">${diff}</span> <span class="home-countdown__label">日</span> (${dateLabel})`;
      display.appendChild(ja);
      // EN main
      const en = el('span', { className: 'i18n-en' });
      en.innerHTML = `Exam in <span class="home-countdown__days">${diff}</span> <span class="home-countdown__label">${diff === 1 ? 'day' : 'days'}</span> (${dateLabel})`;
      display.appendChild(en);
      // JP sub-annotation
      display.appendChild(el('span', { className: 'i18n-sub' }, `試験まで${diff}日`));
    }
  }
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
  titleDiv.appendChild(triText(titleKey, titleEn));
  text.appendChild(titleDiv);
  if (subKey && subEn) {
    const subDiv = el('div', { className: 'menu-card__subtitle' });
    subDiv.appendChild(triText(subKey, subEn));
    text.appendChild(subDiv);
  }
  btn.appendChild(text);
  btn.appendChild(el('span', { className: 'menu-card__arrow' }, '\u203A'));
  return btn;
}

function triviaLabel(category) {
  // Trivia labels are ephemeral (floating card) — tr() is fine
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
