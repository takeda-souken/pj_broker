/**
 * Question data loader
 * Loads BCP or ComGI question banks from JSON files.
 */
const cache = {};

export async function loadQuestions(module) {
  if (cache[module]) return cache[module];
  try {
    const resp = await fetch(`data/${module}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    cache[module] = data;
    return data;
  } catch (e) {
    console.error(`Failed to load ${module} questions:`, e);
    return [];
  }
}

export function getTopics(questions) {
  const set = new Set(questions.map(q => q.topic));
  return [...set];
}
