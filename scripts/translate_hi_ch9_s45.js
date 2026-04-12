const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const translations = {
  // Section 4: Claiming From MediShield Life/IP & MediSave (16 paras)
  'chapters[8].sections[4].paragraphs[0]': 'MediShield Life、IP、および/またはMediSaveから請求することを希望する患者は、Medical Claims Authorisation Formに記入する必要があります：\n(a) 病院が保険者に請求することを許可するため\n(b) MediSaveから支払うことを許可するため',
  'chapters[8].sections[4].subsections[0].paragraphs[0]': '患者のMediSaveが入院費全額をカバーしない場合があるため、入院時に現金で保証金の支払いが求められる場合があります。これは非補助金の病棟クラスの場合に一般的です。',
  'chapters[8].sections[4].subsections[0].paragraphs[1]': '治療の前に、IPの保険契約者は医療機関に連絡して保険者からのLetter of Guarantee（LOG）を要求できます。LOGはIP保険者がIP保険契約者に提供するサービスです。',
  'chapters[8].sections[4].subsections[0].paragraphs[2]': '保険者はすべての治療環境（例：入院/日帰り手術/外来、公的/民間医療機関）に対してLOGを提供するとは限りません。保険契約者はLOGサービスが利用可能かどうか保険者に確認すべきです。',
  'chapters[8].sections[4].subsections[0].paragraphs[3]': '保険者によって、LOG金額は以下のいずれかになります：\n(i) プランの給付に基づくIP推定給付額に基づいて計算（保険者が課す上限の対象）\n(ii) 保険者が設定する定額',
  'chapters[8].sections[4].subsections[1].paragraphs[0]': 'MediShield Life、IP、および/またはMediSaveから請求するIPの保険契約者について、退院後に病院がMediClaimオンラインシステムを通じて代理で請求を提出します。',
  'chapters[8].sections[4].subsections[1].paragraphs[1]': 'MediShield Lifeの請求について、CPF BoardはMediShield Lifeの支払額を計算し、病院と直接精算します。',
  'chapters[8].sections[4].subsections[1].paragraphs[2]': 'IPの請求について、病院は保険者に直接電子的に請求を提出します。給付金について、IP保険者はIPの給付に基づいてIPの支払額を計算し、CPF BoardはMediShield Life部分を計算して病院と精算します。',
  'chapters[8].sections[4].subsections[1].paragraphs[3]': '患者は現行のMediSave引出限度額の範囲内で、MediSaveを使用して請求の一部を支払うことができます。病院は電子的に請求を提出する必要があります。',
  'chapters[8].sections[4].subsections[2].paragraphs[0]': '雇用主の医療給付またはその他の民間保険プランで補償されている者は、保険カード（一部の保険者が特定の医療費保険プランに対して提供）を提示する必要があります。',
  'chapters[8].sections[4].subsections[2].paragraphs[1]': '一部の病院は入院費を直接、患者のMediSave支払い不可の民間保険者または雇用主に送付します。その他の場合、患者は自ら保険者に請求書を提出して請求を行う必要があります。',
  'chapters[8].sections[4].subsections[2].paragraphs[2]': '複数のスキームで補償されている会員について、保健省は重複支払いを避けるため以下の請求プロトコルを定めています：\n(a) 雇用主、民間保険、その他の第三者支払い\n(b) MediShield Life/IP\n(c) MediSave',
  'chapters[8].sections[4].subsections[2].paragraphs[3]': '患者はできるだけ早く、請求を行う予定のすべての当事者を医療機関に通知すべきです。',
  'chapters[8].sections[4].subsections[3].paragraphs[0]': '主治医および診療所名 / 病院/手術センター名 / 希望病棟タイプ',
  'chapters[8].sections[4].subsections[4].paragraphs[0]': '1. 専門家報酬合計の内訳：TOSP コードと説明 / 外科医報酬 / 麻酔医報酬',
  'chapters[8].sections[4].subsections[5].paragraphs[0]': '1. わたくしは以下を表明し保証します：\n(a) わたくしは上記の病態について被保険者（すなわち患者）を個人的に診察し治療したこと、および上記の情報が真実かつ完全であることを表明します。',

  // Section 5: ElderShield & ElderShield Supplements (26 paras)
  'chapters[8].sections[5].paragraphs[0]': 'ElderShieldは2002年9月に導入された長期介護保険スキームです。特に老齢期に長期介護を必要とする者に基本的な財政的保護を提供します。',
  'chapters[8].sections[5].paragraphs[1]': 'すべての者に義務的なMediShield Lifeとは異なり、ElderShieldはオプトアウト方式のスキームです。すなわち、すべてのシンガポール市民（SC）およびシンガポール永住権保持者（SPR）はスキームからオプトアウトすることを選択できます。',
  'chapters[8].sections[5].paragraphs[2]': '保険料はMediSaveから全額支払うことができます。ElderShieldにはElderShield300とElderShield400の2つのスキームがあります。ElderShield300は2002年9月30日に導入され、最大60か月間月額S$300の現金給付を提供しました。ElderShield400は2007年に改善され、最大72か月間月額S$400を提供します。',
  'chapters[8].sections[5].paragraphs[3]': '2021年11月1日以前、政府はAviva Ltd（現Singlife）、Great Eastern Life Assurance Co Ltd、Income Insurance Limitedの3つの民間保険者にElderShieldの提供を委任していました。',
  'chapters[8].sections[5].paragraphs[4]': '政府は2021年11月1日からElderShieldの管理を引き継ぎ、ElderShieldは2021年8月1日以降、閉鎖スキームとなりました。1980年以降に生まれた新しいコホートはCareShield Lifeの下で補償されます。',
  'chapters[8].sections[5].paragraphs[5]': '既存のElderShield被保険者がより高い重度障害保険補償を希望する場合、Supplementsを購入できることにご留意ください。SupplementプランはElderShieldスキームを補完し、追加の給付を提供します。',
  'chapters[8].sections[5].paragraphs[6]': 'Supplementを購入・維持するには、被保険者はElderShield保険証券を有している必要があります。Supplementの保険料はMediSave（暦年あたり被保険者1人あたり最大S$600）および/または現金で支払うことができます。',

  'chapters[8].sections[5].subsections[1].paragraphs[0]': '保険証券の開始日から90日間の待機期間があります。被保険者が補償の最初の90日間に障害を負った場合、給付は支払われません。代わりに、保険者は保険証券を終了し、保険料を返還します。',
  'chapters[8].sections[5].subsections[2].paragraphs[0]': '定義済み',
  'chapters[8].sections[5].subsections[2].paragraphs[1]': 'ElderShieldスキームは、CPF会員が加入しているスキームの種類に応じて、月額S$300を最大60か月間、またはS$400を最大72か月間支払います。',
  'chapters[8].sections[5].subsections[2].paragraphs[2]': 'ADLは以下のように定義されます：\n(a) 入浴 — 入浴またはシャワーで体を洗う能力（浴槽やシャワーへの出入りを含む）、またはその他の方法で体を洗う能力\n(b) 着替え — 適切な衣服を着脱する能力\n(c) 食事 — 準備された食事を食べる能力\n(d) 排泄 — トイレの使用を管理する能力\n(e) 歩行 — 平坦な面で室内を移動する能力\n(f) 移動 — ベッドから直立した椅子へ、またはその逆に移る能力',
  'chapters[8].sections[5].subsections[3].paragraphs[0]': '請求日（すなわちAICが請求申請を受理した日）から90日間の据置期間があります。この期間後も被保険者がまだ障害状態であれば、給付の支払いが開始されます。',
  'chapters[8].sections[5].subsections[3].paragraphs[1]': 'ただし、被保険者が最初の障害期間中に少なくとも90日間障害状態であった場合、回復から180日以内に同一の原因で再発した場合は据置期間は適用されません。',
  'chapters[8].sections[5].subsections[4].paragraphs[0]': '請求を行うには、被保険者はMOH認定の重度障害評価者と予約を取り、障害評価を受ける必要があります。評価者が評価書を完成させ、AICに提出します。',
  'chapters[8].sections[5].subsections[4].paragraphs[1]': '次に、被保険者は請求書に記入する必要があります。本人が記入できない場合、直系家族または介護者が代理で記入できます。',
  'chapters[8].sections[5].subsections[4].paragraphs[2]': '評価者の診療所での評価はS$100、評価者の訪問診療はS$250です。初回またはその後の評価の費用は、被保険者が重度障害と評価された場合に払い戻されます。',
  'chapters[8].sections[5].subsections[5].paragraphs[0]': 'ElderShieldの給付は月額ベースで支払われます。給付支払い期間中、保険証券に基づく保険料は免除されます。被保険者が障害から回復した場合、月額の現金給付は停止され、保険料の支払いが再開されます。',
  'chapters[8].sections[5].subsections[6].paragraphs[0]': 'ElderShieldの保険料は前払い方式です。これにより保険証券は積立金を取得できます。蓄積された積立金により、被保険者は保険料の支払いを停止した場合に減額された給付（すなわち保険証券は払済保険証券に転換される）を享受できます。',
  'chapters[8].sections[5].subsections[6].paragraphs[1]': '例えば、40歳でElderShieldに加入した被保険者は、保険証券の開始から11年後に保険料の支払いを停止した場合、月額約S$100の減額給付を受ける資格があります。',
  'chapters[8].sections[5].subsections[7].paragraphs[0]': 'ElderShieldスキームのその他の主要な特徴は以下のとおりです：\n(a) 年次ベースでの更新保証\n(b) 全世界補償\n(c) 最低加入年齢（40歳）および最大加入年齢あり\n(d) 保険料は加入時の年齢に基づいて固定',
  'chapters[8].sections[5].subsections[8].paragraphs[0]': 'ElderShield保険証券は、以下のいずれかの事由に直接的または間接的に、全体的または部分的に起因する障害を補償しません：\n(a) 自傷行為、自殺または自殺未遂\n(b) 戦争、テロ行為\n(c) 核リスク',
  'chapters[8].sections[5].subsections[8].paragraphs[1]': '既存の障害を有するCPF会員はElderShieldの補償対象外です。',
  'chapters[8].sections[5].subsections[9].paragraphs[0]': 'ElderShield保険証券に基づく補償は、以下のいずれかの事象が発生した場合に終了します：\n(a) ElderShield保険証券が非失効給付の適格性がない場合の猶予期間の満了\n(b) 被保険者の死亡\n(c) 生涯の最大給付期間に達した場合',
  'chapters[8].sections[5].subsections[10].paragraphs[0]': '2021年11月1日から、政府は民間保険者（Singlife、Great Eastern Life Assurance Co Ltd、Income Insurance Limited）からElderShieldの管理を引き継ぎました。これにより、ElderShieldとCareShield Lifeの管理が統合されます。',
  'chapters[8].sections[5].subsections[10].paragraphs[1]': 'CareShield LifeにアップグレードしなかったElderShield保険契約者は、既存のElderShield保険証券による補償が継続されます。政府はElderShieldスキームを非営利ベースで管理しています。',
  'chapters[8].sections[5].subsections[10].paragraphs[2]': 'ElderShield Supplementsの保有者は影響を受けませんでした。既存のSupplement保険者からのサービスが継続されます。',
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
