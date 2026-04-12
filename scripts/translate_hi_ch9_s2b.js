const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const translations = {
  'chapters[8].sections[2].subsections[8].paragraphs[2]': '以下のプランがIPです（2023年4月1日時点）：AIA HealthShield Gold Max、Singlife Shield Plan、Great Eastern Supreme Health、Income Enhanced IncomeShield、Prudential PRUShield、Raffles Shield。',
  'chapters[8].sections[2].subsections[8].paragraphs[3]': '以下の図は、統合シールドプラン（IP）の構成要素を示しています。',

  'chapters[8].sections[2].subsections[9].paragraphs[0]': 'IPの統合構造の下では、シンガポール市民またはPRがIPに加入している場合、MediShield Life部分と追加民間保険部分の両方を1つのプランで享受できます。IPに基づく請求は、まずMediShield Life部分で処理され、次に追加民間保険部分で処理されます。',

  'chapters[8].sections[2].subsections[10].paragraphs[0]': '前述のとおり、IPに加入している者は既にMediShield Lifeの補償を享受しています。IPの追加民間保険部分は、MediShield Lifeを超える補償を提供します。',

  'chapters[8].sections[2].subsections[11].paragraphs[0]': '民間保険者に支払われるIPの保険料も2つの部分で構成されています。すなわち、MediShield Life部分の保険料と追加民間保険部分の保険料です。',
  'chapters[8].sections[2].subsections[11].paragraphs[1]': '追加民間保険部分の保険料水準を決定する際、民間保険者は提供する補償水準や給付を考慮に入れます。',
  'chapters[8].sections[2].subsections[11].paragraphs[2]': 'MediShield LifeスキームとIPの主な違いを以下に説明します。',

  'chapters[8].sections[2].subsections[12].paragraphs[0]': '政府はIP保険者と協力して、B1級病棟までの入院を補償するシンプルで手頃な「フリルなし」プランであるStandard IPを開発しました。',
  'chapters[8].sections[2].subsections[12].paragraphs[1]': '2016年5月1日から、すべてのIP保険者はStandard IPの販売が義務付けられました。Standard IPの給付はすべての保険者で標準化されています。',
  'chapters[8].sections[2].subsections[12].paragraphs[2]': 'MediShield Lifeを超える補償を提供する民間プランとして、Standard IPにはMediShield Lifeにはない追加の免責金額と共同保険があります。',
  'chapters[8].sections[2].subsections[12].paragraphs[3]': 'それにもかかわらず、Standard IPはB2級以上の病棟補償を求めるシンガポール市民およびPRにとって手頃な選択肢です。',

  'chapters[8].sections[2].subsections[13].paragraphs[0]': 'MediSaveはIPの保険料の支払いに使用でき、年齢帯に応じて全額または一部支払い可能です。',

  'chapters[8].sections[2].subsections[14].paragraphs[0]': 'IP保険者はまた、IPの免責金額と共同保険の一部を支払うライダープランも販売しています。',
  'chapters[8].sections[2].subsections[14].paragraphs[1]': '2018年3月8日、MOHは新規IPライダーに以下の要件を導入しました：\n(a) 共同負担の要素——最低5%の共同保険または定額のcopay\n(b) IPライダーにCPF/MediSaveを使用不可（現金またはSupplementary Retirement Schemeのみで支払い可能）',
  'chapters[8].sections[2].subsections[14].paragraphs[2]': 'これらの要件は、2018年3月8日以降にライダーを購入する新規の保険契約者に適用されます。',

  'chapters[8].sections[2].subsections[15].paragraphs[0]': '共同負担は医療保険の設計における重要な原則です。被保険者が医療費の一部を自己負担することを確保し、過剰消費を抑制します。',
  'chapters[8].sections[2].subsections[15].paragraphs[1]': 'この原則は病院のカテゴリーにかかわらず適用されます。かつて免責金額と共同保険を全額カバーしていたフルライダーは廃止されました。',
  'chapters[8].sections[2].subsections[15].paragraphs[2]': 'これが、MOHが2018年3月8日以降に購入されるIPライダーに最低5%の共同保険または定額のcopayを義務付けた理由の1つです。',
  'chapters[8].sections[2].subsections[15].paragraphs[3]': 'この共同負担の要件は2018年3月8日以前に購入されたライダーには義務付けられていませんでしたが、一部のIP保険者は既存のフルライダーを廃止し、新しい共同負担要件を満たすライダーに切り替えました。',
  'chapters[8].sections[2].subsections[15].paragraphs[4]': 'これらの変更後、保険契約者により多くの安心を提供するため、一部の保険者は既存の保険契約者向けの移行措置を導入しました。',

  'chapters[8].sections[2].subsections[16].paragraphs[0]': 'IPの保険契約者が保険料の支払いを継続する余裕がない、または継続を希望しない場合、IPを終了してMediShield Lifeの補償に戻ることができます。',
  'chapters[8].sections[2].subsections[16].paragraphs[1]': '既存のIPを持つ者が別の保険者の新しいIPに切り替える場合、新しい保険者は既存の病態に対する免除を認める義務があります。',
  'chapters[8].sections[2].subsections[16].paragraphs[2]': 'IPをある保険者から別の保険者に切り替えた保険契約者は、新しい保険者のプランの下での既存病態の免除の権利を有します。',
  'chapters[8].sections[2].subsections[16].paragraphs[3]': '新しい保険者が請求を受け取り、請求発生日が前の保険者の下での補償期間内に該当する場合、新しい保険者は前の保険者に請求を転送します。',

  'chapters[8].sections[2].subsections[17].paragraphs[0]': 'MediShield Lifeの開始に伴い、MOHはIP保険者に対し、更新時に保険契約者をリスクに基づいて格付け（リスクロード）することを認めています。',

  'chapters[8].sections[2].subsections[18].paragraphs[0]': 'LIAはIPのPre-Authorisation（事前承認）プロセスに関するガイダンスペーパーを発行しています。事前承認とは、計画された入院または手術の前にIP保険者に承認を求めるプロセスです。',
  'chapters[8].sections[2].subsections[18].paragraphs[1]': '事前承認の利点は以下のとおりです：\n(a) 保険者が処置の医学的必要性を事前に評価でき、不適切な請求を削減する\n(b) 被保険者が入院前に補償額を把握できる\n(c) 過剰請求や過剰治療の抑制に役立つ',
  'chapters[8].sections[2].subsections[18].paragraphs[2]': 'IP保険契約者に事前承認サービスを提供するすべてのIP保険者は、LIAのガイダンスペーパーに従わなければなりません。',
  'chapters[8].sections[2].subsections[18].paragraphs[3]': 'IP保険者は、事前承認された請求について病院、日帰り手術センター、または医療提供者と直接精算します。',
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
console.log('Ch9 overall: ' + done + '/' + total);
