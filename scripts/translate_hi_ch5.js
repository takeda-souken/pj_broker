const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

hi.chapters[4].titleJP = '長期介護保険';

const translations = {
  'chapters[4].sections[0].paragraphs[0]': '優雅に老いること、健康で自立した生活を送ることは、ほとんどの人の願いです。しかし、加齢に伴う疾病や傷害がこの願いの実現を妨げる場合があります。糖尿病、脳卒中、高血圧、関節炎などの慢性疾患は、日常生活の最も基本的な動作を行う能力を損なう可能性があります。長期介護（LTC）保険は、自立して生活できなくなった者の介護費用を賄うための資金を提供するのに役立ちます。',
  'chapters[4].sections[0].paragraphs[1]': 'シンガポールの人口は急速に高齢化しており、2025年までに「超高齢」社会の地位に達すると予想されています。2030年までに市民の4人に1人が65歳以上になります。高齢化する人口と長寿の進展により、国家の医療費は増加し、長期介護のための財政支援の必要性が高まります。',
  'chapters[4].sections[0].paragraphs[2]': 'この章では、長期介護保険が個人の長期介護ニーズの資金調達費用を補助するための資金提供にどのように役立つかを見ていきます。',

  'chapters[4].sections[1].paragraphs[0]': 'LTC保険は、事故、疾病、虚弱、またはこれらの組み合わせにより自立して機能することができない者の介護費用を賄うために設計されています。代わりに、最も基本的な日常生活動作（ADL）の支援を他者に頼らなければなりません。',
  'chapters[4].sections[1].paragraphs[1]': 'LTCを若くて健康で、既存の医学的障害がないうちに購入することには、2つの主要な利点があります。\n▪ 第一に、保険料は年齢とともに大幅に上昇するため、商品のコストが低くなります。\n▪ 第二に、若い年齢で購入することにより、保険者が申込を引き受ける可能性が高くなります。',
  'chapters[4].sections[1].paragraphs[2]': 'LTC保険は、他の医療保険では一般に除外されるケアを補償します。MediShield Life、入院所得保険、重大疾病保険証券など、被保険者の他の保険証券に加えて支払われます。',

  'chapters[4].sections[2].subsections[0].paragraphs[0]': '2種類のLTC保険証券が利用可能です：\n(a) 「サービスベース」の保険証券は、被保険者が保険証券の下で補償されるサービス（例：在宅ケアまたは看護ケア）を利用する必要がある場合に給付を支払います。給付は2つの方法で支払われます：\n▪ 被保険者が実際に発生した費用を保険者に請求する費用償還\n▪ ケアの種類にかかわらず定額の金額を支払う現金給付\n(b) 「所得ベース」の保険証券は、被保険者が保険証券で定義された障害のレベルを満たした場合に月額の所得を支払います。',
  'chapters[4].sections[2].subsections[0].paragraphs[1]': '給付は、承認済みの登録医師により所定のADLの最低数を遂行することができないと証明された被保険者に対して、所定の期間後に月額で支払われます。一部の保険者は、被保険者がADLのうち3つを遂行できない場合にLTC月額給付の100%を支払い、被保険者がADLのうち1つまたは2つを遂行できない場合にLTC月額給付のより低い割合を支払います。',

  'chapters[4].sections[2].subsections[1].paragraphs[0]': '被保険者はLTC給付の適格性を得るために入院する必要はありません。LTCに基づいて受け取った給付を、家事労働者（メイド）の雇用費用、介護施設での滞在費用、または生活支援プログラムへの参加費用に充てることができます。',
  'chapters[4].sections[2].subsections[1].paragraphs[1]': 'ただし、LTC給付を請求する資格を得る前に、特定のその他の基準を満たす必要があります。',

  'chapters[4].sections[2].subsections[2].paragraphs[0]': 'ADLの遂行不能\n(a) LTC保険証券で給付を支払うための主要な基準の1つは、被保険者が支援なしで自立して生活するために必要な特定の基本的動作を遂行できないことです。これらの基本的動作は日常生活動作（ADL）として知られ、以下の6つのADLが含まれます：\n▪ 入浴 — 入浴またはシャワーで体を洗う能力\n▪ 着替え — 適切な衣服を着脱する能力\n▪ 食事 — 準備された食事を食べる能力\n▪ 排泄 — トイレの使用を管理する能力\n▪ 移動 — ベッドから椅子へ、また椅子からベッドへ移る能力\n▪ 歩行 — 室内を平坦な面で移動する能力',
  'chapters[4].sections[2].subsections[2].paragraphs[1]': '進行性認知症\n(a) 進行性認知症とは、アルツハイマー病または不可逆的な器質性疾患に起因する知的能力の低下もしくは喪失、または異常行動を被保険者が経験する状態を意味します。神経症および精神疾患は除外されます。',

  'chapters[4].sections[2].subsections[3].paragraphs[0]': 'ADLの遂行不能の要件に加えて、被保険者はLTC給付を受ける資格を得る前に、据置期間の要件も満たす必要がある場合があります。ほとんどの保険者は、被保険者がADLを遂行できないと最初に判断された日から起算して90日の据置期間を設けています。',

  'chapters[4].sections[2].subsections[4].paragraphs[0]': 'LTC保険証券は、申込書で開示されなかった既存の病態から請求が生じた場合、支払いを行いません。開示された場合、保険者は標準保険料率で、または標準外の保険料率で申込を引き受けるか、あるいは条件付きで引き受ける場合があります。',
  'chapters[4].sections[2].subsections[4].paragraphs[1]': 'この規定の目的は、請求につながる可能性のある状態があることを知っていながら補償を購入する者を防ぐことです。これは保険者に対する逆選択（アンチセレクション）としても知られています。',
  'chapters[4].sections[2].subsections[4].paragraphs[2]': '保険者はまた、被保険者が給付を請求する資格を得る前に遵守しなければならない他の保険証券条件を課す場合があります。',

  'chapters[4].sections[3].paragraphs[0]': '保険者は通常、被保険者の死亡時に被保険者の受益者に支払われる死亡給付も含めています。ただし、その金額は少額で、例えばS$5,000からLTC月額給付の6倍の範囲です。',
  'chapters[4].sections[3].paragraphs[1]': 'LTCおよび死亡給付に加えて、一部の保険者は以下のような他の給付とパッケージにする場合もあります：\n(a) 拡張ケア給付 — 3年または5年ごとに追加の月額給付などの追加の所定額が支払われます\n(b) リハビリテーション給付 — 被保険者が障害から回復した場合、リハビリテーション費用の償還が行われます',
  'chapters[4].sections[3].paragraphs[2]': 'これらの給付は、請求可能な最大額の限度および給付支払い期間の限度が適用されます。さもなければ、商品は法外に高価になります。LTC保険の主な目的は、被保険者のすべての介護費用を賄うニーズを満たすことではなく、必要な費用の一部を補助するための追加の資金源を提供することです。',

  'chapters[4].sections[4].paragraphs[0]': 'LTC給付について、被保険者が請求できる金額は選択したプランに依存します。例えば、月額S$300からS$5,000の範囲で、所定の数のADLを遂行できず、その他の保険証券条件を満たしていることを条件とします。',

  'chapters[4].sections[5].paragraphs[0]': 'ほとんどの被保険者は、生存する限り保険証券の給付が支払われることを望んでいますが、そのようなプランの保険料は高すぎる場合があります。一部の保険者は、顧客が給付支払い期間を選択できるようにしています。これは、給付が所定の期間のみ支払われることを意味します。',
  'chapters[4].sections[5].paragraphs[1]': '上記にかかわらず、被保険者が重度障害である限り生涯の現金給付を提供する（手頃な保険料の）LTC保険スキームがあります。このようなスキームには、この章の後半で検討するCareShield Lifeが含まれます。',

  'chapters[4].sections[5].subsections[0].paragraphs[0]': 'ElderShieldは、特に老齢期の重度障害を対象とした長期介護保険スキームです。',
  'chapters[4].sections[5].subsections[1].paragraphs[0]': 'ElderShieldは2002年に導入された当初、重度障害時に月額S$300を最大5年間給付しました。その後2007年に見直され、月額S$400を最大6年間という改善された給付を提供するようになりました。',
  'chapters[4].sections[5].subsections[2].paragraphs[0]': 'ElderShieldは、重度障害者のケアのための自己負担費用の支払いを支援するために、最大72か月間の月額現金給付を提供します。',
  'chapters[4].sections[5].subsections[3].paragraphs[0]': '保険料は被保険者がスキームに加入した時点で決定され、保険料は固定のままです。被保険者は65歳の誕生日後の保険証券記念日まで、または被保険者が請求に成功するまで毎年保険料を支払わなければなりません。',
  'chapters[4].sections[5].subsections[4].paragraphs[0]': '2021年11月1日から、政府は民間保険者（Singlife、Great Eastern Life Assurance Co Ltd、Income Insurance Limited）からElderShieldの管理を引き継ぎました。',

  'chapters[4].sections[5].subsections[6].paragraphs[0]': '2019年まで、MediSave口座を有するすべてのシンガポール市民およびシンガポール永住権保持者は、オプトアウトしない限り、40歳でElderShieldに自動加入していました。',
  'chapters[4].sections[5].subsections[6].paragraphs[1]': '2020年以降、ElderShieldへの自動加入は中止されました。1980年以降に生まれたシンガポール市民およびシンガポール永住権保持者は、代わりに30歳でCareShield Lifeに加入しました。',
  'chapters[4].sections[5].subsections[6].paragraphs[2]': '1932年9月30日以前に生まれた者、または2002年9月30日時点で既存の障害があった者は、2002年にElderShieldに加入する資格がありませんでした。代わりに、高齢者向け暫定障害支援プログラム（IDAPE）に基づく支援を受ける資格がある場合があります。',
  'chapters[4].sections[5].subsections[6].paragraphs[3]': 'IDAPEの詳細については、以下のウェブサイトをご覧ください：https://www.aic.sg/financial-assistance/interim-disability-assistanceprogramme-elderly',

  'chapters[4].sections[5].subsections[7].paragraphs[0]': '自身の補償を確認するには、以下の手順を実行してください：\n(a) SingpassでCPFデジタルサービスにログインする\n(b) 「my CPF」にカーソルを合わせ、「My dashboards」の「Healthcare」をクリックする\n(c) 左側のサイドバーの「Long-term care insurance」をクリックする',
  'chapters[4].sections[5].subsections[7].paragraphs[1]': '補償されていない場合、ElderShieldに関する情報は表示されません。自身の補償を確認するには、CPFウェブサイト（Central Provident Fund Board (CPFB)）をご覧ください。',

  'chapters[4].sections[5].subsections[8].paragraphs[0]': 'ElderShieldは以下の保護と給付を提供します：\n(a) 生涯補償 — 被保険者は65歳ですべての保険料の支払いを完了すると、生涯にわたって補償が継続します。\n(b) 最大72か月の現金給付 — 被保険者は重度障害と判定された場合、月額最大S$400の現金給付を最大72か月間受け取ることができます。',

  'chapters[4].sections[5].subsections[9].paragraphs[0]': 'ElderShieldの保険料支払いは65歳までで、生涯の補償があります。ElderShieldの保険料は被保険者がスキームに加入した年齢に基づき、65歳の誕生日後の保険証券記念日まで支払います。',
  'chapters[4].sections[5].subsections[9].paragraphs[1]': 'ElderShieldの保険料の詳細については、以下のウェブサイトをご覧ください：https://www.cpf.gov.sg/member/healthcare-financing/eldershield/eldershieldpremiums',

  'chapters[4].sections[5].subsections[10].paragraphs[0]': 'MOH認定評価者により以下の6つの日常生活動作（ADL）のうち3つを遂行することができないと判定された場合、ElderShieldの給付を受けることができます：\n(a) 入浴 — 入浴またはシャワーで体を洗う能力（浴槽やシャワーへの出入りを含む）\n(b) 着替え — 適切な衣服を着脱する能力\n(c) 食事 — 準備された食事を食べる能力\n(d) 排泄 — トイレの使用を管理する能力\n(e) 歩行 — 平坦な面で室内を移動する能力\n(f) 移動 — ベッドから直立した椅子へ、またはその逆に移る能力',

  'chapters[4].sections[5].subsections[11].paragraphs[0]': '請求を行うには、請求評価を完了する必要があります。まず、被保険者はMOH認定の重度障害評価者により障害評価を手配する必要があります。',
  'chapters[4].sections[5].subsections[11].paragraphs[1]': '評価費用は、診療所での評価がS$100、訪問診療がS$250で、いずれも評価時に評価者に支払います。被保険者が重度障害と評価された場合は全額が払い戻されます。',
  'chapters[4].sections[5].subsections[11].paragraphs[2]': '次に、被保険者はSingpassでAICのeサービスポータル（eFASS）にログインして請求を提出する必要があります。',
  'chapters[4].sections[5].subsections[11].paragraphs[3]': 'CareShield Lifeは2020年10月1日に開始され、ElderShieldと比較して給付が強化されています。CareShield Lifeは、重度障害を有するシンガポール人の基本的な長期介護ニーズを支援する長期介護保険スキームです。',
  'chapters[4].sections[5].subsections[11].paragraphs[4]': 'CareShield Lifeは1980年以降に生まれたすべてのシンガポール人に義務付けられています。1980年から1989年に生まれた者は2020年に一括で自動加入し、1990年以降に生まれた者は30歳になった時点でスキームに自動加入します。',
  'chapters[4].sections[5].subsections[11].paragraphs[5]': '1979年以前に生まれた者の場合：\n(a) 1970年から1979年の間に生まれ、ElderShield 400スキームに加入しており、重度障害を発症していない場合、2021年12月1日からCareShield Lifeに自動加入されます。',
  'chapters[4].sections[5].subsections[11].paragraphs[6]': '1980年以降に生まれた者の場合：\n(a) 1980年から1990年の間に生まれた者は2020年にCareShield Lifeに自動加入しました。\n(b) 1990年以降に生まれた者は30歳になった時点でCareShield Lifeに加入します。\n(c) 普遍的な補償 — 生涯にわたって補償されます。',
  'chapters[4].sections[5].subsections[11].paragraphs[7]': '以下の図は、30歳でCareShield Lifeに加入したシンガポール人のAdamの例を示しています。\n出典: https://www.careshieldlife.gov.sg/',
  'chapters[4].sections[5].subsections[11].paragraphs[8]': 'CareShield Lifeは4つの方法でより良い保護と保証を提供します：\n(a) 被保険者が重度障害である限り生涯にわたる現金給付\n(b) 2020年に月額S$600から開始し、67歳まで、または請求が成功するまで毎年増加する給付\n(c) 普遍的で生涯にわたる補償\n(d) MediSaveからの保険料支払い',
  'chapters[4].sections[5].subsections[11].paragraphs[9]': 'CareShield Lifeに加えて、シンガポール人は2020年から2つの新しいスキームの恩恵を受けます：\n(a) 2020年10月1日に開始されたMediSave Care。重度障害で30歳以上のシンガポール人は、MediSave口座から現金を引き出して介護ニーズに充てることができます。\n(b) ElderFund。重度障害を有する低所得の高齢シンガポール人に現金支援を提供します。',

  'chapters[4].sections[5].subsections[12].paragraphs[0]': '以下の表は、CareShield LifeとElderShieldの比較を示しています。',

  'chapters[4].sections[5].subsections[13].paragraphs[0]': 'MediSave Careは2020年10月1日に開始された長期介護スキームです。MediSave Careの下では、30歳以上で重度障害を有するシンガポール市民およびシンガポール永住権保持者は、介護費用を賄うためにMediSave口座から毎月現金を引き出すことができます。',
  'chapters[4].sections[5].subsections[13].paragraphs[1]': '以下の表は、MediSave残高と対応する月額引出額を示しています。',
  'chapters[4].sections[5].subsections[13].paragraphs[2]': 'シンガポール市民またはシンガポール永住権保持者は、MOH認定評価者により6つの日常生活動作のうち3つ以上を遂行することができないと評価された場合、MediSave Careの適格性があります。',

  'chapters[4].sections[5].subsections[14].paragraphs[0]': '政府はElderFundや在宅介護助成金などのさまざまなスキームを通じて長期介護への支援を強化しています。詳細については、CareShield Lifeのウェブサイトをご覧ください。',
  'chapters[4].sections[5].subsections[15].paragraphs[0]': '月額S$150またはS$250の現金支援が最大6年間、重度障害を発症し、2002年に年齢または当時の既存障害のためにElderShieldに加入できなかった低所得のシンガポール市民に提供されます。',
  'chapters[4].sections[5].subsections[16].paragraphs[0]': 'CareShield Life、ElderShield、および/または高齢者向け暫定障害支援プログラムの適格性がない、30歳以上の重度障害を有する低所得のシンガポール市民に財政支援を提供する裁量的支援スキームです。',
  'chapters[4].sections[5].subsections[17].paragraphs[0]': '6つの日常生活動作のうち少なくとも3つについて常に何らかの支援を必要とする中等度障害のパイオニア世代に対する月額S$100の生涯現金支援です。',
  'chapters[4].sections[5].subsections[18].paragraphs[0]': '自宅で生活し、ニーズアセスメントにより適格と認められた高齢者のための補助具および在宅医療用品に対する所得審査付き補助金です。',
  'chapters[4].sections[5].subsections[19].paragraphs[0]': '地域社会で生活する適格なケア受給者の介護費用を賄うための月額S$250またはS$400の給付です。ケア受給者は6つの日常生活動作のうち少なくとも3つについて常に何らかの支援を必要とする者です。',
  'chapters[4].sections[5].subsections[20].paragraphs[0]': '外国人家事労働者の雇用に対するレビー軽減（障害者向け）',
  'chapters[4].sections[5].subsections[20].paragraphs[1]': '患者のケアのために外国人家事労働者を雇用する世帯に対する月額S$60の低減レビーです。患者は日常生活動作のうち少なくとも1つについて常に何らかの支援を必要とする者です。',
  'chapters[4].sections[5].subsections[21].paragraphs[0]': '介護者が家族の介護をより良く行うために承認されたコースに参加するための年間S$200の補助金です。\n5 https://www.careshieldlife.gov.sg/long-term-care/other-long-term-care-financing-support.html',
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

const ch = hi.chapters[4];
let total = 0, done = 0;
ch.sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('HI Ch5: ' + done + '/' + total + ' translated');
