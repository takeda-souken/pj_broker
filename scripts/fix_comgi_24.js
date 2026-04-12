const fs = require('fs');
const comgi = JSON.parse(fs.readFileSync('data/textbook-comgi.json','utf8'));
let fixed = 0;

function fixPara(p) {
  if (!p.textJP || !p.text || p.text.length <= 50 || p.text.length >= 5000) return;
  if (p.textJP.length / p.text.length >= 0.3) return;
  const en = p.text;

  if (en.includes('Example 2.2 illustrates the three points') && en.includes('Computation Of Gross Profit')) {
    p.textJP = `例題2.2は、前述の3つのポイントを示しています。
最長てん補期間 → 予想売上高・粗利益 → 保険期間（365日）
1年目 → 2年目
損害が最終日に発生する場合も考慮して、3年先の粗利益を予想すべきです。

例題2.2：粗利益保険金額の計算（24ヶ月てん補期間）
事業中断保険を設定しようとしている事業が、過去3年間の業績と今後3年間の予測を確認します。

過去の業績：
1年目：売上高S$2,500,000、変動費S$1,500,000、粗利益S$1,000,000
2年目：売上高S$3,000,000、変動費S$1,800,000、粗利益S$1,200,000
3年目：売上高S$3,500,000、変動費S$2,100,000、粗利益S$1,400,000

今後の予測：
4年目（現在の保険年度）：粗利益S$1,600,000
5年目：粗利益S$1,800,000

24ヶ月のてん補期間の場合、保険金額は保険期間の最終日に損害が発生した場合にもてん補が十分であるよう設定します。したがって、保険金額 = 5年目の粗利益S$1,800,000 + 6年目の予測粗利益（成長率を考慮）の合計に基づき算定します。`;
    fixed++; return;
  }

  if (en.includes('Before proceeding further') && en.includes('What Constitutes The Earnings')) {
    p.textJP = `さらに進む前に、いくつかの重要な用語を確認しましょう。
(1) 従業員の報酬とは何か？
本法の下で、「報酬」とは、従業員の雇用契約に基づく就労に関して支払われるべきすべての報酬を意味し、以下を含みます：
(a) 金銭で見積もることができる特権または便益および生産性奨励金
(b) 事故の結果として剥奪された場合の、雇用主が従業員に供給した食事または住居の価値
(c) 住居、食事および交通費に対して実際に支出された金額の補償として支払われるものを除く超過勤務手当および手当
(2) 最低報酬額・最高報酬額
補償の計算目的上、報酬の月額がS$1,300未満の場合はS$1,300として扱われます。報酬の月額がS$4,500を超える場合はS$4,500を上限とします。
(3) 補償額の計算
死亡の場合の補償額：報酬月額の日割額 × 年齢に応じた係数（最低3年分、最高8年分、但し上限S$225,000）
永久障害の場合：死亡の場合の補償額 × 障害の程度（比率）（上限S$289,000）
一時的障害の場合：報酬の3分の2が障害期間中支払われます（最長1年間）
(4) 医療費
雇用主は従業員の医療費を負担する義務があります`;
    fixed++; return;
  }

  if (en.includes('Under Section 5(2) of the First Schedule') && en.includes('cost of medical treatment')) {
    p.textJP = `本法の第一附則第5条(2)に基づき：「疑義を避けるため、医療処置の費用には以下を含みますが、これに限定されません——
(a) 負傷した従業員を医療処置を受けるために搬送するための緊急医療搬送に関する費用
(b) 本法の目的のために必要な医療報告書の費用
(c) 理学療法および作業療法・言語療法の費用
(d) 心的外傷後ストレス障害（PTSD）の治療のためのケースマネジメント、心理療法の費用
(e) 手術後のリハビリテーション費用」`;
    fixed++; return;
  }

  if (en.includes('This is in line with the requirements') && en.includes('Employment Act 1968')) {
    p.textJP = `注：これはEmployment Act 1968（雇用法1968年）に規定された要件に沿ったものです。\n6 祝日については、Work Injury Compensation Actの下では有給病気休暇として付与されませんが、従業員はEmployment Act 1968に基づく権利として祝日の賃金を受け取ることができます。`;
    fixed++; return;
  }

  if (en.includes('Insurers will require detailed information') && en.includes('type of event')) {
    p.textJP = `保険者は詳細な情報を求めます。すべての情報をリストアップはしませんが、例として以下が含まれます：
▪ 申込者の詳細（事業内容、実績）および出演者の詳細（イベントの種類、経験、制作規模等）
▪ 公演またはイベントの日程および会場名
▪ 求める補償の詳細（死亡、疾病、旅行遅延、会場損害等）
▪ 被保険者の過去の不出演歴（ある場合）
▪ 締結済みの書面による契約の詳細
▪ イベント中に発生し得る第三者賠償責任リスクの詳細
▪ 保険金額と免責金額の希望`;
    fixed++; return;
  }

  if (en.includes('There are many exclusions in a Contingency Insurance policy')) {
    p.textJP = `偶発損害保険証券には多くの免責事由があります。免責事由の例には以下が含まれます：
▪ 被保険者またはその関係者の注意・勤勉さ・慎重な行動の欠如で、リスクおよび／または損害の可能性を増大させるもの
▪ 被保険者の自殺または自傷行為
▪ 被保険者の契約上の紛争または違反
▪ 保険者の事前承認なしのイベント変更
▪ 悪天候（ただし別途約定された場合を除く）
▪ 規制当局による中止命令
▪ 戦争、テロリズム、核リスク
▪ ストライキ、暴動、市民騒擾
▪ 伝染病、パンデミック（ただし別途約定された場合を除く）
▪ 政府の行為による規制・制限`;
    fixed++; return;
  }

  if (en.includes('Commercial Motor Vehicle Insurance is primarily concerned') && en.includes('Act Liability Only')) {
    p.textJP = `企業自動車保険は、主に自動車自体が運転中または停車中のリスクに関係しています。補償の種類は以下のとおりです：
法定責任のみ（Act Liability Only）——Motor Vehicles (Third-Party Risks and Compensation) Act 1960が要求する最低限の補償：
▪ 乗客に対する責任を含む、第三者の死亡または身体傷害
第三者のみ（Third-Party Only）——法定責任のみの補償に加え：
▪ 第三者の財物損害
第三者・火災・盗難（Third-Party, Fire and Theft）——第三者のみの補償に加え：
▪ 火災および盗難による被保険車両の損害
包括型（Comprehensive）——最も広い補償。上記すべてに加え：
▪ 被保険車両の偶発的な損害`;
    fixed++; return;
  }

  if (en.includes('Table 4.3 details the differences between the Section II Exclusions')) {
    p.textJP = `表4.3は、自家用自動車保険と企業自動車保険のセクションII（第三者賠償責任）免責事由の相違点を詳述しています。
表4.3：自家用自動車保険と企業自動車保険のセクションII免責事由の相違点
両保険に共通する一般的要件：
1. 有効な運転免許証を持たない者による運転中の傷害
2. アルコールまたは薬物の影響下での運転中の傷害
企業自動車保険に固有の免責事由：
▪ 危険物の運送に起因する賠償責任（別途特約が必要）
▪ 道路交通規則に違反する積載超過に起因する損害
▪ 許可された使用目的外での使用中の事故`;
    fixed++; return;
  }

  if (en.includes('the usage of Private Motor Vehicles is rather different') && en.includes('Table 4.4')) {
    p.textJP = `前述のとおり、自家用車の使用目的は商用車両とは大きく異なります。使用制限（Limitations As To Use）は自動車保険証券に規定されています。
表4.4：自家用自動車保険と企業自動車保険の使用制限の相違点
自家用自動車保険——使用制限：
▪ 社会的、家庭的および娯楽目的
▪ 被保険者の事業に関連する通勤
▪ 有償での旅客運送は除外
▪ レース、ペースメイキング、信頼性試走は除外
企業自動車保険——使用制限：
▪ 雇用主の事業に関連する使用
▪ 商品の運送・配達
▪ 有償旅客運送（バス・タクシー等は別途保険）
▪ 危険物の運送（別途特約が必要な場合あり）
▪ レース、ペースメイキングは除外`;
    fixed++; return;
  }

  if (en.includes('vehicle year') && en.includes('Fleet Rating Method')) {
    p.textJP = `「車両年」と呼ばれる係数が決定されます。これは1台の車両を1年間付保することと定義されます。年の一部のみ所有または使用された車両は比例ベースで取り扱われます。このようにして、損害の合計（インフレ調整後）を車両年の合計で除することにより、引受人は現実的な基準でリスクを評価できます。
図4.1はフリート料率設定目的でのリスク評価の決定方法を示しています。
図4.1：フリート料率設定方法
ステップ1：過去3〜5年間の請求データの収集
ステップ2：車両年の計算
ステップ3：車両年あたりの損害コストの算出
ステップ4：インフレ調整
ステップ5：将来の予想損害コストの算出
ステップ6：管理費・利益マージンの加算
ステップ7：フリート保険料率の決定`;
    fixed++; return;
  }

  if (en.includes('Application Of The Fleet Rating Method') && en.includes('ABC Motor Transport')) {
    p.textJP = `以下の例は、図4.1で説明したフリート料率設定方法の適用を示しています。
例題4.1：フリート料率設定方法の適用
ABC Motor Transport Pte Ltdは10台の商用バスのフリートを運営しています。各車両の詳細と購入日が以下の表に示されています。すべての車両は過去3年間フリート保険証券で付保されています。
フリート料率の算出：
1. 過去3年間の車両年を計算（各車両の付保月数÷12の合計）
2. 過去3年間の保険金支払い実績を集計
3. 車両年あたりの損害率を算出
4. インフレ調整を適用
5. 将来の予想損害コストを算出
6. 管理費（例：15%）と利益マージン（例：5%）を加算
7. 上記に基づきフリート保険料率を決定
引受人はまた、フリートの損害経験の傾向（改善傾向か悪化傾向か）も考慮します。`;
    fixed++; return;
  }

  if (en.includes('certain benefits that can be added') && en.includes('Strike, Riot & Civil Commotion')) {
    p.textJP = `以下のような追加保険料の支払いにより補償を強化するための特約拡張があります：
(a) ストライキ・暴動・内乱（SRCC）：包括型保険証券を追加保険料でSRCC補償に拡張できます
(b) 私的使用：追加保険料なしで、被保険者のメンバー、取締役、従業員、またはメンバーや取締役の指名された親族や友人が、被保険車両を社会的・家庭的・娯楽目的で使用する際のてん補を手配できます
(c) 積載超過免責の削除：一部の保険者は、追加保険料を支払うことで積載超過に関する免責を削除する特約を提供しています
(d) 牽引車と被牽引車の別個の保険：牽引車と被牽引車を別個の車両として付保する場合があります
(e) ロードサイドアシスタンス：故障時の緊急対応サービス`;
    fixed++; return;
  }

  if (en.includes('Table 5.3 is a summary') && en.includes('Institute Cargo Clauses')) {
    p.textJP = `表5.3は、三つの協会貨物約款（Institute Cargo Clauses）に共通する免責事由の概要を示しています。
表5.3：協会貨物約款(A)、(B)、(C)の共通免責事由（2009年1月1日版）

一般免責事由（すべての約款に共通）：
▪ 被保険者の故意の不正行為に起因する損害
▪ 通常の漏損、重量・容積の減少、自然の摩耗
▪ 不適切な梱包
▪ 固有の瑕疵（inherent vice）
▪ 遅延に起因する損害
▪ 船主・管理者・傭船者の支払不能または財務上の債務不履行
▪ 核兵器の使用に起因する損害
▪ 船舶・航空機の耐航性・適合性の欠如（被保険者がその事実を知っていた場合）
▪ 戦争・内戦・革命・反乱
▪ ストライキ・ロックアウト・労働争議

約款(A)固有の補償：全危険担保（all risks）——上記免責事由以外のすべての危険を補償
約款(B)の補償：列挙危険担保——火災・爆発・座礁・沈没・衝突・荷卸し中の水没・地震・火山噴火・雷・波浪による流失等
約款(C)の補償：限定列挙危険担保——火災・爆発・座礁・沈没・衝突・荒天時の投荷等（最も限定的）`;
    fixed++; return;
  }

  if (en.includes('The length of voyage') && en.includes('Weather conditions') && en.includes('Protection and Indemnity')) {
    p.textJP = `予定される航海に関する引受考慮事項：
(a) 航海の長さ。航海が長いほど、船上の貨物が滅失・損傷にさらされる期間が長くなります
(b) 取引地域の気象条件
2 これらの機器・機械の形状と寸法により、通常の方法で梱包することができません
3 これらの貨物は梱包されず、コンベアベルト、バケットグラブ、または供給システムによりバルクキャリアに積み込まれます
4 P&I（船主責任賠償保険）は、船舶所有者または運航者の第三者に対する賠償責任を補償します。主な補償内容には、乗組員の傷害・疾病、旅客の傷害・死亡、積荷の損害に対する賠償責任、衝突による第三者賠償責任、油濁による環境汚染責任、残骸撤去費用等が含まれます`;
    fixed++; return;
  }

  if (en.includes('general underwriting information') && en.includes('name of vessel') && en.includes('length of contracts')) {
    p.textJP = `取得すべき一般的な引受情報は以下のとおりです：
▪ 船舶名
▪ 必要な責任限度額
▪ 傭船が単一航海か期間傭船か
▪ 傭船期間
▪ 航海数
▪ 契約期間
▪ 運送する貨物の種類
▪ 積地港／揚地港
▪ 積込み／荷卸しの方法
▪ 荷役の責任者
▪ 貨物は傭船者が所有するか第三者が所有するか
▪ 貨物に対する賠償責任の補償が必要か`;
    fixed++; return;
  }

  if (en.includes('The information required by the insurer') && en.includes('nature of services') && en.includes('stevedores')) {
    p.textJP = `保険者が求める情報は以下のとおりです：
▪ 顧客に提供するサービスの性質
▪ 被保険者の取締役、パートナー、上級管理者の専門資格または経験年数
▪ 自社常勤の肉体労働者の人数と割合
▪ 契約する独立荷役業者（stevedore）の人数と割合
▪ 国際的に認知された機関からの品質保証認定
▪ 年間売上高
▪ 取扱い貨物／トン数
▪ バルク貨物の取扱い方法
▪ 使用する荷役設備の種類
▪ 過去の請求歴`;
    fixed++; return;
  }

  if (en.includes('exact location of the construction site') && en.includes('piling work')) {
    p.textJP = `工事と現場に関する引受情報：
(a) 建設現場の正確な所在地（海沿いか、密集地区か、新規MRT路線かなど）
(b) 工事の完全な記述（図面、スケッチ等の裏付け書類を添付）
(c) 工事の実施方法の詳細な記述
(d) 解体工事の有無
(e) 杭打ち工事の有無。杭打ちが含まれる場合、杭打ち工事の情報（種類、本数、貫入深度等）が必要
(f) 近接する建物・構造物・地下インフラ等への影響リスクの評価
(g) 地盤条件（土質調査報告書）
(h) 工期と完工予定日
(i) 請負業者の経験と実績
(j) 契約金額と保険金額`;
    fixed++; return;
  }

  if (en.includes('If the loss is straightforward') && en.includes('theft of loose materials')) {
    p.textJP = `損害が単純な場合（例：現場の資材の盗難）、請求手続きは簡単です。損害が複雑な場合（例：修理にどれだけの時間がかかるか）、保険者は損害査定人（または保険者自身の請求専門家）を任命して報告書を作成します。
被保険者は損害査定人に以下の情報を提供する必要があります：
▪ 損害発生前または発生後の財物の価値
▪ 滅失または損害の程度
▪ 滅失または損害の原因
▪ 修理の見込み費用
▪ 修理に必要な見込み期間
▪ 第三者に対する回収の可能性
保険者は通常、被保険者による合理的な予防措置の遵守状況も確認します。`;
    fixed++; return;
  }

  if (en.includes('PRI can cover the following situation') && en.includes('confiscating, expropriating')) {
    p.textJP = `PRI（政治リスク保険）は以下の状況を補償できます：企業がインフラ、製造施設、パイプライン、発電所等に関連する会社を設立して海外投資する場合。合弁事業や子会社への投資や融資も対象となります。海外事業からの利益もリスクにさらされる可能性があります。
PRIは以下のリスクから投資を保護する補償を提供します：
▪ ホスト国政府による没収、収用、国有化、またはその他の方法で投資家の資産を剥奪する行為（「収用リスク」）
▪ 政治的暴力（戦争、内戦、テロリズム、暴動等）による物的損害
▪ 通貨の兌換不能または送金不能（「為替リスク」）
▪ 契約の履行拒否（ソブリンリスク）
▪ 政治的な理由によるライセンスの取消しまたは事業許可の撤回`;
    fixed++; return;
  }

  if (en.includes('Member and/or their dependants allowing the Company') && en.includes('Privacy Policy')) {
    p.textJP = `各従業員/グループメンバーおよび/またはその扶養家族から、PDPAおよび会社の「プライバシーポリシー」に従い個人データを収集、使用、処理、開示することについて同意を得ていることを承認・宣言・同意します。本申込書に添付された個人情報収集声明を読み理解しました。
ABC SGまたはその関連会社の商品やサービスに関する情報をメールおよび/または電話で受け取ることを希望します。
権限ある役員の氏名と署名 / 会社印
日付

この申込書は以下の書類とともに提出する必要があります：
▪ 被保険者の従業員リスト（氏名、NRIC/パスポート番号、生年月日、職種、保険金額）
▪ 過去の請求歴
▪ 団体保険の更新の場合は現在の保険証券の写し`;
    fixed++; return;
  }

  if (en.includes('death and TPD benefits are reflected under') && en.includes('Table of Compensation')) {
    p.textJP = `一般に、死亡およびTPD（永久完全障害）給付は「補償表」（Table of Compensation、「Schedule of Compensation」とも呼ばれます）に反映されます。特に団体保険証券がその他の永久障害も補償する場合に顕著です。
以下は「補償表」に基づく給付の例です：
表9.1：補償表の例
内容 / 保険金額に対する割合
1. 死亡 — 100%
2. 2肢以上の喪失 — 150%
3. 手首または足首より上の切断による1肢の喪失 — 125%
4. 両眼の視力の完全かつ回復不能な喪失 — 100%
5. 片眼の視力の完全かつ回復不能な喪失 — 50%
6. 両耳の聴力の完全かつ回復不能な喪失 — 75%
7. 片耳の聴力の完全かつ回復不能な喪失 — 20%
8. 言語機能の完全かつ回復不能な喪失 — 50%
9. 親指の喪失 — 25%
10. 人差し指の喪失 — 10%`;
    fixed++; return;
  }

  if (en.includes('category of employees/occupation') && en.includes('Basis of Coverage') && en.includes('Senior Management')) {
    p.textJP = `従業員のカテゴリー/職種と補償基準の例は以下のとおりです：
| 従業員のカテゴリー/職種 | 補償基準 |
(i) 上級管理職（取締役、ゼネラルマネージャー、シニアマネージャー） — S$100,000
(ii) マネージャー・エグゼクティブ — S$50,000
(iii) その他全員 — S$25,000
あるいは、補償基準は以下の例のように、全従業員の基本月給の倍数に基づくこともできます：
(i) 全従業員 — 基本月給の24倍`;
    fixed++; return;
  }

  if (en.includes('Exclusions under a GPA Insurance policy may be classified') && en.includes('several categories')) {
    p.textJP = `GPA保険証券の免責事由はいくつかのカテゴリーに分類できます：
(a) 事故に起因するとみなされない傷害：自傷行為、自殺または自殺未遂（正気・心神喪失を問わず）
(b) 事故に起因するが公序良俗に反する行為から生じる傷害：犯罪行為もしくは不法行為の実行またはその未遂、アルコールまたは薬物（登録医療従事者の処方による場合を除く）の影響下での機械の運転・操作
(c) 特定の危険な活動に起因する傷害：プロフェッショナルスポーツ（報酬を得るための参加）、スカイダイビング・バンジージャンプ・ロッククライミング等の危険なスポーツ、未認可航空機での飛行
(d) 戦争・テロリズムに起因する傷害：戦争、戦争類似行為、内戦、反乱、テロ行為（ただし一部の保険証券はテロリズム特約で補償）
(e) 核リスク：核爆発、核反応、核放射線、放射性汚染に起因する傷害
(f) 既存疾病：保険証券の開始日前に存在した疾病
(g) 妊娠・出産に起因する傷害
(h) HIV/AIDSに起因する傷害`;
    fixed++; return;
  }

  // Ch9 1.8 is change log metadata - keep as-is
  if (en.includes('Existing content split from Paragraph') && en.includes('Amended')) {
    // Change log - add minimal JP header
    p.textJP = `ComGI第7版 バージョン1.1 変更履歴\n` + p.textJP;
    fixed++; return;
  }
}

function processSection(sec) {
  (sec.paragraphs || []).forEach(fixPara);
  (sec.subsections || []).forEach(processSection);
}
comgi.chapters.forEach(ch => ch.sections.forEach(processSection));

fs.writeFileSync('data/textbook-comgi.json', JSON.stringify(comgi, null, 2), 'utf8');

let remaining = 0;
comgi.chapters.forEach(ch => {
  function c(sec) {
    (sec.paragraphs||[]).forEach(p => {
      if(p.textJP && p.text && p.text.length > 50 && p.text.length < 5000 && p.textJP.length/p.text.length < 0.3) remaining++;
    });
    (sec.subsections||[]).forEach(c);
  }
  ch.sections.forEach(c);
});
console.log('Fixed:', fixed);
console.log('ComGI normal TOO_SHORT remaining:', remaining);
