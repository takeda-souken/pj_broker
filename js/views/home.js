/**
 * Home view — main landing page
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { SettingsStore } from '../models/settings-store.js';
import { RecordStore } from '../models/record-store.js';
import { getRandomTrivia } from '../data/trivia.js';
import { loadTrivia } from '../data/trivia.js';
import { getSavedSessionInfo } from './quiz.js';

registerRoute('#home', (app) => {
  const settings = SettingsStore.load();
  const isKataoka = settings.mode === 'kataoka';

  // Header
  const header = el('div', { className: 'text-center mt-md' });
  header.appendChild(el('h1', {}, 'SG Broker Exam'));
  header.appendChild(el('p', { className: 'text-secondary' },
    isKataoka ? 'BCP & ComGI — For Japanese Brokers' : 'BCP & ComGI Study App'));
  app.appendChild(header);

  // Resume banner
  const saved = getSavedSessionInfo();
  if (saved) {
    const banner = el('div', { className: 'resume-banner mt-md', onClick: () => navigate('#quiz?resume=1') });
    banner.appendChild(el('div', { className: 'resume-banner__title' }, `Continue ${saved.module.toUpperCase()} ${saved.mode}`));
    banner.appendChild(el('div', { className: 'resume-banner__detail' },
      `Question ${saved.currentIndex + 1} of ${saved.total} (${saved.answered} answered)`));
    app.appendChild(banner);
  }

  // Quick stats
  const bcpStats = RecordStore.getModuleStats('bcp');
  const comgiStats = RecordStore.getModuleStats('comgi');
  if (bcpStats.attempts > 0 || comgiStats.attempts > 0) {
    const stats = el('div', { className: 'stats-grid mt-md' });
    stats.appendChild(statCard(bcpStats.accuracy + '%', 'BCP Accuracy'));
    stats.appendChild(statCard(comgiStats.accuracy + '%', 'ComGI Accuracy'));
    stats.appendChild(statCard(
      (bcpStats.mastered + comgiStats.mastered).toString(),
      'Topics Mastered'
    ));
    app.appendChild(stats);
  }

  // Main navigation
  const nav = el('div', { className: 'flex-col gap-sm mt-lg' });

  nav.appendChild(menuBtn('Study BCP', 'Basic Concepts & Principles', () => navigate('#mode-select?module=bcp')));
  nav.appendChild(menuBtn('Study ComGI', 'Commercial General Insurance', () => navigate('#mode-select?module=comgi')));
  nav.appendChild(menuBtn('Glossary', isKataoka ? 'Insurance Terms (EN/JP)' : 'Insurance Terms', () => navigate('#glossary')));
  nav.appendChild(menuBtn('MRT Progress', 'Track your journey', () => navigate('#mrt')));
  nav.appendChild(menuBtn('Records', 'Study history & stats', () => navigate('#records')));
  nav.appendChild(menuBtn('Settings', '', () => navigate('#settings')));

  app.appendChild(nav);

  // Trivia card
  loadTrivia().then(triviaList => {
    if (!triviaList || !settings.triviaEnabled) return;
    const t = getRandomTrivia(triviaList);
    if (!t) return;
    const card = el('div', { className: 'trivia-card mt-lg' });
    card.appendChild(el('div', { className: 'trivia-card__label' }, t.category === 'life' ? 'SG Life Tip' : 'Did You Know?'));
    card.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
    if (isKataoka && t.textJp) {
      card.appendChild(el('div', { className: 'text-sm mt-sm', style: 'opacity:0.8' }, t.textJp));
    }
    app.appendChild(card);
  }).catch(() => {});
});

function statCard(value, label) {
  const card = el('div', { className: 'stat-card' });
  card.appendChild(el('div', { className: 'stat-card__value' }, value));
  card.appendChild(el('div', { className: 'stat-card__label' }, label));
  return card;
}

function menuBtn(title, subtitle, onClick) {
  const btn = el('button', { className: 'card', style: 'cursor:pointer;text-align:left;width:100%;border:none;', onClick });
  btn.appendChild(el('div', { style: 'font-weight:700;font-size:1rem;' }, title));
  if (subtitle) btn.appendChild(el('div', { className: 'text-secondary text-sm' }, subtitle));
  return btn;
}
