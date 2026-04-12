// HI Ch1: Healthcare Environment in Singapore — translate all 27 paragraphs
const fs = require('fs');
const hi = JSON.parse(fs.readFileSync('data/textbook-hi.json','utf8'));
const ch = hi.chapters[0];

// Translate by matching paragraph num + text content
const translations = {};

function t(num, textStart, jp) {
  if (!translations[num]) translations[num] = [];
  translations[num].push({ start: textStart, jp });
}

t('1.1', 'Rising healthcare costs', `医療費の上昇はほとんどの政府にとって懸念事項です。医療科学の進歩、高価な医療技術や薬剤のより多くの使用、および寿命が延びた高齢化社会は、医療費上昇に寄与する要因の一部です。ほとんどの先進国では、医療費はGDPの重要な割合を占めており、その割合は増加し続けています。各国政府は、国民に手頃な価格で質の高い医療サービスを提供するために、さまざまな医療制度を導入しています。シンガポールも例外ではなく、独自の医療制度を構築してきました。`);

t('2.1', 'Through the Ministry of Health', `保健省（Ministry of Health: MOH）を通じて、シンガポール政府は5つの基本的な目標に基づいて医療制度を管理しています：
(a) 健康の促進により健康な国民を育てること
(b) 個人の健康に対する自己責任を促進し、国家福祉や医療保険への過度の依存を避けること
(c) 良質で手頃な基本的医療サービスへのアクセスを確保すること
(d) 競争と市場原理を通じて医療サービスのコスト効率と品質の向上を促進すること
(e) 医療費を支払えないために適切な医療を受けられないシンガポール人がいないようにすること`);

t('2.2', 'The population is encouraged', `国民は健康的な生活習慣を採用し、自らの健康に対する責任を持つよう奨励されています。同時に、支払い能力がないために適切な医療へのアクセスを拒否されるシンガポール人がいないよう、セーフティネットが整備されています。\n3. シンガポールの医療変革`);

t('3.1', 'Over the past two decades', `過去20年間にわたり、MOHは医療制度内の過去、現在、および予想される課題に対処するために、大規模な医療変革の取り組みに着手してきました。`);

t('3.2', 'Launched in 2012', `2012年に開始された「Healthcare 2020」マスタープランは、アクセスと手頃さに焦点を当てて、シンガポール人の医療アクセスの改善を目指しました。`);

t('3.3', 'Under Healthcare 2020', `Healthcare 2020の下で、以下が達成されました：
(a) アクセスの改善
MOHは2012年から2016年にかけて4つの新しい病院を開設し、急性期および地域の医療ニーズに対応する1,800以上の追加ベッドを確保しました。ケアの重心を地域社会に移すため、MOHは地域病院、在宅ケア、デイケア等の地域ケアサービスの能力を拡大しました。
(b) 手頃さの向上
MOHはMediShieldを見直し、2015年11月にMediShield Lifeを導入しました。MediShield Lifeはすべてのシンガポール市民と永住者に終身の基本的な入院保険を提供する強制保険です。また、パイオニア世代パッケージを導入し、シンガポールの建国に貢献した高齢者に特別な医療給付を提供しました。
(c) 医療の質の向上
MOHはケアの質と安全性の基準を強化し、医療機関のライセンス制度を改善しました。`);

t('3.4', 'Further changes were needed', `持続可能な医療制度を確保するために、さらなる変革が必要でした。2016年、MOHは「3つのBeyond」（Better Health（より良い健康）、Better Care（より良いケア）、Better Life（より良い生活））に着手しました。2017年に6つの地域保健システムが3つの完全統合型クラスターに再編成され、各クラスターは急性期病院、地域病院、ポリクリニック、その他の地域ケア施設の組み合わせで構成されました。
主な取り組み：
▪ 予防医療の推進——生活習慣病の予防に焦点
▪ プライマリケアの強化——かかりつけ医と患者の長期的な関係の構築
▪ 地域ケアの拡充——在宅ケア、デイリハビリテーション、ホスピスケア等
▪ ActiveSG等のプログラムを通じた身体活動の促進
▪ 高齢者のアクティブ・エイジングの支援
▪ Merdeka世代パッケージの導入（2019年）——1950年代から1960年代に生まれたシンガポール人への追加医療給付`);

t('3.5', 'The progress made under', `3つのBeyondの下で達成された進歩により、強固な地域保健システムが構築され、MOHが医療変革の次の飛躍に着手するための基盤が整いました。2023年半ばに、MOHはHealthier SG——予防医療を促進し、個人が自らの健康をより積極的に管理できるようにするための複数年にわたる戦略——を開始しました。`);

