const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const translations = {
  'chapters[8].sections[2].paragraphs[0]': 'MediShield Lifeは、年齢や健康状態にかかわらず、すべてのシンガポール市民（SC）および永住権保持者（PR）を大きな医療費から生涯にわたって保護する基本的な健康保険スキームです。',
  'chapters[8].sections[2].paragraphs[1]': 'MediShield Lifeへの申請は不要です。すべてのSCおよびPRは2015年11月1日からMediShield Lifeに自動加入しています。新しいSCは出生時または市民権取得日から補償されます。PRは永住権取得日から補償されます。',
  'chapters[8].sections[2].paragraphs[2]': 'MediShield Lifeは、すべての公的医療機関および民間医療機関での補助金付きおよび非補助金の病棟クラスでの入院の補償を提供します。ただし、MediShield Lifeの請求限度額はB2/C級病棟の補助金付き入院を基準に設計されています。',

  'chapters[8].sections[2].subsections[0].paragraphs[0]': 'MediShield Lifeの保険料は、各年齢グループの保険金支払いがそれぞれの年齢グループの保険料によって概ね支えられるよう、各年齢グループの健康リスクと予想される医療利用に基づいて保険数理的に算定されています。',
  'chapters[8].sections[2].subsections[0].paragraphs[1]': '既存の病態を有する者もその病態に対する補償を享受できます。MOHウェブサイトに記載されている深刻な既存の病態を有する者のみが、追加保険料を支払う必要があります。',
  'chapters[8].sections[2].subsections[0].paragraphs[2]': 'MediShield Lifeの保険料は全額MediSaveで支払うことができます。自分のMediSaveまたは家族のMediSaveを使用して保険料を支払うことができます。',

  'chapters[8].sections[2].subsections[1].paragraphs[0]': '政府はSCおよびPRのMediShield Life保険料を支援するためのさまざまな保険料補助金および支援措置を提供しています（追加保険料を支払う必要がある者を含む）：\n(a) 保険料補助金\n(b) Pioneer Generation補助金\n(c) Merdeka Generation補助金\n(d) 追加保険料支援（APS）',

  'chapters[8].sections[2].subsections[2].paragraphs[0]': 'これは、1人あたりの世帯月収がS$2,800以下で、年間評価額（AV）がS$21,000以下の住宅に居住する低〜中所得世帯を支援するための対象化された支援措置です。',
  'chapters[8].sections[2].subsections[2].paragraphs[1]': '適格な者は保険料の最大50%の補助金を受けることができます。PRはSCに適用される補助金の半額を受け取ります。',

  'chapters[8].sections[2].subsections[3].paragraphs[0]': 'パイオニアとは、1949年12月31日以前に生まれ、1986年12月31日以前に市民権を取得したシンガポール市民を指します。',
  'chapters[8].sections[2].subsections[3].paragraphs[1]': 'パイオニアは、年齢に応じて40%〜60%の特別なPioneer Generation補助金を受けます。これは世帯月収や住居の年間評価額にかかわりません。',
  'chapters[8].sections[2].subsections[3].paragraphs[2]': 'パイオニアはまた、MediShield Lifeの保険料に充てることができる年間S$250〜S$900のMediSaveトップアップ（出生年に応じて）を生涯にわたって受けます。',
  'chapters[8].sections[2].subsections[3].paragraphs[3]': 'これにより、高齢のパイオニアは引き続き特別なPG保険料補助金とMediSaveトップアップにより保険料が全額カバーされ、若いパイオニアは保険料の約3分の2がカバーされます。',
  'chapters[8].sections[2].subsections[3].paragraphs[4]': 'さらに、深刻な既存病態を有する高齢のPioneer Generationの高齢者は、2021年から2025年まで追加保険料に充てることができる年間S$50〜S$200の追加MediSaveトップアップも受けます。',

  'chapters[8].sections[2].subsections[4].paragraphs[0]': 'Merdeka Generationの高齢者とは：\n(i) 1950年1月1日から1959年12月31日までの間に生まれ、1996年12月31日以前に市民権を取得したシンガポール市民\n(ii) 上記の期間に生まれ、PRとして市民権を申請したシンガポール市民を指します。',
  'chapters[8].sections[2].subsections[4].paragraphs[1]': '2019年7月1日から、Merdeka Generationの高齢者は、世帯月収や住居の年間評価額にかかわらず、年間MediShield Life保険料の5%の追加Merdeka Generation補助金を受け、75歳以降は10%に増加します。',
  'chapters[8].sections[2].subsections[4].paragraphs[2]': 'Merdeka Generationの会員は、2019年から2023年の5年間、年間S$200のMediSaveトップアップを受けました。これらのトップアップはMediShield Lifeの保険料の支払いに使用できます。',

  'chapters[8].sections[2].subsections[5].paragraphs[0]': '政府補助金、MediSaveの使用後もMediShield Lifeの保険料を支払うことができず、家族の支援も限られている個人は、追加保険料支援（APS）を申請するよう政府から招請されます。',

  'chapters[8].sections[2].subsections[6].paragraphs[0]': 'MediShield Lifeの給付は、進化するヘルスケアの状況とコストインフレに対応し、シンガポール人のニーズに持続可能で適切であり続けるよう定期的にレビューされています。',

  'chapters[8].sections[2].subsections[7].paragraphs[0]': 'MediShield Lifeスキームは、補償される医療費に課される請求限度額、ならびに免責金額、共同保険、按分係数に基づき、償還ベースで支払います。',
  'chapters[8].sections[2].subsections[7].paragraphs[1]': '免責金額は、MediShield Lifeの給付が開始される前に被保険者が各保険年度（保険証券更新月の翌年）に支払う固定額です。免責金額は保険年度ごとに1回のみ支払います。',
  'chapters[8].sections[2].subsections[7].paragraphs[2]': '共同保険は、被保険者が免責金額とともに支払わなければならない請求可能額のうちの患者の負担分です。請求額が増加するにつれて10%から3%に減少します。共同保険は過剰消費の抑制に役立ちます。',
  'chapters[8].sections[2].subsections[7].paragraphs[3]': '民間病院の請求額および公立病院のA/B1級の請求額はMediShield Lifeが設計されたB2/C級の請求額よりも一般に高いため、B2/C級の同等レベルに按分されます。',
  'chapters[8].sections[2].subsections[7].paragraphs[4]': '表9.2は、MediShield Lifeに基づく償還の算出方法の例を示しています。',
  'chapters[8].sections[2].subsections[7].paragraphs[5]': '表9.2から、MediShield LifeはA級病棟の入院費の大部分を補償しないことに注意してください。被保険者の入院費はB2/C級の同等額に按分された後、免責金額と共同保険が適用されました。',
  'chapters[8].sections[2].subsections[7].paragraphs[6]': 'したがって、被保険者は入院を希望する病院や病棟を選択する前に、保険補償を慎重に検討することが重要です。A級やB1級の病棟の補償を希望する場合は、統合シールドプラン（IP）で補償を補完することを検討すべきです。',
  'chapters[8].sections[2].subsections[7].paragraphs[7]': '特定の医療処置および費用には免責事項が課されています。このような費用が発生した場合、被保険者はMediShield Lifeの下で請求できません。',
  'chapters[8].sections[2].subsections[7].paragraphs[8]': '以下の治療項目、処置、状態、活動はMediShield Lifeで補償されず、請求できません（2021年3月1日以降に受けた入院または治療に適用）：\n▪ 美容整形手術\n▪ 歯科治療（事故による場合を除く）\n▪ 不妊治療\n▪ 健康診断\n▪ 予防接種\n▪ 視力矯正手術',

  'chapters[8].sections[2].subsections[8].paragraphs[0]': 'MediShield Lifeスキームは非営利スキームです。徴収されたすべての保険料はMediShield Life基金に置かれ、保険契約者の利益のためおよびスキームの管理にのみ使用されます。',
  'chapters[8].sections[2].subsections[8].paragraphs[1]': '統合シールドプラン（IP）は、2つの部分で構成されるMediSave承認の入院保険プランです。第一はCPF Boardが管理するMediShield Life部分です。第二は民間保険者が提供・管理する追加の民間保険補償部分です。',
};

// Get remaining subsection 8 paragraphs (4.2 onwards) and subsections 9-14
const s = hi.chapters[8].sections[2];
let remaining = [];
if (s.subsections) {
  for (let subi = 8; subi < s.subsections.length; subi++) {
    s.subsections[subi].paragraphs.forEach((p, pi) => {
      if (!translations['chapters[8].sections[2].subsections['+subi+'].paragraphs['+pi+']']) {
        remaining.push({path: 'chapters[8].sections[2].subsections['+subi+'].paragraphs['+pi+']', num: p.num, text: p.text.substring(0, 200)});
      }
    });
  }
}
if (remaining.length > 0) {
  console.log('Remaining untranslated in section 2:');
  remaining.forEach(r => console.log(r.path, 'num='+r.num, r.text.substring(0, 80)));
}

Object.entries(translations).forEach(([path, textJP]) => {
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

let total = 0, done = 0;
hi.chapters[8].sections[2].paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
if (hi.chapters[8].sections[2].subsections) hi.chapters[8].sections[2].subsections.forEach(sub => {
  sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
});
console.log('Ch9 S2 progress: ' + done + '/' + total);
