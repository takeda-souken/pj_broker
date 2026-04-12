const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const t = {
  'chapters[11].sections[2].subsections[0].paragraphs[0]': 'これには被保険者の過去の病歴および現在の身体的状態が含まれます。引受人は、現在の障害および過去の病歴が将来の請求に与える蓋然的な影響を考慮します。例えば、認知的（心理的）障害の兆候は、被保険者が将来長期介護を必要とする可能性があることを示す場合があります。',
  'chapters[11].sections[2].subsections[1].paragraphs[0]': '申込書には被保険者の病歴に関する質問があります。引受人は申告された疾患についてさらに情報を要求する場合があります。例えば、申込者が高血圧の治療を受けていると述べた場合、引受人は主治医の報告書（APS）を要求し、治療状況や状態が管理されているかどうかを確認することがあります。',
  'chapters[11].sections[2].subsections[1].paragraphs[1]': '保険者は過去の病歴を審査して以下を判断します：\n(a) 再発の可能性\n(b) 申込者の全般的な健康への影響\n(c) 後日の合併症の可能性\n(d) 障害の通常の進行',
  'chapters[11].sections[2].subsections[1].paragraphs[2]': '多くの急性疾患は、回復が迅速かつ完全で、残存する障害の証拠がなければ無視できます。例としては、単純骨折や虫垂切除術が挙げられます。',
  'chapters[11].sections[2].subsections[1].paragraphs[3]': '多くの疾患では、潜在的な合併症や既存の障害の悪化が起こり得ます。例えば、過体重、疲労、血圧の上昇は、それ自体では通常高リスクではありませんが、将来の心血管障害や未診断の糖尿病の発生率が高いことの指標と考えられます。',
  'chapters[11].sections[2].subsections[2].paragraphs[0]': '申込書における被保険者の申告および健康診断の結果は、現在の身体的状態の最初の指標です。年齢や保険金額に応じて、尿検査、血液検査、空腹時血糖、認知評価、心電図（ECG）などの追加検査が必要となる場合があります。',
  'chapters[11].sections[2].subsections[3].paragraphs[0]': '非医学的要因も、健康保険の異なるクラスにさまざまな影響を与える可能性があります。',
  'chapters[11].sections[2].subsections[4].paragraphs[0]': '申込を検討する際、財務情報（すなわち所得、資産、負債）により、引受人は被保険者が過剰保険であるかどうか、または保険料を継続して支払い保険証券を期間中維持する能力があるかどうかを判断できます。',
  'chapters[11].sections[2].subsections[4].paragraphs[1]': '財務情報は障害所得保険の引受において重要です。引受人は、申請された給付額が合理的であり、被保険者の現在の所得の75%を超えていないことを確認しなければなりません。',
  'chapters[11].sections[2].subsections[4].paragraphs[2]': '障害所得給付が正当であるかどうかを判断するために、引受人は被保険者の勤労所得および不労所得（例：投資からの所得）、ならびに純資産を考慮しなければなりません。申込者の資産が相当な投資収益を生んでいなくても、高い純資産は重要です。',
  'chapters[11].sections[2].subsections[5].paragraphs[0]': '被保険者の職業は、その者が呈するリスクに大きな影響を与える可能性があります。職業上の危険は事故または健康上の危険のいずれかです。',
  'chapters[11].sections[2].subsections[5].paragraphs[1]': '高層ビルの外壁塗装に従事する塗装工や、製造工場で重機を扱う者などの一部の職業は、事故による傷害のリスクが高く、障害や入院の可能性が高まります。アスベストや化学物質を扱う職業は、健康上の危険が高いです。',
  'chapters[11].sections[2].subsections[6].paragraphs[0]': '医学的問題は年齢とともに増加する傾向があります。したがって、引受ガイドラインでは、高齢の申込者に対して健康診断/検査および主治医の報告書の要件がより多く求められます。引受人はまた、高齢の被保険者の病歴をより徹底的に調査する場合があります。',
  'chapters[11].sections[2].subsections[7].paragraphs[0]': '過去、現在、将来の居住地は重要なリスク要因となり得ます。引受人は、引受の考慮として、戦争地域、健康関連リスクのある地域、または政治的に不安定な地域に旅行する可能性のある申込者に注意を払います。',
  'chapters[11].sections[2].subsections[8].paragraphs[0]': '(a) 趣味およびライフスタイルリスク\n趣味およびライフスタイルリスクは、事故や疾病の発生確率が高いものと関連するリスクです。以下の活動への従事はライフスタイルリスクと考えられます：\n(i) 薬物乱用\n(ii) 複数の性的パートナー\n(iii) 危険な海域での航海\n(iv) スカイダイビング、バンジージャンプ、スキューバダイビングなどの危険なスポーツ\n(b) 喫煙\n喫煙は、がん、心臓病、脳卒中などの多くの疾病のリスクを高めます。',
  'chapters[11].sections[2].subsections[9].paragraphs[0]': '特定の要因は、各種健康保険の引受においてより重要となる傾向があります。',
  'chapters[11].sections[2].subsections[10].paragraphs[0]': '医療費保険を評価する際、病歴および被保険者の現在の身体的状態は、入院および治療のための医療費につながる可能性のある将来の健康問題の蓋然性の基本的な指標です。既存の病態を有する者は通常、引受条件に制約が課されます。',
  'chapters[11].sections[2].subsections[11].paragraphs[0]': '被保険者の稼得額の規模と安定性、および全般的な財務状況は、障害所得保険の引受における重要な要因です。一部の人にとっては、業務の性質上、軽度の事故や疾病が障害につながる可能性があります。例えば、喉の感染症は歌手にとっては障害になり得ますが、会計士にとってはそうではありません。',
  'chapters[11].sections[2].subsections[12].paragraphs[0]': '長期介護保険（LTC）の引受における2つの主要な要因は、初期の認知障害の検出と罹患リスクです。認知障害はLTCの請求を長期化させる可能性があります。このため、一部の保険者は引受段階で被保険者に認知評価を受けることを求めます。',
  'chapters[11].sections[2].subsections[13].paragraphs[0]': '重大疾病保険の引受では、病歴および現在の身体的状態に加えて、喫煙習慣および家族歴も重要です。',
};

