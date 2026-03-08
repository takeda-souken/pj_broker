/**
 * Home view — main landing page
 * Optional sections are dismissible (×) and can be toggled in Settings.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { RecordStore } from '../models/record-store.js';
import { getRandomTrivia, loadTrivia } from '../data/trivia.js';
import { getSavedSessionInfo } from './quiz.js';
import { getEncouragement, shouldShowTakedaMessage } from '../data/kataoka-messages.js';
import { tr, trNode, showJp as shouldShowJp, getLangMode } from '../utils/i18n.js';
import { GamificationStore } from '../models/gamification-store.js';

registerRoute('#home', (app) => {
  const settings = SettingsStore.load();
  const isKataoka = settings.mode === 'kataoka';

  // Header
  const header = el('div', { className: 'text-center mt-md' });
  const titleEl = el('h1', { className: 'home-title' });
  titleEl.innerHTML = 'Broker<span class="home-title__accent">Pass</span> SG';
  header.appendChild(titleEl);
  if (isKataoka) {
    header.appendChild(el('p', { className: 'home-greeting' }, getEncouragement('greeting')));
    if (shouldShowTakedaMessage()) {
      header.appendChild(el('p', { className: 'home-takeda-msg' }, getEncouragement('takeda')));
    }
  } else {
    const sub = el('p', { className: 'home-subtitle' });
    sub.appendChild(trNode('home.subtitle', 'BCP & ComGI Study Guide'));
    header.appendChild(sub);
  }
  app.appendChild(header);

  // --- Optional section: Exam countdown ---
  if (isKataoka && settings.homeShowCountdown !== false) {
    const countdown = buildCountdown();
    if (countdown) app.appendChild(dismissible(countdown, 'homeShowCountdown'));
  }

  // --- Optional section: XP bar ---
  if (settings.homeShowXp !== false) {
    const gameData = GamificationStore.load();
    const levelInfo = GamificationStore.getLevel(gameData.xp);
    const xpSection = el('div', { className: 'xp-bar mt-sm' });
    xpSection.appendChild(el('div', { className: 'xp-bar__level' }, `Lv.${levelInfo.level}`));
    const track = el('div', { className: 'xp-bar__track' });
    const xpFill = el('div', { className: 'xp-bar__fill' });
    xpFill.style.width = `${Math.round(levelInfo.progress * 100)}%`;
    track.appendChild(xpFill);
    xpSection.appendChild(track);
    xpSection.appendChild(el('div', { className: 'xp-bar__label' }, `${gameData.xp} XP`));
    const xpWrap = el('div', {});
    xpWrap.appendChild(xpSection);
    xpWrap.appendChild(el('div', { className: 'text-center text-sm text-secondary' }, levelInfo.title));
    app.appendChild(dismissible(xpWrap, 'homeShowXp'));
  }

  // --- Optional section: Daily goal ---
  if (settings.homeShowGoal !== false) {
    const gameData = GamificationStore.load();
    const todayProgress = GamificationStore.getTodayProgress();
    if (gameData.dailyGoal > 0) {
      const goalSection = el('div', { className: 'daily-goal mt-sm' });
      const goalPct = Math.min(100, Math.round((todayProgress.done / gameData.dailyGoal) * 100));
      const goalDone = todayProgress.done >= gameData.dailyGoal;
      goalSection.appendChild(el('div', { className: 'daily-goal__icon' }, goalDone ? '\u2705' : '\uD83C\uDFAF'));
      const goalInfo = el('div', { className: 'daily-goal__info', style: 'flex:1;' });
      goalInfo.appendChild(el('div', { className: 'text-sm' },
        goalDone
          ? tr('home.goalDone', 'Daily goal reached!', todayProgress.done, gameData.dailyGoal)
          : tr('home.goalProgress', `${todayProgress.done}/${gameData.dailyGoal} questions today`, todayProgress.done, gameData.dailyGoal)));
      const goalBar = el('div', { className: 'xp-bar__track', style: 'height:6px;' });
      const goalFillEl = el('div', { className: 'xp-bar__fill' });
      goalFillEl.style.width = `${goalPct}%`;
      if (goalDone) goalFillEl.style.background = 'var(--c-success)';
      goalBar.appendChild(goalFillEl);
      goalInfo.appendChild(goalBar);
      goalSection.appendChild(goalInfo);
      app.appendChild(dismissible(goalSection, 'homeShowGoal'));
    }
  }

  // --- Optional section: Study streak ---
  if (settings.homeShowStreak !== false) {
    const studyDaysArr = GamificationStore.getStudyDays();
    const studyDaysSet = new Set(studyDaysArr);
    if (studyDaysArr.length > 0) {
      const gameData = GamificationStore.load();
      const calSection = el('div', { className: 'card mt-sm', style: 'text-align:center;' });
      const streakCount = gameData.longestDailyStreak || 0;
      calSection.appendChild(el('div', { className: 'text-sm', style: 'font-weight:700;margin-bottom:6px;' },
        tr('home.studyStreak', `Study Streak: ${streakCount} days`, streakCount)));
      const cal = el('div', { className: 'streak-calendar' });
      const today = new Date();
      for (let i = 27; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const cell = el('div', { className: `streak-calendar__day ${studyDaysSet.has(key) ? 'streak-calendar__day--active' : ''}` });
        if (i === 0) cell.style.outline = '1px solid var(--c-accent)';
        cal.appendChild(cell);
      }
      calSection.appendChild(cal);
      app.appendChild(dismissible(calSection, 'homeShowStreak'));
    }
  }

  // Resume banner (always shown if available)
  const saved = getSavedSessionInfo();
  if (saved) {
    const banner = el('div', { className: 'resume-banner mt-md', onClick: () => navigate('#quiz?resume=1') });
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

  // --- Optional section: Quick stats ---
  if (settings.homeShowStats !== false) {
    const bcpStats = RecordStore.getModuleStats('bcp');
    const comgiStats = RecordStore.getModuleStats('comgi');
    const totalAttempts = bcpStats.attempts + comgiStats.attempts;

    if (totalAttempts > 0) {
      const statsWrap = el('div', { className: 'mt-md' });
      const stats = el('div', { className: 'stats-grid' });
      stats.appendChild(statCard(bcpStats.accuracy + '%', tr('home.bcpAccuracy', 'BCP Accuracy')));
      stats.appendChild(statCard(comgiStats.accuracy + '%', tr('home.comgiAccuracy', 'ComGI Accuracy')));
      stats.appendChild(statCard(
        (bcpStats.mastered + comgiStats.mastered).toString(),
        tr('home.topicsMastered', 'Topics Mastered')
      ));
      statsWrap.appendChild(stats);

      const todayInfo = getTodayProgress();
      if (todayInfo.today > 0) {
        const strip = el('div', { className: 'home-today-strip mt-sm' });
        strip.appendChild(el('span', {}, tr('home.today', `Today: ${todayInfo.today} questions`, todayInfo.today)));
        if (todayInfo.todayAccuracy !== null) {
          strip.appendChild(el('span', { style: `color:${todayInfo.todayAccuracy >= 70 ? 'var(--c-success)' : 'var(--c-warning)'}` },
            tr('home.accuracy', `${todayInfo.todayAccuracy}% accuracy`, todayInfo.todayAccuracy)));
        }
        statsWrap.appendChild(strip);
      }

      const totalTopics = bcpStats.topicCount + comgiStats.topicCount;
      const totalMastered = bcpStats.mastered + comgiStats.mastered;
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
      app.appendChild(dismissible(statsWrap, 'homeShowStats'));
    }
  }

  // Quick quiz button
  const quickBtn = el('button', {
    className: 'btn btn--primary btn--block mt-lg',
    style: 'font-size:1.05rem;padding:14px;',
    onClick: () => {
      const modules = ['bcp', 'comgi'];
      const mod = modules[Math.floor(Math.random() * modules.length)];
      navigate(`#quiz?module=${mod}&mode=practice&count=5`);
    },
  });
  quickBtn.appendChild(trNode('home.quickQuiz', 'Quick Quiz (5 Q)'));
  app.appendChild(quickBtn);

  // Main navigation
  const nav = el('div', { className: 'flex-col gap-sm mt-md' });
  nav.appendChild(menuBtn('home.studyBcp', 'Study BCP', 'home.bcpSub', 'Basic Concepts & Principles', 'bcp', () => navigate('#mode-select?module=bcp')));
  nav.appendChild(menuBtn('home.studyComgi', 'Study ComGI', 'home.comgiSub', 'Commercial General Insurance', 'comgi', () => navigate('#mode-select?module=comgi')));
  nav.appendChild(menuBtn('home.mixedPractice', 'Mixed Practice', 'home.mixedSub', 'Random from both modules', 'mixed', () => navigate('#quiz?module=mixed&mode=practice&count=10')));
  nav.appendChild(menuBtn('home.glossary', 'Glossary', 'home.glossarySub', 'Insurance Terms (EN/JP)', 'glossary', () => navigate('#glossary')));
  nav.appendChild(menuBtn('home.mrt', 'MRT Progress', 'home.mrtSub', 'Track your journey', 'mrt', () => navigate('#mrt')));
  nav.appendChild(menuBtn('home.records', 'Records', 'home.recordsSub', 'Study history & stats', 'records', () => navigate('#records')));
  nav.appendChild(menuBtn('home.settings', 'Settings', null, '', 'settings', () => navigate('#settings')));
  app.appendChild(nav);

  // --- Optional section: Trivia card ---
  if (settings.homeShowTrivia !== false) {
    loadTrivia().then(triviaList => {
      if (!triviaList) return;
      const t = getRandomTrivia(triviaList);
      if (!t) return;
      const card = el('div', { className: 'trivia-card mt-lg' });
      card.appendChild(el('div', { className: 'trivia-card__label' }, triviaLabel(t.category)));
      card.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
      if (shouldShowJp() && t.textJp) {
        card.appendChild(el('div', { className: 'text-sm mt-sm', style: 'opacity:0.8' }, t.textJp));
      }
      app.appendChild(dismissible(card, 'homeShowTrivia'));
    }).catch(() => {});
  }
});

// ─── Dismissible wrapper ─────────────────────────────────────────
// Wraps content in a container with a × button. Clicking × hides the section
// and saves the preference so it stays hidden on next visit.
function dismissible(content, settingsKey) {
  const wrapper = el('div', { className: 'home-dismissible', style: 'position:relative;' });
  const closeBtn = el('button', {
    className: 'home-dismissible__close',
    onClick: (e) => {
      e.stopPropagation();
      SettingsStore.set(settingsKey, false);
      wrapper.style.transition = 'opacity 0.2s, max-height 0.3s';
      wrapper.style.opacity = '0';
      wrapper.style.maxHeight = '0';
      wrapper.style.overflow = 'hidden';
      setTimeout(() => wrapper.remove(), 300);
    },
  }, '\u00D7');
  wrapper.appendChild(closeBtn);
  wrapper.appendChild(content);
  return wrapper;
}

// ─── Helpers ─────────────────────────────────────────────────────

function buildCountdown() {
  const now = new Date();
  const year = now.getFullYear();
  const apr30 = new Date(year, 3, 30);
  if (now > apr30) return null;
  const days = Math.ceil((apr30 - now) / (1000 * 60 * 60 * 24));
  const countdown = el('div', { className: 'home-countdown mt-sm' });
  const mode = getLangMode();
  if (mode === 'ja') {
    countdown.innerHTML = `\u8A66\u9A13\u307E\u3067 <span class="home-countdown__days">${days}</span> <span class="home-countdown__label">\u65E5</span> (4\u670830\u65E5)`;
  } else if (mode === 'bilingual') {
    countdown.innerHTML = `Exam in <span class="home-countdown__days">${days}</span> <span class="home-countdown__label">${days === 1 ? 'day' : 'days'}</span> (April 30) <span class="bilingual-sub">\u8A66\u9A13\u307E\u3067${days}\u65E5</span>`;
  } else {
    countdown.innerHTML = `Exam in <span class="home-countdown__days">${days}</span> <span class="home-countdown__label">${days === 1 ? 'day' : 'days'}</span> (April 30)`;
  }
  return countdown;
}

function getTodayProgress() {
  const records = RecordStore.getRecords();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter(r => r.timestamp && r.timestamp.startsWith(today));
  const correct = todayRecords.filter(r => r.isCorrect).length;
  return {
    today: todayRecords.length,
    todayAccuracy: todayRecords.length > 0 ? Math.round((correct / todayRecords.length) * 100) : null,
  };
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
    bcp: '\uD83D\uDCD8', comgi: '\uD83D\uDCD5', glossary: '\uD83D\uDD0D',
    mrt: '\uD83D\uDE87', records: '\uD83D\uDCCA', settings: '\u2699\uFE0F',
    mixed: '\uD83C\uDFB2', trivia: '\uD83E\uDD81',
  };
  return icons[type] || '';
}
