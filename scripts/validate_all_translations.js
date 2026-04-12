const fs = require('fs');

function validate(filePath, moduleName) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let totalParas = 0, tooShort = 0, amountMissing = 0, formatChange = 0, listCount = 0, bulletsLost = 0;

  const shortExamples = [];

  data.chapters.forEach((ch, chIdx) => {
    const allParas = [];
    function collect(sections) {
      for (const s of sections) {
        if (s.paragraphs) for (const p of s.paragraphs) allParas.push(p);
        if (s.subsections) collect(s.subsections);
      }
    }
    collect(ch.sections);
    totalParas += allParas.length;

    allParas.forEach((p, pIdx) => {
      const en = p.text;
      const jp = p.textJP;
      if (!jp || !jp.trim()) return;

      // Length ratio
      const ratio = jp.length / en.length;
      if (ratio < 0.25) {
        tooShort++;
        if (shortExamples.length < 5) {
          shortExamples.push({ ch: chIdx+1, num: p.num, ratio: ratio.toFixed(2), enLen: en.length, jpLen: jp.length,
            enPreview: en.substring(0, 80), jpPreview: jp.substring(0, 80) });
        }
      }

      // S$ amounts
      const enAmounts = [...en.matchAll(/S\$[\d,]+/g)].map(m => m[0]);
      for (const amt of enAmounts) {
        const numOnly = amt.replace('S$', '').replace(/,/g, '');
        if (!jp.includes(amt) && !jp.includes(numOnly)) amountMissing++;
      }

      // List format
      const enAbc = (en.match(/\([a-z]\)/g) || []).length;
      const jpAbc = (jp.match(/\([a-z]\)/g) || []).length;
      const enBullets = (en.match(/▪/g) || []).length;
      const jpBullets = (jp.match(/▪/g) || []).length;

      if (enAbc >= 3 && jpAbc === 0 && jpBullets >= 2) formatChange++;
      if (enBullets >= 3 && jpAbc >= 2 && jpBullets === 0) formatChange++;
      if (enAbc >= 3 && jpAbc > 0 && Math.abs(enAbc - jpAbc) >= 2) listCount++;
      if (enBullets >= 3 && jpBullets === 0 && jpAbc === 0) bulletsLost++;
    });
  });

  console.log(`\n=== ${moduleName} (${filePath.split('/').pop()}) ===`);
  console.log(`Total paragraphs: ${totalParas}`);
  console.log(`TOO_SHORT (ratio < 0.25):  ${tooShort}  (${(tooShort/totalParas*100).toFixed(1)}%)`);
  console.log(`AMOUNT_MISSING:           ${amountMissing}`);
  console.log(`FORMAT_CHANGE:            ${formatChange}`);
  console.log(`LIST_COUNT mismatch:      ${listCount}`);
  console.log(`BULLETS_LOST:             ${bulletsLost}`);

  if (shortExamples.length > 0) {
    console.log(`\nTOO_SHORT examples:`);
    for (const ex of shortExamples) {
      console.log(`  Ch${ex.ch} [${ex.num}] ratio=${ex.ratio} (EN:${ex.enLen} JP:${ex.jpLen})`);
      console.log(`    EN: ${ex.enPreview}...`);
      console.log(`    JP: ${ex.jpPreview}...`);
    }
  }
}

validate('c:/projects/pjbroker/data/textbook-bcp.json', 'BCP');
validate('c:/projects/pjbroker/data/textbook-comgi.json', 'ComGI');
validate('c:/projects/pjbroker/data/textbook-pgi.json', 'PGI');
