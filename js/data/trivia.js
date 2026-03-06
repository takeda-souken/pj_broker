/**
 * Singapore trivia and life tips data loader
 */
let cache = null;

export async function loadTrivia() {
  if (cache) return cache;
  const resp = await fetch('data/trivia.json');
  cache = await resp.json();
  return cache;
}

export function getRandomTrivia(triviaList, category = null) {
  let pool = triviaList;
  if (category) pool = pool.filter(t => t.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}
