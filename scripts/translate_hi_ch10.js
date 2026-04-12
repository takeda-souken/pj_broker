const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));
hi.chapters[9].titleJP = '共通の保険証券条項';
const t = {
  'chapters[9].sections[0].paragraphs[0]': '健康保険証券は、保険者と保険契約者（個人、雇用主、または組織）との間の契約の書面による証拠です。',
  'chapters[9].sections[0].paragraphs[1]': '後日の紛争を避けるため、さまざまな保険証券条項を十分に理解することが非常に重要です。',
  'chapters[9].sections[1].paragraphs[0]': '健康保険の保険契約にはさまざまなセクションがあります。',
  'chapters[9].sections[1].paragraphs[1]': '保険証券のセクションの順序またはヘッダーは、異なる保険者間で異なる場合があります。',
  'chapters[9].sections[2].paragraphs[0]': 'スケジュールには、保険契約者、被保険者、ならびに保険補償、補償限度額の詳細が記載されています。',
  'chapters[9].sections[2].paragraphs[1]': 'スケジュールには以下の情報が含まれます：\n(a) 保険証券番号\n(b) 補償の有効日\n(c) 補償の満了日\n(d) 保険料\n(e) 被保険者の詳細',
  'chapters[9].sections[2].paragraphs[2]': '保険証券スケジュールは保険契約の具体的な詳細を記載しています（この章の付録10Aのサンプルを参照）。',
  'chapters[9].sections[3].subsections[0].paragraphs[0]': '付保条項は、保険者が支払い責任を負うリスクと補償の範囲を詳述します。',
  'chapters[9].sections[3].subsections[1].paragraphs[0]': '両当事者の共通理解を確保するため、保険証券には保険証券で使用される重要な用語の定義が含まれています。',
  'chapters[9].sections[4].paragraphs[0]': '一般条件セクションは、保険契約者と保険者の双方の権利を概説しています。',
  'chapters[9].sections[4].subsections[0].paragraphs[0]': 'この条項は、保険契約が申込書、宣言書、保険者に提供された質問票で構成されることを述べています。',
  'chapters[9].sections[4].subsections[0].paragraphs[1]': 'この条項はまた、保険者が保険証券の開始日に保険証券に記載された給付の提供を開始することを述べています。',
  'chapters[9].sections[4].subsections[1].paragraphs[0]': '被保険者が保険証券に基づいて補償され始める日です。',
  'chapters[9].sections[4].subsections[1].paragraphs[1]': '補償の有効日は、特別な手配がない限り、保険証券に基づくすべての種類の補償に適用されます。',
  'chapters[9].sections[4].subsections[1].paragraphs[2]': '例えば、事故と疾病の補償の有効日は異なる場合があります。事故の場合、補償は保険証券の開始日から開始されますが、疾病の場合は待機期間が適用されることがあります。',
  'chapters[9].sections[4].subsections[2].paragraphs[0]': '保険料は補償開始前に支払わなければなりません。2年目以降は、保険契約者が保険料を支払うための猶予期間が設けられています。',
  'chapters[9].sections[4].subsections[3].paragraphs[0]': 'フリールック期間とは、保険証券が交付された後、保険契約者が保険証券を確認し、不満がある場合はキャンセルして保険料の返還を受けることができる期間です。',
  'chapters[9].sections[4].subsections[4].paragraphs[0]': 'この条項は通常、団体保険および障害所得保険に見られます。',
  'chapters[9].sections[4].subsections[5].paragraphs[0]': 'この条項は、健康保険の補償が終了する状況を列挙しています：\n(a) 被保険者が死亡した場合\n(b) 保険証券が失効した場合\n(c) 被保険者が最大補償年齢に達した場合',
  'chapters[9].sections[4].subsections[5].paragraphs[1]': 'また、保険証券の終了は、終了前に発生した請求の支払いに影響しないことを述べています。',
  'chapters[9].sections[4].subsections[6].paragraphs[0]': '保険者は、緊急の海外治療と計画された海外治療の一方または両方を補償する場合があります。',
  'chapters[9].sections[4].subsections[6].paragraphs[1]': '入院期間中に発生したすべての補償対象費用は、保険証券の免責事項、制限、および条件の対象となります。',
  'chapters[9].sections[4].subsections[6].paragraphs[2]': 'この条項の目的は、健康保険の補償を保険証券が発行された国に制限することです。緊急の場合を除きます。',
  'chapters[9].sections[4].subsections[7].paragraphs[0]': '更新条項は、保険者が更新を拒否する、または保険証券をキャンセルする権利を有する状況を説明します。',
  'chapters[9].sections[4].subsections[7].paragraphs[1]': '健康保険証券は以下のいずれかのベースで発行できます：\n(a) キャンセル可能\n(b) 任意更新\n(c) 条件付き更新\n(d) 更新保証',
  'chapters[9].sections[4].subsections[8].paragraphs[0]': 'キャンセル可能な保険証券では、保険者はいつでも保険証券を終了する権利を有します。',
  'chapters[9].sections[4].subsections[9].paragraphs[0]': '健康保険証券には、保険者が保険証券の更新を拒否するための特定の条件が含まれる場合もあります。',
  'chapters[9].sections[4].subsections[10].paragraphs[0]': '更新保証の保険証券では、保険者はいつでも保険証券をキャンセルする権利、および保険料支払期日に更新を拒否する権利を放棄します。',
  'chapters[9].sections[4].subsections[10].paragraphs[1]': '保険料の不払いが、保険者が更新保証保険証券をキャンセルまたは更新拒否できる唯一の理由です。',
  'chapters[9].sections[4].subsections[10].paragraphs[2]': 'ただし、クラスベースで保険料を引き上げることができます。一般的な分類の例としては職業クラスがあります。',
  'chapters[9].sections[4].subsections[10].paragraphs[3]': '更新保証保険証券では、保険者は保険証券が更新期日を迎えた際に更新しなければなりません。ただし、新しい経験データに基づいて保険料を調整できます。',
  'chapters[9].sections[4].subsections[10].paragraphs[4]': '更新保証の特徴はしばしば制限されています。一部の保険証券では、被保険者が所定の年齢に達すると、保険者はキャンセルおよび更新拒否の権利を回復します。',
  'chapters[9].sections[4].subsections[10].paragraphs[5]': '更新を拒否する権利を放棄することにより、保険者は更新保証保険証券に対してより高い保険料を課します。',
  'chapters[9].sections[4].subsections[11].paragraphs[0]': '状況によっては、個人が固定された限定期間のみ健康保険を必要とする場合があります。',
  'chapters[9].sections[4].subsections[11].paragraphs[1]': '旅行保険は定期保険の典型的な例です。基本的に旅行の開始から終了までを補償します。',
  'chapters[9].sections[4].subsections[12].paragraphs[0]': 'この条項は、被保険者が年齢または性別を誤って申告した場合、保険者は正しい情報に基づいて給付を調整することを規定しています。',
  'chapters[9].sections[4].subsections[13].paragraphs[0]': '個人健康保険証券には、保険料支払期日から所定の日数以内に更新保険料を支払うことができる猶予期間条項が含まれています。',
  'chapters[9].sections[4].subsections[14].paragraphs[0]': '個人健康保険証券には、失効した保険証券を所定の条件の下で復活させるための復活条項が含まれています。',
  'chapters[9].sections[4].subsections[15].paragraphs[0]': '生命保険証券に付帯された健康保険ライダーは不可争条項の対象となります。不可争条項は、保険証券発行後2年経過すると、保険者が虚偽申告を理由に契約を取り消すことができなくなることを規定しています。',
  'chapters[9].sections[4].subsections[16].paragraphs[0]': '多くの個人障害所得保険証券には、被保険者の職業変更時に保険者が給付および/または保険料を調整することを認める職業変更条項が含まれています。',
  'chapters[9].sections[4].subsections[17].paragraphs[0]': '多くの個人健康保険証券には給付調整条項が含まれており、他の保険証券を含めた総給付が実際に発生した医療費を超えないようにしています。',
  'chapters[9].sections[4].subsections[17].paragraphs[1]': '給付調整条項は、保険者が申込時に他の補償について通知を受けていたかどうかにかかわらず適用されます。',
  'chapters[9].sections[4].subsections[18].paragraphs[0]': '保険契約者は、保険者に事前の書面による通知を行うか、保険証券を失効させることにより、保険証券をキャンセルする選択肢があります。',
  'chapters[9].sections[4].subsections[18].paragraphs[1]': '保険者は、保険証券がキャンセルまたは終了した後の保険年度中に発生した費用に関するいかなる給付についても責任を負いません。',
  'chapters[9].sections[4].subsections[19].paragraphs[0]': '医療費保険証券には、被保険者が補償プランをアップグレードまたはダウングレードすることを認める条項があります。',
  'chapters[9].sections[4].subsections[19].paragraphs[1]': 'プラン変更の直前に補償されていた病態は引き続き補償され、新しいプランの給付レベルに移行します。',
  'chapters[9].sections[4].subsections[20].paragraphs[0]': '保険金の支払いが償還ベースの場合、保険証券は給付の支払い通貨を規定します。',
  'chapters[9].sections[4].subsections[21].paragraphs[0]': 'この条項はMediShield Lifeおよび統合シールドプランに見られます。被保険者が他の補償から支払いを受ける権利がある場合、保険者はこの保険証券に基づく給付を減額します。',
  'chapters[9].sections[4].subsections[21].paragraphs[1]': '保険証券に基づく給付が先に支払われた場合、保険者は他のスキームから受けた支払い額を回収する権利を有します。',
  'chapters[9].sections[4].subsections[22].paragraphs[0]': 'Insurance Act 1966の第3C部に基づく受益者指名（NOB）の導入により、保険契約者は死亡給付を含む保険証券について受益者を指名できるようになりました。',
  'chapters[9].sections[4].subsections[22].paragraphs[1]': '組み込みの死亡給付を有するCI保険証券はNOBの枠組みの対象となります。',
  'chapters[9].sections[4].subsections[23].paragraphs[0]': 'シンガポールの消費者は健全な金融システムの恩恵を享受しています。保険者はMASの監督を受けています。PPFスキームは保険契約者への追加保護を提供します。',
  'chapters[9].sections[4].subsections[23].paragraphs[1]': 'PPFスキームの範囲には、個人および団体の傷害・健康保険証券が含まれます。',
  'chapters[9].sections[4].subsections[23].paragraphs[2]': 'PPFスキームはSingapore Deposit Insurance Corporation（SDIC）が管理しています。補償は自動的です。',
  'chapters[9].sections[5].paragraphs[0]': '給付条項セクションは、保険証券が補償する内容を詳述します。',
  'chapters[9].sections[5].paragraphs[1]': '給付条項は細心の注意を払って作成されます。明確かつ正確でなければなりません。',
  'chapters[9].sections[5].paragraphs[2]': '医療費保険証券のいくつかの給付条項を見てみましょう。',
  'chapters[9].sections[5].subsections[0].paragraphs[0]': '当会社は、保険証券に規定された限度額を条件として、被保険者が受けた必要な医療処置について合理的な費用の償還のみを支払います。',
  'chapters[9].sections[6].paragraphs[0]': '免責事項とは、保険者が支払いを行わない状況を指します。',
  'chapters[9].sections[6].paragraphs[1]': '合理的な費用を超える費用に対しては給付は支払われません。待機期間内に罹患した疾病も免責となります。',
  'chapters[9].sections[6].paragraphs[2]': '新しい技術が登場するにつれ、免責事項のリストは随時変更されます。',
  'chapters[9].sections[7].paragraphs[0]': 'このセクションでは、健康保険証券に一般的に見られる重要な請求条件を強調します。',
  'chapters[9].sections[7].subsections[0].paragraphs[0]': '健康保険証券には、損害の適時の通知を提供する被保険者の義務を定義する条項が含まれています。',
  'chapters[9].sections[7].subsections[1].paragraphs[0]': '保険契約者は（自己の費用で）すべての証明書、書式、原本請求書、領収書、情報、証拠を提出しなければなりません。',
  'chapters[9].sections[7].subsections[2].paragraphs[0]': 'この条項は、保険者が任命した医師による被保険者の診察を受けさせる権利を保険者に与えます。',
  'chapters[9].sections[7].subsections[3].paragraphs[0]': '個人健康保険証券には通常、紛争解決条項が含まれます。紛争はまずFIDReCに付託されます。',
  'chapters[9].sections[7].subsections[3].paragraphs[1]': '紛争をFIDReCに付託できない場合、仲裁により決定されます。',
  'chapters[9].sections[7].subsections[3].paragraphs[2]': '調停と仲裁が失敗した場合、保険契約者は法的措置を求めることができます。',
  'chapters[9].sections[7].subsections[3].paragraphs[3]': 'シンガポールの保険者が発行した保険証券はシンガポール共和国の法律に準拠します。',
  'chapters[9].sections[8].paragraphs[0]': '裏書とは、付帯された保険証券を修正する別個の文書です。',
  'chapters[9].sections[8].paragraphs[1]': '裏書は、保険証券の条件を修正または追加するために行われます。',
  'chapters[9].sections[8].paragraphs[2]': '裏書はまた、オプション給付を提供する補足合意としても機能できます。',
  'chapters[9].sections[8].paragraphs[3]': '免責事項に関する裏書は、特定の既存病態や活動を除外することにより、補償範囲を制限します。',
  'chapters[9].sections[9].paragraphs[0]': '保険担当者として、見込み客が標準的な保険証券条項を理解し、情報に基づいた判断ができるよう支援すべきです。',
};
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
let total = 0, done = 0;
hi.chapters[9].sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('Ch10: ' + done + '/' + total);
