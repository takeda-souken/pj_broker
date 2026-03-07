/**
 * Trivia view — browse Singapore trivia and life tips
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadTrivia } from '../data/trivia.js';
import { showJp as shouldShowJp, tr, trNode } from '../utils/i18n.js';

const CAT_LABELS = {
  insurance: { en: 'Insurance', ja: '保険' },
  life: { en: 'SG Life', ja: 'SG生活' },
  fun: { en: 'Fun Facts', ja: '豆知識' },
  sightseeing: { en: 'Sightseeing', ja: '観光' },
  transport: { en: 'Transport', ja: '交通' },
  exam: { en: 'Exam Tips', ja: '試験のコツ' },
  food: { en: 'Food', ja: 'グルメ' },
};

function catLabel(cat) {
  const entry = CAT_LABELS[cat];
  if (!entry) return cat;
  return tr(`home.${cat}`, entry.en) || entry.en;
}

registerRoute('#trivia', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('trivia.title', 'Singapore Tips & Trivia'));
  app.appendChild(h1);

  const showJp = shouldShowJp();
  let triviaList = [];
  try { triviaList = await loadTrivia(); } catch { }

  if (triviaList.length === 0) {
    app.appendChild(el('div', { className: 'text-secondary mt-md' }, tr('trivia.noData', 'No trivia available.')));
    return;
  }

  // Category tabs
  const categories = [...new Set(triviaList.map(t => t.category))];
  let activeCategory = null;

  const tabRow = el('div', { className: 'flex-row gap-sm mt-md mb-md', style: 'flex-wrap:wrap;' });
  const allTab = el('button', { className: 'btn btn--primary', onClick: () => filter(null) }, tr('trivia.all', 'All'));
  tabRow.appendChild(allTab);
  const catBtns = {};
  for (const cat of categories) {
    const btn = el('button', { className: 'btn btn--outline', onClick: () => filter(cat) }, catLabel(cat));
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
      card.appendChild(el('div', { className: 'trivia-card__label' }, catLabel(t.category)));
      card.appendChild(el('div', { className: 'trivia-card__text' }, t.text));
      if (showJp && t.textJp) {
        card.appendChild(el('div', { className: 'text-sm mt-sm', style: 'opacity:0.8;' }, t.textJp));
      }
      cont.appendChild(card);
    }
  }

  filter(null);
});
