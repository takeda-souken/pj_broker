const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('./data/textbook-hi.json', 'utf8'));

hi.chapters[5].titleJP = '重大疾病保険';

const translations = {
  'chapters[5].sections[0].paragraphs[0]': '重大疾病保険が最初に開発されたとき、初期の商品は四大疾病保険（Dread Disease Insurance）として知られ、がん、脳卒中、心臓発作、冠動脈バイパス手術の4つの主要な健康状態を補償していました。その後、補償範囲はより多くの疾病に拡大されました。',

  'chapters[5].sections[1].paragraphs[0]': '重大疾病（四大疾病としても知られる）保険は、被保険者が保険証券に記載された重大疾病の1つに罹患していると診断された場合に、保険契約者に一時金を提供します。この給付は被保険者の診断時に支払われ、被保険者の回復を待つ必要はありません。',
  'chapters[5].sections[1].paragraphs[1]': '重大疾病保険証券から受け取る給付は、治療費、療養費、医療用具、所得の喪失の補填、またはライフスタイルの変更のための資金として使用できます。',
  'chapters[5].sections[1].paragraphs[2]': '重大疾病（CI）保険証券は、スタンドアローンの保険証券（個人または団体ベース）として、または終身保険、養老保険、定期保険、投資連動型保険証券（ILP）のオプションのライダーとして販売できます。',
  'chapters[5].sections[1].paragraphs[3]': 'CIフレームワークは、消費者と保険会社の双方の利益のバランスを取ることを目指しています。核心的な重大疾病給付について明確で一貫性のある補償を提供することで、商品の比較が容易になり、消費者により良い透明性を提供します。',
  'chapters[5].sections[1].paragraphs[4]': 'シンガポール金融管理庁（MAS）との協議のもと設立され、Life Insurance Association（LIA）およびGeneral Insurance Association（GIA）の会員企業は、保険契約者にシンプルかつ包括的な保護を提供することを目的としたフレームワークの遵守を約束しています。',
  'chapters[5].sections[1].paragraphs[5]': '2003年以降、業界は保険者が保険契約者への一貫性を確保するために採用する、37の重度段階の重大疾病の標準化された定義リストを策定しました。その後のレビューは2014年および2019年に実施されました。',
  'chapters[5].sections[1].paragraphs[6]': '2014年以降、保険者はCIプランの下で単一疾病CIプランを含む任意の数の疾病を提供できるようになりました。保険者が提供できる疾病進行の段階数に制限はありませんでした。',
  'chapters[5].sections[1].paragraphs[7]': '2019年のレビューでは、標準化された定義が一部の名称変更を伴い更新されました。LIAは37の疾病の定義リストを維持し、これらの共通定義は各疾病の最も重度の段階を説明しています。',
  'chapters[5].sections[1].paragraphs[8]': 'LIAのリストに含まれる疾病を補償することを選択した保険者は、重度段階のその疾病についてLIAの共通定義を採用しなければなりません。ただし、これらの疾病について、保険者は早期段階など他の段階の疾病進行について独自の定義を使用する自由があります。',
  'chapters[5].sections[1].paragraphs[9]': 'LIAのリストに含まれない疾病については、保険者はすべての段階の疾病進行について独自の定義を使用します。',
  'chapters[5].sections[1].paragraphs[10]': '業界は3年に1度、LIAの共通定義の継続的な妥当性をレビューします。',
  'chapters[5].sections[1].paragraphs[11]': 'その目的は、補償の意図の明確性を高め、顧客が何が補償され何が補償されないかを誤解しないようにすることです。',
  'chapters[5].sections[1].paragraphs[12]': '2020年8月26日以降、バージョン2014の定義を使用するCI商品はシンガポールで販売できません。2020年8月26日以降に購入されたCI保険証券には2019年のCI定義が適用されます。',
  'chapters[5].sections[1].paragraphs[13]': 'それ以前に発行された重大疾病保険証券は、新しい定義の影響を受けません。',
  'chapters[5].sections[1].paragraphs[14]': 'ファイナンシャルアドバイザーは、CIが定義を満たす場合にのみ保険証券で補償されることを顧客に強調する必要があります。',
  'chapters[5].sections[1].paragraphs[15]': '付録6Aは、LIAウェブサイト（www.lia.org.sg）から抽出した37の重大疾病の重度段階の標準定義：バージョン2019を示しています。',
  'chapters[5].sections[1].paragraphs[16]': '重大疾病フレームワーク2019に基づく37の重大疾病の標準リストの変更一覧はAnnex 1に示されています。\n1 https://www.lia.org.sg/industry-guidelines/health-insurance/critical-illness/',
  'chapters[5].sections[1].paragraphs[17]': '2022年11月16日から、CIフレームワークに以下のさらなる更新が行われました：\n(a) 保険者はすべての保険証券で適切な待機期間を独自に決定できます。待機期間とは、保険証券に記載された、補償が開始される前に経過しなければならない期間です。\n(b) 保険者は被保険者の既存の病態を含め、適格な請求に対して支払いを行うため、待機期間を設定します。',
  'chapters[5].sections[1].paragraphs[18]': '各保険者は待機期間条項に関する独自の文言を採用する自由がありますが、待機期間は補償開始日または復活日から開始し、「診断日」は保険者が独自に定義できます。',
  'chapters[5].sections[1].paragraphs[19]': 'CIフレームワークの範囲内にあるものは以下のとおりです：\n(a) 新規の個人保険証券または給付\n(b) 新規の団体保険証券または更新（保険年度中の新規CI補償を含む）\n(c) 他の保険証券にパッケージまたは付帯されたCI給付',
  'chapters[5].sections[1].paragraphs[20]': 'CIフレームワークの範囲外にあるものは以下のとおりです：\n(a) その全範囲でLIAリストのCI疾病のいずれも補償しない男性向け、女性向け、または子供向けのCI商品。例えば、がんのみを補償する女性向けCI商品。',
  'chapters[5].sections[1].paragraphs[21]': 'ただし、上記は保険者がLIAの37の重大疾病の標準リストを超えて、より多くの疾病や疾病進行の段階に補償を拡張して商品をカスタマイズすることを妨げるものではありません。',
  'chapters[5].sections[1].paragraphs[22]': '保険者は単一疾病型プランを含め、CIプランの下で任意の数の疾病を補償することを選択できます。各疾病について、「LIAの共通定義の採用」に従い、保険者は任意の数の疾病進行段階を提供できます。',

  'chapters[5].sections[2].subsections[0].paragraphs[0]': '一般的な適格基準は以下のとおりです：\n(a) 保険証券が有効であること\n(b) 被保険者がCI保険補償の満期年齢に達していないこと（該当する場合）\n(c) 重大疾病の定義を満たしていること',
  'chapters[5].sections[2].subsections[1].paragraphs[0]': 'CI保険には2種類の補償がありますが、それぞれ以下のような共通の特徴を持っています：\n(a) 付保された重大疾病の診断時に一時金が支払われます\n(b) 保険期間中に1回のCI請求のみが認められます（マルチペイCIプランを除く）',
  'chapters[5].sections[2].subsections[2].paragraphs[0]': '保険市場で提供されるCI保険の補償には2つの主要な種類があります：\n(a) 前払給付（Acceleration Benefit）\n(b) 追加給付（Additional Benefit）',
  'chapters[5].sections[2].subsections[2].paragraphs[1]': '一部の保険者は重症度ベースおよびマルチペイCI保険プランも導入しています。それぞれの仕組みを見ていきましょう。',
  'chapters[5].sections[2].subsections[3].paragraphs[0]': '前払給付は、付帯された基本保険証券の保険金額の一部（例：50%）または全額（100%）の前払いを提供するために、パッケージ保険証券またはライダーとして発行できます。',
  'chapters[5].sections[2].subsections[3].paragraphs[1]': '図6.1は1回のCI請求のみを支払う保険証券の例を示しています。別の重大疾病に罹患しても、保険証券は残りの保険金額を支払いません。',
  'chapters[5].sections[2].subsections[3].paragraphs[2]': '上記の例で50%ではなく100%の前払給付を選択した場合、重大疾病に罹患したか死亡したかにかかわらず、基本保険金額の全額にボーナス（ある場合）が加算されて支払われます。',
  'chapters[5].sections[2].subsections[3].paragraphs[3]': '100%未満の前払を選択した保険契約者は、残額の保険金額に対する将来の保険料が免除されるよう、CI保険料免除ライダーを付帯することを検討できます。',
  'chapters[5].sections[2].subsections[3].paragraphs[4]': 'この種のCI保険証券の補償期間は、付帯またはパッケージされた生命保険証券の種類に応じて、100歳まで、または終身となる場合があります。',
  'chapters[5].sections[2].subsections[3].paragraphs[5]': 'CI保険補償の期間に影響するもう1つの要因は、付帯された保険証券が解約返戻金を取得するかどうかです。',
  'chapters[5].sections[2].subsections[3].paragraphs[6]': '要約すると、前払給付型CI保険証券またはライダーは、以下のいずれかの事象が先に発生するかに応じて、被保険者に補償を提供します。',

  'chapters[5].sections[2].subsections[4].paragraphs[0]': 'この種の補償はスタンドアローンベースまたはライダーとして利用可能です。\n▪ スタンドアローンベースでは、付保された重大疾病の診断時に保険金額が支払われ、保険証券は終了します。\n▪ ライダーとして発行された場合、CI給付は基本保険証券の保険金額に加えて支払われます。',
  'chapters[5].sections[2].subsections[4].paragraphs[1]': '図6.2から、CI保険給付の支払いは基本保険金額に影響しないことに注目してください。重大疾病に罹患し、その後死亡した場合、保険者が支払う総額はCI給付と基本保険証券の保険金額の合計です。',
  'chapters[5].sections[2].subsections[4].paragraphs[2]': 'この種のCI保険ライダーの期間は、基本保険証券より短くすることはできますが、長くすることはできません。通常、このライダーは被保険者が所定の年齢（通常65歳または70歳）に達したときに満了します。',
  'chapters[5].sections[2].subsections[4].paragraphs[3]': '顧客は、基本保険証券の保険料の支払いについて心配しなくて済むよう、CI保険料免除ライダーの付帯を検討できます。',
  'chapters[5].sections[2].subsections[4].paragraphs[4]': '表6.1は、CI保険の前払給付型と追加給付型の違いの要約です。',

  'chapters[5].sections[3].paragraphs[0]': '重大疾病保険商品が提供する補償は、補償される重大疾病の数から重大疾病の種類および/または段階まで多岐にわたります。',
  'chapters[5].sections[3].paragraphs[1]': '従来のCI保険証券は、重度（末期）段階の重大疾病のみを補償します。例えば、被保険者はステージ4の大腸がんと診断された場合には給付を受けますが、ステージ1では受けません。',
  'chapters[5].sections[3].paragraphs[2]': '重症度ベースの重大疾病プランは、被保険者が重大疾病の早期段階または中間段階で診断された場合に給付を提供します。医療および技術の進歩により、早期発見が可能になりました。',
  'chapters[5].sections[3].paragraphs[3]': '重大疾病（CI）補償について助言するファイナンシャルアドバイザーは、顧客に以下を強調すべきです：\n(a) 購入したプランの種類\n(b) 補償範囲と免責事項\n(c) CIの補償——補償される疾病の数と範囲\n(d) 待機期間と生存期間',

  'chapters[5].sections[3].subsections[0].paragraphs[0]': '疾病のより早い段階で支払うCI保険は、一般にアーリーペイCIとして知られています。給付は早期から中間、重度まで、疾病のさまざまな段階で請求可能です。',
  'chapters[5].sections[3].subsections[0].paragraphs[1]': '重大疾病の段階と重症度に応じて、プランは保険金額の一定割合を一時金として保険契約者に支払います。',
  'chapters[5].sections[3].subsections[0].paragraphs[2]': '重症度ベースのCIプランにも待機期間と生存期間が適用される場合があります。',
  'chapters[5].sections[3].subsections[0].paragraphs[3]': '重症度ベースのCIプランは、重大疾病の早期治療のための財政支援を懸念する者にとって魅力的な場合があります。定期プランとして購入するか、既存の保険証券のライダーとして付帯できます。',
  'chapters[5].sections[3].subsections[1].paragraphs[0]': '重症度ベースの補償は、従来の重大疾病補償のハイブリッド（混合型）と見なすことができます。',
  'chapters[5].sections[3].subsections[1].paragraphs[1]': '被保険者が補償対象のCIと診断された場合に保険金額の100%を受け取るか何も受け取らないかの従来の補償とは異なり、重症度ベースの重大疾病保険は疾病の段階に応じて保険金額の一定割合を支払います。',
  'chapters[5].sections[3].subsections[1].paragraphs[2]': '重症度ベースの重大疾病保険の利点は以下のとおりです：\n(a) より多くの疾病を補償——被保険者はより多くの重大疾病について補償されます。それほど重度でない形態のがんもカバーされます\n(b) 疾病の早期段階での保険金支払い\n(c) 複数回の保険金支払いの可能性',
  'chapters[5].sections[3].subsections[2].paragraphs[0]': 'アーリーペイCIプランは、重度CIプランよりも高額です。',
  'chapters[5].sections[3].subsections[2].paragraphs[1]': 'このような保険証券は被保険者が複数の疾病について請求することを認めますが、保険証券に基づいて請求できる最大額があり、行われた請求は保険金額から控除されます。',
  'chapters[5].sections[3].subsections[3].paragraphs[0]': 'マルチペイ重大疾病プランは、重大疾病の各診断ごとに、また重大疾病の再発または再燃に対して被保険者に複数回支払います（適用される待機期間が条件）。',
  'chapters[5].sections[3].subsections[3].paragraphs[1]': 'この種のCI保険プランでは、保険証券に基づく複数回の重大疾病請求が認められます。疾病の状態が悪化した場合、または異なる疾病が診断された場合に、2回目以降の請求が認められます。',
  'chapters[5].sections[3].subsections[3].paragraphs[2]': 'このような複数回の請求は、重度段階のCIに限定されません。CIプランに重症度ベースのCIの給付が含まれる場合、保険者は給付の上限および条件に従い、CIの早期段階での複数回の請求を認める場合があります。',
  'chapters[5].sections[3].subsections[3].paragraphs[3]': 'このようなプランには待機期間および生存期間が適用される場合があります。',
  'chapters[5].sections[3].subsections[3].paragraphs[4]': '進行段階CIの初回請求の診断時に、将来の保険料が免除される場合があります。',
  'chapters[5].sections[3].subsections[4].paragraphs[0]': '精神疾患の増加により、従来保険者が除外してきた精神的状態の補償を提供する商品イノベーションの新たな機会が生まれています。',
  'chapters[5].sections[3].subsections[4].paragraphs[1]': '精神疾患補償の給付は、被保険者1人あたりの最大給付に制限されます。待機期間および生存期間が適用される場合があります。',
  'chapters[5].sections[3].subsections[5].paragraphs[0]': '糖尿病と診断され、新しいライフスタイルに適応しなければならないことは、大変な経験になる可能性があります。保険者は糖尿病患者の治療費の負担を軽減する補償を設計しています。',
  'chapters[5].sections[3].subsections[5].paragraphs[1]': '糖尿病を補償する保険は、慢性疾病である糖尿病の診断時、糖尿病の合併症、または糖尿病関連の重大疾病に対して一時金を提供します。',
  'chapters[5].sections[3].subsections[5].paragraphs[2]': 'このような補償には待機期間および生存期間が適用される場合があります。',
  'chapters[5].sections[3].subsections[6].paragraphs[0]': '保険者が進行段階、重症度段階、マルチペイCI補償に糖尿病および精神疾患を含めた組み合わせを1つのCIプランで提供することは一般的です。特定の疾病段階に対する給付に上限が課される場合があることにご留意ください。',

  'chapters[5].sections[4].subsections[0].paragraphs[0]': '引受要件は基本的に生命保険証券と同じであり、申込書（通常は生命保険と同じもの）の記入と被保険者が引受に必要な医療検査を受けることです。',
  'chapters[5].sections[4].subsections[1].paragraphs[0]': '引受上の考慮事項は生命保険証券と類似しており、本スタディテキストの後の章でより詳細に説明します。',
  'chapters[5].sections[4].subsections[1].paragraphs[1]': '通常、CI保険については標準リスクおよび中程度の付加料率までの標準外リスクのみが検討されます。高い超過死亡率を有するリスクおよび生命保険を謝絶されたリスクは、CI保険の候補とはみなされません。',
  'chapters[5].sections[4].subsections[1].paragraphs[2]': '一般に、引受条件は本スタディテキストの後の章で議論されるものと同じですが、保険者は被保険者が罹患しやすい補償対象の重大疾病を具体的に除外する場合があります。',

  'chapters[5].sections[5].paragraphs[0]': '補償 5',
  'chapters[5].sections[5].paragraphs[1]': '重大疾病（CI）保険は、被保険者が重大疾病と診断された場合に給付を提供します。すべてのCI保険証券が同じ範囲の疾病を補償するわけではないことにご留意ください。',
  'chapters[5].sections[5].paragraphs[2]': '従来のCI保険証券は、被保険者が重大疾病と診断された場合に一時金を提供します。通常、疾病が重度段階（例：ステージIVのがん）にある場合にのみ支払います。',
  'chapters[5].sections[5].paragraphs[3]': 'したがって、適切な程度の財政支援を提供するCIプランを選択することが重要です。CI補償の十分性を判断する際に考慮すべき要因があります：\n▪ 最低4年分の所得\n▪ 追加費用（ケア費用）\n▪ 扶養家族の年齢',
  'chapters[5].sections[5].subsections[0].paragraphs[0]': '経験則として、被保険者の所得の少なくとも4年分のCI補償を持つことが推奨されます。ただし、被保険者の扶養家族の年齢を考慮する必要があります。',
  'chapters[5].sections[5].subsections[0].paragraphs[1]': 'すべての負債やその他の債務を考慮した後、純補償額は被保険者の4年間の生活水準を支えるのに十分であるべきです。',
  'chapters[5].sections[5].subsections[0].paragraphs[2]': '生命保険は死亡給付補償であるため、生命保険だけに頼ることはできません。被保険者が重大疾病に罹患している場合でも生活費が必要であるため、CI保険のような生存給付補償が必要です。',
  'chapters[5].sections[5].subsections[1].paragraphs[0]': '重大疾病の診断後、被保険者は看護師の雇用、家事手伝いの雇用などの費用を負担する必要がある場合があります。これらの追加費用を考慮に入れなければなりません。',
  'chapters[5].sections[5].subsections[1].paragraphs[1]': '適切な医療ケアへのアクセスにより、被保険者は早期段階で回復する可能性があります。したがって、早期段階CIプランがこの点で最も有用です。',
  'chapters[5].sections[5].subsections[1].paragraphs[2]': 'CI保険は、入院・手術保険の下で除外される治療やケアをカバーする給付により、被保険者の既存の入院・手術保険の補償を補完します。',
  'chapters[5].sections[5].subsections[2].paragraphs[0]': '前述のとおり、生命保険証券は死亡給付のみを提供します。生存給付も同様に重要です。被保険者が重大疾病に罹患している場合、働くことはできませんが、請求書の支払いは必要です。ここでCI保険が役立ちます。',
  'chapters[5].sections[5].subsections[2].paragraphs[1]': '被保険者の扶養家族のニーズも考慮することが重要です。子供が幼い場合、子供が独立するまでの補償を確保すべきです。',
  'chapters[5].sections[5].subsections[2].paragraphs[2]': '被保険者の扶養家族が既に経済的に自立している場合、被保険者はより少ない補償で済む場合があります。このような事項についてはファイナンシャルコンサルタントの助言を求めることが最善です。',

  'chapters[5].sections[6].paragraphs[0]': 'CI保険証券に見られる一般的な免責事項は以下のとおりです：\n(a) 既存の疾病\n(b) 正気であれ心神喪失であれ、自傷行為\n(c) 薬物および/またはアルコールの故意の乱用\n(d) 先天性異常\n(e) 戦争、暴動、テロ行為\n(f) HIV/AIDS',
  'chapters[5].sections[6].paragraphs[1]': '被保険者が上記のいずれかの原因によりCI保険証券の下で補償される重大疾病の1つに罹患した場合、保険者は請求を支払う義務はありません。免責事項は保険者によって異なる場合があることにご留意ください。',

  'chapters[5].sections[7].paragraphs[0]': 'CI保険補償は、以下のいずれかの事象が発生した場合に終了します：\n(a) 有効なCI請求が行われた場合（通常の場合。保険証券にマルチペイの規定がある場合を除く）\n(b) 被保険者が死亡した場合\n(c) 保険証券がCI補償の満期年齢に達した場合\n(d) 保険証券が失効した場合',

  'chapters[5].sections[8].paragraphs[0]': '請求が発生した場合、請求者は以下の裏付け書類を提出しなければなりません：\n(a) 保険契約者と被保険者が異なる場合に両者が記入する請求者の陳述書\n(b) 主治医が記入する医師の陳述書\n(c) 保険者が必要と判断するその他の関連書類',
  'chapters[5].sections[8].paragraphs[1]': 'これらは基本的な要件です。ただし、保険者は適切と判断するその他の関連する裏付け情報および書類を要求する権利を留保します。',
  'chapters[5].sections[8].paragraphs[2]': '通常、保険者は以下を要求します：\n(a) 保険証券の下で補償される重大疾病の診断または手術の実施から所定の期間内に提出される請求の書面による通知\n(b) 被保険者を全面的に調査するための同意書',

  'chapters[5].sections[9].paragraphs[0]': '団体CI保険はパッケージ保険証券またはライダーとして発行できます。団体CI保険の補償は個人CI保険と類似しており、前払給付または追加給付の形態をとることができます。',
  'chapters[5].sections[9].subsections[0].paragraphs[0]': '輸血に起因する場合、以下のすべての条件が満たされることを条件とします：\n▪ 輸血が医学的に必要であったか、医療処置の一環として行われたこと\n▪ 輸血がシンガポールで受けられたこと',
  'chapters[5].sections[9].subsections[1].paragraphs[0]': '本補足契約の発行日、裏書日、または復活日のいずれか遅い日以降に発生した事故で、被保険者が通常の職業活動を遂行している際に発生したもの。',
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

const ch = hi.chapters[5];
let total = 0, done = 0;
ch.sections.forEach(s => {
  s.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  if (s.subsections) s.subsections.forEach(sub => {
    sub.paragraphs.forEach(p => { total++; if (p.textJP && p.textJP.trim()) done++; });
  });
});
console.log('HI Ch6: ' + done + '/' + total + ' translated');