// Now get remaining paragraphs from sections 3-8
const ch = hi.chapters[11];
let remaining = [];
for (let si = 3; si < ch.sections.length; si++) {
  ch.sections[si].paragraphs.forEach((p, pi) => {
    if (!p.textJP || !p.textJP.trim()) remaining.push({path:'chapters[11].sections['+si+'].paragraphs['+pi+']', num:p.num, text:p.text});
  });
  if (ch.sections[si].subsections) ch.sections[si].subsections.forEach((sub, subi) => {
    sub.paragraphs.forEach((p, pi) => {
      if (!p.textJP || !p.textJP.trim()) remaining.push({path:'chapters[11].sections['+si+'].subsections['+subi+'].paragraphs['+pi+']', num:p.num, text:p.text});
    });
  });
}

// Print remaining to see what else needs translation
console.log('Remaining after section 2 subsections:', remaining.length);
remaining.forEach((r, i) => {
  console.log('[' + (i+1) + '] ' + r.path + ' num=' + r.num + ' (' + r.text.length + ' chars)');
});

// Apply batch 1
Object.entries(t).forEach(([path, textJP]) => {
  const parts = path.match(/(\w+)\[(\d+)\]/g);
  let obj = hi;
  for (const part of parts.slice(0, -1)) {
    const [, key, idx] = part.match(/(\w+)\[(\d+)\]/);
    obj = obj[key][parseInt(idx)];
  }
  const lastPart = parts[parts.length - 1];
  const [, lastKey, lastIdx] = lastPart.match(/(\w+)\[(\d+)\]/);
  obj[lastKey][parseInt(lastIdx)].textJP = textJP;
});

fs.writeFileSync('./data/textbook-hi.json', JSON.stringify(hi, null, 2), 'utf8');
console.log('Batch 1: ' + Object.keys(t).length + ' paragraphs translated');