t('3.6', 'Five key features of Healthier SG', `Healthier SGの5つの主要特徴：
(a) かかりつけ医を動員して住民に予防医療を提供する。MOHはかかりつけ医のネットワークを動員し、予防と慢性疾患ケアの改善に焦点を当てた包括的なケアを提供します。MOHは一貫したエビデンスに基づくレベルのケアを確保します。
(b) 住民が自らの健康に対する責任を持つことを奨励する。MOHは住民に自らの健康管理への積極的な参加を奨励し、健康的な生活習慣の採用を支援します。
(c) 健康的な生活のための支援環境を構築する。MOHは地域社会において健康的な生活を支援する環境を整備し、公園、スポーツ施設、健康的な食事オプションへのアクセスを改善します。
(d) 医療をより手頃にする。MOHは医療費の管理可能性を確保するための措置を継続して講じ、補助金とMediSaveの使用を最適化します。
(e) 地域社会のケア能力を強化する。MOHは地域社会のケアサービスの能力を強化し、高齢者やケアが必要な人々が地域社会の中で適切なケアを受けられるようにします。`);

t('4.1', 'There are three main types', `医療サービスには3つの主要な種類があります：
(a) プライマリヘルスケアサービスおよび施設
(b) 病院サービス
(c) 中間ケアおよび長期ケアサービス`);

t('4.2', 'Primary healthcare involves', `プライマリヘルスケアは、基本的な医療、予防医療、および健康教育の提供を含みます。シンガポールでは、プライマリヘルスケアサービスは、全島にわたるポリクリニックのネットワークと民間の一般開業医（GP）のクリニックを通じて提供されています。これらの医療専門家は、多くの場合、患者の最初の連絡先となります。ポリクリニックは政府が補助金を出して運営しており、一般的な疾患の治療、予防接種、健康スクリーニング等の基本的な医療サービスを提供しています。ポリクリニックの診療費はGPクリニックよりも低額です。`);

t('4.3', 'Under the Community Health Assist', `Community Health Assist Scheme（CHAS）の下で、資格を有するシンガポール市民は、ポリクリニックに行く必要なく、参加しているGPおよび歯科クリニックで補助金付きの治療を受けることができます。CHASにより、Merdeka世代（MG）およびパイオニア世代（PG）のカードホルダーを含むすべてのシンガポール市民が、一般的な疾患や特定の慢性疾患の医療および歯科治療の補助金を受けることができます。`);

t('4.4', 'Besides subsidies for care at CHAS', `CHASクリニックでのケアの補助金に加えて、CHAS、MGおよびPGのカードホルダーは、公的な専門外来クリニック（Specialist Outpatient Clinics: SOCs）への補助金付き紹介、および必要に応じてNational Dental Centre SingaporeおよびNational University Centre for Oral Health Singaporeへの補助金付き紹介を受けることができます。カードの色は受けられる補助金のレベルを示します。`);

t('4.5', 'Clinics participating in CHAS', `CHASに参加するクリニックはMOHと提携し、資格を有する患者に一般的な外来医療と基本的な歯科サービスを提供しています。このスキームは、糖尿病や高血圧等のChronic Disease Management Programme（CDMP）に基づく慢性疾患の治療も対象としています。ポリクリニックを受診するには、CHASカードは不要です。`);

t('4.6', 'Public hospitals account for', `シンガポールの全病院ベッドの85%を公立病院が占め、民間セクターが15%を占めています。公立病院は3つのクラスターに分かれた地域別に構成されています：National University Health System（NUHS）、National Healthcare Group（NHG）、SingHealth。シンガポールには10の公立病院があり、幅広い一般的および専門的な医療サービスを提供しています。さらに、国立専門センターが特定の分野（がん、心臓、眼科、精神科等）の専門治療を提供しています。`);

t('4.7', 'The Government has also introduced', `政府はまた、通常は急性期病院からの退院後に患者にリハビリテーションと継続的なケアを提供するためのコミュニティホスピタル（地域病院）を導入しました。シンガポールには現在9つのコミュニティホスピタルがあり、VWO（ボランティア福祉団体）またはヘルスケアクラスターによって運営されています。`);

t('4.8', 'Within the public hospitals', `公立病院内では、患者は入院時に希望する病棟クラスを選択できます。受けられる補助金は選択した病棟クラスに基づきます。基本的な設備を提供するB2およびC病棟クラスは最大80%の手厚い補助金を受けられます。より多くの設備を希望する場合はB1またはA病棟クラスを選択できますが、補助金の額は少なくなります。私立病院での治療を選択した場合は補助金はありません。`);

t('4.9', 'The Government has restructured', `政府はすべての急性期病院と専門センターを、政府が所有する民間企業として運営するように再編しました。これにより、公立病院はより多くの経営自律性と柔軟性を持ち、患者のニーズにより迅速に対応できるようになりました。公立病院は、完全に私的に設立・運営されている他の民間病院とは異なります。これらの病院には、Gleneagles Hospital、Mount Elizabeth Hospital、Parkway East Hospital等が含まれます。`);

t('4.10', 'For more information on the regions', `地域および各地域に属する医療機関の詳細については、MOHのウェブサイト（https://www.healthhub.sg/directory/hospitals）をご覧ください。`);

