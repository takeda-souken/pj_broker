const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/projects/pjbroker/data/textbook-pgi.json', 'utf8'));

const issues = [];

function extractNumbers(text) {
  // Extract monetary amounts, percentages, years, section numbers
  const nums = [];
  // S$ amounts
  for (const m of text.matchAll(/S\$[\d,]+/g)) nums.push(m[0]);
  // Percentages
  for (const m of text.matchAll(/\d+%/g)) nums.push(m[0]);
  // Years (4 digits)
  for (const m of text.matchAll(/\b(19|20)\d{2}\b/g)) nums.push(m[0]);
  // Standalone numbers that look significant (not paragraph nums)
  for (const m of text.matchAll(/\b\d{2,}\b/g)) {
    if (!m[0].match(/^(19|20)\d{2}$/)) { /* already caught */ }
  }
  return nums;
}

function countListItems(text) {
  // Count (a), (b), (c)... style items
  const abcMatches = text.match(/\([a-z]\)/g) || [];
  // Count (i), (ii), (iii)... style items
  const romanMatches = text.match(/\([ivx]+\)/g) || [];
  // Count ▪ bullet items
  const bulletMatches = text.match(/▪/g) || [];
  return { abc: abcMatches.length, roman: romanMatches.length, bullets: bulletMatches.length };
}

function extractKeyTerms(text) {
  // Extract capitalized proper nouns / acronyms
  const terms = [];
  for (const m of text.matchAll(/\b[A-Z]{2,}\b/g)) {
    if (!['THE', 'AND', 'FOR', 'NOT', 'HIS', 'HER', 'HAS', 'ARE', 'MAY', 'ALL', 'ANY', 'ITS'].includes(m[0])) {
      terms.push(m[0]);
    }
  }
  // Extract S$ amounts
  for (const m of text.matchAll(/S\$[\d,]+/g)) terms.push(m[0]);
  return [...new Set(terms)];
}

data.chapters.forEach((ch, chIdx) => {
  const allParas = [];
  function collect(sections) {
    for (const s of sections) {
      if (s.paragraphs) for (const p of s.paragraphs) allParas.push(p);
      if (s.subsections) collect(s.subsections);
    }
  }
  collect(ch.sections);

  allParas.forEach((p, pIdx) => {
    const en = p.text;
    const jp = p.textJP;
    if (!jp || !jp.trim()) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'EMPTY', detail: 'No translation' });
      return;
    }

    // 1. Length ratio check
    // Japanese chars are roughly 1:0.5-0.7 ratio to English chars
    const ratio = jp.length / en.length;
    if (ratio < 0.25) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'TOO_SHORT',
        detail: `JP/EN ratio: ${ratio.toFixed(2)} (EN: ${en.length}, JP: ${jp.length})` });
    }

    // 2. List item count mismatch
    const enList = countListItems(en);
    const jpList = countListItems(jp);

    if (enList.abc > 0 && jpList.abc === 0 && jpList.bullets === 0) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'LIST_FORMAT',
        detail: `EN has (a)(b)... x${enList.abc}, JP has none (no abc, no bullets)` });
    }
    if (enList.abc >= 3 && jpList.abc > 0 && Math.abs(enList.abc - jpList.abc) >= 2) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'LIST_COUNT',
        detail: `EN (a)(b)... x${enList.abc}, JP (a)(b)... x${jpList.abc}` });
    }
    if (enList.bullets >= 3 && jpList.bullets > 0 && Math.abs(enList.bullets - jpList.bullets) >= 2) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'BULLET_COUNT',
        detail: `EN bullets: ${enList.bullets}, JP bullets: ${jpList.bullets}` });
    }
    // EN has bullets but JP converted to (a)(b) or vice versa
    if (enList.bullets >= 3 && jpList.bullets === 0 && jpList.abc === 0) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'BULLETS_LOST',
        detail: `EN has ${enList.bullets} bullets, JP has none` });
    }

    // 3. Key numbers missing
    const enAmounts = [...en.matchAll(/S\$[\d,]+/g)].map(m => m[0]);
    for (const amt of enAmounts) {
      if (!jp.includes(amt) && !jp.includes(amt.replace('S$', '').replace(/,/g, ''))) {
        // Check if the number itself appears
        const numOnly = amt.replace('S$', '').replace(/,/g, '');
        if (!jp.includes(numOnly)) {
          issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'AMOUNT_MISSING',
            detail: `"${amt}" in EN but not in JP` });
        }
      }
    }

    // 4. Key acronyms missing
    const enAcronyms = [...new Set([...en.matchAll(/\b(?:MAS|MOM|LTA|GIA|MIB|FIDReC|BOLA|NCD|MCF|HDB|CPF|LIA|FDWI?|PMD|UBI|PAYD|PHYD|EV|ICU|TCM|SRCC|CI)\b/gi)].map(m => m[0].toUpperCase()))];
    for (const acr of enAcronyms) {
      if (!jp.includes(acr)) {
        issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'ACRONYM_MISSING',
          detail: `"${acr}" in EN but not in JP` });
      }
    }

    // 5. EN has (a)(b)(c) but JP uses ▪ bullets instead (format change)
    if (enList.abc >= 3 && jpList.abc === 0 && jpList.bullets >= 2) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'FORMAT_CHANGE',
        detail: `EN uses (a)(b)(c) x${enList.abc}, JP uses ▪ bullets x${jpList.bullets}` });
    }
    if (enList.bullets >= 3 && jpList.abc >= 2 && jpList.bullets === 0) {
      issues.push({ ch: chIdx + 1, para: pIdx, num: p.num, type: 'FORMAT_CHANGE',
        detail: `EN uses ▪ bullets x${enList.bullets}, JP uses (a)(b)(c) x${jpList.abc}` });
    }
  });
});

// Summary
const byType = {};
for (const issue of issues) {
  byType[issue.type] = (byType[issue.type] || 0) + 1;
}

console.log('=== PGI Translation Validation Report ===\n');
console.log('Issue Summary:');
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}
console.log(`\nTotal issues: ${issues.length}\n`);

// Print issues grouped by type
for (const type of Object.keys(byType).sort()) {
  console.log(`\n--- ${type} ---`);
  const typeIssues = issues.filter(i => i.type === type);
  for (const i of typeIssues.slice(0, 30)) {
    console.log(`  Ch${i.ch} [${i.num}] para${i.para}: ${i.detail}`);
  }
  if (typeIssues.length > 30) console.log(`  ... and ${typeIssues.length - 30} more`);
}
