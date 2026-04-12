// BCP Ch9: Fix all TOO_SHORT paragraphs
// Strategy: Read each paragraph's EN text, apply correct full JP translation
const fs = require('fs');
const bcp = JSON.parse(fs.readFileSync('data/textbook-bcp.json','utf8'));
const ch = bcp.chapters[8];

let fixed = 0;
let skipped = 0;

function fixParagraph(p) {
  if (!p.textJP || !p.text || p.text.length <= 50 || p.text.length >= 5000) return;
  if (p.textJP.length / p.text.length >= 0.3) return;

  const en = p.text;
  const enLen = en.length;
  const currentJP = p.textJP;
  const currentRatio = currentJP.length / enLen;

  // For paragraphs that are already mostly translated but just under threshold (ratio > 0.25),
  // expand slightly with more faithful translation
  // For paragraphs with very low ratio (<0.2), need full retranslation

  // The approach: use the existing JP as base and expand it to include all missing content
  // Since we can't call an API, we'll write the translations inline

  // For efficiency, we'll handle this by checking if the current JP covers the key points
  // and adding missing content. We target ratio >= 0.32 to have margin.

  const targetLen = Math.ceil(enLen * 0.32);
  const deficit = targetLen - currentJP.length;

  if (deficit <= 0) return; // Already meets target

  // For short paragraphs (EN < 300), the JP is usually a good summary
  // that just needs minor expansion
  if (enLen < 300 && currentRatio > 0.25) {
    // Minor expansion - add clarifying terms
    // These are usually already well-translated, just under threshold due to JP efficiency
    p.textJP = currentJP; // Keep as-is if very close
    if (currentRatio < 0.29) {
      // Need a small boost - typically adding English terms in parentheses helps
      skipped++;
      return;
    }
    return;
  }

  // For everything else, we need to substantially expand
  // Since we can't generate translations dynamically, mark for manual review
  skipped++;
}

// Instead of the above approach, let's just do a bulk fix:
// Read all TOO_SHORT, collect their indices, and write translations

// Collect all TOO_SHORT paragraphs with path info
let allShort = [];
function collectShort(sec, path) {
  (sec.paragraphs||[]).forEach((p, pi) => {
    if (p.textJP && p.text && p.text.length > 50 && p.text.length < 5000 && p.textJP.length/p.text.length < 0.3) {
      allShort.push({
        path: path,
        paraIndex: pi,
        num: p.num,
        enLen: p.text.length,
        jpLen: p.textJP.length,
        ratio: (p.textJP.length/p.text.length).toFixed(3),
        enStart: p.text.substring(0, 80),
      });
    }
  });
  (sec.subsections||[]).forEach((sub, si) => collectShort(sub, path + '.sub' + si));
}
ch.sections.forEach((s, si) => collectShort(s, 'sec' + si));

console.log('Total TOO_SHORT to fix:', allShort.length);

// For BCP Ch9, the pattern is consistent: existing JP translations are decent summaries
// but miss details from the original. We need to expand them.
// The most efficient approach: for each paragraph, take the existing JP and
// add the missing content from EN.

// Since we have 105 items and can't generate translations in this script,
// let's use a different strategy: expand each JP by appending key missing info
// extracted from the EN text.

function expandJP(sec) {
  (sec.paragraphs||[]).forEach(p => {
    if (!p.textJP || !p.text || p.text.length <= 50 || p.text.length >= 5000) return;
    if (p.textJP.length / p.text.length >= 0.3) return;

    const en = p.text;
    const jp = p.textJP;
    const targetLen = Math.ceil(en.length * 0.32);

    // Strategy: The current JP is a compressed version.
    // We need to make it more complete.
    // Common patterns in BCP Ch9:
    // 1. Bullet lists where some bullets are missing
    // 2. Examples/illustrations that were omitted
    // 3. Explanatory details that were compressed

    // For now, we'll use a mechanical approach:
    // If EN has bullet points (▪ or (a)(b)(c)) count them vs JP

    const enBullets = (en.match(/▪/g) || []).length;
    const jpBullets = (jp.match(/▪/g) || []).length;
    const enLetterPoints = (en.match(/\([a-z]\)/g) || []).length;
    const jpLetterPoints = (jp.match(/\([a-z]\)/g) || []).length;

    // If missing bullets/points, that's where content was lost
    // But we can't auto-translate, so we'll need to flag these

    fixed++;
  });
  (sec.subsections||[]).forEach(expandJP);
}

// Actually, let's take a completely different approach.
// For BCP Ch9 with 105 items, the most practical method is:
// Output all EN texts, then we handle translations in the next step.

// Output format for translation
allShort.forEach((item, i) => {
  console.log(`[${i}] ${item.path} ${item.num} EN=${item.enLen} JP=${item.jpLen} ratio=${item.ratio}`);
});

console.log('\nTo fix these, we need to read each EN text and write proper JP.');
console.log('This requires multiple batches of translation work.');
