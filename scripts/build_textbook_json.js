#!/usr/bin/env node
/**
 * build_textbook_json.js — Convert SCI eBook txt files to structured JSON
 *
 * Usage: node scripts/build_textbook_json.js
 *
 * Input:  *.txt in project root (PDF copy-paste exports)
 * Output: data/textbook-{module}.json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');

const MODULES = [
  { id: 'bcp',   file: 'BCP 7th Ed Ver 1.4_eBook_combined.txt',               title: 'Basic Insurance Concepts & Principles' },
  { id: 'comgi', file: '1 ComGI 7th Ed Ver 1.1_eBook_28102024.txt',            title: 'Commercial General Insurance' },
  { id: 'pgi',   file: '2 PGI 7th Ed V1.3_eBook_combined.txt',                 title: 'Personal General Insurance' },
  { id: 'hi',    file: '3 HI 8th Edition V1.1 Full Combined_Dec 2024.txt',     title: 'Health Insurance' },
];

// ─── Phase 1: Pre-process — strip page headers/footers ───

function preprocess(rawLines) {
  const cleaned = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Strip "Copyright reserved by the Singapore College..." lines
    if (/^Copyright reserved by the Singapore College/i.test(trimmed)) {
      // Also strip the PREVIOUS line if it's a page header like "N. Chapter Title"
      if (cleaned.length > 0) {
        const prev = cleaned[cleaned.length - 1].trim();
        // Page headers: "N. Chapter Title Text" (matches section heading pattern)
        // OR standalone chapter/module name repetitions
        if (/^\d+\.\s+[A-Z]/.test(prev) && !(/^\d+\.\d+/.test(prev))) {
          cleaned.pop();
        }
      }
      continue;
    }

    // Strip standalone module name lines (repeated as page headers)
    if (/^Basic Insurance Concepts and Principles$/i.test(trimmed)) continue;
    if (/^Commercial General Insurance$/i.test(trimmed)) continue;
    if (/^Personal General Insurance$/i.test(trimmed)) continue;
    if (/^Health Insurance$/i.test(trimmed)) continue;

    // Strip standalone roman numeral page numbers
    if (/^[ivxlcdm]+$/i.test(trimmed) && trimmed.length <= 6) continue;

    // Strip "N Copyright reserved..." (page number + copyright)
    if (/^\d+\s+Copyright reserved/i.test(trimmed)) continue;

    // Strip "Table of Contents" headers that appear mid-text
    if (/^Table of Contents$/i.test(trimmed)) continue;

    // Strip standalone page numbers (just a number on its own line)
    if (/^\d+$/.test(trimmed) && parseInt(trimmed) < 500) continue;

    cleaned.push(line);
  }

  // Second pass: remove chapter-internal Contents/TOC blocks
  // "Contents" → many TOC lines → first real paragraph (N.N text without dots)
  const result = [];
  let inTOC = false;
  for (let i = 0; i < cleaned.length; i++) {
    const trimmed = cleaned[i].trim();

    if (!inTOC && /^Contents$/i.test(trimmed)) {
      inTOC = true;
      continue;
    }

    if (inTOC) {
      // The only reliable exit signal: a paragraph number (N.N) without dot leaders
      if (/^\d+\.\d+\s+/.test(trimmed) && !/\.{3,}/.test(trimmed)) {
        inTOC = false;
        // Look back for the section heading that precedes this paragraph.
        // It would have been skipped as TOC content, but it's actually the real heading.
        // The heading is an ALL-CAPS "N. TITLE" without dots, within the last few skipped lines.
        for (let k = i - 1; k >= Math.max(0, i - 5); k--) {
          const prev = cleaned[k].trim();
          if (/^\d+\.\s+[A-Z][A-Z\s&',\-()/–?:]+$/.test(prev) && !/\.{3,}/.test(prev)) {
            result.push(cleaned[k]);
            break;
          }
        }
        result.push(cleaned[i]);
      }
      // Also exit on CHAPTER N
      else if (CHAPTER_START_RE.test(trimmed)) {
        inTOC = false;
        result.push(cleaned[i]);
      }
      // Everything else inside TOC is skipped
      continue;
    }

    result.push(cleaned[i]);
  }
  return result;
}

// ─── Phase 2: Split into chapters ───

const CHAPTER_START_RE = /^CHAPTER\s+(\d+)\s*$/i;

function findChapterBoundaries(lines) {
  // Find all "CHAPTER N" lines (all caps, standalone)
  const allStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(CHAPTER_START_RE);
    if (m) {
      allStarts.push({ lineIndex: i, number: parseInt(m[1]) });
    }
  }

  if (allStarts.length === 0) return [];

  // Find "ACCESS TO ONLINE" or "LIST OF CHANGES" — marks the end of body content.
  // Chapters after this point are changelog entries, not real chapters.
  let endOfBody = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^(ACCESS TO ONLINE|LIST OF CHANGES)/i.test(lines[i].trim())) {
      endOfBody = i;
      break;
    }
  }

  // Keep chapters before endOfBody, but also skip duplicates from front-matter TOC.
  // Real chapters: the FIRST occurrence of each chapter number before endOfBody.
  const seen = new Set();
  const starts = [];
  for (const s of allStarts) {
    if (s.lineIndex >= endOfBody) continue;
    if (seen.has(s.number)) continue;
    seen.add(s.number);
    starts.push(s);
  }
  return starts;
}

// ─── Phase 3: Parse each chapter ───

// Section: "N. TITLE IN CAPS" (all caps after the number)
function isSectionHeading(line) {
  const m = line.match(/^(\d+)\.\s+([A-Z][A-Z\s&',\-()/–?:]+)$/);
  if (!m) return null;
  // Reject if it looks like a paragraph number (N.N)
  if (/^\d+\.\d+/.test(line)) return null;
  // Section titles are ALL CAPS
  const titlePart = m[2].trim();
  if (titlePart !== titlePart.toUpperCase()) return null;
  return { number: m[1], title: toTitleCase(titlePart) };
}

// Subsection: "A.", "A1.", "A5A." (letter-based)
function isSubsectionHeading(line) {
  const m = line.match(/^([A-Z]\d*[A-Z]?)\.\s+(.+)$/);
  if (!m) return null;
  // Reject single letters that are too common (e.g. "I. ..." could be a list)
  // but allow "A.", "B.", etc. as they're the standard subsection format
  const label = m[1];
  const title = m[2].trim();
  // Title should start with a capital letter
  if (!/^[A-Z]/.test(title)) return null;
  return { label, title };
}

// Paragraph: "N.N text..." or "N.NN text..."
function isParagraph(line) {
  const m = line.match(/^(\d+\.\d+)\s+(.+)/);
  if (!m) return null;
  return { num: m[1], text: m[2] };
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

function parseChapter(lines, chapterNum) {
  let idx = 1; // skip "CHAPTER N"

  // ── Title (caps lines before CHAPTER OUTLINE) ──
  const titleParts = [];
  while (idx < lines.length) {
    const line = lines[idx].trim();
    if (!line || /^CHAPTER OUTLINE/i.test(line) || /^LEARNING OUTCOMES?/i.test(line)) break;
    titleParts.push(line);
    idx++;
  }
  const title = titleParts.join(' ').replace(/\s+/g, ' ').trim();

  // ── Outline ──
  const outline = [];
  if (idx < lines.length && /^CHAPTER OUTLINE/i.test(lines[idx].trim())) {
    idx++;
    while (idx < lines.length) {
      const line = lines[idx].trim();
      if (/^LEARNING OUTCOMES?/i.test(line) || /^Contents$/i.test(line)) break;
      if (line) {
        const m = line.match(/^\d+\.\s+(.+)/);
        if (m) outline.push(m[1]);
      }
      idx++;
    }
  }

  // ── Learning Outcomes ──
  const learningOutcomes = [];
  if (idx < lines.length && /^LEARNING OUTCOMES?/i.test(lines[idx].trim())) {
    idx++;
    while (idx < lines.length) {
      const line = lines[idx].trim();
      if (/^Contents$/i.test(line)) break;
      if (isSectionHeading(line)) break;
      if (/^▪/.test(line)) {
        learningOutcomes.push(line.replace(/^▪\s*/, ''));
      } else if (learningOutcomes.length > 0 && line && !/^After studying/i.test(line)) {
        learningOutcomes[learningOutcomes.length - 1] += ' ' + line;
      }
      idx++;
    }
  }

  // ── Skip chapter-internal Contents/TOC ──
  // TOC lines have dot leaders (......) or end with page numbers.
  // Skip everything until the first numbered paragraph (N.N text).
  // Section headings inside TOC look identical to real ones, so we can't use
  // isSectionHeading to break — instead we rely on paragraph numbers as the
  // reliable boundary.
  if (idx < lines.length && /^Contents$/i.test(lines[idx].trim())) {
    idx++;
    while (idx < lines.length) {
      const line = lines[idx].trim();
      if (isParagraph(line)) break;
      if (CHAPTER_START_RE.test(line)) break;
      idx++;
    }
  }

  // ── Body: sections → subsections → paragraphs ──
  const sections = [];
  let curSec = null;
  let curSub = null;

  function pushSub() {
    if (curSub && curSec) {
      curSec.subsections.push(curSub);
      curSub = null;
    }
  }
  function pushSec() {
    pushSub();
    if (curSec) sections.push(curSec);
    curSec = null;
  }

  function appendText(text) {
    const target = curSub || curSec;
    if (!target) return;
    if (target.paragraphs.length > 0) {
      target.paragraphs[target.paragraphs.length - 1].text += ' ' + text;
    } else {
      target.paragraphs.push({ num: '', text });
    }
  }

  while (idx < lines.length) {
    const line = lines[idx].trim();
    idx++;

    if (!line) continue;

    // Section heading (ALL CAPS)
    const sec = isSectionHeading(line);
    if (sec) {
      pushSec();
      curSec = {
        id: `ch${chapterNum}-s${sec.number}`,
        number: sec.number,
        title: sec.title,
        paragraphs: [],
        subsections: [],
      };
      continue;
    }

    // Subsection heading
    const sub = isSubsectionHeading(line);
    if (sub && curSec) {
      pushSub();
      curSub = {
        id: `ch${chapterNum}-s${curSec.number}-${sub.label}`,
        label: sub.label,
        title: sub.title,
        paragraphs: [],
      };
      continue;
    }

    // Paragraph with number
    const para = isParagraph(line);
    if (para) {
      const target = curSub || curSec;
      if (target) {
        target.paragraphs.push({ num: para.num, text: para.text });
      }
      continue;
    }

    // List item
    if (/^[▪•]\s/.test(line) || /^▪/.test(line)) {
      const itemText = line.replace(/^[▪•]\s*/, '').trim();
      const target = curSub || curSec;
      if (target && target.paragraphs.length > 0) {
        target.paragraphs[target.paragraphs.length - 1].text += '\n▪ ' + itemText;
      } else if (target) {
        target.paragraphs.push({ num: '', text: '▪ ' + itemText });
      }
      continue;
    }

    // Continuation text — append to last paragraph
    appendText(line);
  }

  pushSec();

  return {
    id: `ch${chapterNum}`,
    number: chapterNum,
    title,
    outline,
    learningOutcomes,
    sections,
  };
}

