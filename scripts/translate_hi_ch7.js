const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

hi.chapters[6].titleJP = 'その他の健康保険';

const translations = {
  'chapters[6].sections[0].paragraphs[0]': 'この章では、その他の種類の健康保険商品について取り上げます：入院日額保険、マタニティ保険、旅行保険に含まれる医療費給付、および団体歯科保険です。',

  'chapters[6].sections[1].paragraphs[0]': '入院日額（Hospital Income）保険は、被保険者が傷害または疾病により入院した場合に日額の現金給付を支払います。日額給付は固定金額（例：S$200）です。この種の保険は被保険者の入院費用の一部を補填するのに役立ちます。',
  'chapters[6].sections[1].paragraphs[1]': '例題7.1でこの給付の仕組みを説明しましょう。',
  'chapters[6].sections[1].paragraphs[2]': 'Harryは2014年、2017年、2019年に180日を超えて入院しましたが、保険者は1回の入院あたりの最大期間である180日分のみを支払いました。2023年には、滞在は90日間でしたが、入院日額保険証券の下での生涯の最大入院日数に達していたため、保険者からの支払いはありませんでした。',
  'chapters[6].sections[1].paragraphs[3]': '生涯の最大入院日数分を請求済みであったため、保険者からの最終支払いを受け取った後、保険証券は終了しました。',
  'chapters[6].sections[1].paragraphs[4]': '入院日額保険は、スタンドアローンの保険証券として、ライダーとして、または傷害保険、旅行保険、重大疾病保険もしくは生命保険など他の種類の保険にバンドルして発行できます。',
  'chapters[6].sections[1].paragraphs[5]': 'この給付は以下に起因する入院を補償するために発行できます：\n▪ 傷害のみ\n▪ 傷害および疾病の両方',

  'chapters[6].sections[1].subsections[0].paragraphs[0]': '入院日額給付を請求するためには、被保険者は以下の基準を満たす必要があります：',
  'chapters[6].sections[1].subsections[1].paragraphs[0]': '(a) 傷害の場合：入院が他の原因から独立して直接的に事故により引き起こされた場合、待機期間はありません。\n(b) 疾病の場合：入院が疾病に起因する場合、待機期間が適用されます。',
  'chapters[6].sections[1].subsections[2].paragraphs[0]': '被保険者は所定の最低時間以上入院していなければなりません。\n(a) 生涯限度額：被保険者が生涯で請求できる最大入院日数の合計です。\n(b) 1回の入院あたりの限度額：1回の入院につき支払われる最大日数です。',
  'chapters[6].sections[1].subsections[3].paragraphs[0]': '入院日額保険はスタンドアローンの保険証券またはライダーとして発行できますが、以下のような共通の特徴を有しています：\n(a) 入院1日あたりの給付があります\n(b) 入院1回あたりおよび生涯の最大給付日数があります\n(c) 待機期間が適用されます\n(d) 既存の病態は除外されます',
  'chapters[6].sections[1].subsections[4].paragraphs[0]': '入院日額保険はスタンドアローンの保険証券またはライダーとして発行できます。',
  'chapters[6].sections[1].subsections[5].paragraphs[0]': '入院日額保険がスタンドアローンの保険証券として発行される場合、提供される日額給付はより魅力的であり、以下を含む場合があります：\n(a) 被保険者がHigh Dependency Unit（HDU）またはIntensive Care Unit（ICU）に滞在する場合、日額給付の100%超\n(b) 入院と退院の間に自宅療養が必要な場合のホームナーシング給付',
  'chapters[6].sections[1].subsections[5].paragraphs[1]': 'スタンドアローンの保険証券の保険料は、被保険者が保険証券の更新時に次の年齢帯に移行すると増加します。',
  'chapters[6].sections[1].subsections[5].paragraphs[2]': '被保険者は異なる金額の給付を提供するさまざまなプランから選択でき、配偶者と子を補償に含めることができます。保険証券は通常、年次更新ベースで自動的に更新されます。',
  'chapters[6].sections[1].subsections[6].paragraphs[0]': '入院日額保険は、生命保険証券（例：終身保険、養老保険、または重大疾病保険証券）などの基本保険証券に付帯するライダーとしても発行できます。',
  'chapters[6].sections[1].subsections[7].paragraphs[0]': '保険料が少額であるため、入院日額保険証券は引受が行われません。待機期間が適用され、既存の病態は保険証券の下で永久的に除外されます。',
  'chapters[6].sections[1].subsections[8].paragraphs[0]': '入院日額保険証券の一般的な免責事項には以下が含まれます：\n(a) 被保険者が存在を知っていたか、治療および/または医学的助言を受けた既存の病態\n(b) 既存の身体的障害\n(c) 先天性異常\n(d) 美容整形手術',
  'chapters[6].sections[1].subsections[9].paragraphs[0]': '入院日額保険の補償は、以下のいずれかの事象が発生した場合に終了します：\n(a) 猶予期間の終了時に保険料が支払われなかった場合\n(b) 被保険者が保険証券に記載された満期年齢に達した場合\n(c) 被保険者が生涯の最大入院日数に達した場合',
  'chapters[6].sections[1].subsections[10].paragraphs[0]': '請求が発生した場合、保険者は以下の裏付け書類の提出を要求します：\n(a) 請求書\n(b) 退院サマリーおよび請求書',
  'chapters[6].sections[1].subsections[10].paragraphs[1]': 'これらは被保険者が通常提出する必要がある書類です。保険者は、主治医の報告書などの追加の書類の提出を要求する権利を留保することにご留意ください。',

  'chapters[6].sections[2].paragraphs[0]': 'この保険は、妊娠期間中の母子を補償し、第3保険年度の終了まで補償を延長する場合があり、妊娠および出産に関連する合併症から母子を保護します。',
  'chapters[6].sections[2].subsections[0].paragraphs[0]': 'マタニティ保険が提供する給付には以下が含まれる場合があります：\n母親向け：\n▪ 補償対象の合併症リストに起因する医療費\n▪ 妊娠合併症による死亡または全部永久障害\n赤ちゃん向け：\n▪ 先天性疾患の入院治療費\n▪ 新生児死亡',
  'chapters[6].sections[2].subsections[0].paragraphs[1]': '入院前後の請求書を含む分娩費用は除外されます。',
  'chapters[6].sections[2].subsections[1].paragraphs[0]': 'マタニティ保険には以下のような共通の特徴があります：\n(a) 一時払いの定期保険証券です\n(b) 妊娠13週目から母子（単一の妊娠で最大3人の赤ちゃん）を保護します\n(c) 母親の補償は出産後終了します\n(d) 赤ちゃんの補償は通常、保険証券の第3年度末まで継続します',
  'chapters[6].sections[2].subsections[1].paragraphs[1]': '免責事項\nマタニティ保険証券の一般的な免責事項には以下が含まれます：\n(a) 自傷行為、疾病、自殺または自殺未遂\n(b) 薬物またはアルコールの乱用\n(c) 後天性免疫不全症候群（AIDS）\n(d) 戦争、テロ行為\n(e) 核リスク',

  'chapters[6].sections[3].paragraphs[0]': '旅行保険は、個人または団体ベースで発行され、シンガポール国外を旅行中に個人が被る損害、責任、医療費およびその他の旅行の不便を補償します。',
  'chapters[6].sections[3].paragraphs[1]': '旅行保険証券が提供する医療給付には通常、以下が含まれます：\n(a) 医療費およびその他の関連給付\n(b) 入院日額手当\n(c) 緊急医療搬送\n(d) 緊急医療送還および遺体送還',
  'chapters[6].sections[3].subsections[0].paragraphs[0]': '旅行保険は、被保険者が傷害または疾病（保険証券に定義された）を被ったことにより必要かつ合理的に発生した、ほとんどの選択的でない海外医療費および治療費を償還します。',
  'chapters[6].sections[3].subsections[0].paragraphs[1]': '旅行保険証券の申込に年齢制限がないため、保険者は子供（18歳未満）には低い給付限度額を、高齢者（通常70歳以上）には含まれている場合に高い限度額を設定しています。',
  'chapters[6].sections[3].subsections[0].paragraphs[2]': '一部の保険者は、追加保険料および/または簡単な健康に関する質問により、旅行保険証券に既存の病態の補償を認めています。それ以外の場合、既存の病態は補償から除外されます。',
  'chapters[6].sections[3].subsections[0].paragraphs[3]': '以下についても償還が行われます：\n▪ 海外での治療完了を待つために滞在する必要がある場合に被保険者（および必要な場合は旅行の同伴者）が必要かつ発生した合理的な追加の宿泊費および旅費\n▪ 担当医師が推奨する追加の医療処置費用',
  'chapters[6].sections[3].subsections[1].paragraphs[0]': '被保険者は、一定期間または一定金額まで、海外で入院した場合に日額の入院現金給付を受ける権利があります。これは請求した医療費に加えて支給されます。',
  'chapters[6].sections[3].subsections[1].paragraphs[1]': '帰国後一定期間内にシンガポールで治療を受けた場合の入院については、限度額は一般に低くなります。',
  'chapters[6].sections[3].subsections[1].paragraphs[2]': '一部の保険者は、事故による集中治療室での海外入院について、一定期間まで2倍の給付を提供しています。',
  'chapters[6].sections[3].subsections[2].paragraphs[0]': 'これは緊急医療搬送の費用を補償します。緊急医療搬送とは、被保険者が重篤な疾病または傷害を被った緊急事態において、適切な医療施設に搬送する必要がある場合を意味します。',
  'chapters[6].sections[3].subsections[2].paragraphs[1]': '保険者は緊急医療搬送を提供する専門会社と契約しています。保険証券では、被保険者がまず当該専門会社に連絡し、搬送の必要性と搬送先を決定してもらうことが要件とされています。',
  'chapters[6].sections[3].subsections[2].paragraphs[2]': '低補償プランでは支払われる最大給付限度額があります。ただし、高補償プランでは、補償額は通常無制限です。',
  'chapters[6].sections[3].subsections[2].paragraphs[3]': '緊急支援補償を持つことの重要な側面は、被保険者が不慣れな環境で重篤な疾病や傷害を被った場合に、専門家の支援が利用可能であることを知ることで、さらなる安心感を与えることです。',
  'chapters[6].sections[3].subsections[3].paragraphs[0]': '旅行保険は、緊急医療送還および遺体送還に発生した費用を補償します。',
  'chapters[6].sections[3].subsections[3].paragraphs[1]': '緊急医療送還は、海外での不幸な疾病または事故の結果として、被保険者が出身国（例：シンガポールへの帰国）に送還されなければならない場合に発生します。',
  'chapters[6].sections[3].subsections[3].paragraphs[2]': '遺体送還とは、死亡した被保険者の遺体を出身国に輸送し帰還させることを意味します。',
  'chapters[6].sections[3].subsections[3].paragraphs[3]': '低補償プランでは支払われる最大給付限度額があります。ただし、高補償プランでは、補償額は通常無制限です。',
  'chapters[6].sections[3].subsections[4].paragraphs[0]': '旅行保険は通常、以下に直接的または間接的に起因するまたはこれらに関連する請求を補償しません：\n(a) 戦争、侵略、外国の敵の行為、敵対行為または戦争類似行為\n(b) 自傷行為、自殺または自殺未遂\n(c) 核リスク\n(d) 既存の病態\n(e) 美容整形手術\n(f) エクストリームスポーツまたは危険な活動への参加',

  'chapters[6].sections[4].paragraphs[0]': '団体歯科保険は引受なしで提供され、団体入院・手術保険証券のライダーとして発行されます。すべての団体保険証券と同様に、現に就業中の従業員のみが保険証券の下で補償される資格があります。',
  'chapters[6].sections[4].subsections[0].paragraphs[0]': '提供される給付は非常に包括的であり、簡単なスケーリングおよびポリッシングから根管治療や親知らずの抜歯まで、幅広い歯科処置を含みます。',
  'chapters[6].sections[4].subsections[0].paragraphs[1]': '各治療/処置の給付限度額を設定する代わりに、一部の保険者は各保険年度中に各被保険従業員が請求できる全体的な限度額を設定しています。この限度額に達すると、被保険従業員はその保険年度のそれ以降の歯科処置について請求できなくなります。',
  'chapters[6].sections[4].subsections[1].paragraphs[0]': '団体歯科保険証券を発行するほとんどの保険者は、独自の提携歯科医パネルを持っていません。そのため、被保険従業員は治療のために自分の歯科医を受診できます。',
  'chapters[6].sections[4].subsections[1].paragraphs[1]': 'ほとんどの保険者は、被保険従業員の家族（配偶者および子）を含むよう補償の拡張も認めています。',
  'chapters[6].sections[4].subsections[2].paragraphs[0]': '他のすべての保険補償と同様に、団体歯科保険証券も提供される補償に一定の免責事項を課しています。一般的な免責事項には以下が含まれます：\n(a) 保険証券の給付スケジュールに指定されていない歯科処置\n(b) 美容目的の歯科処置\n(c) 既存の歯科疾患',
  'chapters[6].sections[4].subsections[2].paragraphs[1]': 'これらは一般的な免責事項です。免責事項は保険者によって異なるため、保険者の保険証券に基づく具体的な免責事項を確認する必要があります。',
  'chapters[6].sections[4].subsections[3].paragraphs[0]': 'すべての団体歯科保険証券にはこの制限条項が含まれており、被保険者（従業員）に対して、保険証券に基づく償還は他のソースから受け取る給付により減額されることを通知しています。',
  'chapters[6].sections[4].subsections[4].paragraphs[0]': '団体歯科保険証券に基づく各被保険従業員の補償は、以下の日のうち最も早い日に自動的に終了します：\n(a) 被保険従業員の雇用終了日\n(b) 保険証券の終了日\n(c) 被保険者が保険証券に記載された満期年齢に達した日',
  'chapters[6].sections[4].subsections[5].paragraphs[0]': '従業員が保険者の提携歯科医で治療を受ける場合、アプリにログインするか、eカードまたは身分証明書を提示してメンバーシップを確認し、キャッシュレスサービスを享受するだけです。',
  'chapters[6].sections[4].subsections[5].paragraphs[1]': '従業員が自分の歯科医を利用することを決めた場合、まず診療所に支払いを行い、その後償還を求めるために以下の書類を保険者に提出して請求を行う必要があります：\n(a) 記入済みの請求書\n(b) 歯科医の領収書原本',
  'chapters[6].sections[4].subsections[5].paragraphs[2]': '請求は所定の期間内に提出する必要があります。',
  'chapters[6].sections[4].subsections[5].paragraphs[3]': '注：被保険従業員が承認された提携歯科医を受診した場合、給付は「実費（as-charged）」で支払われます。提携外の歯科医を受診した被保険従業員については、給付は保険証券の給付スケジュールに記載された限度額を上限として支払われます。',
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

const ch = hi.chapters[6];
let total = 0, done = 0;
ch.sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('HI Ch7: ' + done + '/' + total + ' translated');
