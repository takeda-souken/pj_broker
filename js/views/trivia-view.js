/**
 * Trivia view — browse Singapore trivia and life tips
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadTrivia } from '../data/trivia.js';
import { SettingsStore } from '../models/settings-store.js';

registerRoute('#trivia', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'Singapore Tips & Trivia'));

  const isKataoka = SettingsStore.isKataokaMode();
  let triviaList = [];
  try { triviaList = await loadTrivia(); } catch { }

  if (triviaList.length === 0) {
    app.appendChild(el('div', { className: 'text-secondary mt-md' }, 'No trivia available.'));
    return;
  }

  // Category tabs
  const categories = [...new Set(triviaList.map(t => t.category))];
  let activeCategory = null;

  const tabRow = el('div', { className: 'flex-row gap-sm mt-md mb-md', style: 'flex-wrap:wrap;' });
  const allTab = el('button', { className: 'btn btn--primary', onClick: () => filter(null) }, 'All');
  tabRow.appendChild(allTab);
  const catBtns = {};
  for (const cat of categories) {
    const btn = el('button', { className: 'btn btn--outline', onClick: () => filter(cat) }, cat);
    catBtns[cat] = btn;
    tabRow.appendChild(btn);
  }
  app.appendChild(tabRow);

  const container = el('div', {});
  app.appendChild(container);

  function filter(cat) {
    activeCategory = cat;
    allTab.className = cat === null ? 'btn btn--primary' : 'btn btn--outline';
    for (const [c, btn] of Object.entries(catBtns)) {
      btn.className = c === cat ? 'btn btn--primary' : 'btn btn--outline';
    }
    renderTrivia(container, cat);
  }

  function renderTrivia(cont, category) {
    cont.innerHTML = '';
    const items = category ? triviaList.filter(t => t.category === category) : triviaList;
    for (const t of items) {
      const card = el('div', { className: 'trivia-card' });
      card.appendChild(el('div', { className: 'trivia-card__label' }, t.category));
      card.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
      if (isKataoka && t.textJp) {
        card.appendChild(el('div', { className: 'text-sm mt-sm', style: 'opacity:0.8;' }, t.textJp));
      }
      cont.appendChild(card);
    }
  }

  filter(null);
});
