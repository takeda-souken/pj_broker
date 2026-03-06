/**
 * Glossary data loader
 */
let cache = null;

export async function loadGlossary() {
  if (cache) return cache;
  const resp = await fetch('data/glossary.json');
  cache = await resp.json();
  return cache;
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