// ─── Main ───

function parseModule(mod) {
  const filePath = path.join(ROOT, mod.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${mod.file}`);
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const rawLines = raw.split(/\r?\n/);

  // Phase 1: Clean
  const lines = preprocess(rawLines);

  // Phase 2: Find chapters
  const chapterStarts = findChapterBoundaries(lines);
  if (chapterStarts.length === 0) {
    console.warn(`  ⚠ No chapters found in ${mod.file}`);
    return null;
  }

  // Phase 3: Parse chapters
  const chapters = [];
  for (let ci = 0; ci < chapterStarts.length; ci++) {
    const start = chapterStarts[ci].lineIndex;
    const end = ci + 1 < chapterStarts.length ? chapterStarts[ci + 1].lineIndex : lines.length;
    const chapterLines = lines.slice(start, end);
    chapters.push(parseChapter(chapterLines, chapterStarts[ci].number));
  }

  return { module: mod.id, title: mod.title, chapters };
}

console.log('Building textbook JSON...\n');

for (const mod of MODULES) {
  console.log(`Processing ${mod.id.toUpperCase()} (${mod.file})...`);
  const result = parseModule(mod);
  if (!result) { console.log('  Skipped.\n'); continue; }

  const outPath = path.join(DATA, `textbook-${mod.id}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

  let totalSections = 0, totalParas = 0, totalSubs = 0;
  for (const ch of result.chapters) {
    totalSections += ch.sections.length;
    for (const sec of ch.sections) {
      totalParas += sec.paragraphs.length;
      totalSubs += sec.subsections.length;
      for (const sub of sec.subsections) totalParas += sub.paragraphs.length;
    }
  }
  const fileSize = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✓ ${result.chapters.length} chapters, ${totalSections} sections, ${totalSubs} subsections, ${totalParas} paragraphs → ${fileSize}KB\n`);
}

console.log('Done!');
