/**
 * translate_hi_ch11_13.js
 * Translates HI Chapter 11 (HEALTH INSURANCE PRICING, index 10)
 * and Chapter 13 (NOTICE NO: MAS 120, index 12) to Japanese.
 * Sets titleJP and textJP for all paragraphs.
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/textbook-hi.json');

// ─── Translations ────────────────────────────────────────────────────────────

// Chapter 11 (index 10): HEALTH INSURANCE PRICING
const CH11_TITLE_JP = '健康保険の保険料算定';

const CH11_SECTION_TITLES = {
  'ch11-s2': '保険料計算に用いられる主要な要素',
  'ch11-s2-A': '罹患率',
  'ch11-s2-B': '運用収益',
  'ch11-s2-C': '営業費用',
  'ch11-s2-D': '医療インフレ',
  'ch11-s2-E': '伝染病・パンデミックが一般住民に与える影響',
  'ch11-s2-F': '補償給付の範囲',
  'ch11-s2-G': '保険者の利益',
  'ch11-s2-H': '保険料支払い方法',
  'ch11-s2-I': '引受審査の範囲',
  'ch11-s3': '保険料算定のパラメータ',
  'ch11-s3-A': '年齢',
  'ch11-s3-B': '性別',
  'ch11-s3-C': '健康状態',
  'ch11-s3-D': 'ライフスタイル',
  'ch11-s3-E': '職業',
  'ch11-s3-F': '継続率',
  'ch11-s3-G': 'ポートフォリオの保険金請求実績',
  'ch11-s3-H': '請求実績に基づく保険料算定',
  'ch11-s3-I': '団体加入率',
};

const CH11_PARA_JP = {
  '2.1': '健康保険の保険料を計算する際に用いられる主要な要素は以下のとおりです。（a）罹患率、（b）運用収益、（c）営業費用、（d）医療インフレ、（e）伝染病・パンデミックが一般住民に与える影響、（f）補償給付の範囲、（g）保険者の利益、（h）保険料の支払方法、（i）引受審査の範囲。',

  '2.2': '罹患率（Morbidity rate）とは、一定期間内にある集団において疾病や傷病が発生する割合のことです。これは健康保険の保険料算定における最も重要な考慮要素です。平均的に、女性の罹患率は男性より高いため、ほとんどの健康保険において女性の保険料率は男性より高く設定されています。',

  '2.3': '運用収益（Investment income）とは、保険者が保険契約者から受け取った保険料を運用することで得られる収益です。',

  '2.4': '保険料は保険金支払いの主要な財源です。しかし、保険者が毎年受け取る保険料の全てを当年度の保険金支払いに充てる必要はありません。そのような保険料は遊休させずに運用され、さらなる収益を生み出します。したがって、運用収益は保険者が保険義務を履行するための追加的な資金源と捉えることができます。',

  '2.5': '運用収益は、保険者が保険契約者に請求しなければならない保険料の引き下げに寄与します。',

  '2.6': '営業費用は保険料を押し上げます。保険者は保険コストを賄うためだけでなく、人件費・販売手数料・税金・事務所賃料・広告費・コンピュータシステム・備品費など、会社の運営コストを賄うためにも保険料を徴収しています。個人および団体の被保険者は、このような営業費用も賄う保険料を支払うことになります。',

  '2.7': '近年、個人・団体いずれのプランにおいても、医療保険金請求コストが一貫して上昇しています。請求額の増加は、医療費の上昇、医療技術の進歩、特にシンガポールにおける高齢化人口の増加に伴うサービス利用率の上昇に起因しています。',

  '2.8': '保険者は保険金支払い義務を果たすため、増大する医療費をカバーするのに十分な保険料が確保できるよう、医療インフレ要素を保険料算定に織り込みます。',

  '2.9': '世界が最近、新型コロナウイルス感染症（Covid-19）の甚大な影響と、それに伴うワクチン開発や政府による強制措置の結果を目の当たりにしたことを踏まえ、保険者は健康保険の保険料算定にあたって、一般的な人口統計上の健康状態の変化と、それが健康保険請求に与える潜在的影響を考慮し始めています。',

  '2.10': '給付内容が充実し給付上限額が高いプラン、免責金額（deductible）が小さいプラン、共同保険（co-insurance）の自己負担割合が小さいプランほど、保険料は高くなります。',

  '2.11': 'Integrated Shield Plans（統合シールドプラン）などのH&S（入院・手術）保険では、民間病院での治療の補償は公立病院での治療の補償より費用が高くなります。',

  '2.12': '保険者は事業から利益を得ることを主な目的として市場に参入します。商品の価格設定にあたって、保険者は利益マージンを保険料に上乗せします。この上乗せ額は保険者の利益目標・戦略、および事業の性質によって異なります。例えば、市場シェア拡大を目指す保険者は、より薄い利益マージンに甘んじることもあります。',

  '2.13': 'これは保険料を支払う頻度のことです。支払方法には以下があります。（a）年払い：年1回、（b）半年払い：年2回、（c）四半期払い：3ヶ月に1回、（d）月払い：月1回。',

  '2.14': '支払頻度が高くなると保険料はわずかに増加します。この増加分は、保険者が（a）追加的な請求・事務処理コスト、および（b）年間保険料を一括して運用した場合に得られたであろう運用収益の機会損失を回収するためのものです。支払方法は年払い・半年払い・四半期払い・月払いのいずれかを選択できます。',

  '2.15': 'したがって、月払いの保険料は半年払いの保険料の6分の1よりわずかに高く、半年払いの保険料は年払いの保険料の2分の1よりわずかに高くなります。',

  '2.16': '保険申込時に被保険者から医療情報を収集するために必要な時間と手間は、場合によっては多大なものになります。保険者によっては、申込書に記載する健康告知事項を減らすことで、最小限のリスク審査にとどめる場合があります。その場合、より高い保険料を設定することになります。',

  '3.1': '年齢・性別・健康状態・ライフスタイル・職業・保険金請求実績・モラルハザードなどによって保険料がどのように異なるか、またそれぞれが保険料水準に与える影響を見ていきましょう。',

  '3.2': '年齢は、個人プランか団体プランかを問わず、保険料率を決定する上での主要なパラメータです。年齢層によって、保険金請求の頻度と重大性に差異があります。例えば、50歳の人は30歳の人より長い回復期間を要する可能性が高くなります。',

  '3.3': '統計によると、女性は一般的に男性より多くの医療保険金請求を行っています。そのため、長期介護保険や重大疾病保険などの健康保険では、同年齢の男性と比較して女性の保険料が高くなっています。簡略化のため、すべての健康保険で性別による保険料差別化が行われているわけではありません。例えば、MediShield Life（医療シールドライフ）やIntegrated Shield Plans（統合シールドプラン）の保険料は性別ではなく年齢によって決まります。',

  '3.4': '申込予定の被保険者の健康状態は、保険料算定における重要な考慮要素です。既往症を持つ個人は、特別な引受条件が適用されたり、申込が謝絶される場合があります。',

  '3.5': '申込予定の被保険者のライフスタイルも保険料に影響を与えます。けがのリスクが高い危険なスポーツ（例：レクリエーション飛行、登山、スキューバダイビング）への参加は、追加保険料が必要となるか、当該活動に関する補償除外が求められます。',

  '3.6': '保険料率を決定するうえで最も重要なライフスタイル要因は喫煙です。非喫煙者は喫煙者より低い保険料を支払うことが期待できます。',

  '3.7': '申込予定の被保険者の職業はリスクに大きな影響を与えます。職業によっては、けがや疾病のリスクが高い場合があります。',

  '3.8': '保険者は職業を事故・疾病リスクに応じたさまざまなクラスに分類し、職業上の危険度に基づいた保険料率を設定します。例えば、高所建設作業員は事務管理者より職業上のけがを負う可能性が高くなります。',

  '3.9': '職業リスク分類リストにすべての職業が掲載されているわけではありませんが、ほとんどの職業は大まかに分類することができます。',

  '3.10': '当然のことながら、職業に起因するけがや疾病のリスクが高いほど、保険料も高くなる傾向があります。',

  '3.11': '継続率（Persistency）とは、顧客が保険証券を更新する期間の長さを測る指標であり、個人・団体健康保険の保険料算定におけるパラメータです。継続率は一般的に、保険証券の経過年数とともに改善します。',

  '3.12': '継続率は年齢層によっても異なります。若年層（例：20〜29歳）のグループは高齢者層（例：50〜59歳）のグループより継続率が低い場合があります。高齢の被保険者は、新規保険の引受要件を満たすことが難しくなるため、保険証券をより価値あるものと見なす傾向があります。',

  '3.13': 'ある補償種別の継続率が高いと見込まれる場合、保険者は保険料を引き下げます。',

  '3.14': '健康保険ポートフォリオの保険金請求実績は保険料に大きな影響を与えます。保険数理士は、何より優先して、徴収した保険料が予想される保険金支払いに十分充足していることを確保しなければなりません。',

  '3.15': 'ポートフォリオの総保険金請求額は、（i）支払済保険金、（ii）支払待ち保険金、（iii）発生報告未了保険金（IBNR）で構成されます。',

  '3.16': 'IBNR（Incurred But Not Reported）とは、既に発生しているが、報告の遅延などにより保険契約者から保険者にまだ報告されていない潜在的な保険金請求のことです。保険者はIBNR請求額を正確に見積もり、これらの将来的な潜在的負債をカバーするのに十分な資金を確保するために積立金（reserve）を設定しなければなりません。',

  '3.17': '団体プランでは、当該グループの保険金請求実績が適用保険料率に影響する主要な要素です。例えば、団体外来プランでは、請求実績はグループの一般的な健康状態とグループメンバーの請求傾向を示します。保険料算定における請求実績データの重要性は、グループ規模が大きくなり、利用可能なデータ年数が増えるにつれて高まります。',

  '3.18': '保険者によっては、保険証券での請求に基づいて個人の健康保険料を調整する「請求実績連動型保険料算定（Claims-based pricing）」を採用しています。例えば、保険証券に請求がなかった場合には更新割引が適用されたり、請求があった場合でも、公立病院での治療を選択するなど保険金請求コストを低く抑える努力をした場合はペナルティが課されない仕組みがあります。',

  '3.19': '任意加入の団体プランでは、プランへの従業員の加入率が保険料率の設定において重要なパラメータとなります。加入率が低い場合、健康上の問題を抱える個人の割合が通常より高くなる可能性があります。これを逆選択（anti-selection）と呼びます。加入率が高い場合、逆選択リスクを補う健康な被保険者が十分に揃う可能性が高くなります。そのため、多くの保険者は加入率に基づいて保険料率を変動させています。',
};

// Chapter 13 (index 12): NOTICE NO: MAS 120
const CH13_TITLE_JP = 'MAS通達第120号 – 傷害・疾病保険商品に係る開示・助言プロセス要件';

const CH13_SECTION_TITLES = {
  'ch13-s1': '背景',
  'ch13-s2': '通達第MAS120号の適用範囲',
  'ch13-s3': '通達第MAS120号の構成',
};

const CH13_PARA_JP = {
  '1.1': 'シンガポール金融管理局（MAS: Monetary Authority of Singapore）は、傷害・疾病（A&H）保険商品に係る開示・助言プロセス要件を定めた「通達第MAS120号（Notice No: MAS 120 – Disclosure And Advisory Process Requirements For Accident And Health Insurance Products）」を2004年1月30日に初めて発行しました。MAS 120の最終改定は2022年6月1日に行われました。',

  '2.1': 'この通達は、A&H保険証券およびA&H給付を提供する生命保険証券の保険契約者への情報開示と助言の提供に関する強制要件とベストプラクティス基準の両方を含んでいます。この通達は、Insurance Act 1966（保険法1966年）第67条、第72条および第154条(4)に基づいて発行されています。',

  '2.2': '一般的に、この通達はA&H保険証券およびA&H給付を提供する生命保険証券について助言・手配を行うすべての直接保険者、認可または届出済みのファイナンシャルアドバイザーに適用されます。ただし、以下の場合には適用されません。（a）当該保険証券が保険証券上の負債の再保険に関するもの、および（b）当該保険証券において、被保険者が当該保険証券で定義される「全廃疾（totally and permanently disabled）」状態となった場合にのみA&H給付が支払われると定めているもの。',

  '3.1': 'この通達は以下の内容で構成されています。パートI（強制要件）：区分1：A&H保険証券に関する一般要件 – 直接保険者は、当該保険証券がMedisave（メディセーブ）承認保険証券でない限り、A&H保険証券の名称に「Shield」という単語を使用してはなりません。区分1A：A&H保険証券に関する開示要件 – これはA&H保険仲介業者に関する一般情報（業務上の商号、業務所在地等）を含みます。区分2：A&H保険証券に関するアドバイザリー要件 – A&H保険証券および生命保険証券のA&H給付のいずれかを客に推薦する際の要件と、当該保険証券または給付を受け取る客への要件を定めています。パートII（ベストプラクティス基準）はパートIの強制要件を補完するものです。',

  '3.2': '本通達の詳細とその遵守要件については、MASウェブサイトから引用・作成された付録13A（Appendix 13A）を参照してください。',
};

// ─── Helper Functions ──────────────────────────────────────────────────────

function applyTranslations(obj, paraJP, sectionTitlesJP) {
  // Set section/subsection titleJP
  if (obj.id && sectionTitlesJP[obj.id] !== undefined) {
    obj.titleJP = sectionTitlesJP[obj.id];
  }

  // Set paragraph textJP
  if (obj.paragraphs) {
    obj.paragraphs.forEach(p => {
      if (paraJP[p.num] !== undefined) {
        p.textJP = paraJP[p.num];
      }
    });
  }

  // Recurse into sections and subsections
  if (obj.sections) {
    obj.sections.forEach(s => applyTranslations(s, paraJP, sectionTitlesJP));
  }
  if (obj.subsections) {
    obj.subsections.forEach(s => applyTranslations(s, paraJP, sectionTitlesJP));
  }
}

function countParas(obj) {
  let count = 0;
  if (obj.paragraphs) count += obj.paragraphs.length;
  if (obj.sections) obj.sections.forEach(s => { count += countParas(s); });
  if (obj.subsections) obj.subsections.forEach(s => { count += countParas(s); });
  return count;
}

function countTranslatedParas(obj) {
  let count = 0;
  if (obj.paragraphs) {
    obj.paragraphs.forEach(p => { if (p.textJP && p.textJP.trim()) count++; });
  }
  if (obj.sections) obj.sections.forEach(s => { count += countTranslatedParas(s); });
  if (obj.subsections) obj.subsections.forEach(s => { count += countTranslatedParas(s); });
  return count;
}

// ─── Main ──────────────────────────────────────────────────────────────────

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// --- Chapter 11 (index 10) ---
const ch11 = data.chapters[10];
console.log(`\nProcessing Chapter 11 (index 10): "${ch11.title}"`);
const ch11TotalBefore = countParas(ch11);
console.log(`  Total paragraphs: ${ch11TotalBefore}`);

ch11.titleJP = CH11_TITLE_JP;
applyTranslations(ch11, CH11_PARA_JP, CH11_SECTION_TITLES);

const ch11Translated = countTranslatedParas(ch11);
console.log(`  Translated paragraphs: ${ch11Translated} / ${ch11TotalBefore}`);

// --- Chapter 13 (index 12) ---
const ch13 = data.chapters[12];
console.log(`\nProcessing Chapter 13 (index 12): "${ch13.title.slice(0, 60)}..."`);
const ch13TotalBefore = countParas(ch13);
console.log(`  Total paragraphs: ${ch13TotalBefore}`);

ch13.titleJP = CH13_TITLE_JP;
applyTranslations(ch13, CH13_PARA_JP, CH13_SECTION_TITLES);

const ch13Translated = countTranslatedParas(ch13);
console.log(`  Translated paragraphs: ${ch13Translated} / ${ch13TotalBefore}`);

// --- Write back ---
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✓ Written back to textbook-hi.json');

// --- Verify ---
console.log('\n=== Verification ===');
const reread = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const v11 = reread.chapters[10];
const v13 = reread.chapters[12];

console.log(`Ch11 titleJP: "${v11.titleJP}"`);
console.log(`Ch13 titleJP: "${v13.titleJP}"`);

// Sample checks
function findPara(obj, num) {
  if (obj.paragraphs) {
    const p = obj.paragraphs.find(x => x.num === num);
    if (p) return p;
  }
  let found = null;
  if (obj.sections) obj.sections.forEach(s => { if (!found) found = findPara(s, num); });
  if (obj.subsections) obj.subsections.forEach(s => { if (!found) found = findPara(s, num); });
  return found;
}

const samples = [
  { ch: v11, num: '2.1', label: 'Ch11 2.1' },
  { ch: v11, num: '2.9', label: 'Ch11 2.9' },
  { ch: v11, num: '3.18', label: 'Ch11 3.18' },
  { ch: v11, num: '3.19', label: 'Ch11 3.19' },
  { ch: v13, num: '1.1', label: 'Ch13 1.1' },
  { ch: v13, num: '3.2', label: 'Ch13 3.2' },
];

samples.forEach(({ ch, num, label }) => {
  const p = findPara(ch, num);
  if (!p) {
    console.log(`  ${label}: PARAGRAPH NOT FOUND`);
  } else if (!p.textJP) {
    console.log(`  ${label}: textJP MISSING`);
  } else {
    console.log(`  ${label}: OK — "${p.textJP.slice(0, 60)}..."`);
  }
});

// Final count summary
const finalCh11 = countTranslatedParas(reread.chapters[10]);
const finalCh13 = countTranslatedParas(reread.chapters[12]);
const totalParasCh11 = countParas(reread.chapters[10]);
const totalParasCh13 = countParas(reread.chapters[12]);

console.log(`\nFinal counts:`);
console.log(`  Ch11: ${finalCh11}/${totalParasCh11} paragraphs translated`);
console.log(`  Ch13: ${finalCh13}/${totalParasCh13} paragraphs translated`);

if (finalCh11 !== totalParasCh11) {
  console.error(`  ERROR: Ch11 has ${totalParasCh11 - finalCh11} untranslated paragraphs!`);
  process.exit(1);
}
if (finalCh13 !== totalParasCh13) {
  console.error(`  ERROR: Ch13 has ${totalParasCh13 - finalCh13} untranslated paragraphs!`);
  process.exit(1);
}

console.log('\n✓ All paragraphs translated successfully.');
