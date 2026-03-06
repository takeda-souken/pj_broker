/**
 * Glossary view — searchable insurance term dictionary
 * Supports English search, Japanese reverse lookup, and category filtering.
 */
import { registerRoute, navigate } from '../router.js';
import { el } from '../utils/dom-helpers.js';
import { loadGlossary, searchGlossary } from '../data/glossary.js';
import { SettingsStore } from '../models/settings-store.js';

registerRoute('#glossary', async (app) => {
  app.appendChild(el('button', { className: 'btn--back', onClick: () => navigate('#home') }, '\u25C0 Back'));
  app.appendChild(el('h1', { className: 'mt-md' }, 'Insurance Glossary'));

  const isKataoka = SettingsStore.isKataokaMode();

  const searchInput = el('input', {
    className: 'search-box',
    type: 'text',
    placeholder: isKataoka ? 'Search in English or Japanese...' : 'Search terms...',
  });
  app.appendChild(searchInput);

  const listContainer = el('ul', { className: 'glossary-list mt-md' });
  app.appendChild(listContainer);

  let glossary = [];
  try {
    glossary = await loadGlossary();
  } catch {
    listContainer.appendChild(el('li', { className: 'text-secondary' }, 'Glossary data not loaded.'));
    return;
  }

  function render(items) {
    listContainer.innerHTML = '';
    if (items.length === 0) {
      listContainer.appendChild(el('li', { className: 'text-secondary', style: 'padding:16px 0;' }, 'No results.'));
      return;
    }
    for (const item of items) {
      const li = el('li', { className: 'glossary-item' });
      li.appendChild(el('div', { className: 'glossary-item__term' }, item.term));
      li.appendChild(el('div', { className: 'glossary-item__def' }, item.definition));
      if (isKataoka && item.jpTerm) {
        li.appendChild(el('div', { className: 'glossary-item__jp' }, `${item.jpTerm}${item.jp ? ' — ' + item.jp : ''}`));
      }
      listContainer.appendChild(li);
    }
  }

  render(glossary);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    render(q ? searchGlossary(glossary, q) : glossary);
  });
});
