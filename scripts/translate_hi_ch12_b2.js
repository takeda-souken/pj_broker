const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const t = {
  // Section 3 subsections - Sources of underwriting information
  'chapters[11].sections[3].subsections[0].paragraphs[0]': '申込（申請）書は、保険者にとって引受情報の主要な情報源です。引受人が必要な補償を提供するか修正するか、追加情報を取得するか、申込を拒否するかを決定するための基本的な情報を提供します。',
  'chapters[11].sections[3].subsections[0].paragraphs[1]': '保険証券が発行された後、申込書は保険契約の一部を構成し、請求が提出された際の基礎として使用されます。保険者が争訟可能期間の終了前に虚偽の申告または不完全な開示があったと判断した場合、保険者は保険証券を無効にする権利を有します。',
  'chapters[11].sections[3].subsections[1].paragraphs[0]': '申込書は各健康保険商品により異なりますが、一般に以下の情報が含まれています：\n(i) 契約当事者の身元：保険契約は保険者と申込者の間のものです。ヘッダーセクションには、申込者および被保険者の個人情報が含まれます。\n(ii) 健康に関する質問：被保険者の病歴および現在の健康状態を開示するための質問です。\n(iii) ライフスタイルに関する質問：喫煙、飲酒、危険なスポーツへの参加などに関する質問です。\n(iv) 申告および承認：申込者が提供した情報が真実かつ完全であることの宣言です。',
  'chapters[11].sections[3].subsections[1].paragraphs[1]': '申込書の形式とその質問の深さは、商品の種類に応じて保険者間で異なります。個人健康保険の申込書および団体保険の申込書のサンプルは付録12Bおよび12Cに掲載されています。',
  'chapters[11].sections[3].subsections[1].paragraphs[2]': '申込者および被保険候補者は申込書に自ら署名し、申込書に加えた変更に副署しなければなりません。申込書における重要な事実の適切な開示の責任は申込者および被保険候補者にあるためです。',
  'chapters[11].sections[3].subsections[2].paragraphs[0]': 'ほとんどの保険者は、代理人が申込書に含まれていないが、リスク評価に重要な申込者に関する情報を示すための秘密コメント用の別個の書式を提供しています。',
  'chapters[11].sections[3].subsections[2].paragraphs[1]': '申込の特別な状況や、申込書では特定されない特別な問題（医学的、財務的、またはその他の引受人の意思決定を支援する関連情報）を引受人に知らせる保険担当者は、引受プロセスに貴重な貢献をしています。',
  'chapters[11].sections[3].subsections[3].paragraphs[0]': '保険者は、障害所得保険、重大疾病保険、長期介護保険について健康診断/検査を要求する場合があります。保険者が任命した医師がこれらの検査および医学的質問を完成させ、申込者に署名させます。',
  'chapters[11].sections[3].subsections[3].paragraphs[1]': '検査は身長と体重、脈拍、血圧、およびその他の重要な臨床的/医学的所見に関する情報を提供します。',
  'chapters[11].sections[3].subsections[3].paragraphs[2]': '保険者が要求する可能性のあるその他の一般的な検査には以下が含まれます：\n(a) 心電図（ECG）検査\n(b) 胸部X線\n(c) 微量尿検査\n(d) 血液プロファイル分析\n(e) ヒト免疫不全ウイルス（HIV）抗体検査\n(f) 長期介護保険のための認知評価',
  'chapters[11].sections[3].subsections[3].paragraphs[3]': '保険申込時の健康診断の費用は保険者が負担します。ただし、その後保険証券が取得されなかった場合は除きます。',
  'chapters[11].sections[3].subsections[4].paragraphs[0]': 'APSは、主治医が申込者の医療記録に基づいて、申込者に関する個人的な知識に従って記入する標準的な事前印刷書式です。この報告書は通常、引受人が被保険者の病歴をより深く理解する必要がある場合に要求されます。',
  'chapters[11].sections[3].subsections[5].paragraphs[0]': '被保険候補者は、保険者がリスクを分類するための追加情報を収集するために、特別な質問票に記入しなければならない場合があります。これらの書式は通常、病歴、財務情報、特別な危険に関するものです。',
  'chapters[11].sections[3].subsections[5].paragraphs[1]': 'そのような医学的質問票の例としては、血圧、喘息、潰瘍、糖尿病などの状態に関するものがあります。また、純資産や不労（受動的）所得に関する情報を引き出そうとする財務質問票もあります。',

  // Section 5 subsections - Underwriting decisions
  'chapters[11].sections[5].subsections[0].paragraphs[0]': '申込が標準リスクとして引き受けられた場合、料率表またはパンフレットに記載された保険料率に基づいて保険証券が発行されます。保険料が全額支払われると保険証券が発行されます。通常、保険者が受け取る申込の80%〜90%が標準料率で引き受けられます。',
  'chapters[11].sections[5].subsections[1].paragraphs[0]': '標準外リスクとは、医学的または非医学的な障害により保険者にとってより高いリスクとなる者です。保険者は、申込者が申請した補償を修正することにより標準外リスクに対処します。',
  'chapters[11].sections[5].subsections[2].paragraphs[0]': '補償の修正は、除外、追加保険料の賦課、給付の変更、給付支払い期間の短縮、据置期間の延長、またはこれらのアプローチの組み合わせです。\n(i) 特定の除外：除外は、補償から特定の状態や活動を除く手段として使用されます。\n(ii) 追加保険料：リスクが高い場合、標準保険料に追加保険料が課されます。\n(iii) 給付の変更：給付額を減額するか、給付の種類を制限します。',
  'chapters[11].sections[5].subsections[3].paragraphs[0]': '被保険候補者が手術を受けたばかり、または手術を控えている場合があります。このような場合、引受人は通常、所定の期間（例：手術後6か月）申込を保留します。',
  'chapters[11].sections[5].subsections[4].paragraphs[0]': '最も厳しい引受措置は申込の拒否です。この選択は、深刻な医学的理由がある場合、または被保険候補者が特定の保険者の職業的もしくは財務的リスクの受容可能なパラメータの範囲外であることが明らかな場合にのみ使用されます。',
  'chapters[11].sections[5].subsections[4].paragraphs[1]': 'したがって、保険担当者は見込み客に対し、後日健康が悪化または低下した場合に拒否されるリスクを避けるため、健康な時に健康保険に申し込むべきであると伝えることが重要です。',

  // Section 7 subsections - Appendices (forms)
  'chapters[11].sections[7].subsections[0].paragraphs[0]': 'NRIC/パスポート/出生証明書に記載の氏名* 性別：男 女 住所： 電話番号 自宅： 勤務先： 内線： 人種： 国籍： 出生地： *NRIC/パスポート番号 生年月日： 次の誕生日の年齢： 婚姻状況：',
  'chapters[11].sections[7].subsections[1].paragraphs[0]': 'プラン：A B C D E 保険期間：開始 終了 保険料合計：保険料： GST：',
  'chapters[11].sections[7].subsections[2].paragraphs[0]': '*NRIC/パスポート/出生証明書記載の氏名 *NRIC/出生証明書/パスポート番号 性別 生年月日 次の誕生日の年齢 身長(m) 体重(Kg) 職業 申込者との続柄',
  'chapters[11].sections[7].subsections[3].paragraphs[0]': '*該当しないものを削除してください。 月 日 年 郵便番号：',
  'chapters[11].sections[7].subsections[4].paragraphs[0]': '質問3、4、5、6のいずれかの回答が「はい」の場合、以下に詳細を記入してください（質問番号を明記）（スペースが不足する場合は別紙を使用してください）。',
  'chapters[11].sections[7].subsections[6].paragraphs[0]': 'データ保護\nわたくし/わたくしたちは、ABC Life Ltd、その役員、従業員および代表者が、わたくし/わたくしたちに関するすべての情報（個人情報、保険取引の詳細を含む）を、その単独の裁量で開示することに明示的に承認し同意します。',
  'chapters[11].sections[7].subsections[7].paragraphs[0]': 'すべての申込書、保険契約書、保険証券の連絡および通信は電子的に送付されます。ABC Lifeアプリにログインして電子文書の取得および印刷が可能です。',
  'chapters[11].sections[7].subsections[8].paragraphs[0]': 'わたくし/わたくしたちは、重要な事実、すなわちこの申込の評価および引受に影響を与える可能性のある事実を隠匿していないことを宣言し、わたくし/わたくしたちの知識および信念の限りにおいて、ここに記載された情報は真実かつ完全であることを宣言します。',
  'chapters[11].sections[7].subsections[9].paragraphs[0]': '会社名 事業内容 郵便住所： 電話番号： FAX番号： 代理人またはブローカー',
  'chapters[11].sections[7].subsections[10].paragraphs[0]': '(i) 御社の従業員数は何名ですか？ (ii) 全従業員に補償が適用されますか？ はい いいえ (iii) いいえの場合、補償が適用される従業員のクラスを定義してください（例：管理職、エグゼクティブ、事務職）。',
  'chapters[11].sections[7].subsections[11].paragraphs[0]': 'プランA プランB プランC 有効日（当会社による満足な健康引受を条件とします）： その他のオプション',
  'chapters[11].sections[7].subsections[12].paragraphs[0]': 'プランA プランB プランC 年間全体限度額 S$50,000 S$75,000 S$100,000 共同保険 20% 20% 20%',
  'chapters[11].sections[7].subsections[13].paragraphs[0]': 'プランA プランB プランC 年間外来がん治療 S$10,000 S$20,000 S$50,000 年間外来腎臓透析 S$10,000 S$20,000 S$50,000',
  'chapters[11].sections[7].subsections[14].paragraphs[0]': '性別： 職業： 生年月日： 身長(cm)・体重(Kg)： NRIC/パスポート/出生証明書番号： 国籍*： 婚姻状況： 居住国**：\n注：* 外国籍——現在のWork Permit/Employment Passの証明を提出してください。** 居住国がシンガポール以外の場合に記入してください。',
  'chapters[11].sections[7].subsections[15].paragraphs[0]': '1. あなたまたは付保対象の家族が、生命保険、傷害保険、入院保険、疾病保険を拒否、キャンセル、特別条件付きでの発行、または更新を拒否されたことがありますか？\n2. あなたまたは付保対象の家族が、現在他の保険者で生命保険、傷害保険、入院保険、疾病保険に加入していますか、または申込中ですか？',
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
hi.chapters[11].sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('Ch12: ' + done + '/' + total);
