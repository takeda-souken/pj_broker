/**
 * Textbook Reference view — browse and search SCI textbook content
 * Chapter tree → Section detail → Related questions
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadTextbook, searchTextbook, getRelatedQuestions } from '../data/textbook.js';
import { loadQuestions } from '../data/questions.js';
import { triText, tr } from '../utils/i18n.js';

const MODULES = ['bcp', 'comgi', 'pgi', 'hi'];
const MOD_LABELS = { bcp: 'BCP', comgi: 'ComGI', pgi: 'PGI', hi: 'HI' };

const STORAGE_KEY = 'sg_broker_textbook_state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

registerRoute('#textbook', async (app) => {
  // Restore state
  const saved = loadState();
  let currentModule = saved.module || 'bcp';
  let searchQuery = saved.searchQuery || '';
  let selectedSection = saved.selectedSection || null;
  let expandedChapters = new Set(saved.expandedChapters || []);
  let searchTimer = null;

  function persistState() {
    saveState({
      module: currentModule,
      searchQuery,
      selectedSection,
      expandedChapters: [...expandedChapters],
      scrollY: window.scrollY,
    });
  }

  // ── Back button ──
  const backBtn = el('button', { className: 'btn--back', onClick: () => navigate('#home') });
  backBtn.append('\u25C0 ');
  backBtn.appendChild(triText('common.back', 'Back'));
  app.appendChild(backBtn);

  // ── Title ──
  const h1 = el('h1', { className: 'mt-md' });
  h1.appendChild(triText('textbook.title', 'Textbook Reference'));
  app.appendChild(h1);

  // ── Search box ──
  const searchBox = el('input', {
    type: 'search',
    className: 'search-box',
    placeholder: tr('textbook.search', 'Search textbook...'),
    value: searchQuery,
  });
  searchBox.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchBox.value.trim();
      selectedSection = null;
      persistState();
      render();
    }, 300);
  });
  app.appendChild(searchBox);

  // ── Module tabs ──
  const moduleSeg = el('div', { className: 'seg-control mt-sm mb-sm' });
  function renderModuleTabs() {
    moduleSeg.innerHTML = '';
    for (const mod of MODULES) {
      const btn = el('button', {
        className: `seg-control__item seg-control__item--${mod} ${mod === currentModule ? 'seg-control__item--active' : ''}`,
        onClick: () => {
          currentModule = mod;
          searchQuery = '';
          searchBox.value = '';
          selectedSection = null;
          expandedChapters = new Set();
          persistState();
          renderModuleTabs();
          render();
        },
      }, MOD_LABELS[mod]);
      moduleSeg.appendChild(btn);
    }
  }
  renderModuleTabs();
  app.appendChild(moduleSeg);

  // ── Content area ──
  const content = el('div', { className: 'textbook-content' });
  content.setAttribute('data-module', currentModule);
  app.appendChild(content);

  async function render() {
    content.innerHTML = '';
    content.setAttribute('data-module', currentModule);
    const textbook = await loadTextbook(currentModule);

    if (!textbook) {
      content.appendChild(renderNotAvailable());
      return;
    }

    if (selectedSection) {
      await renderSectionDetail(content, textbook, selectedSection);
    } else if (searchQuery) {
      renderSearchResults(content, textbook);
    } else {
      renderChapterTree(content, textbook);
    }
  }

  // ── Not available fallback ──
  function renderNotAvailable() {
    const wrap = el('div', { className: 'textbook-empty' });
    wrap.appendChild(el('div', { className: 'textbook-empty__icon' }, '\uD83D\uDCD6'));
    const msg = el('div', { className: 'textbook-empty__text' });
    msg.appendChild(triText('textbook.notAvailable', 'Textbook content for this module is not yet available.'));
    wrap.appendChild(msg);
    return wrap;
  }

  // ── Chapter Tree ──
  function renderChapterTree(container, textbook) {
    for (const ch of textbook.chapters) {
      const isExpanded = expandedChapters.has(ch.id);
      const chEl = el('div', { className: 'tb-chapter' });

      // Chapter header (clickable)
      const header = el('button', {
        className: `tb-chapter__header ${isExpanded ? 'tb-chapter__header--open' : ''}`,
        onClick: () => {
          if (expandedChapters.has(ch.id)) expandedChapters.delete(ch.id);
          else expandedChapters.add(ch.id);
          persistState();
          render();
        },
      });
      header.appendChild(el('span', { className: 'tb-chapter__arrow' }, isExpanded ? '\u25BC' : '\u25B6'));
      header.appendChild(el('span', { className: 'tb-chapter__num' }, `Ch ${ch.number}`));
      header.appendChild(el('span', { className: 'tb-chapter__title' }, ch.title));
      chEl.appendChild(header);

      // Sections (only if expanded)
      if (isExpanded) {
        const secList = el('div', { className: 'tb-sections' });

        // Learning outcomes (collapsible)
        if (ch.learningOutcomes && ch.learningOutcomes.length > 0) {
          const loEl = el('div', { className: 'tb-lo' });
          loEl.appendChild(el('div', { className: 'tb-lo__title' }, tr('textbook.learningOutcomes', 'Learning Outcomes')));
          const loList = el('ul', { className: 'tb-lo__list' });
          ch.learningOutcomes.forEach(lo => loList.appendChild(el('li', {}, lo)));
          loEl.appendChild(loList);
          secList.appendChild(loEl);
        }

        for (let si = 0; si < ch.sections.length; si++) {
          const sec = ch.sections[si];
          const secBtn = el('button', {
            className: 'tb-section',
            onClick: () => {
              const chIdx = textbook.chapters.indexOf(ch);
              selectedSection = { chapterIdx: chIdx, sectionIdx: si };
              persistState();
              render();
            },
          });
          secBtn.appendChild(el('span', { className: 'tb-section__num' }, `§${sec.number}`));
          secBtn.appendChild(el('span', { className: 'tb-section__title' }, sec.title));
          const paraCount = sec.paragraphs.length + sec.subsections.reduce((n, sub) => n + sub.paragraphs.length, 0);
          secBtn.appendChild(el('span', { className: 'tb-section__count' }, `${paraCount}`));
          secList.appendChild(secBtn);
        }
        chEl.appendChild(secList);
      }

      container.appendChild(chEl);
    }
  }

  // ── Section Detail ──
  async function renderSectionDetail(container, textbook, sel) {
    const ch = textbook.chapters[sel.chapterIdx];
    const sec = ch.sections[sel.sectionIdx];

    // Breadcrumb
    const breadcrumb = el('div', { className: 'tb-breadcrumb' });
    const backLink = el('button', { className: 'tb-breadcrumb__link', onClick: () => { selectedSection = null; persistState(); render(); } });
    backLink.textContent = `Ch ${ch.number}`;
    breadcrumb.appendChild(backLink);
    breadcrumb.appendChild(el('span', { className: 'tb-breadcrumb__sep' }, ' \u203A '));
    breadcrumb.appendChild(el('span', {}, `§${sec.number} ${sec.title}`));
    container.appendChild(breadcrumb);

    // Section title
    container.appendChild(el('h2', { className: 'tb-detail__title' }, `${sec.number}. ${sec.title}`));

    // Section paragraphs
    if (sec.paragraphs.length > 0) {
      const paraWrap = el('div', { className: 'tb-paragraphs' });
      for (const p of sec.paragraphs) {
        paraWrap.appendChild(renderParagraph(p));
      }
      container.appendChild(paraWrap);
    }

    // Subsections
    for (const sub of sec.subsections) {
      const subEl = el('div', { className: 'tb-subsection' });
      subEl.appendChild(el('h3', { className: 'tb-subsection__title' }, `${sub.label}. ${sub.title}`));
      for (const p of sub.paragraphs) {
        subEl.appendChild(renderParagraph(p));
      }
      container.appendChild(subEl);
    }

    // Related questions
    const questions = await loadQuestions(currentModule);
    const related = getRelatedQuestions(questions, ch.number, sec.number);
    if (related.length > 0) {
      const relEl = el('div', { className: 'tb-related' });

      // Header row: title + practice all button
      const headerRow = el('div', { className: 'tb-related__header' });
      headerRow.appendChild(el('div', { className: 'tb-related__title' },
        `${tr('textbook.relatedQuestions', 'Related Questions')} (${related.length})`));
      const allIds = related.map(q => q.id).join(',');
      headerRow.appendChild(el('button', {
        className: 'btn btn--sm tb-related__practice-all',
        onClick: () => { persistState(); navigate(`#quiz?module=${currentModule}&mode=practice&review=${allIds}&from=textbook`); },
      }, `${tr('textbook.practiceAll', 'Practice All')}`));
      relEl.appendChild(headerRow);

      for (const q of related.slice(0, 10)) {
        const qEl = el('div', { className: 'tb-related__item' });
        const badge = el('span', { className: `badge tb-related__badge` },
          q.difficulty <= 1 ? 'Easy' : q.difficulty <= 2 ? 'Medium' : 'Hard');
        qEl.appendChild(badge);
        qEl.appendChild(el('span', { className: 'tb-related__text' }, q.question.substring(0, 120) + (q.question.length > 120 ? '...' : '')));
        qEl.appendChild(el('button', {
          className: 'tb-related__go',
          onClick: () => { persistState(); navigate(`#quiz?module=${currentModule}&mode=practice&review=${q.id}&from=textbook`); },
        }, '\u25B6'));
        relEl.appendChild(qEl);
      }
      if (related.length > 10) {
        relEl.appendChild(el('div', { className: 'tb-related__more' },
          `+ ${related.length - 10} more`));
      }
      container.appendChild(relEl);
    }

    // Prev/Next navigation
    const navRow = el('div', { className: 'tb-nav' });
    if (sel.sectionIdx > 0) {
      const prev = ch.sections[sel.sectionIdx - 1];
      navRow.appendChild(el('button', {
        className: 'btn btn--outline tb-nav__btn',
        onClick: () => { selectedSection = { chapterIdx: sel.chapterIdx, sectionIdx: sel.sectionIdx - 1 }; persistState(); render(); window.scrollTo({ top: 0, behavior: 'instant' }); },
      }, `\u25C0 §${prev.number}`));
    } else {
      navRow.appendChild(el('span'));
    }
    if (sel.sectionIdx < ch.sections.length - 1) {
      const next = ch.sections[sel.sectionIdx + 1];
      navRow.appendChild(el('button', {
        className: 'btn btn--outline tb-nav__btn',
        onClick: () => { selectedSection = { chapterIdx: sel.chapterIdx, sectionIdx: sel.sectionIdx + 1 }; persistState(); render(); window.scrollTo({ top: 0, behavior: 'instant' }); },
      }, `§${next.number} \u25B6`));
    }
    container.appendChild(navRow);
  }

  // ── Paragraph renderer ──
  function renderParagraph(p) {
    const pEl = el('div', { className: 'tb-para' });
    if (p.num) {
      pEl.appendChild(el('span', { className: 'tb-para__num' }, p.num));
    }
    // Handle bullet lists in text
    const parts = p.text.split('\n');
    const textEl = el('div', { className: 'tb-para__text' });
    for (const part of parts) {
      if (part.startsWith('\u25AA ')) {
        textEl.appendChild(el('div', { className: 'tb-para__bullet' }, part.replace('\u25AA ', '')));
      } else {
        textEl.appendChild(document.createTextNode(part));
      }
    }
    pEl.appendChild(textEl);
    return pEl;
  }

  // ── Search Results ──
  function renderSearchResults(container, textbook) {
    const results = searchTextbook(textbook, searchQuery);

    if (results.length === 0) {
      const empty = el('div', { className: 'textbook-empty' });
      empty.appendChild(el('div', { className: 'textbook-empty__text' },
        `${tr('textbook.noResults', 'No results for')} "${searchQuery}"`));
      container.appendChild(empty);
      return;
    }

    container.appendChild(el('div', { className: 'tb-search-count' },
      `${results.length} result${results.length !== 1 ? 's' : ''}`));

    const shown = results.slice(0, 50);
    for (const r of shown) {
      const item = el('button', {
        className: 'tb-search-item',
        onClick: () => {
          // Navigate to section detail
          const chIdx = textbook.chapters.findIndex(c => c.id === r.chapterId);
          const secIdx = chIdx >= 0 ? textbook.chapters[chIdx].sections.findIndex(s => s.id === r.sectionId) : -1;
          if (chIdx >= 0 && secIdx >= 0) {
            selectedSection = { chapterIdx: chIdx, sectionIdx: secIdx };
            render();
          }
        },
      });

      // Breadcrumb
      const bc = el('div', { className: 'tb-search-item__bc' });
      bc.textContent = `Ch ${r.chapterNum} \u203A §${r.sectionNum} ${r.sectionTitle}`;
      if (r.subsection) bc.textContent += ` \u203A ${r.subsection.label}. ${r.subsection.title}`;
      item.appendChild(bc);

      // Snippet with highlight
      const snippet = getSnippet(r.text, searchQuery, 120);
      const snippetEl = el('div', { className: 'tb-search-item__snippet' });
      snippetEl.innerHTML = highlightQuery(snippet, searchQuery);
      item.appendChild(snippetEl);

      if (r.paraNum) {
        item.appendChild(el('span', { className: 'tb-search-item__ref' }, `¶${r.paraNum}`));
      }

      container.appendChild(item);
    }

    if (results.length > 50) {
      container.appendChild(el('div', { className: 'tb-search-more' },
        `Showing 50 of ${results.length} results`));
    }
  }

  function getSnippet(text, query, maxLen) {
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());
    if (idx === -1) return text.substring(0, maxLen);
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 80);
    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet += '...';
    return snippet;
  }

  function highlightQuery(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const qEscaped = escapeHtml(query);
    const regex = new RegExp(`(${qEscaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initial render + restore scroll
  await render();
  if (saved.scrollY) {
    requestAnimationFrame(() => window.scrollTo({ top: saved.scrollY, behavior: 'instant' }));
  }

  return () => { clearTimeout(searchTimer); };
});