t('4.11', 'Intermediate and Long-Term Care', `中間ケアおよび長期ケア（Intermediate and Long-Term Care: ILTC）サービスは、通常、急性期病院またはコミュニティホスピタルから退院した後にさらなるケアと治療が必要な高齢者、および虚弱で日常生活動作に監督や支援が必要な地域在住の高齢者に必要とされます。ILTCサービスには以下が含まれます：
▪ 在宅ケアサービス——在宅医療、在宅看護、在宅療法サービス
▪ デイケアサービス——高齢者デイケア、デイリハビリテーション
▪ ナーシングホーム——24時間の看護ケアが必要な高齢者のための入所施設
▪ ホスピスケア——末期疾患の患者に対する緩和ケア（在宅ホスピスおよび入所ホスピス）
▪ その他の地域ケアサービス——シニアアクティビティセンター、認知症デイケア等`);

t('', '(a) Dental Services', `(a) 歯科サービス`);

t('4.12', 'Public dental services', `公的な歯科サービスはNational Dental Centreおよび一部のポリクリニックや病院で提供されています。Health Promotion Board（健康促進委員会）は主に学童を対象とした予防歯科に焦点を当てています。\n(b) 伝統医療と補完医療`);

t('4.13', 'MOH bases its healthcare services', `MOHは西洋医学に基づいて医療サービスを提供しています。しかし、シンガポールの各民族グループは一般的な疾患について伝統医療の施術者に相談することがあります。中国伝統医学（Traditional Chinese Medicine: TCM）およびその他の伝統的または代替的な医療に対する関心は、シンガポール国内および世界的に高まっています。TCM施術者はTraditional Chinese Medicine Practitioners Act 2000に基づき、TCM Practitioners Board（TCM施術者委員会）によって規制されています。`);

t('4.14', 'Support services to hospitals', `病院およびプライマリヘルスケアプログラムへの支援サービスには、法医学病理学、医薬品サービス、および輸血サービスが含まれます。`);

t('5.1', 'MOH has made decisive changes', `MOHは補助金の対象範囲を拡大し、より多くの患者の手頃さを改善するための決定的な変革を行いました。例えば、長期ケアサービスに対する補助金が増額され、より多くの患者が補助金を受けられるようになりました。2022年と2023年には、急性期病院、コミュニティホスピタル、および長期ケアサービスについて、改訂された所得連動型補助金制度が導入されました。政府はまた、シンガポール人が受けられるMediSave引出し限度額を引き上げ、MediSaveを使用して支払える医療費の範囲を拡大しました。`);

t('5.2', 'Other initiatives to make healthcare', `医療費をより手頃にするためのその他の取り組みには、自己負担金の削減のためのMediSaveの使用が含まれます。例えば、Flexi-MediSaveにより、高齢者は公立医療機関およびCHASの一般開業医クリニックでの外来診療に年間追加S$300を使用できます。政府はまた、より多くの外来サービスをMediSaveで支払えるように拡大しました。`);

t('5.3', 'MOH will continue to review', `MOHは、すべての人にとって医療が手頃であり続けることを確保するために、医療費の状況を引き続き見直していきます。支払い能力がないために適切なケアへのアクセスを失う人はいません。

シンガポールの医療環境の概要 — 重要概念
定義／説明
▪ シンガポール政府の医療目標——健康な国民の育成、個人の自己責任、良質で手頃な基本医療サービスへのアクセス確保、競争とコスト効率の促進、医療からの排除防止
▪ Healthcare 2020——アクセスの改善（4つの新病院）、MediShield Lifeの導入、質の向上
▪ 3つのBeyond——Better Health、Better Care、Better Life。3つの統合型クラスターへの再編
▪ Healthier SG——予防医療の推進、かかりつけ医の動員、住民の自己管理の奨励
▪ 医療サービスの3類型——プライマリヘルスケア（ポリクリニック・GPクリニック）、病院サービス（公立・私立）、ILTC（在宅ケア・デイケア・ナーシングホーム・ホスピス）
▪ CHAS——参加GPおよび歯科クリニックでの補助金付き治療
▪ 病棟クラス——C・B2（最大80%補助金）、B1・A（補助金あり）、私立（補助金なし）
▪ 3つのヘルスケアクラスター——NUHS、NHG、SingHealth`);

// Apply translations
function applyTranslations(sec) {
  (sec.paragraphs || []).forEach(p => {
    const candidates = translations[p.num || ''];
    if (candidates) {
      for (const c of candidates) {
        if (p.text && p.text.startsWith(c.start)) {
          p.textJP = c.jp;
          break;
        }
      }
    }
  });
  (sec.subsections || []).forEach(applyTranslations);
}
ch.sections.forEach(applyTranslations);

// Also set section/chapter titleJP
ch.titleJP = 'シンガポールの医療環境の概要';
if (ch.sections[0]) ch.sections[0].titleJP = 'はじめに';
if (ch.sections[1]) ch.sections[1].titleJP = 'シンガポール政府の医療制度';

fs.writeFileSync('data/textbook-hi.json', JSON.stringify(hi, null, 2), 'utf8');

// Verify
let translated = 0, total = 0;
function count(sec) {
  (sec.paragraphs || []).forEach(p => { total++; if(p.textJP) translated++; });
  (sec.subsections || []).forEach(count);
}
ch.sections.forEach(count);
console.log('Ch1: ' + translated + '/' + total + ' translated');
