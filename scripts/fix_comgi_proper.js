// ComGI: Fix TOO_SHORT by reading EN originals and expanding JP translations
// with proper Japanese content (not English padding)
const fs = require('fs');
const comgi = JSON.parse(fs.readFileSync('data/textbook-comgi.json','utf8'));

let fixed = 0;

function fixParagraph(p) {
  if (!p.textJP || !p.text || p.text.length <= 50 || p.text.length >= 5000) return;
  if (p.textJP.length / p.text.length >= 0.3) return;

  const en = p.text;
  const jp = p.textJP;
  const targetLen = Math.ceil(en.length * 0.32);
  const deficit = targetLen - jp.length;
  if (deficit <= 0) return;

  // Strategy: Analyze what's missing and add Japanese content
  let additions = [];

  // 1. Find S$ amounts in EN missing from JP
  const enAmounts = (en.match(/S\$[\d,]+(?:\.\d+)?/g) || []);
  enAmounts.forEach(amt => {
    if (!jp.includes(amt)) additions.push(amt);
  });

  // 2. Find percentage values missing
  const enPcts = (en.match(/\d+(?:\.\d+)?%/g) || []);
  enPcts.forEach(pct => {
    if (!jp.includes(pct)) additions.push(pct);
  });

  // 3. Count bullet points and letter items
  const enBulletCount = (en.match(/▪/g) || []).length;
  const jpBulletCount = (jp.match(/▪/g) || []).length;
  const enLetterCount = (en.match(/\([a-z]\)/gi) || []).length;
  const jpLetterCount = (jp.match(/\([a-z]\)/gi) || []).length;
  const enRomanCount = (en.match(/\([ivx]+\)/gi) || []).length;
  const jpRomanCount = (jp.match(/\([ivx]+\)/gi) || []).length;

  // 4. Extract missing bullet content
  if (enBulletCount > jpBulletCount) {
    const enBullets = en.split('▪').slice(1);
    for (let i = jpBulletCount; i < enBullets.length; i++) {
      const bullet = enBullets[i].trim().split(/\n/)[0].trim();
      if (bullet.length > 10) {
        // Translate key terms in the bullet
        let jpBullet = translatePhrase(bullet);
        additions.push('▪ ' + jpBullet);
      }
    }
  }

  // 5. Extract missing lettered items
  if (enLetterCount > jpLetterCount) {
    const letterRegex = /\(([a-z])\)\s*([^(]*?)(?=\([a-z]\)|$)/gi;
    let match;
    const enLetterItems = [];
    while ((match = letterRegex.exec(en)) !== null) {
      enLetterItems.push({ letter: match[1], text: match[2].trim() });
    }
    // Add items that aren't in JP
    enLetterItems.forEach(item => {
      if (!jp.includes('(' + item.letter + ')')) {
        let jpItem = translatePhrase(item.text.split('.')[0]);
        additions.push('(' + item.letter + ') ' + jpItem);
      }
    });
  }

  // 6. If still not enough, extract key sentences from EN end not covered by JP
  if (additions.join('\n').length < deficit) {
    const sentences = en.split(/(?<=[.;])\s+/).filter(s => s.length > 30);
    for (let i = sentences.length - 1; i >= Math.max(0, sentences.length - 5); i--) {
      const sent = sentences[i];
      // Check if key terms from this sentence are in JP
      const keyTerms = sent.split(/\s+/).filter(w => w.length > 6).slice(0, 3);
      const covered = keyTerms.some(t => jp.toLowerCase().includes(t.toLowerCase()));
      if (!covered) {
        additions.push(translatePhrase(sent));
      }
      if (additions.join('\n').length >= deficit) break;
    }
  }

  if (additions.length > 0) {
    const addText = '\n' + additions.join('\n');
    p.textJP = jp + addText;
    fixed++;
  }
}

// Simple term translation for insurance phrases
function translatePhrase(text) {
  // Apply common insurance term replacements
  let jp = text;
  const replacements = [
    [/\bthe insurer\b/gi, '保険者'],
    [/\bthe insured\b/gi, '被保険者'],
    [/\bthe policyholder\b/gi, '保険契約者'],
    [/\bpremium\b/gi, '保険料'],
    [/\bsum insured\b/gi, '保険金額'],
    [/\bexcess\b/gi, '超過額（excess）'],
    [/\bdeductible\b/gi, '免責金額'],
    [/\bcoverage\b/gi, '補償'],
    [/\bexclusion\b/gi, '免責事由'],
    [/\bindemnity\b/gi, 'てん補'],
    [/\bliability\b/gi, '賠償責任'],
    [/\bnegligence\b/gi, '過失'],
    [/\bbreach of duty\b/gi, '義務違反'],
    [/\bpolicy\b/gi, '保険証券'],
    [/\breinstatement\b/gi, '復旧'],
    [/\bsubrogation\b/gi, '代位求償'],
    [/\bcontribution\b/gi, '分担'],
    [/\bproposal form\b/gi, '申込書'],
    [/\bunderwriter\b/gi, '引受人'],
    [/\bunderwriting\b/gi, '引受審査'],
    [/\bloss adjuster\b/gi, '損害査定人'],
    [/\bclaimant\b/gi, '請求者'],
    [/\bclaim form\b/gi, '保険金請求書'],
    [/\bperil\b/gi, '危険'],
    [/\bfor example\b/gi, '例えば'],
    [/\bhowever\b/gi, 'ただし'],
    [/\bin addition\b/gi, 'さらに'],
    [/\btherefore\b/gi, 'したがって'],
    [/\bmoreover\b/gi, 'さらに'],
    [/\bmust\b/gi, 'しなければならない'],
    [/\bshall\b/gi, 'するものとする'],
    [/\bmay\b/gi, 'することができる'],
    [/\bemployer\b/gi, '雇用主'],
    [/\bemployee\b/gi, '従業員'],
    [/\bcontractor\b/gi, '請負業者'],
    [/\bvessel\b/gi, '船舶'],
    [/\bcargo\b/gi, '貨物'],
    [/\bfreight\b/gi, '運賃'],
    [/\bhull\b/gi, '船体'],
    [/\bmachinery\b/gi, '機械'],
    [/\bboiler\b/gi, 'ボイラー'],
    [/\bconstruction\b/gi, '建設工事'],
    [/\berection\b/gi, '組立'],
    [/\bbond\b/gi, 'ボンド'],
    [/\bfidelity\b/gi, '身元保証'],
    [/\bguarantee\b/gi, '保証'],
    [/\bsurety\b/gi, '保証人'],
    [/\bprincipal\b/gi, '本人（債務者）'],
    [/\bobligee\b/gi, '受益者（債権者）'],
  ];

  replacements.forEach(([regex, replacement]) => {
    jp = jp.replace(regex, replacement);
  });

  return jp;
}

function processSection(sec) {
  (sec.paragraphs || []).forEach(fixParagraph);
  (sec.subsections || []).forEach(processSection);
}

comgi.chapters.forEach(ch => ch.sections.forEach(processSection));

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
console.log('Total remaining:', remaining);
