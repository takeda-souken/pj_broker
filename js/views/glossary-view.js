/**
 * Glossary view — searchable, indexed insurance term dictionary
 * Features: EN/JP index tabs, A-Z navigation, module filter, search
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadGlossary, searchGlossary, filterByModule, groupAlphabetically } from '../data/glossary.js';
import { BookmarkStore } from '../models/bookmark-store.js';
import { triText, tr } from '../utils/i18n.js';

// --- Kana row mapping (hiragana + katakana + voiced/semi-voiced) ---
const KANA_ROWS = [
  { label: '\u3042', chars: '\u3042\u3044\u3046\u3048\u304A\u30A2\u30A4\u30A6\u30A8\u30AA' },
  { label: '\u304B', chars: '\u304B\u304D\u304F\u3051\u3053\u30AB\u30AD\u30AF\u30B1\u30B3\u304C\u304E\u3050\u3052\u3054\u30AC\u30AE\u30B0\u30B2\u30B4' },
  { label: '\u3055', chars: '\u3055\u3057\u3059\u305B\u305D\u30B5\u30B7\u30B9\u30BB\u30BD\u3056\u3058\u305A\u305C\u305E\u30B6\u30B8\u30BA\u30BC\u30BE' },
  { label: '\u305F', chars: '\u305F\u3061\u3064\u3066\u3068\u30BF\u30C1\u30C4\u30C6\u30C8\u3060\u3062\u3065\u3067\u3069\u30C0\u30C2\u30C5\u30C7\u30C9' },
  { label: '\u306A', chars: '\u306A\u306B\u306C\u306D\u306E\u30CA\u30CB\u30CC\u30CD\u30CE' },
  { label: '\u306F', chars: '\u306F\u3072\u3075\u3078\u307B\u30CF\u30D2\u30D5\u30D8\u30DB\u3070\u3073\u3076\u3079\u307C\u30D0\u30D3\u30D6\u30D9\u30DC\u3071\u3074\u3077\u307A\u307D\u30D1\u30D4\u30D7\u30DA\u30DD' },
  { label: '\u307E', chars: '\u307E\u307F\u3080\u3081\u3082\u30DE\u30DF\u30E0\u30E1\u30E2' },
  { label: '\u3084', chars: '\u3084\u3086\u3088\u30E4\u30E6\u30E8' },
  { label: '\u3089', chars: '\u3089\u308A\u308B\u308C\u308D\u30E9\u30EA\u30EB\u30EC\u30ED' },
  { label: '\u308F', chars: '\u308F\u3090\u3091\u3092\u3093\u30EF\u30F2\u30F3' },
];

function getKanaRow(ch) {
  for (const row of KANA_ROWS) {
    if (row.chars.includes(ch)) return row.label;
  }
  return '\u4ED6'; // 他 (other/kanji)
}

// Sub-row display characters (hiragana only, for expansion UI)
const KANA_SUB = {
  '\u3042': ['\u3042', '\u3044', '\u3046', '\u3048', '\u304A'],
  '\u304B': ['\u304B', '\u304D', '\u304F', '\u3051', '\u3053'],
  '\u3055': ['\u3055', '\u3057', '\u3059', '\u305B', '\u305D'],
  '\u305F': ['\u305F', '\u3061', '\u3064', '\u3066', '\u3068'],
  '\u306A': ['\u306A', '\u306B', '\u306C', '\u306D', '\u306E'],
  '\u306F': ['\u306F', '\u3072', '\u3075', '\u3078', '\u307B'],
  '\u307E': ['\u307E', '\u307F', '\u3080', '\u3081', '\u3082'],
  '\u3084': ['\u3084', '\u3086', '\u3088'],
  '\u3089': ['\u3089', '\u308A', '\u308B', '\u308C', '\u308D'],
  '\u308F': ['\u308F', '\u3092', '\u3093'],
};

registerRoute('#glossary', async (app) => {
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.append('\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('glossary.title', 'Insurance Glossary'));
  app.appendChild(h1);

  // State
  let indexMode = 'en';
  let moduleFilter = 'all';
  let searchQuery = '';
  let expandedRow = null;

  // --- Search box (placeholder needs plain string, so use tr()) ---
  const searchInput = el('input', {
    className: 'search-box',
    type: 'text',
    placeholder: tr('glossary.searchBilingual', 'Search in English or Japanese...'),
  });
  app.appendChild(searchInput);

  // --- Index mode segmented control (EN / JP) — always rendered, CSS controls visibility ---
  const indexSegEl = el('div', { className: 'seg-control mt-sm i18n-ja' });
  const enBtn = el('button', { className: 'seg-control__item seg-control__item--active', onClick: () => setIndexMode('en') }, 'A-Z (English)');
  const jpBtn = el('button', { className: 'seg-control__item', onClick: () => setIndexMode('jp') }, '\u3042-\u308F (Japanese)');
  indexSegEl.appendChild(enBtn);
  indexSegEl.appendChild(jpBtn);
  app.appendChild(indexSegEl);

  // --- Module filter segmented control ---
  const moduleSeg = el('div', { className: 'seg-control mt-sm' });
  const allBtn = el('button', { className: 'seg-control__item seg-control__item--active', onClick: () => setModule('all') });
  allBtn.appendChild(triText('glossary.allFilter', 'All'));
  const bcpBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('BCP') }, 'BCP');
  const comgiBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('ComGI') }, 'ComGI');
  const bmCount = BookmarkStore.count();
  const bmBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('bookmarks') });
  bmBtn.append('\u2605 ');
  bmBtn.appendChild(triText('glossary.bookmarks', 'Bookmarks'));
  if (bmCount) bmBtn.append(` (${bmCount})`);
  moduleSeg.appendChild(allBtn);
  moduleSeg.appendChild(bcpBtn);
  moduleSeg.appendChild(comgiBtn);
  moduleSeg.appendChild(bmBtn);
  app.appendChild(moduleSeg);

  // --- A-Z / kana bar ---
  const azBar = el('div', { className: 'az-bar mt-sm' });
  app.appendChild(azBar);

  // --- Sub-row bar (for kana expansion) ---
  const subBar = el('div', { className: 'az-bar az-bar--sub', style: 'display:none;' });
  app.appendChild(subBar);

  // --- List container ---
  const listContainer = el('div', { className: 'glossary-list mt-sm' });
  app.appendChild(listContainer);

  // --- Count ---
  const countEl = el('div', { className: 'text-sm text-secondary text-center mt-sm' });
  app.appendChild(countEl);

  // Load data
  let glossary = [];
  try {
    glossary = await loadGlossary();
  } catch {
    listContainer.appendChild(el('div', { className: 'text-secondary', style: 'padding:16px 0;' }, 'Glossary data not loaded.'));
    return;
  }

  function setIndexMode(mode) {
    indexMode = mode;
    expandedRow = null;
    indexSegEl.querySelectorAll('.seg-control__item').forEach((btn, i) => {
      btn.className = 'seg-control__item' + ((i === 0 && mode === 'en') || (i === 1 && mode === 'jp') ? ' seg-control__item--active' : '');
    });
    render();
  }

  function setModule(mod) {
    moduleFilter = mod;
    [allBtn, bcpBtn, comgiBtn, bmBtn].forEach((btn, i) => {
      const active = (i === 0 && mod === 'all') || (i === 1 && mod === 'BCP') || (i === 2 && mod === 'ComGI') || (i === 3 && mod === 'bookmarks');
      btn.className = 'seg-control__item' + (active ? ' seg-control__item--active' : '');
    });
    render();
  }

  function getFilteredItems() {
    let items;
    if (moduleFilter === 'bookmarks') {
      const bookmarks = BookmarkStore.getAll();
      const bmLower = bookmarks.map(b => b.toLowerCase());
      items = glossary.filter(item => {
        const termLow = item.term.toLowerCase();
        // Exact match on term, jpTerm, or tags
        if (bookmarks.includes(item.term)) return true;
        if (item.jpTerm && bookmarks.includes(item.jpTerm)) return true;
        if (item.tags && item.tags.some(t => bookmarks.includes(t))) return true;
        // Partial match: bookmark keyword found in term, or term found in bookmark
        return bmLower.some(bm => termLow.includes(bm) || bm.includes(termLow));
      });
    } else {
      items = filterByModule(glossary, moduleFilter);
    }
    if (searchQuery) {
      items = searchGlossary(items, searchQuery);
    }
    return items;
  }

  function render() {
    listContainer.innerHTML = '';
    azBar.innerHTML = '';
    subBar.innerHTML = '';
    subBar.style.display = 'none';

    const items = getFilteredItems();
    countEl.textContent = `${items.length} terms`;

    if (items.length === 0) {
      const noRes = el('div', { className: 'text-secondary', style: 'padding:16px 0;text-align:center;' });
      noRes.appendChild(triText('glossary.noResults', 'No results.'));
      listContainer.appendChild(noRes);
      return;
    }

    if (searchQuery) {
      items.sort((a, b) => a.term.localeCompare(b.term));
      for (const item of items) {
        listContainer.appendChild(createGlossaryItem(item));
      }
      return;
    }

    if (indexMode === 'jp') {
      renderJpIndex(items);
    } else {
      renderEnIndex(items);
    }
  }

  function renderEnIndex(items) {
    const groups = groupAlphabetically(items, (item) => item.term);
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (const letter of allLetters) {
      const hasItems = groups.has(letter);
      const btn = el('button', {
        className: 'az-bar__letter' + (hasItems ? '' : ' az-bar__letter--disabled'),
        onClick: hasItems ? () => scrollToSection(letter) : undefined,
      }, letter);
      azBar.appendChild(btn);
    }

    for (const [letter, groupItems] of groups) {
      const sectionId = `glossary-section-${letter}`;
      listContainer.appendChild(el('div', { className: 'glossary-section-header', id: sectionId }, letter));
      for (const item of groupItems) {
        listContainer.appendChild(createGlossaryItem(item));
      }
    }
  }

  function renderJpIndex(items) {
    // Group items by kana row based on jpTerm first character
    const rowGroups = new Map();
    const rowLabels = KANA_ROWS.map(r => r.label).concat(['\u4ED6']);

    for (const item of items) {
      const jpKey = item.jpTerm || item.term;
      const firstChar = jpKey[0] || '#';
      const row = getKanaRow(firstChar);
      if (!rowGroups.has(row)) rowGroups.set(row, []);
      rowGroups.get(row).push(item);
    }

    // Sort items within each group by jpTerm
    for (const [, groupItems] of rowGroups) {
      groupItems.sort((a, b) => (a.jpTerm || a.term).localeCompare(b.jpTerm || b.term, 'ja'));
    }

    // Build row bar (always visible)
    for (const label of rowLabels) {
      const hasItems = rowGroups.has(label);
      const isExpanded = expandedRow === label;
      const btn = el('button', {
        className: 'az-bar__letter' + (hasItems ? '' : ' az-bar__letter--disabled') + (isExpanded ? ' az-bar__letter--active' : ''),
        onClick: hasItems ? () => toggleKanaRow(label) : undefined,
      }, label);
      azBar.appendChild(btn);
    }

    // Show sub-row if a kana row is expanded
    if (expandedRow && KANA_SUB[expandedRow]) {
      subBar.style.display = '';
      for (const ch of KANA_SUB[expandedRow]) {
        const btn = el('button', {
          className: 'az-bar__letter',
          onClick: () => scrollToSection(`jp-${ch}`),
        }, ch);
        subBar.appendChild(btn);
      }
    }

    // Render items
    if (expandedRow) {
      // Show only items in the expanded row
      const groupItems = rowGroups.get(expandedRow) || [];

      if (expandedRow === '\u4ED6') {
        // Kanji group: sub-group by first character
        const subGroups = new Map();
        for (const item of groupItems) {
          const ch = (item.jpTerm || item.term)[0] || '#';
          if (!subGroups.has(ch)) subGroups.set(ch, []);
          subGroups.get(ch).push(item);
        }
        for (const [ch, subItems] of subGroups) {
          listContainer.appendChild(el('div', { className: 'glossary-section-header', id: `glossary-section-jp-${ch}` }, ch));
          for (const item of subItems) {
            listContainer.appendChild(createGlossaryItem(item));
          }
        }
      } else {
        // Kana row: sub-group by hiragana/katakana character
        const subChars = KANA_SUB[expandedRow] || [];
        const shown = new Set();
        for (const ch of subChars) {
          const katakana = String.fromCharCode(ch.charCodeAt(0) + 0x60);
          const matching = groupItems.filter(item => {
            const first = (item.jpTerm || item.term)[0];
            return first === ch || first === katakana;
          });
          if (matching.length === 0) continue;
          listContainer.appendChild(el('div', { className: 'glossary-section-header', id: `glossary-section-jp-${ch}` }, ch));
          for (const item of matching) {
            listContainer.appendChild(createGlossaryItem(item));
            shown.add(item);
          }
        }
        // Dakuten/handakuten items not covered by base sub-chars
        const remaining = groupItems.filter(item => !shown.has(item));
        if (remaining.length > 0) {
          listContainer.appendChild(el('div', { className: 'glossary-section-header' },
            expandedRow + ' (voiced)'));
          for (const item of remaining) {
            listContainer.appendChild(createGlossaryItem(item));
          }
        }
      }
    } else {
      // No row expanded: show all items grouped by row
      for (const label of rowLabels) {
        const groupItems = rowGroups.get(label);
        if (!groupItems) continue;
        const sectionId = `glossary-section-jp-${label}`;
        listContainer.appendChild(el('div', {
          className: 'glossary-section-header',
          id: sectionId,
        }, label === '\u4ED6' ? '\u4ED6 (Kanji)' : label + '\u884C'));
        for (const item of groupItems) {
          listContainer.appendChild(createGlossaryItem(item));
        }
      }
    }
  }

  function toggleKanaRow(label) {
    expandedRow = expandedRow === label ? null : label;
    render();
  }

  function isTermBookmarked(term) {
    if (BookmarkStore.has(term)) return true;
    const bookmarks = BookmarkStore.getAll();
    const termLow = term.toLowerCase();
    return bookmarks.some(bm => {
      const bmLow = bm.toLowerCase();
      return termLow.includes(bmLow) || bmLow.includes(termLow);
    });
  }

  function createGlossaryItem(item) {
    const li = el('div', { className: 'glossary-item' });
    const headerRow = el('div', { className: 'glossary-item__header' });
    const termText = indexMode === 'jp' && item.jpTerm
      ? `${item.jpTerm} / ${item.term}`
      : item.term;
    headerRow.appendChild(el('div', { className: 'glossary-item__term' }, termText));
    const isBookmarked = isTermBookmarked(item.term);
    const starBtn = el('button', {
      className: 'btn-bookmark-star' + (isBookmarked ? ' btn-bookmark-star--active' : ''),
      onClick: (e) => {
        e.stopPropagation();
        const added = BookmarkStore.toggle(item.term);
        starBtn.classList.toggle('btn-bookmark-star--active', added);
        starBtn.textContent = added ? '\u2605' : '\u2606';
        // Update bookmark button text
        bmBtn.textContent = '';
        bmBtn.append('\u2605 ');
        bmBtn.appendChild(triText('glossary.bookmarks', 'Bookmarks'));
        if (BookmarkStore.count()) bmBtn.append(` (${BookmarkStore.count()})`);
      },
    }, isBookmarked ? '\u2605' : '\u2606');
    headerRow.appendChild(starBtn);
    li.appendChild(headerRow);
    li.appendChild(el('div', { className: 'glossary-item__def' }, item.definition));
    if (item.example) {
      li.appendChild(el('div', { className: 'glossary-item__example' }, `e.g. ${item.example}`));
    }
    // JP term annotation — always rendered, CSS controls visibility via i18n-ja / i18n-sub
    if (item.jpTerm && indexMode !== 'jp') {
      const jpLine = el('div', { className: 'glossary-item__jp i18n-ja' });
      jpLine.textContent = `${item.jpTerm}${item.jp ? ' \u2014 ' + item.jp : ''}`;
      li.appendChild(jpLine);
    }
    if (item.jp && indexMode === 'jp') {
      const jpLine = el('div', { className: 'glossary-item__jp i18n-ja' });
      jpLine.textContent = item.jp;
      li.appendChild(jpLine);
    }
    if (item.tags && item.tags.length > 0) {
      const tagsEl = el('div', { className: 'glossary-item__tags' });
      for (const tag of item.tags) {
        const cls = tag === 'BCP' ? 'glossary-tag glossary-tag--bcp'
          : tag === 'ComGI' ? 'glossary-tag glossary-tag--comgi'
          : tag === 'PGI' ? 'glossary-tag glossary-tag--pgi'
          : tag === 'HI' ? 'glossary-tag glossary-tag--hi'
          : 'glossary-tag';
        tagsEl.appendChild(el('span', { className: cls }, tag));
      }
      li.appendChild(tagsEl);
    }
    return li;
  }

  function scrollToSection(sectionId) {
    const id = sectionId.startsWith('glossary-section-') ? sectionId : `glossary-section-${sectionId}`;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    expandedRow = null;
    render();
  });

  render();
});
