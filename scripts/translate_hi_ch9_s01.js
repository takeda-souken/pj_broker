const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

hi.chapters[8].titleJP = 'パートI ヘルスケアファイナンシング';

const translations = {
  // Section 0
  'chapters[8].sections[0].paragraphs[0]': 'この章では、シンガポール政府がシンガポール人の医療費負担を支援するために導入したさまざまな補助金およびヘルスケアファイナンシングスキームをレビューします。',
  'chapters[8].sections[0].paragraphs[1]': '混合ファイナンシングシステム（以下の図9.1参照）を通じて、シンガポールは国民に良好な医療成果を確保しています。例えば、出生時の平均寿命は2006年の80.3歳から2022年の83.93歳に増加し、乳児死亡率は出生千人あたり2.6から1.8に改善しました。',

  // Section 1
  'chapters[8].sections[1].paragraphs[0]': '政府は公的医療機関（例：公立病院、国立専門センター、ポリクリニック）、ならびに地域および在宅ケアのサービスを提供する一部の民間診療所およびボランティア福祉団体（VWO）に資金を提供しています。これにより、シンガポール人は手頃な価格で質の高い医療ケアを受けることができます。',
  'chapters[8].sections[1].paragraphs[1]': '多くの医療環境では、ミーンズテスト（資力調査）を使用して補助金を対象化し、困窮している患者がより多くの支援を受けられるようにしています。低所得の患者は高所得の患者よりも多くの補助金を受けます。このアプローチは、限られた資源をより必要としている人に充て、政府の補助金が効率的に使用されるようにしています。',
  'chapters[8].sections[1].subsections[1].paragraphs[0]': '入院が必要な場合、患者はさまざまな病棟クラスを選択できます。これらの病棟クラスは物理的な設備の種類と快適さのレベルのみが異なり、個室（A級病棟）から多床室（B/C級病棟）まであります。どの病棟クラスを選択しても、医療ケアの水準は同じです。',
  'chapters[8].sections[1].subsections[1].paragraphs[1]': '政府が提供する補助金は病棟クラスによって異なります。基本的な設備の病棟（例：C級病棟）は多額の補助金が出ます。より良い設備を希望する者はより上位の病棟クラスを選択できますが、補助金は少なくなります。B2級およびC級病棟の入院（公立病院の入院の81%）では、シンガポール市民は最大80%の補助金を受けます。',
  'chapters[8].sections[1].subsections[1].paragraphs[2]': '2009年1月、B2級およびC級病棟への手厚い補助金を低所得者層により適切に対象化するため、公立病院にミーンズテストが導入されました。補助金の基準は、患者の1人あたり世帯所得（PCHI）または所得のない世帯の場合は住居の年間評価額に依存します。',
  'chapters[8].sections[1].subsections[1].paragraphs[3]': '入院後に専門外来診療所（SOC）でのフォローアップが必要な患者は、入院時の病棟クラスの選択にかかわらず、補助金付きまたは民間のSOCのいずれかで治療を継続することを選択できます。',
  'chapters[8].sections[1].subsections[2].paragraphs[0]': '一般に、より高い補助金の適格性は1人あたり世帯所得（PCHI）、または所得のない世帯の場合は住居の年間評価額に基づきます。',
  'chapters[8].sections[1].subsections[2].paragraphs[1]': 'SOCサービスについて、適格な患者はPCHIおよび住居の年間評価額（該当する場合）に応じて30%から70%の補助金を受けることができます。低〜中所得のSOC患者はより高い補助金を受けることができます。永住権保持者はシンガポール市民の補助金より少ない補助金を引き続き受けます。',
  'chapters[8].sections[1].subsections[2].paragraphs[2]': 'SOCでの標準的な薬剤について、補助金対象の患者はPCHIに応じて50%または75%のミーンズテスト付き補助金を受けることができます。',
  'chapters[8].sections[1].subsections[3].paragraphs[0]': '日帰り手術やA&E（救急）サービスなどのその他のサービスは、それぞれ最大80%および50%の補助金が出ます。日帰り手術の補助金はシンガポール市民で50%〜80%、永住権保持者で25%〜50%です。A&Eサービスを利用する患者は定額が課されます。',
  'chapters[8].sections[1].subsections[4].paragraphs[0]': '政府ポリクリニックで提供されるサービスは約50%の補助金が出ます（患者が子供または高齢者の場合は75%）。ポリクリニックの低〜中所得の患者はすべての標準的な薬剤について75%の補助金を享受します。',
  'chapters[8].sections[1].subsections[5].paragraphs[0]': 'Community Health Assist Scheme（CHAS）により、適格なシンガポール市民は参加する一般開業医（GP）および歯科診療所で医療および/または歯科ケアの補助金を受けることができます。2019年11月以降、このスキームは世帯所得にかかわらずすべてのシンガポール市民に拡大されました。',
  'chapters[8].sections[1].subsections[5].paragraphs[1]': 'CHASカードの色は、カード保持者が受ける資格のある補助金の段階を示します。すなわち、CHAS Blue、Orange、またはGreenの段階です。すべてのPioneer Generation（PG）およびMerdeka Generation（MG）の高齢者も、CHAS診療所で特別な補助金を受けます。',
  'chapters[8].sections[1].subsections[5].paragraphs[2]': 'カード保持者が支払う金額は、診療所の請求額からCHAS補助金を差し引いた額に基づきます。料金は各患者の状態および診療所の請求額によって異なります。',
  'chapters[8].sections[1].subsections[5].paragraphs[3]': 'CHAS診療所でのケアに対する補助金に加えて、CHAS、MG、PGのカード保持者は、適格な場合、公的専門外来診療所（SOC）への補助金付き紹介を享受します。',
  'chapters[8].sections[1].subsections[5].paragraphs[4]': '慢性疾患を有する患者について、CHAS補助金はChronic Disease Management Programme（CDMP）を補完しており、CHASの対象となる同一の慢性疾患の外来治療にMediSaveを使用できます。',
  'chapters[8].sections[1].subsections[5].paragraphs[5]': 'CHAS GPクリニックで慢性疾患の治療を受ける適格な患者は、コミュニティヘルスセンター（CHC）やプライマリケアネットワーク（PCN）での糖尿病足スクリーニング（DFS）、糖尿病網膜撮影（DRP）、看護師カウンセリングなどのヘルスケアサービスについても補助金付き料金を受けることができます。',
  'chapters[8].sections[1].subsections[5].paragraphs[6]': '透析、精神科リハビリテーション、介護施設ケアなどのヘルスケアサービスを提供する長期介護事業者にも補助金が提供されています。MOHは、必要な中間的長期介護サービスの種類に応じて最大80%の補助金を提供しています。',
};

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
console.log('Ch9 S0-1: 20 paragraphs translated');

// Check overall progress
let total = 0, done = 0;
hi.chapters[8].sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('Ch9 progress: ' + done + '/' + total);
