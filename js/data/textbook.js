/**
 * Textbook data loader — fetch structured textbook JSON per module
 */

const cache = {};

/**
 * Load textbook data for a module. Returns null if not available.
 * @param {string} module - 'bcp', 'comgi', 'pgi', 'hi'
 */
export async function loadTextbook(module) {
  if (cache[module]) return cache[module];
  try {
    const resp = await fetch(`data/textbook-${module}.json`);
    if (!resp.ok) return null;
    cache[module] = await resp.json();
    return cache[module];
  } catch {
    return null;
  }
}

/**
 * Search textbook content. Returns array of { chapter, section, subsection?, paragraph, snippet }.
 */
export function searchTextbook(textbook, query) {
  if (!textbook || !query) return [];
  const q = query.toLowerCase();
  const results = [];

  for (const ch of textbook.chapters) {
    for (const sec of ch.sections) {
      // Search section paragraphs
      for (const p of sec.paragraphs) {
        if (p.text.toLowerCase().includes(q)) {
          results.push({
            chapterId: ch.id, chapterNum: ch.number, chapterTitle: ch.title,
            sectionId: sec.id, sectionNum: sec.number, sectionTitle: sec.title,
            subsection: null,
            paraNum: p.num, text: p.text,
          });
        }
      }
      // Search subsection paragraphs
      for (const sub of sec.subsections) {
        for (const p of sub.paragraphs) {
          if (p.text.toLowerCase().includes(q)) {
            results.push({
              chapterId: ch.id, chapterNum: ch.number, chapterTitle: ch.title,
              sectionId: sec.id, sectionNum: sec.number, sectionTitle: sec.title,
              subsection: { id: sub.id, label: sub.label, title: sub.title },
              paraNum: p.num, text: p.text,
            });
          }
        }
      }
    }
  }
  return results;
}

/**
 * Parse a question source string into structured data.
 * "Ch1 §2.4, p.11" → { chapter: 1, paragraphs: ["2.4"], page: 11 }
 * "Ch1 §7.15–7.16, p.27" �� { chapter: 1, paragraphs: ["7.15", "7.16"], page: 27 }
 * "Ch1 §2.28 / §2.31 (table), p.16" → { chapter: 1, paragraphs: ["2.28", "2.31"], page: 16 }
 */
export function parseSource(sourceStr) {
  if (!sourceStr) return null;

  // Extract chapter number
  const chMatch = sourceStr.match(/Ch(\d+)/i);
  if (!chMatch) return null;
  const chapter = parseInt(chMatch[1]);

  // Extract paragraph references (§N.N patterns)
  const paragraphs = [];
  const paraPattern = /§(\d+\.\d+)/g;
  let m;
  while ((m = paraPattern.exec(sourceStr)) !== null) {
    paragraphs.push(m[1]);
  }

  // Handle ranges: §7.15–7.16
  const rangePattern = /§(\d+)\.(\d+)[–-](\d+)\.(\d+)/;
  const rangeMatch = sourceStr.match(rangePattern);
  if (rangeMatch) {
    const sec = parseInt(rangeMatch[1]);
    const from = parseInt(rangeMatch[2]);
    const to = parseInt(rangeMatch[4]);
    for (let i = from; i <= to; i++) {
      const ref = `${sec}.${i}`;
      if (!paragraphs.includes(ref)) paragraphs.push(ref);
    }
  }

  // Extract page
  const pageMatch = sourceStr.match(/p\.(\d+)/);
  const page = pageMatch ? parseInt(pageMatch[1]) : null;

  // Derive section number from first paragraph (e.g., "2.4" → section "2")
  const section = paragraphs.length > 0 ? paragraphs[0].split('.')[0] : null;

  return { chapter, section, paragraphs, page };
}

/**
 * Find related questions for a given section.
 * @param {Array} questions - question array from module JSON
 * @param {number} chapterNum
 * @param {string} sectionNum - e.g. "2"
 * @returns {Array} matching questions
 */
export function getRelatedQuestions(questions, chapterNum, sectionNum) {
  if (!questions) return [];
  return questions.filter(q => {
    const parsed = parseSource(q.source);
    if (!parsed) return false;
    if (parsed.chapter !== chapterNum) return false;
    if (sectionNum && parsed.section !== sectionNum) return false;
    return true;
  });
}
