const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const translations = {
  'chapters[8].sections[3].paragraphs[0]': 'MediSaveは、中央積立基金（CPF）の傘下にあるシンガポールの強制的な国民健康貯蓄スキームです。各CPF会員の月給の8%〜10.5%（年齢に応じて）が個人のMediSave口座（MA）に積み立てられます。これらの資金は、入院費の支払いおよび承認された医療保険の保険料の支払いに使用できます。',
  'chapters[8].sections[3].paragraphs[1]': 'MA内の金額には魅力的な年間利息収入が付き、高齢のCPF会員にはインフレから貯蓄を保護するための追加利息が付きます。1984年4月1日の導入以来、MediSaveは多くのシンガポール人が医療費のために貯蓄するのに役立ってきました。',
  'chapters[8].sections[3].paragraphs[2]': '2022年1月1日から、会員がMediSaveに追加できる最大額は、Basic Healthcare Sum（BHS）と現在のMediSave残高の差額となりました。',
  'chapters[8].sections[3].paragraphs[3]': 'さらに、2022年1月1日付で、会員は以下の年間税額控除を享受できます：\n(a) 会員が自身のSpecial/Retirement Accountおよび/またはMAに追加する場合、最大S$8,000（以前はS$7,000）\n(b) 家族のSpecial/Retirement Accountおよび/またはMAに追加する場合、追加で最大S$8,000（以前はS$7,000）の税額控除',
  'chapters[8].sections[3].paragraphs[4]': 'MediSave Grant for Newbornsにより、すべてのシンガポール人の赤ちゃんは出生時からCPF会員となります。この助成金は、新生児が出生から21歳までMediShield Lifeの保険料を支払うのに十分な額を確保します。',

  'chapters[8].sections[3].subsections[0].paragraphs[0]': 'MAへの拠出はBasic Healthcare Sum（BHS）と呼ばれる最大額の対象となります。BHSはCPF会員の老後における基本的な補助金付き医療ニーズに十分な額になるよう設計されています。',
  'chapters[8].sections[3].subsections[0].paragraphs[1]': 'BHSを超える金額は、CPF会員のSpecialまたはRetirement Accountに移され、月額の年金を増やします。CPF会員がFull Retirement Sumを既に満たしている場合、金額はOrdinary Accountに移され、現金として引き出すことができます。',
  'chapters[8].sections[3].subsections[0].paragraphs[2]': '平均寿命と医療費が上昇するにつれ、CPF会員の後続の世代は老後の医療費のためにより多くのMediSave貯蓄が必要になります。したがって、BHSはMediSave利用の増加に合わせて毎年1月に調整されます。',
  'chapters[8].sections[3].subsections[0].paragraphs[3]': '年次のBHS調整はその年に65歳以下のCPF会員にのみ適用されます。CPF会員が65歳に達すると、そのBHSはその時点のBHSで固定され、生涯にわたって変更されません。',
  'chapters[8].sections[3].subsections[0].paragraphs[4]': '現在のBHSについては、CPFウェブサイトの以下のリンクを参照してください：https://www.cpf.gov.sg/member/faq/healthcare-financing/basic-healthcaresum/what-is-the-basic-healthcare-sum',

  'chapters[8].sections[3].subsections[1].paragraphs[0]': 'MediSaveは以下の支払いに使用できます：\n(a) 公的および民間の両セクターを含む認定機関でのCPF会員の医療費\n(b) CPF会員の承認された扶養家族——配偶者、子、親、兄弟姉妹、祖父母——の医療費\n(c) MediShield Life、ElderShieldまたはCareShield Life、および統合シールドプランの保険料',
  'chapters[8].sections[3].subsections[1].paragraphs[1]': 'これらのMediSaveの用途をより詳しく見ていきましょう。',

  'chapters[8].sections[3].subsections[2].paragraphs[0]': 'MediSaveは、GP、ポリクリニック、専門外来診療所（SOC）での慢性疾患の治療および予防ケアを含む、選択された外来サービスの支払いに使用できます。\n(a) Chronic Disease Management Programme（CDMP）に基づく承認された慢性疾患の外来治療\n(b) 予防接種およびスクリーニング\n(c) 在宅でのケア',

  'chapters[8].sections[3].subsections[3].paragraphs[0]': 'MediSaveで支払うことができる入院および日帰り手術の費用にはいくつかの種類があります。',
  'chapters[8].sections[3].subsections[3].paragraphs[1]': '入院日額の病院限度額は、患者が少なくとも8時間入院した場合に適用され、日帰り手術の限度額は、患者がTable of Surgical Procedures（TOSP）に記載された手術を受け、8時間未満入院した場合に適用されます。',
  'chapters[8].sections[3].subsections[3].paragraphs[2]': 'これらの項目のいくつかを見てみましょう：\n(a) 入院エピソード：CPF会員は入院日額限度額の下で、最初の2日間は1日あたり最大S$550、それ以降は1日あたり最大S$400を使用できます（日額の病棟費用、日額の治療費、検査などを含む）。',

  'chapters[8].sections[3].subsections[4].paragraphs[0]': '(a) リハビリテーション\nMediSaveは以下の場合にリハビリテーションケアの費用に使用できます：\n▪ 承認されたコミュニティ病院の入院患者（1日あたりS$250、年間最大S$5,000）\n▪ 承認された療養病院の入院患者',

  'chapters[8].sections[3].subsections[5].paragraphs[0]': '医療費の支払いにMediSaveを使用するほか、CPF会員はMediSaveを使用して、自身または承認された扶養家族の健康保険の保険料を支払うことができます。MediShield LifeおよびElderShieldまたはCareShield Lifeの保険料はMediSaveから全額支払うことができます。',
  'chapters[8].sections[3].subsections[5].paragraphs[1]': '表9.1はMediSave口座の用途をまとめています。',

  'chapters[8].sections[3].subsections[6].paragraphs[0]': 'MediSaveの使用は引出限度額の対象となり、一般に公的医療機関での補助金付き治療に十分です。これにより将来の医療ニーズのための十分な貯蓄が引き続き確保されます。',

  'chapters[8].sections[3].subsections[7].paragraphs[0]': 'MediSaveによる支払いは、すべての公的医療機関および承認された民間医療機関で認められています。MediSaveに参加する医療機関の最新リストについては、CPF Boardのウェブサイトを参照してください。',

  'chapters[8].sections[3].subsections[8].paragraphs[0]': 'すべてのCPF会員は、承認された扶養家族の医療費の支払いにMediSaveを使用でき、1件の請求に対して複数の支払者がいる場合もあります（例：2人の子が母親の入院費を支払う）。',
  'chapters[8].sections[3].subsections[8].paragraphs[1]': '承認された扶養家族のMediSaveが入院費の支払いに十分でない場合、患者の家族は直系家族以外のメンバー（例：義理の子、義理の兄弟姉妹）がMediSaveで請求を精算できるよう、病院に申請することができます。',

  'chapters[8].sections[3].subsections[9].paragraphs[0]': '患者が死亡直前に入院し、医療費の支払いにMediSaveの使用を承認していた場合、既存のMediSave引出限度額の対象とならず、MediSave残高の全額が最後の入院費の支払いに使用されます。',
  'chapters[8].sections[3].subsections[9].paragraphs[1]': '患者が死亡前にMediSaveの使用を承認していなかった場合、直系家族（配偶者、親、または21歳以上の子）、または精神能力を欠いていない受任者もしくは代理人が、最後の入院費についてそうすることができます。',
  'chapters[8].sections[3].subsections[9].paragraphs[2]': '最後の医療費の支払い後の残りのMediSave残高は、死亡前に指名が行われていた場合、患者のCPF口座の指名受取人に分配されます。指名が行われていなかった場合、残高は無遺言相続法に基づいて分配されます。',
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

let total = 0, done = 0;
hi.chapters[8].sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('Ch9: ' + done + '/' + total);
