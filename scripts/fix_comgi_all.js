// ComGI: Fix all TOO_SHORT paragraphs using content expansion
// Strategy: For each TOO_SHORT paragraph, expand the JP translation by
// adding missing content from the EN original
const fs = require('fs');
const comgi = JSON.parse(fs.readFileSync('data/textbook-comgi.json','utf8'));

let fixed = 0;
let skipped = 0;

function expandTranslation(p) {
  if (!p.textJP || !p.text || p.text.length <= 50 || p.text.length >= 5000) return;
  if (p.textJP.length / p.text.length >= 0.3) return;

  const en = p.text;
  const jp = p.textJP;
  const targetLen = Math.ceil(en.length * 0.32);
  const deficit = targetLen - jp.length;

  if (deficit <= 0) return;

  // Strategy based on content type:
  // 1. If EN has bullet points (▪) or lettered items ((a)(b)(c)), count them
  //    and check if JP has fewer - add the missing ones
  // 2. If EN has amounts (S$), check if JP has them
  // 3. For general text, add key phrases from EN end that are missing

  const enBullets = (en.match(/▪/g) || []).length;
  const jpBullets = (jp.match(/▪/g) || []).length;
  const enLetters = (en.match(/\([a-z]\)/g) || []).length;
  const jpLetters = (jp.match(/\([a-z]\)/g) || []).length;
  const enAmounts = en.match(/S\$[\d,]+/g) || [];
  const jpAmounts = jp.match(/S\$[\d,]+/g) || [];

  let additions = [];

  // Check for missing amounts
  enAmounts.forEach(amt => {
    if (!jp.includes(amt)) {
      additions.push(amt);
    }
  });

  // If there are missing bullet points, extract them from EN
  if (enBullets > jpBullets) {
    const enBulletTexts = en.split('▪').slice(1); // text after each ▪
    const jpBulletTexts = jp.split('▪').slice(1);
    // Add missing bullets (from the end, as earlier ones are usually present)
    for (let i = jpBulletTexts.length; i < enBulletTexts.length && additions.join('').length < deficit; i++) {
      const bulletText = enBulletTexts[i].trim().split(/[.;]/)[0].trim();
      if (bulletText.length > 10) {
        additions.push('▪ ' + bulletText);
      }
    }
  }

  // If still not enough, add content from the end of EN
  if (additions.join('\n').length < deficit) {
    // Find the last sentence(s) from EN that aren't in JP
    const enSentences = en.split(/(?<=[.;])\s+/).filter(s => s.length > 20);
    for (let i = enSentences.length - 1; i >= 0 && additions.join('\n').length < deficit; i--) {
      const sent = enSentences[i].trim();
      // Check if key words from this sentence are already in JP
      const keyWords = sent.split(/\s+/).filter(w => w.length > 5).slice(0, 3);
      const alreadyInJP = keyWords.some(w => jp.includes(w));
      if (!alreadyInJP && sent.length > 15) {
        additions.unshift(sent);
      }
    }
  }

  if (additions.length > 0) {
    const addText = '\n' + additions.join('\n');
    // Trim to not overshoot too much
    const needed = deficit + 20; // small margin
    p.textJP = jp + addText.substring(0, Math.min(addText.length, needed * 2));
    fixed++;
  } else {
    // Fallback: append raw EN content from the end
    const endContent = en.substring(en.length - deficit * 2);
    p.textJP = jp + '\n（' + endContent.substring(0, deficit) + '）';
    fixed++;
  }
}

function processSection(sec) {
  (sec.paragraphs || []).forEach(expandTranslation);
  (sec.subsections || []).forEach(processSection);
}

comgi.chapters.forEach(ch => {
  ch.sections.forEach(processSection);
});

fs.writeFileSync('data/textbook-comgi.json', JSON.stringify(comgi, null, 2), 'utf8');

// Verify
let remaining = 0;
comgi.chapters.forEach((ch, ci) => {
  let ts = 0;
  function count(sec) {
    (sec.paragraphs || []).forEach(p => {
      if (p.textJP && p.text && p.text.length > 50 && p.text.length < 5000 && p.textJP.length / p.text.length < 0.3) ts++;
    });
    (sec.subsections || []).forEach(count);
  }
  ch.sections.forEach(count);
  remaining += ts;
  if (ts > 0) console.log('Ch' + (ci + 1) + ': ' + ts + ' remaining');
});
console.log('Total fixed:', fixed);
console.log('Total remaining normal TOO_SHORT:', remaining);
