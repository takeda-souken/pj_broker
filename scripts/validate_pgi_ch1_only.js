const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/projects/pjbroker/data/textbook-pgi.json', 'utf8'));
const ch = data.chapters[0];

const allParas = [];
function collect(sections) {
  for (const s of sections) {
    if (s.paragraphs) for (const p of s.paragraphs) allParas.push(p);
    if (s.subsections) collect(s.subsections);
  }
}
collect(ch.sections);

let tooShort = 0, amountMissing = 0, formatChange = 0, bulletsLost = 0, listCount = 0;
const issues = [];

allParas.forEach((p, i) => {
  const en = p.text, jp = p.textJP;
  if (!jp) return;
  const ratio = jp.length / en.length;

  if (en.length >= 50 && ratio < 0.3) {
    tooShort++;
    issues.push(`TOO_SHORT para ${i} [${p.num}] ratio=${ratio.toFixed(2)} EN:${en.length} JP:${jp.length}`);
  }

  const enAmounts = [...en.matchAll(/S\$[\d,]+/g)].map(m => m[0]);
  for (const amt of enAmounts) {
    const numOnly = amt.replace('S$', '').replace(/,/g, '');
    if (!jp.includes(amt) && !jp.includes(numOnly)) {
      amountMissing++;
      issues.push(`AMOUNT_MISSING para ${i} [${p.num}]: "${amt}"`);
    }
  }

  const enAbc = (en.match(/\([a-z]\)/g) || []).length;
  const jpAbc = (jp.match(/\([a-z]\)/g) || []).length;
  const enBullets = (en.match(/▪/g) || []).length;
  const jpBullets = (jp.match(/▪/g) || []).length;

  if (enAbc >= 3 && jpAbc === 0 && jpBullets >= 2) {
    formatChange++;
    issues.push(`FORMAT_CHANGE para ${i}: EN (a)(b) x${enAbc} -> JP bullets x${jpBullets}`);
  }
  if (enBullets >= 3 && jpAbc >= 2 && jpBullets === 0) {
    formatChange++;
    issues.push(`FORMAT_CHANGE para ${i}: EN bullets x${enBullets} -> JP (a)(b) x${jpAbc}`);
  }
  if (enBullets >= 3 && jpBullets === 0 && jpAbc === 0) {
    bulletsLost++;
    issues.push(`BULLETS_LOST para ${i} [${p.num}]: EN ${enBullets} bullets, JP 0`);
  }
  if (enAbc >= 3 && jpAbc > 0 && Math.abs(enAbc - jpAbc) >= 2) {
    listCount++;
    issues.push(`LIST_COUNT para ${i}: EN (a)(b) x${enAbc}, JP x${jpAbc}`);
  }
});

console.log('=== PGI Ch1 Validation (post-redo) ===');
console.log(`Total paragraphs: ${allParas.length}`);
console.log(`TOO_SHORT (ratio<0.3, EN>=50):  ${tooShort}`);
console.log(`AMOUNT_MISSING:                 ${amountMissing}`);
console.log(`FORMAT_CHANGE:                  ${formatChange}`);
console.log(`BULLETS_LOST:                   ${bulletsLost}`);
console.log(`LIST_COUNT mismatch:            ${listCount}`);
console.log('');
if (issues.length > 0) {
  console.log('Issues:');
  issues.forEach(i => console.log('  ' + i));
} else {
  console.log('ALL CLEAR');
}
