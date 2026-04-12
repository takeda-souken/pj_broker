const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

hi.chapters[7].titleJP = 'マネージドヘルスケア';

const translations = {
  'chapters[7].sections[0].paragraphs[0]': 'マネージドヘルスケア（MHC）スキームは、増加する医療費への対応として市場で発展してきました。MHCプランは通常、保険者により保険付きプランとして管理または運営されます。国内では、団体MHC保険のみが利用可能です。',
  'chapters[7].sections[1].paragraphs[0]': 'MHCとは、人々が適切な医療ケアを受けられることを保証しつつ、医療費を抑制するための全体的な戦略を指します。個人が一般開業医（GP）、専門医を受診したり、入院治療を受けたりした場合に、医療費の大部分を支払います。',
  'chapters[7].sections[2].paragraphs[0]': 'MHC提供者は、会員のケアへのアクセス、コスト、品質を管理するためにヘルスケアネットワークを構築します。医師、病院、診療所、薬局、検査機関、X線センターなどの他のヘルスケア提供者と交渉し契約します。',
  'chapters[7].sections[2].paragraphs[1]': 'MHCは、以下の3つの要素を注意深く管理することにより、ヘルスケア支出を抑制・管理します：\n(a) アクセシビリティ\n(b) コスト\n(c) ケアの品質',
  'chapters[7].sections[2].subsections[0].paragraphs[0]': 'MHCプランでは、会員は厳選されたヘルスケア提供者のネットワークに紹介されます。一部のMHCプランでは、会員はネットワーク内の特定の提供者からすべてのヘルスケアサービスを受けることが求められる場合があります。この医師がプライマリケア医師（PCP）となります。',
  'chapters[7].sections[2].subsections[0].paragraphs[1]': 'MHCは深刻な健康問題を予防するためにプライマリケアと予防ケアを重視しているため、PCPは多くのMHCプランの根幹です。PCPは幅広い疾患を診断・治療する能力があることから重視されています。',
  'chapters[7].sections[2].subsections[0].paragraphs[2]': 'PCPは通常、会員の「かかりつけ医」として機能し、MHCへの最初の窓口となる一般開業医です。追加のケアが必要な場合、PCPはネットワーク内の専門医に会員を紹介します。',
  'chapters[7].sections[2].subsections[1].paragraphs[0]': 'マネージドヘルスケア組織（MHCO）は、増加する医療費を管理するためにさまざまな方法を使用しています。その1つは、交渉による提供者報酬です。',
  'chapters[7].sections[2].subsections[1].paragraphs[1]': '提供者ネットワーク内の医師または病院の数を制限することにより、MHCOは医師または病院の報酬を交渉し、会員への医療サービス提供のコストを削減できます。',
  'chapters[7].sections[2].subsections[1].paragraphs[2]': 'MHCOが使用する4つの一般的な支払い方法は以下のとおりです：\n(a) 人頭払い（キャピテーション）——MHCOが提供者に各会員の医療ケアについて固定額を前払い\n(b) 割引出来高払い——提供者が通常の報酬から割引価格でサービスを提供\n(c) 給与制——提供者にMHCOが直接給与を支払い\n(d) 報酬表——各サービスの報酬額を事前に定めた表に基づいて支払い',
  'chapters[7].sections[2].subsections[1].paragraphs[3]': 'MHCOが医療費を管理するために使用するその他の方法には、利用管理とリスク共有契約があります。',
  'chapters[7].sections[2].subsections[2].paragraphs[0]': 'コスト抑制の取り組みによりケアの品質が損なわれないよう、MHCOは必要なスキル、訓練、ライセンスを有するヘルスケア提供者とのみ契約していることを会員に保証できます。これらの提供者はMHCOが定めた品質基準に従った医療ケアを提供しなければなりません。',
  'chapters[7].sections[3].paragraphs[0]': '3つの一般的な種類は以下のとおりです：\n(a) Health Maintenance Organisation（HMO）\n(b) Preferred Provider Organisation（PPO）\n(c) Point-of-Service（POS）プラン',
  'chapters[7].sections[3].paragraphs[1]': 'それぞれを順番に見ていきましょう。',
  'chapters[7].sections[3].subsections[0].paragraphs[0]': 'HMOは、前払い報酬で患者集団を治療するヘルスケア提供者のネットワークを特徴としています。',
  'chapters[7].sections[3].subsections[0].paragraphs[1]': 'HMOに加入した会員は、ほとんどまたはすべてのヘルスケアをネットワーク提供者から受ける必要があります。HMOでは、会員が医療ケアの調整と管理を担当するプライマリケア医師（PCP）を選択することが求められます。',
  'chapters[7].sections[3].subsections[0].paragraphs[2]': '会員がネットワーク内の専門医によるケアや、検査やX線などの診断サービスを必要とする場合、PCPが紹介状を出す必要があります。紹介状がない場合やネットワーク外の医師を選択した場合、会員は自己負担が必要か、補償されない場合があります。',
  'chapters[7].sections[3].subsections[0].paragraphs[3]': 'HMOは最も制限的なタイプの健康プランです。会員がヘルスケア提供者を選択する際の選択肢が最も少ないためです。',
  'chapters[7].sections[3].subsections[1].paragraphs[0]': 'HMOプランでは、常にまずPCPを受診し、PCPがネットワーク内の専門医に紹介します。PPOプランでは、紹介なしで専門医を受診できます。',
  'chapters[7].sections[3].subsections[1].paragraphs[1]': 'Preferred Provider Organisation（PPO）は、会員が選択できる優先提供者のネットワークと交渉契約を結んでいます。会員はPCPを選択する必要がなく、ネットワーク内の他の提供者を受診するための紹介状も必要ありません。',
  'chapters[7].sections[3].subsections[1].paragraphs[2]': 'PPOはヘルスケア提供者の選択においてHMOよりも制限が少ないです。ただし、会員からのより多くの「自己負担」支払いを必要とする傾向があります。',
  'chapters[7].sections[3].subsections[2].paragraphs[0]': 'POSプランはHMOとPPOの組み合わせです。',
  'chapters[7].sections[3].subsections[2].paragraphs[1]': 'POSプランはHMOプランと類似しており、保険契約者がネットワーク内のPCPを選択し、専門医のサービスをプランが補償するためにはその医師からの紹介状が必要です。',
  'chapters[7].sections[3].subsections[2].paragraphs[2]': 'POSプランはPPOプランとも類似しており、ネットワーク外のサービスも補償しますが、保険契約者はネットワーク内の提供者を利用する場合よりもそれらのサービスに対してより多く支払う必要があります。',
  'chapters[7].sections[3].subsections[2].paragraphs[3]': 'このプランがPoint-of-Serviceと呼ばれるのは、会員がヘルスケアサービスを必要とするたびに（サービスの時点または「ポイント」）、ネットワーク内にとどまりPCPにケアを管理してもらうか、自己負担額の増加を伴いネットワーク外に出るかを決定できるためです。',
  'chapters[7].sections[4].paragraphs[0]': '前述のとおり、MHCOは提供者へのアクセス、ヘルスケア提供のコスト、ケアの品質を管理することにより、ヘルスケアのコストの抑制に寄与します。',
  'chapters[7].sections[4].paragraphs[1]': 'HMOはコスト管理が最も高いですが、会員の提供者選択の自由度は最も低いことに留意してください。節約されたコストは、プランへの参加に対してより低い価格を請求される購入者に還元されます。',
  'chapters[7].sections[4].paragraphs[2]': '現在のところ、高い給付水準、提供者への無制限のアクセス、低コストのすべてを同時に提供できるMHCプランはありません。いずれのプランも達成できるのは、3つの特徴のうち2つが最善です。',
  'chapters[7].sections[5].paragraphs[0]': 'MHC保険の例を見てみましょう。',
  'chapters[7].sections[5].subsections[0].paragraphs[0]': '固定年間保険料で、MHCプランを提供する保険者は、保険契約者に以下のような補償の一部またはすべてを提供する場合があります：\n(a) プライマリケア——シンガポール全土の診療所の一般医師の広範なネットワークにより提供。コンサルテーション、薬剤、簡単な検査を含む\n(b) 専門医ケア——提携専門医への紹介\n(c) 入院ケア——団体入院・手術保険に基づく入院補償',
  'chapters[7].sections[5].subsections[0].paragraphs[1]': 'MHCOが提供する給付は異なる場合があり、外来ケアのみを提供するものもあれば、完全な給付を提供するものもあります。これらの給付は扶養家族にも拡張できます。',
  'chapters[7].sections[5].subsections[0].paragraphs[2]': '他の健康保険証券と同様に、MHCプランには最低加入年齢と最大加入年齢がありますが、通常、保険者によって異なります。',
  'chapters[7].sections[5].subsections[1].paragraphs[0]': '医療費保険と同様に、MHC保険には共同保険、免責金額、按分係数などの自己負担が適用される場合があります。',
  'chapters[7].sections[5].subsections[2].paragraphs[0]': 'MHC保険証券の一般的な免責事項には以下が含まれます：\n(a) 既存の病態\n(b) 先天性異常、遺伝性疾患\n(c) 精神疾患および人格障害\n(d) 不妊症、不妊補助、補助的受精治療\n(e) 美容整形手術\n(f) 歯科治療（事故による場合を除く）',
  'chapters[7].sections[5].subsections[2].paragraphs[1]': '免責事項は保険者によって異なることにご留意ください。したがって、保険者の免責事項を確認し、顧客に強調する必要があります。',
  'chapters[7].sections[5].subsections[3].paragraphs[0]': 'MHCの引受要件については、本スタディテキストの後の章で説明します。医療費保険の補償の引受要件と類似しています。',
  'chapters[7].sections[5].subsections[4].paragraphs[0]': 'MHC請求の手続きは、主にMHCOと提供者の間で行われます。ネットワーク内のケアを利用する会員は、保険者に請求を提出する必要はありません。ネットワーク外の提供者を利用する会員のみがMHCOに請求を提出する必要があります。',
  'chapters[7].sections[6].paragraphs[0]': 'MHCの仕組みはシンガポールでは一般的ではありません。シンガポールの雇用主は、MHCOまたは保険会社に委託して従業員にキャッシュレス医療サービスを提供しています。このようなサービスには、キャッシュレスの外来一般開業医（GP）および専門医のコンサルテーションが含まれます。',
  'chapters[7].sections[6].paragraphs[1]': '従業員はキャッシュレスサービスを享受するために、選択されたパネルを受診する必要があります。ケアのコストと品質はMHCOまたは保険者が管理します。従業員がパネル外の診療所を受診した場合、費用は補償されないか、共同負担/免責金額の条件に従い部分的に補償されます。',
  'chapters[7].sections[6].paragraphs[2]': '保険付きスキームの場合、保険者は病院への保証状の提供によるキャッシュレスの入院補償（団体入院・手術保険）も追加で提供します。',
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

const ch = hi.chapters[7];
let total = 0, done = 0;
ch.sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('HI Ch8: ' + done + '/' + total + ' translated');
