const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const translations = {
  // Section 6: CareShield Life And Supplements (28 paras)
  'chapters[8].sections[6].paragraphs[0]': 'CareShield Lifeは2020年に導入され、政府が管理しています。シンガポールの人口が高齢化し、長期介護を必要とする人が増えるにつれ、財政支援の強化が求められています。',
  'chapters[8].sections[6].paragraphs[1]': 'CareShield Lifeは重度障害である限り全世界で給付を提供します。シンガポール人はすべての保険料の支払いを完了すれば生涯にわたって補償が継続します。',
  'chapters[8].sections[6].paragraphs[2]': '請求を行うには、被保険者はMOH認定の重度障害評価者により、6つの日常生活動作のうち少なくとも3つを遂行することができないと評価される必要があります。',
  'chapters[8].sections[6].paragraphs[3]': 'CareShield Lifeは政府により非営利ベースで管理されており、以下を提供します：\n(a) 時間の経過とともに増加する、より良い保護とより高い給付\n(b) 給付期間の上限なし\n(c) 普遍的で生涯にわたる補償',
  'chapters[8].sections[6].paragraphs[4]': '保険料の支払いが真に困難な者がCareShield Lifeの補償を失わないようにするため、政府は以下の保険料補助金と支援を提供しています。',
  'chapters[8].sections[6].paragraphs[5]': 'ElderShieldは2021年8月1日から閉鎖スキームとなりました。ただし、既存のElderShield300およびElderShield400の保険契約者は既存のスキームへの参加を継続できます。',
  'chapters[8].sections[6].paragraphs[6]': 'CareShield Lifeの保険契約者がより高い長期介護保険補償を希望する場合、Supplementsも購入できることに留意することが重要です。',
  'chapters[8].sections[6].paragraphs[7]': 'Supplementを購入するには、被保険者はCareShield LifeまたはElderShield保険証券を有している必要があります。Supplementsの保険料はMediSave（暦年あたり最大S$600）および/または現金で支払うことができます。',

  'chapters[8].sections[6].subsections[0].paragraphs[0]': '1980年以降に生まれたSCおよびSPRについて、CareShield Lifeは普遍的です。CareShield Lifeへの申請は不要です。30歳になった時点で自動的に補償されます。',
  'chapters[8].sections[6].subsections[0].paragraphs[1]': '1979年以前に生まれたSCおよびSPRについて、CareShield Lifeへの加入は任意です。2021年11月6日以降にCareShield Lifeへの加入を申請できます。',

  'chapters[8].sections[6].subsections[1].paragraphs[0]': 'CareShield Lifeは時間の経過とともに増加するより高い給付を特徴とし、給付期間に上限がなく、長期介護費用の不確実性に対するより良い保護を提供します。',
  'chapters[8].sections[6].subsections[1].paragraphs[1]': '適用される推定月額給付の詳細については、以下を参照してください：https://www.careshieldlife.gov.sg/careshield-life/benefits.html',

  'chapters[8].sections[6].subsections[2].paragraphs[0]': 'CareShield Lifeスキームは前払い保険料方式を採用しており、被保険CPF会員は若い間に健康リスクのコストよりも多くの保険料を支払い、高齢になったときに使用するための積立金を蓄積します。',
  'chapters[8].sections[6].subsections[2].paragraphs[1]': '1980年以降に生まれたSCについて、保険料は加入年齢から67歳まで支払います。保険料は時間の経過とともに増加し、給付の増加を支えます。',
  'chapters[8].sections[6].subsections[2].paragraphs[2]': '1979年以前に生まれたSC（任意コホート）は基本保険料を支払います。基本保険料は一般に加入年齢から67歳まで支払いますが、加入年齢が67歳以上の場合は10年間支払います。',
  'chapters[8].sections[6].subsections[2].paragraphs[3]': 'SCは以下のウェブサイトで保険料と補助金の見積もりを取得できます：https://www.careshieldlife.gov.sg/careshield-life/premiums-and-premiumsupport/',
  'chapters[8].sections[6].subsections[2].paragraphs[4]': 'CareShield Lifeの保険料はMediSaveから全額支払い可能です。保険料を手頃に保つための補助金と支援が利用可能であり、被保険者はMediSave残高を必要以上に使用する必要がありません。',

  'chapters[8].sections[6].subsections[3].paragraphs[0]': '2023年12月31日までにCareShield Lifeに加入したPioneerおよびMerdeka Generationの高齢者は、5年間にわたりS$1,500の追加参加インセンティブを受けます。',
  'chapters[8].sections[6].subsections[3].paragraphs[1]': '2024年1月1日から2024年12月31日の間にCareShield Lifeに加入・補償される者について、PioneerおよびMerdeka Generationの高齢者はインセンティブを受けます。',
  'chapters[8].sections[6].subsections[3].paragraphs[2]': 'PioneerおよびMerdeka Generationの高齢者は以下のように分類されます：\n(a) Pioneer Generationの高齢者とは、1949年12月31日以前に生まれ、1986年12月31日以前に市民権を取得したシンガポール市民を指します。\n(b) Merdeka Generationの高齢者とは、1950年1月1日から1959年12月31日の間に生まれたシンガポール市民を指します。',

  'chapters[8].sections[6].subsections[4].paragraphs[0]': 'CareShield Life給付の適格基準はElderShieldと類似しています。',
  'chapters[8].sections[6].subsections[5].paragraphs[0]': '定義済み',
  'chapters[8].sections[6].subsections[5].paragraphs[1]': 'CareShield Lifeは、被保険者が重度障害である限り月額少なくともS$600を支払います。被保険者がMOH認定評価者により6つのADLのうち少なくとも3つを遂行できないと評価された場合に給付を支払います。',
  'chapters[8].sections[6].subsections[6].paragraphs[0]': '請求日（すなわちAICが請求申請を受理した日）から90日間の据置期間がある場合があります。この期間後も被保険者がまだ重度障害状態であれば、給付の支払いが開始されます。',
  'chapters[8].sections[6].subsections[7].paragraphs[0]': '請求を行うには、被保険者はMOH認定の重度障害評価者と予約を取り、障害評価を受ける必要があります。評価者が評価書を完成させ、AICに提出します。',
  'chapters[8].sections[6].subsections[7].paragraphs[1]': '次に、被保険者はAICに請求申請を提出する必要があります。本人が自力で完了できない場合（例：精神能力を欠く場合）、直系家族または介護者が代理で行うことができます。',
  'chapters[8].sections[6].subsections[7].paragraphs[2]': '初回のCareShield Life障害評価の費用は、請求が最終的に支払い対象と評価されるかどうかにかかわらず免除されます。その後の評価の費用は、被保険者が重度障害と評価された場合に払い戻されます。',
  'chapters[8].sections[6].subsections[8].paragraphs[0]': 'CareShield Lifeスキームのその他の主要な特徴は以下のとおりです：\n(a) 年次ベースでの更新保証\n(b) 全世界補償\n(c) 保険料はMediSaveから全額支払い可能\n(d) 保険料の支払い期間中は保険料が段階的に増加',

  // Section 7: Other Healthcare Financing Schemes (37 paras)
  'chapters[8].sections[7].paragraphs[0]': '政府',
  'chapters[8].sections[7].paragraphs[1]': '上記で議論した政府補助金、MediSave、保険スキームに加えて、政府は以下のスキームを含むその他のスキームも導入しています。',

  'chapters[8].sections[7].subsections[0].paragraphs[0]': '政府は2014年にPioneer Generation Packageを導入し、国の建設における重要な貢献に対してPioneer Generationに敬意を表し感謝しました。',
  'chapters[8].sections[7].subsections[0].paragraphs[1]': '「Pioneer Generation」とは、以下の2つの基準を満たすシンガポール人を指します：\n(a) 1965年時点で16歳以上（1949年12月31日以前に生まれた）\n(b) 1986年12月31日以前に市民権を取得した',
  'chapters[8].sections[7].subsections[0].paragraphs[2]': 'パッケージは以下に記載する給付を提供し、Pioneer Generationが生涯にわたって享受します。',

  'chapters[8].sections[7].subsections[1].paragraphs[0]': '(a) ポリクリニックおよび専門外来診療所での補助金付きサービスおよび薬剤の残額からさらに50%割引\n(b) MediShield Life保険料の特別補助金\n(c) MediSaveトップアップ',
  'chapters[8].sections[7].subsections[2].paragraphs[0]': 'パイオニアはMediShield Life保険料について特別なPioneer Generation補助金を受けます。',
  'chapters[8].sections[7].subsections[3].paragraphs[0]': 'すべてのパイオニアは出生コホートに応じてS$250〜S$900の年間MediSaveトップアップを生涯にわたって受けます。これらのトップアップは保険料のさらなる支払いに使用できます。',
  'chapters[8].sections[7].subsections[4].paragraphs[0]': 'このスキームは以下のADLのうち最低3つについて恒久的に中等度以上の支援を必要とするパイオニア向けです：\n▪ 食事\n▪ 入浴\n▪ 着替え\n▪ 排泄\n▪ 歩行\n▪ 移動',
  'chapters[8].sections[7].subsections[4].paragraphs[1]': 'パイオニアの介護費用を支援するために月額S$100の生涯現金支援が提供されます。',
  'chapters[8].sections[7].subsections[5].paragraphs[0]': 'パイオニアは2023年12月31日までにCareShield Lifeに加入した場合、S$2,500のCareShield Life追加参加インセンティブを受けます。',

  'chapters[8].sections[7].subsections[6].paragraphs[0]': '政府は2019年にMerdeka Generation Package（MGP）を導入し、Merdeka Generation（MG）の貢献に敬意を表し感謝しました。',
  'chapters[8].sections[7].subsections[6].paragraphs[1]': '「Merdeka Generation」とは以下のシンガポール人を指します：\n(a) 1950年1月1日から1959年12月31日の間に生まれた\n(b) 1996年12月31日以前に市民権を取得した',
  'chapters[8].sections[7].subsections[6].paragraphs[2]': 'MGPは以下のシンガポール人にも拡大適用されます：\n(a) 1949年12月31日以前に生まれた\n(b) 1986年12月31日以前に市民権を取得した\n(c) Pioneer Generationの適格基準を満たさない',
  'chapters[8].sections[7].subsections[6].paragraphs[3]': 'パッケージは以下の給付で構成されています：',

  'chapters[8].sections[7].subsections[7].paragraphs[0]': 'MG高齢者はPAssion Silverカードに一回限りのS$100トップアップを受けます。アクティブエイジングプログラム、公共交通機関などの利用料金の支払いに使用できます。',
  'chapters[8].sections[7].subsections[8].paragraphs[0]': 'MG高齢者は2019年から2023年の5年間、年間S$200のMediSaveトップアップを受けます。これにより医療ニーズのための貯蓄が増えます。',
  'chapters[8].sections[7].subsections[9].paragraphs[0]': '(a) ポリクリニックおよび専門外来診療所での補助金付きサービスおよび薬剤の残額からさらに25%割引\n(b) CHAS GP診療所での特別補助金',
  'chapters[8].sections[7].subsections[10].paragraphs[0]': 'MG高齢者はMediShield Life保険料について追加のMerdeka Generation補助金を受けます。これは高齢者が受ける資格のあるその他の保険料補助金に加えてのものです。',
  'chapters[8].sections[7].subsections[11].paragraphs[0]': 'MG高齢者は2023年12月31日までにCareShield Lifeに加入した場合、S$2,500のCareShield Life追加参加インセンティブを受けます。',

  'chapters[8].sections[7].subsections[12].paragraphs[0]': '政府は2023年にMajulah Packageを導入し、1960年から1973年に生まれた「ヤングシニア」の退職後の十分性に対する支援を強化しました。',
  'chapters[8].sections[7].subsections[12].paragraphs[1]': 'パッケージはPioneerおよびMerdeka Generationを含む1973年以前に生まれたすべてのシンガポール市民に拡大適用されます。',
  'chapters[8].sections[7].subsections[12].paragraphs[2]': 'パッケージは3つの要素で構成されています：',
  'chapters[8].sections[7].subsections[13].paragraphs[0]': '不動産を1つ以下所有し、年間評価額がS$25,000以下の住居に居住する就労シニアは、最大で年間ボーナスを受け取ります。',
  'chapters[8].sections[7].subsections[14].paragraphs[0]': '退職後の貯蓄が2023年のBasic Retirement SumであるS$99,400を下回るシニアは、Special Accountに最大S$1,500の一回限りのボーナスを受け取ります。',
  'chapters[8].sections[7].subsections[15].paragraphs[0]': '1973年12月31日以前に生まれたすべてのシンガポール市民は、MediSave Accountに最大S$1,500の一回限りのボーナスを受け取ります。',

  'chapters[8].sections[7].subsections[16].paragraphs[0]': 'IDAPEは、2002年9月のElderShieldスキーム導入時に加入資格がなかったシンガポール人をケアするために政府が導入しました。',
  'chapters[8].sections[7].subsections[16].paragraphs[1]': 'シンガポール人は以下の場合にIDAPEの資格があります：\n(a) 6つの日常生活動作（ADL）のうち3つ以上を遂行できない\n(b) シンガポール市民である\n(c) 年齢または既存の障害のためにElderShieldに加入する資格がなかった',
  'chapters[8].sections[7].subsections[16].paragraphs[2]': 'スキームに基づく給付は、表9.4に示すとおり個人の1人あたり世帯所得に依存します。',
  'chapters[8].sections[7].subsections[16].paragraphs[3]': 'IDAPEは現在Agency for Integrated Care（AIC）が管理しています。給付がElderShieldスキームより低く72か月に限定されている点を除き、その他の特徴はElderShieldと同様です。',
  'chapters[8].sections[7].subsections[16].paragraphs[4]': 'おわかりのとおり、ElderShieldおよびIDAPEの給付は基本的で72か月に限定されています。ElderShield加入者でより高い給付やより長い補償を希望する者は、ElderShield Supplementsの購入を検討すべきです。',

  'chapters[8].sections[7].subsections[17].paragraphs[0]': 'ElderFundは2020年1月31日に導入された裁量的支援スキームです。重度障害を有する30歳以上の低所得シンガポール市民を対象としています。',
  'chapters[8].sections[7].subsections[18].paragraphs[0]': 'MediFundは政府が設立した基金です。補助金やMediSaveを使用した後も残りの医療費の支払いに困難を抱える困窮したシンガポール人のためのセーフティネットを提供します。',
  'chapters[8].sections[7].subsections[18].paragraphs[1]': 'MediFund SilverおよびMediFund Juniorは、困窮した高齢者および子供にそれぞれより対象化された支援を提供するためにMediFundから切り出されています。',
  'chapters[8].sections[7].subsections[18].paragraphs[2]': '基金として、元本から生じる利息収入がMediFund承認医療機関に配分され、困窮した患者の医療費を支援します。',
  'chapters[8].sections[7].subsections[18].paragraphs[3]': 'MediFund支援を申請するには、以下の条件を満たす必要があります：\n(a) シンガポール市民であること\n(b) 補助金対象の患者であること\n(c) MediFund承認医療機関で治療を受けた、または必要としていること',
  'chapters[8].sections[7].subsections[18].paragraphs[4]': '患者の申請は、医療ソーシャルワーカーおよびMediFund委員会により、患者とその家族の総合的な財政状況を考慮して包括的に審査されます。',
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
