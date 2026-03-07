/**
 * Singapore trivia and life tips data loader
 */
let cache = null;

export async function loadTrivia() {
  if (cache) return cache;
  try {
    const resp = await fetch('data/trivia.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache = await resp.json();
    return cache;
  } catch (e) {
    console.error('Failed to load trivia:', e);
    return [];
  }
}

export function getRandomTrivia(triviaList, category = null) {
  let pool = triviaList;
  if (category) pool = pool.filter(t => t.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}
