/**
 * Question data loader
 * Loads BCP or ComGI question banks from JSON files.
 */
const cache = {};

export async function loadQuestions(module) {
  if (cache[module]) return cache[module];
  const resp = await fetch(`data/${module}.json`);
  const data = await resp.json();
  cache[module] = data;
  return data;
}

export function getTopics(questions) {
  const set = new Set(questions.map(q => q.topic));
  return [...set];
}
