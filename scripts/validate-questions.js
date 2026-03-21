#!/usr/bin/env node
/**
 * validate-questions.js
 * Validates all 4 question data files for the SG Broker Exam Study App.
 *
 * Checks:
 *   1. Required fields (id, topic, question, choices, answer, explanation)
 *   2. choices count === 4
 *   3. answer in range 0-3
 *   4. ID uniqueness within each file
 *   5. choicesJP length === choices length (if present)
 *   6. choicesJP number/proper-noun consistency with choices for the correct answer
 *   7. Duplicate / near-duplicate questions (Levenshtein)
 *
 * Usage:  node scripts/validate-questions.js
 * Exit:   1 if any ERROR, 0 otherwise
 */

const fs = require('fs');
const path = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Levenshtein distance (iterative, O(n*m) space-optimised to two rows). */
function levenshtein(a, b) {
  const la = a.length, lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  let prev = new Array(lb + 1);
  let curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[lb];
}

/** Extract all numbers (integers & decimals, incl. those with commas like 1,000) from a string. */
function extractNumbers(str) {
  const matches = str.match(/[\d,]+\.?\d*/g);
  if (!matches) return [];
  return matches.map(m => m.replace(/,/g, '')).filter(m => m.length > 0);
}

// ── Main ─────────────────────────────────────────────────────────────────────

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const FILES = ['bcp.json', 'comgi.json', 'pgi.json', 'hi.json'];
const REQUIRED = ['id', 'topic', 'question', 'choices', 'answer', 'explanation'];

const issues = [];   // { level, file, id, check, detail }

function log(level, file, id, check, detail) {
  issues.push({ level, file, id, check, detail });
}

let totalQuestions = 0;

for (const fname of FILES) {
  const fpath = path.join(DATA_DIR, fname);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  } catch (e) {
    log('ERROR', fname, '-', 'parse', `Failed to parse JSON: ${e.message}`);
    continue;
  }

  if (!Array.isArray(data)) {
    log('ERROR', fname, '-', 'structure', 'Top-level value is not an array');
    continue;
  }

  totalQuestions += data.length;
  const seenIds = new Map();       // id -> index
  const questionTexts = [];        // { idx, id, text }

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    const qid = q.id || `(index ${i})`;

    // 1. Required fields
    for (const field of REQUIRED) {
      if (q[field] === undefined || q[field] === null) {
        log('ERROR', fname, qid, 'required_field', `Missing field: ${field}`);
      }
    }

    // 2. choices count
    if (Array.isArray(q.choices)) {
      if (q.choices.length !== 4) {
        log('ERROR', fname, qid, 'choices_count', `Expected 4 choices, got ${q.choices.length}`);
      }
    } else if (q.choices !== undefined) {
      log('ERROR', fname, qid, 'choices_type', 'choices is not an array');
    }

    // 3. answer range
    if (typeof q.answer === 'number') {
      if (q.answer < 0 || q.answer > 3 || !Number.isInteger(q.answer)) {
        log('ERROR', fname, qid, 'answer_range', `answer=${q.answer}, expected integer 0-3`);
      }
    } else if (q.answer !== undefined) {
      log('ERROR', fname, qid, 'answer_type', `answer is ${typeof q.answer}, expected number`);
    }

    // 4. ID uniqueness
    if (q.id !== undefined) {
      if (seenIds.has(q.id)) {
        log('ERROR', fname, qid, 'id_unique', `Duplicate ID (first at index ${seenIds.get(q.id)})`);
      } else {
        seenIds.set(q.id, i);
      }
    }

    // 5. choicesJP count
    if (q.choicesJP !== undefined) {
      if (!Array.isArray(q.choicesJP)) {
        log('ERROR', fname, qid, 'choicesJP_type', 'choicesJP is not an array');
      } else if (Array.isArray(q.choices) && q.choicesJP.length !== q.choices.length) {
        log('ERROR', fname, qid, 'choicesJP_count',
          `choicesJP length ${q.choicesJP.length} != choices length ${q.choices.length}`);
      }
    }

    // 6. choicesJP number consistency for the correct answer
    if (q.choicesJP && Array.isArray(q.choicesJP) && Array.isArray(q.choices) &&
        typeof q.answer === 'number' && q.answer >= 0 && q.answer < q.choices.length &&
        q.answer < q.choicesJP.length) {
      const enCorrect = String(q.choices[q.answer]);
      const jpCorrect = String(q.choicesJP[q.answer]);
      const enNums = extractNumbers(enCorrect);
      const jpNums = extractNumbers(jpCorrect);

      if (enNums.length > 0) {
        // Check that each significant number in the EN correct answer appears in the JP version
        for (const num of enNums) {
          if (!jpNums.includes(num)) {
            log('WARN', fname, qid, 'choicesJP_number',
              `EN correct answer number "${num}" not found in JP correct answer. EN="${enCorrect}" JP="${jpCorrect}"`);
          }
        }
      }
    }

    // Collect question texts for duplicate check
    if (typeof q.question === 'string') {
      questionTexts.push({ idx: i, id: qid, text: q.question });
    }
  }

  // 7. Duplicate / near-duplicate questions
  // For performance, only compare within the same file, skip very long comparisons
  const MAX_COMPARE = 2000; // limit pairwise comparisons for large files
  const len = questionTexts.length;
  const doFull = len <= MAX_COMPARE;

  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const a = questionTexts[i];
      const b = questionTexts[j];

      // Exact match
      if (a.text === b.text) {
        log('WARN', fname, a.id, 'duplicate_question',
          `Exact duplicate with ${b.id}`);
        continue;
      }

      // Substring overlap check (>80%)
      const shorter = a.text.length <= b.text.length ? a.text : b.text;
      const longer = a.text.length > b.text.length ? a.text : b.text;
      if (longer.includes(shorter) && shorter.length / longer.length > 0.8) {
        log('WARN', fname, a.id, 'near_duplicate',
          `Substring overlap >80% with ${b.id}`);
        continue;
      }

      // Levenshtein only when both are short enough (< 500 chars) to avoid O(n^2) blowup
      if (doFull && a.text.length < 500 && b.text.length < 500) {
        const maxLen = Math.max(a.text.length, b.text.length);
        const dist = levenshtein(a.text, b.text);
        if (dist < maxLen * 0.1) {
          log('WARN', fname, a.id, 'near_duplicate',
            `Levenshtein distance ${dist} (<10% of length ${maxLen}) with ${b.id}`);
        }
      }
    }
  }
}

// ── Output ───────────────────────────────────────────────────────────────────

let errorCount = 0;
let warnCount = 0;
const perFile = {};

for (const issue of issues) {
  const tag = issue.level === 'ERROR' ? 'ERROR' : 'WARN';
  if (tag === 'ERROR') errorCount++;
  else warnCount++;

  if (!perFile[issue.file]) perFile[issue.file] = { errors: 0, warnings: 0 };
  if (tag === 'ERROR') perFile[issue.file].errors++;
  else perFile[issue.file].warnings++;

  console.log(`[${tag}] ${issue.file} | ${issue.id} | ${issue.check} | ${issue.detail}`);
}

console.log('\n' + '='.repeat(70));
console.log(`Total questions checked: ${totalQuestions}`);
console.log(`Total errors: ${errorCount}  |  Total warnings: ${warnCount}`);
for (const fname of FILES) {
  const s = perFile[fname] || { errors: 0, warnings: 0 };
  console.log(`  ${fname}: ${s.errors} errors, ${s.warnings} warnings`);
}
console.log('='.repeat(70));

process.exit(errorCount > 0 ? 1 : 0);
