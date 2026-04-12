const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

const t = {
  // Ch14 (index 13) - Financial Needs Analysis
  'chapters[13].sections[2].subsections[0].paragraphs[0]': 'ファクトファインド文書の形式は保険者によって異なる場合があることにご留意ください。',
  'chapters[13].sections[2].subsections[0].paragraphs[1]': 'ファクトファインド文書の各セクションは異なる目的を果たしています。\n(a) 顧客への重要な通知：このセクションは、ファイナンシャルアドバイザーの役割と保険商品に関する一般的な情報を提供します。\n(b) 個人情報：顧客の個人的な詳細——氏名、年齢、性別、婚姻状況、住所、連絡先を収集します。\n(c) 扶養家族の情報：配偶者、子、およびその他の扶養家族の詳細を収集します。\n(d) 雇用情報：顧客の職業、雇用主、所得の詳細を記録します。\n(e) 財務情報：資産、負債、月間の収入と支出を記録します。\n(f) 既存の保険：顧客が現在保有するすべての保険証券の詳細を記録します。\n(g) 保険のニーズと優先順位：顧客の保険ニーズと優先順位を特定します。',
  'chapters[13].sections[2].subsections[0].paragraphs[2]': 'ファクトファインド文書の記入が完了したら、次のステップに進み、見込み客のニーズの特定と定量化を支援します。',

  'chapters[13].sections[3].subsections[0].paragraphs[0]': 'ファクトファインド段階で収集した情報の分析から始めます。分析を進める際に、以下の質問を自問すべきです：\n▪ 見込み客が健康保険を必要としているか？\n▪ 必要な場合、どの種類の健康保険が適しているか？\n▪ どの程度の補償が必要か？\n▪ 見込み客はそれを支払う余裕があるか？',
  'chapters[13].sections[3].subsections[1].paragraphs[0]': '緊急資金は、家計の稼ぎ手の失業や、所得の流れを中断する短期的な障害に備えるのに有用です。',
  'chapters[13].sections[3].subsections[1].paragraphs[1]': '見込み客に緊急資金がない場合、あなたから購入する保険証券の保険料を支払う能力に影響する可能性があります。',
  'chapters[13].sections[3].subsections[2].paragraphs[0]': '雇用の詳細については、この章のセクション3.3(d)の情報を参照してください。',
  'chapters[13].sections[3].subsections[3].paragraphs[0]': 'ほとんどの人は以下の人生の段階を経ます：\n(a) 子供時代\n(b) 社会人1年目/若い未婚者\n(c) 若い既婚者/若い子供を持つ既婚者\n(d) 子供が成長した壮年期\n(e) 退職前\n(f) 退職後',
  'chapters[13].sections[3].subsections[3].paragraphs[1]': '就業中は、傷害や長期的な疾病から生じる障害に対して稼得能力を保護することが極めて重要です。',
  'chapters[13].sections[3].subsections[3].paragraphs[2]': '健康不良に対する保護のニーズは、人生のどの段階にいる人にも当てはまります。高齢者にとっては、重大疾病保険および長期介護保険のニーズがより大きくなります。',
  'chapters[13].sections[3].subsections[4].paragraphs[0]': '見込み客に扶養家族がいる場合、扶養家族のいずれかが病気になったり入院したりした場合の経済的負担を避けるため、扶養家族の医療費についても備えるべきです。',
  'chapters[13].sections[3].subsections[5].paragraphs[0]': '見込み客とその扶養家族が生命保険および健康保険に加入している場合、既存の保険証券の給付と現在のニーズを比較し、不足がないか確認する必要があります。',
  'chapters[13].sections[3].subsections[6].paragraphs[0]': 'ファクトファインドの情報により、見込み客が健康保険を必要としているかどうか、また必要な場合にそれを支払う余裕があるかどうかを判断できます。',
  'chapters[13].sections[3].subsections[7].paragraphs[0]': 'ニーズの定量化は義務ではありませんが、業界の「ベストプラクティス」です。',
  'chapters[13].sections[3].subsections[8].paragraphs[0]': '障害所得保護ニーズは維持費用としても知られています。これは見込み客とその家族の継続的な維持に必要な金額です。',
  'chapters[13].sections[3].subsections[8].paragraphs[1]': 'これを定量化する一般的な3つの方法があります。\n方法1：月給を使用し、その75%が所得保護ニーズです。\n方法2：月間支出に基づいて計算します。\n方法3：既存の補償を差し引いた純ニーズを計算します。',
  'chapters[13].sections[3].subsections[8].paragraphs[2]': '維持費用の決定方法を学んだので、次に医療費用の決定方法を学びましょう。',
  'chapters[13].sections[3].subsections[9].paragraphs[0]': '医療費用とは、見込み客が入院する原因となった傷害や疾病に関連する即時の入院・医療費を指します。',
  'chapters[13].sections[3].subsections[9].paragraphs[1]': '医療費のニーズを定量化するために、見込み客と以下について話し合うことが重要です：\n(a) 顧客が選択する病院の種類と病棟\n(b) 現在の医療保険の補償レベル\n(c) 自己負担を希望する金額',
  'chapters[13].sections[3].subsections[9].paragraphs[2]': '特定の医療処置の費用を顧客が知ることも有益です。料金ベンチマークのデータは保健省（MOH）のウェブサイトで入手できます。',
  'chapters[13].sections[3].subsections[10].paragraphs[0]': '必要な入院日額保険の金額の計算方法は以下のとおりです：\n月間総支出 S$X\n控除：既存の入院日額給付（月額）\n不足額 = 必要な入院日額保険の金額',
  'chapters[13].sections[3].subsections[11].paragraphs[0]': '入院費用と障害所得の補償に加えて、見込み客は重大疾病から回復するためのリハビリテーション費用の一時金を希望する場合もあります。',
  'chapters[13].sections[3].subsections[11].paragraphs[1]': '計算は多くの不確実性があるため、科学よりも技術に近いです。見込み客にとって考慮すべき要因には以下が含まれます：\n(a) 必要な治療の種類と費用\n(b) 回復期間\n(c) 生活様式の変更の必要性',
  'chapters[13].sections[3].subsections[11].paragraphs[2]': '必要なCI保険補償について合意に達した後、既存の補償を差し引くことにより補償の不足額を計算できます。',
  'chapters[13].sections[3].subsections[11].paragraphs[3]': '見込み客の健康保険ニーズがどのように定量化されるかを見たので、次に最も適切な商品を推奨する方法に進みます。',

  'chapters[13].sections[4].subsections[0].paragraphs[0]': '保険担当者が商品が見込み客に適切かどうかを判断するためには、保険者が提供する商品を十分に理解している必要があります。',
  'chapters[13].sections[4].subsections[1].paragraphs[0]': '保険担当者は、自社商品の以下の側面に精通しているべきです：\n(a) 商品の範囲は何か？\n(b) 各商品は何を補償するか？\n(c) 給付と限度額は何か？\n(d) 免責事項は何か？\n(e) 保険料はいくらか？',
  'chapters[13].sections[4].subsections[2].paragraphs[0]': '手頃さは、見込み客に推奨する最も適切な商品を選択する際に重要です。ほとんどの保険証券は、保険証券を有効に維持するために定期的な保険料の支払いを必要とします。',
  'chapters[13].sections[4].subsections[3].paragraphs[0]': '見込み客に最も適切な保険証券を決定する際、この章で検討したすべての要因を考慮する必要があります。',

  // Ch15 (index 14) - Case Studies
  'chapters[14].sections[0].subsections[0].paragraphs[0]': '維持費用に最も適した保険証券は障害所得保険です。',
  'chapters[14].sections[0].subsections[0].paragraphs[1]': 'Tommyは障害所得保険証券を持っていません。ファクトファインド文書で、所得喪失に対する補償が緊急に必要であると記載しています。',
  'chapters[14].sections[0].subsections[0].paragraphs[2]': 'そこでAngelaは、Tommyの月給の75%（すなわちS$4,500）の給付と年率5%のエスカレーション給付を持つ障害所得保険証券を提案します。',
  'chapters[14].sections[0].subsections[0].paragraphs[3]': 'Tang夫人の障害時に必要なTPD補償額は以下のとおりです：\nTang夫人の障害時に必要な維持費用\n必要な年間所得 × 受給年数 = 必要な総額',
  'chapters[14].sections[0].subsections[0].paragraphs[4]': 'Tang家の維持費用を決定した後、AngelaはTang家の現在の医療費保険証券が十分であるかどうかを判断します。',
  'chapters[14].sections[0].subsections[1].paragraphs[0]': '医療費を賄うために使用できる保険証券は以下のとおりです：\n(a) 医療費保険\n(b) マネージドヘルスケア保険\n(c) 長期介護保険\n(d) 重大疾病保険\n(e) 入院日額保険',
  'chapters[14].sections[0].subsections[1].paragraphs[1]': 'ファクトファインドの結果によると、Tommyは雇用主の保険の下でのみ医療費保険の補償を持っています。Angelaは、団体保険の補償は転職時に終了することをTommyに伝えました。',
  'chapters[14].sections[0].subsections[1].paragraphs[2]': 'Angelaは適切な医療費保険を推奨するために以下を確認しました：\n(a) 入院時の希望する滞在先の確認\n(b) 現在のMediShield Life補償の確認\n(c) 統合シールドプランのオプションの確認',
  'chapters[14].sections[0].subsections[1].paragraphs[3]': 'Tommyとの手頃さについての議論は、現在だけでなく、MediSaveまたは現金で保険料を将来的に持続的に支払えるかどうかについても行うべきです。',
  'chapters[14].sections[0].subsections[1].paragraphs[4]': 'Tang家は重大疾病保険の補償も必要です。重大疾病が発生した場合の医療費は、医療費保険では全額補償されない可能性があるためです。',
  'chapters[14].sections[0].subsections[1].paragraphs[5]': 'Tang家は既に早すぎる死亡に対する保護の保険証券を有しているため、Angelaは生命保険証券にライダーとして付帯する100%前払給付型の重大疾病保険を提案しました。',
  'chapters[14].sections[0].subsections[1].paragraphs[6]': '現金での支払保険料合計はS$695.50（S$505.50 + S$190.00）となり、TommyのS$700の予算内です。',
  'chapters[14].sections[0].subsections[1].paragraphs[7]': 'Tommyに適した保険証券の種類を決定した後、Angelaはファクトファインド文書の「担当者の推奨」セクションの記入に進みます。',
  'chapters[14].sections[0].subsections[1].paragraphs[8]': '顧客に推奨する保険パッケージを確定した後、Angelaは顧客との面談を手配し、パッケージを提示します。',
  'chapters[14].sections[0].subsections[1].paragraphs[9]': 'このケーススタディは、他の可能な推奨の中の1つのセットを示しています。結果として、一部の妥当な提案は議論されていません。',
  'chapters[14].sections[0].subsections[1].paragraphs[10]': '保険担当者として、「Your Guide To Health Insurance」および「Evaluating My Health Insurance Coverage」についても認識しておくべきです。',
  'chapters[14].sections[0].subsections[1].paragraphs[11]': 'これらの文書を見込み客に紹介し、話し合うべきです。\n3. ケーススタディ2 — 団体健康保険',
  'chapters[14].sections[0].subsections[1].paragraphs[12]': '次に、見込み客の団体健康保険のニーズに焦点を当てた別のケーススタディを見てみましょう。Apex Services Company Private Limitedは従業員の福利厚生として団体健康保険の購入を検討しています。',
  'chapters[14].sections[0].subsections[1].paragraphs[13]': '先に進む前に、会社（すなわち見込み客）が保険者の引受要件（グループの規模やその他の適格基準）を満たしているかどうかを確認する必要があります。',
  'chapters[14].sections[0].subsections[1].paragraphs[14]': '見込み客が団体補償の適格性を確立したら、見込み客に利用可能なさまざまなプランとオプションを説明します。',
  'chapters[14].sections[0].subsections[1].paragraphs[15]': 'さらに、各カテゴリーの従業員の保険金額を決定するのを支援する必要があります。',
  'chapters[14].sections[0].subsections[1].paragraphs[16]': '最初の方法は、従業員の役職に基づくため管理が容易です。ただし、従業員の勤続年数や個人的な貢献は考慮されません。',
  'chapters[14].sections[0].subsections[1].paragraphs[17]': '例えば、エグゼクティブとして入社した新しいスタッフは、2年間勤務した者と同じ給付を受けます。',
  'chapters[14].sections[0].subsections[1].paragraphs[18]': 'このケースでは、見込み客は会社がランキング方式を好むと述べています。与えられた予算に基づいて、適切なプランを推奨します。',
  'chapters[14].sections[0].subsections[1].paragraphs[19]': '団体定期生命保険証券にライダーとして50%前払重大疾病保険を付帯することで、見込み客が従業員に追加の福利厚生を提供するのに役立ちます。',
  'chapters[14].sections[0].subsections[1].paragraphs[20]': '団体入院・手術保険証券については、以下のようにランキング方式で計画することもできます：\nカテゴリー / プラン\n上級管理職 / プランA\n管理職 / プランB\n一般従業員 / プランC',
  'chapters[14].sections[0].subsections[1].paragraphs[21]': '次に、会社の過去3年間の請求履歴と、発生したがまだ報告されていない請求の見込みリストを取得します。請求履歴は、更新保険料の算定に非常に重要です。',
  'chapters[14].sections[0].subsections[1].paragraphs[22]': 'また、見込み客がGIFFフォームに正式に記入し署名しなければならないことにご留意ください。このフォームにはあなたも署名することが重要です。',
  'chapters[14].sections[0].subsections[1].paragraphs[23]': '見積書には、補償範囲、引受ガイドライン、保険料、免責事項、待機期間等が含まれます。見込み客に提示する前にこれらを確認する必要があります。',
  'chapters[14].sections[0].subsections[1].paragraphs[24]': '見込み客が見積書を受諾したら、必要に応じて申込書と健康申告書の記入を支援し、保険者に提出する必要があります。',
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

// Final verification
let grandTotal = 0, grandDone = 0;
hi.chapters.forEach(ch => {
  let total = 0, done = 0;
  ch.sections.forEach(s => {
    s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
    if (s.subsections) s.subsections.forEach(sub => {
      sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
    });
  });
  grandTotal += total; grandDone += done;
  console.log(ch.id + ': ' + done + '/' + total + (done === total ? ' ✓' : ' ✗'));
});
console.log('\nTotal: ' + grandDone + '/' + grandTotal + ' (' + (grandDone/grandTotal*100).toFixed(1) + '%)');
