/**
 * Glossary view — searchable, indexed insurance term dictionary
 * Features: EN/JP index tabs, A-Z navigation, module filter, search
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadGlossary, searchGlossary, filterByModule, groupAlphabetically } from '../data/glossary.js';
import { SettingsStore } from '../models/settings-store.js';
import { BookmarkStore } from '../models/bookmark-store.js';
import { showJp as shouldShowJp, tr, trNode } from '../utils/i18n.js';

registerRoute('#glossary', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 ' + tr('common.back', 'Back')));
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(trNode('glossary.title', 'Insurance Glossary'));
  app.appendChild(h1);

  const showJp = shouldShowJp();

  // State
  let indexMode = 'en'; // 'en' or 'jp'
  let moduleFilter = 'all'; // 'all', 'BCP', 'ComGI'
  let searchQuery = '';

  // --- Search box ---
  const searchInput = el('input', {
    className: 'search-box',
    type: 'text',
    placeholder: showJp ? tr('glossary.searchBilingual', 'Search in English or Japanese...') : tr('glossary.searchEn', 'Search terms...'),
  });
  app.appendChild(searchInput);

  // --- Index mode segmented control (EN / JP) ---
  let indexSegEl = null;
  if (showJp) {
    indexSegEl = el('div', { className: 'seg-control mt-sm' });
    const enBtn = el('button', { className: 'seg-control__item seg-control__item--active', onClick: () => setIndexMode('en') }, 'A-Z (English)');
    const jpBtn = el('button', { className: 'seg-control__item', onClick: () => setIndexMode('jp') }, '\u3042-\u308F (Japanese)');
    indexSegEl.appendChild(enBtn);
    indexSegEl.appendChild(jpBtn);
    app.appendChild(indexSegEl);
  }

  // --- Module filter segmented control ---
  const moduleSeg = el('div', { className: 'seg-control mt-sm' });
  const allBtn = el('button', { className: 'seg-control__item seg-control__item--active', onClick: () => setModule('all') }, tr('glossary.allFilter', 'All'));
  const bcpBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('BCP') }, 'BCP');
  const comgiBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('ComGI') }, 'ComGI');
  const bmCount = BookmarkStore.count();
  const bmBtn = el('button', { className: 'seg-control__item', onClick: () => setModule('bookmarks') },
    `\u2605 ${tr('glossary.bookmarks', 'Bookmarks')}${bmCount ? ` (${bmCount})` : ''}`);
  moduleSeg.appendChild(allBtn);
  moduleSeg.appendChild(bcpBtn);
  moduleSeg.appendChild(comgiBtn);
  moduleSeg.appendChild(bmBtn);
  app.appendChild(moduleSeg);

  // --- A-Z bar ---
  const azBar = el('div', { className: 'az-bar mt-sm' });
  app.appendChild(azBar);

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
    if (indexSegEl) {
      indexSegEl.querySelectorAll('.seg-control__item').forEach((btn, i) => {
        btn.className = 'seg-control__item' + ((i === 0 && mode === 'en') || (i === 1 && mode === 'jp') ? ' seg-control__item--active' : '');
      });
    }
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

  function render() {
    listContainer.innerHTML = '';
    azBar.innerHTML = '';

    let items;
    if (moduleFilter === 'bookmarks') {
      const bookmarks = BookmarkStore.getAll();
      items = glossary.filter(item =>
        bookmarks.includes(item.term) ||
        (item.jpTerm && bookmarks.includes(item.jpTerm)) ||
        (item.tags && item.tags.some(t => bookmarks.includes(t)))
      );
    } else {
      items = filterByModule(glossary, moduleFilter);
    }
    if (searchQuery) {
      items = searchGlossary(items, searchQuery);
    }

    countEl.textContent = `${items.length} terms`;

    if (items.length === 0) {
      listContainer.appendChild(el('div', { className: 'text-secondary', style: 'padding:16px 0;text-align:center;' }, tr('glossary.noResults', 'No results.')));
      return;
    }

    // If searching, show flat list (no index)
    if (searchQuery) {
      items.sort((a, b) => a.term.localeCompare(b.term));
      for (const item of items) {
        listContainer.appendChild(createGlossaryItem(item));
      }
      return;
    }

    // Grouped view with A-Z index
    const keyFn = indexMode === 'jp'
      ? (item) => item.jpTerm || item.term
      : (item) => item.term;

    const groups = groupAlphabetically(items, keyFn);
    const allLetters = indexMode === 'jp'
      ? '\u3042\u3044\u3046\u3048\u304A\u304B\u304D\u304F\u3051\u3053\u3055\u3057\u3059\u305B\u305D\u305F\u3061\u3064\u3066\u3068\u306A\u306B\u306C\u306D\u306E\u306F\u3072\u3075\u3078\u307B\u307E\u307F\u3080\u3081\u3082\u3084\u3086\u3088\u3089\u308A\u308B\u308C\u308D\u308F'.split('')
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Build A-Z bar
    for (const letter of allLetters) {
      const hasItems = groups.has(letter);
      const btn = el('button', {
        className: 'az-bar__letter' + (hasItems ? '' : ' az-bar__letter--disabled'),
        onClick: hasItems ? () => scrollToSection(letter) : undefined,
      }, letter);
      azBar.appendChild(btn);
    }

    // Build grouped list
    for (const [letter, items] of groups) {
      const sectionId = `glossary-section-${letter}`;
      const header = el('div', { className: 'glossary-section-header', id: sectionId }, letter);
      listContainer.appendChild(header);
      for (const item of items) {
        listContainer.appendChild(createGlossaryItem(item));
      }
    }
  }

  function createGlossaryItem(item) {
    const li = el('div', { className: 'glossary-item' });
    // Header row with term + bookmark star
    const headerRow = el('div', { className: 'glossary-item__header' });
    headerRow.appendChild(el('div', { className: 'glossary-item__term' }, item.term));
    const isBookmarked = BookmarkStore.has(item.term);
    const starBtn = el('button', {
      className: 'btn-bookmark-star' + (isBookmarked ? ' btn-bookmark-star--active' : ''),
      onClick: (e) => {
        e.stopPropagation();
        const added = BookmarkStore.toggle(item.term);
        starBtn.classList.toggle('btn-bookmark-star--active', added);
        starBtn.textContent = added ? '\u2605' : '\u2606';
        // Update bookmark count in tab
        bmBtn.textContent = `\u2605 ${tr('glossary.bookmarks', 'Bookmarks')}${BookmarkStore.count() ? ` (${BookmarkStore.count()})` : ''}`;
      },
    }, isBookmarked ? '\u2605' : '\u2606');
    headerRow.appendChild(starBtn);
    li.appendChild(headerRow);
    li.appendChild(el('div', { className: 'glossary-item__def' }, item.definition));
    if (item.example) {
      li.appendChild(el('div', { className: 'glossary-item__example' }, `e.g. ${item.example}`));
    }
    if (showJp && item.jpTerm) {
      li.appendChild(el('div', { className: 'glossary-item__jp' }, `${item.jpTerm}${item.jp ? ' \u2014 ' + item.jp : ''}`));
    }
    if (item.tags && item.tags.length > 0) {
      const tagsEl = el('div', { className: 'glossary-item__tags' });
      for (const tag of item.tags) {
        const cls = tag === 'BCP' ? 'glossary-tag glossary-tag--bcp'
          : tag === 'ComGI' ? 'glossary-tag glossary-tag--comgi'
          : 'glossary-tag';
        tagsEl.appendChild(el('span', { className: cls }, tag));
      }
      li.appendChild(tagsEl);
    }
    return li;
  }

  function scrollToSection(letter) {
    const target = document.getElementById(`glossary-section-${letter}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight active letter briefly
      azBar.querySelectorAll('.az-bar__letter').forEach(btn => btn.classList.remove('az-bar__letter--active'));
      const letterBtns = azBar.querySelectorAll('.az-bar__letter');
      for (const btn of letterBtns) {
        if (btn.textContent === letter) {
          btn.classList.add('az-bar__letter--active');
          setTimeout(() => btn.classList.remove('az-bar__letter--active'), 1500);
          break;
        }
      }
    }
  }

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    render();
  });

  render();
});
