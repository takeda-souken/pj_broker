/**
 * Glossary data loader with filtering and grouping
 */
let cache = null;

export async function loadGlossary() {
  if (cache) return cache;
  try {
    const resp = await fetch('data/glossary.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache = await resp.json();
    return cache;
  } catch (e) {
    console.error('Failed to load glossary:', e);
    return [];
  }
}

/**
 * Search glossary by English term, Japanese term, or definition
 */
export function searchGlossary(glossary, query) {
  const q = query.toLowerCase();
  return glossary.filter(item =>
    item.term.toLowerCase().includes(q) ||
    item.definition.toLowerCase().includes(q) ||
    (item.jp && item.jp.toLowerCase().includes(q)) ||
    (item.jpTerm && item.jpTerm.includes(q))
  );
}

/**
 * Filter glossary by module tag (BCP / ComGI / all)
 */
export function filterByModule(glossary, module) {
  if (!module || module === 'all') return glossary;
  return glossary.filter(item =>
    item.tags && item.tags.includes(module)
  );
}

/**
 * Group items alphabetically by a key function.
 * Returns Map<letter, items[]> sorted by letter.
 */
export function groupAlphabetically(items, keyFn) {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    const letter = (key && key.length > 0) ? key[0].toUpperCase() : '#';
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(item);
  }
  const sorted = new Map([...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  for (const [, list] of sorted) {
    list.sort((a, b) => keyFn(a).localeCompare(keyFn(b)));
  }
  return sorted;
}
