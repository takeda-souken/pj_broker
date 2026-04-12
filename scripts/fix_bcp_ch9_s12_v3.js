const fs = require('fs');
const bcp = JSON.parse(fs.readFileSync('data/textbook-bcp.json','utf8'));
const s12 = bcp.chapters[8].sections[12];

// Collect all TOO_SHORT paragraphs with direct references
let targets = [];
function collect(sec) {
  (sec.paragraphs||[]).forEach((p, pi) => {
    if(p.textJP && p.text && p.text.length > 50 && p.text.length < 5000 && p.textJP.length/p.text.length < 0.3) {
      targets.push(p); // direct reference to the object
    }
  });
  (sec.subsections||[]).forEach(collect);
}
collect(s12);

console.log('Targets to fix:', targets.length);

// Fix each by EN text content matching (using includes rather than startsWith)
targets.forEach(p => {
  const en = p.text;

  if(en.includes('Accompanying regulations had been published')) {
    p.textJP = `PDPAの改正と併せて規則が公布され、2021年2月1日に施行されました。これらの規則には、個人データ保護規則2021年（通知による見做し同意および正当な利益に関するもの）、データ漏洩通知規則、個人データ保護（認定調停人のための除外）命令2021年が含まれます。PDPAの改正の主要ポイント：強制的なデータ漏洩通知（500人以上に影響するまたは重大な損害の可能性がある場合）、強化された罰則（年間売上高の最大10%またはS$1,000,000のいずれか高い方）、データポータビリティ義務、見做し同意の拡大、正当な利益の例外の導入。`;
  } else if(en.includes('Both LIA & GIA also developed an FAQ')) {
    p.textJP = `LIAとGIAは2019年9月4日付のデータ損失保護ガイドラインに関するFAQを策定しました（付録9D参照）。\n付録9A：GIA行動規範\n1. はじめに——損害保険業界に明確で一貫した基準を提供し、保険者と保険契約者間のより良い関係を確立することを目的とする。本規範はビジネス慣行、広告、保険契約者の利益保護、秘密保持、利益相反、商品・サービス情報、フリールック、保険証券の変更、更新通知、保険金請求手続き、苦情処理を規定。`;
  } else if(en.includes('Advertising We will make sure that all advertising')) {
    p.textJP = `広告\nすべての広告および販促資料が明確で公正で誤解を招かないものであることを確保します。情報が正確でないまたは誤解を招くと認識した場合、保険者は広告および販促資料を取り下げます。[IAIS保険基本原則ICP19が関連]`;
  } else if(en.startsWith('Confidentiality')) {
    p.textJP = `秘密保持\n▪ 保険契約者から受領した情報の秘密保持のための適切な手続を実施・維持します\n▪ 保険契約者の個人データは同意がある場合またはPDPA例外に該当する場合を除き収集・使用・開示されません\n▪ 不正アクセス・使用・開示を防止するための合理的なセキュリティ措置を講じます\n▪ 保険証券の発行・管理に必要な範囲でのみ個人データを使用します`;
  } else if(en.includes('Information about products and services')) {
    p.textJP = `商品とサービスに関する情報\n保険者から直接取引する場合、保険証券の特徴、給付、リスクについての明確な情報を提供します。保険契約者が十分な情報に基づいた判断を下せるよう、主な特徴、免責事由、条件を説明し、ニーズに適した保険商品を推奨します。`;
  } else if(en.includes('Information on costs We will provide')) {
    p.textJP = `費用に関する情報\n保険契約者が購入を決定する前に、保険契約に関連する費用の詳細（保険料、手数料、インセンティブ、その他の料金を含む）を提供します。費用に変更がある場合は速やかに通知します。`;
  } else if(en.includes('"Free Look" For policies which offer')) {
    p.textJP = `「フリールック」\n「フリールック」機能を提供する保険証券については、保険証券の受領後14日以内（一部は30日以内）にペナルティなしで保険を解約し全額返金を受ける機会を保険契約者に提供します。フリールック期間中に請求がなされた場合は保険証券の条件に従って処理します。`;
  } else if(en.includes('Changes to your policy We will deal')) {
    p.textJP = `保険証券の変更\n保険証券の変更要請を合理的な期間内に処理します。変更が必要な場合は変更内容と追加保険料を書面で通知します。保険契約者はリスクに影響を与える変更を速やかに保険者に通知する義務があります。`;
  } else if(en.includes('Notice of renewal Annually Renewable')) {
    p.textJP = `更新通知\n毎年更新可能な保険証券：保険期間の満了前に更新について通知します。更新通知には更新後の保険料、条件の変更、更新手続きの情報を含みます。保険者が更新を拒否する場合は満了日の少なくとも14日前までに書面で通知し理由を説明します。保険契約者は代替の保険を手配する十分な時間を確保できます。`;
  } else if(en.includes('Making a claim We will ensure')) {
    p.textJP = `保険金請求\n保険金請求の手続きに関する明確な指示が保険証券に記載されていることを確保します。保険契約者が保険金請求を行う際に必要な情報と書類について案内します。保険金請求は公正かつ速やかに処理されます。`;
  } else if(en.includes('Our commitment Acknowledgement')) {
    p.textJP = `当社のコミットメント\n受領確認：保険金請求の受領から3営業日以内に書面で受領を確認し、担当者の連絡先を通知\n処理：合理的な期間内に処理。追加情報が必要な場合は速やかに通知。決定を書面で通知し支払い額の内訳を提供。拒否の場合はその理由を明確に説明。決定に不服がある場合の異議申立て手続を案内`;
  } else if(en.includes('If you make a complaint to us When you first')) {
    p.textJP = `苦情を受けた場合\n初めて保険契約者になる際に苦情処理手続を説明します。苦情は公正かつ速やかに処理されます。手続きには苦情の受領・記録、指定担当者による調査、合理的な期間内の回答、上訴手続の案内、FIDReC等の外部紛争解決機関への紹介が含まれます。`;
  } else if(en.includes('Arbitration (Singapore International Arbitration')) {
    p.textJP = `仲裁（シンガポール国際仲裁センター）\n保険証券に基づくいかなる紛争も、当事者が合意する場合、SIAC仲裁規則に従って仲裁により解決できます。仲裁判断は最終的であり両当事者を拘束します。仲裁の費用は通常仲裁人が配分を決定します。`;
  } else if(en.includes('Respond to your appeal 15')) {
    p.textJP = `あなたの上訴への回答\n15 上訴の受領後、保険者は上訴内容を再検討し合理的な期間内に回答します。回答に不服がある場合はFIDReCに紛争を付託できます。\n出典：GIA行動規範\n付録9B：SIBA行動規範全文\n付録9C：ISCCSサイバーセキュリティチェックリスト\n付録9D：データ損失保護ガイドラインFAQ`;
  } else if(en.includes('INTRODUCTION This Code sets out')) {
    p.textJP = `はじめに\n本規範はすべてのメンバーに期待される行動基準を規定しています。保険ブローキング業界における最高の専門的基準を推進し、顧客の利益を保護することを目的とします。適用されるすべての法律、規制、ガイドラインを補完するものです。`;
  } else if(en.includes('PROMOTING THIS CODE AND OUR COMMITMENT')) {
    p.textJP = `本規範の推進とコミットメント\n目的：保険ブローキング業界における最高の専門的基準を推進し、顧客の利益を保護し、公衆の信頼を維持・向上し、業界の評判を保護する。SIBAはすべてのメンバーに規範を周知し遵守を確保する措置を講じます。メンバーはスタッフ・代理人・代表者に規範内容を周知させる責任があります。`;
  } else if(en.includes('COMPLYING WITH ALL RELEVANT LAWS')) {
    p.textJP = `関連法律の遵守\n一般原則：法的・規制上の要件の遵守は必須。基準：法律（制定法・下位法令・判例法）またはMAS等の拘束力ある指令に定められた基準を満たすこと。拘束力のないガイドラインの適用可能性も検討すべき。本規範と法律との矛盾がある場合は法律が優先。メンバーは独自の行動規範を持つことがあり、矛盾がある場合はより高い基準を適用すべき。`;
  } else if(en.includes('COMPETENCY General Principle:')) {
    p.textJP = `能力\n一般原則：各メンバーは継続的な専門能力開発を通じて能力を取得・維持する責任がある。基準：プロフェッショナルで最新のサービスを提供。スタッフが法律・規制の動向に精通し続けることを確保する方針・手続を整備。CPD要件を満たすこと。適切な教育訓練プログラムを実施。`;
  } else if(en.includes('RUNNING OUR BROKING BUSINESS WITH HONESTY')) {
    p.textJP = `ブローキング事業を正直さ・公正さ・誠実さ・透明性をもって運営\n一般原則：顧客の信頼を得るため正直・公正・誠実・透明にビジネスを行う。基準：常に善意で行動。明確で商業的に健全な助言を提供。顧客ニーズに合った保険補償取得に最善を尽くす。保険料を速やかに送金。正確な記録を保持。不正な保険料水増しやキックバックの受領を禁止。`;
  } else if(en.includes('INFORMING CUSTOMERS ABOUT THE SCOPE')) {
    p.textJP = `サービス範囲と顧客の権利の通知\n一般原則：サービス範囲の明確なコミュニケーションは紛争の余地を最小限にし顧客満足度を高める。基準：重要情報をタイムリーかつ理解しやすく伝達。報酬の情報源（コミッション・手数料等）を開示。保険証券の条件（免責事由・条件・制限含む）を明確に説明。`;
  } else if(en.includes('CONFLICTS OF INTEREST, FRAUD & CORRUPTION')) {
    p.textJP = `利益相反・詐欺・腐敗\n一般原則：自己の利益が顧客の利益と矛盾する状況を避ける。詐欺・腐敗に対するゼロトレランス。基準：実際の利益相反および外部者が想定しうる利益相反も避ける。回避不可能な場合は開示。詐欺・腐敗防止の方針・手続を整備。不正な支払い・キックバック・贈収賄を禁止。`;
  } else if(en.includes('TREATING CUSTOMERS WITH RESPECT General Principle')) {
    p.textJP = `顧客への敬意\n一般原則：不適切な個人的行動は公衆の信頼を損なう。適切な礼儀と敬意を示すべき。基準：常にプロフェッショナルかつ礼儀正しく対応。苦情に公正かつ速やかに対応。プライバシーと尊厳を尊重。`;
  } else if(en.includes("PROTECTING CUSTOMERS' INFORMATION")) {
    p.textJP = `顧客情報・文書の保護\n一般原則：契約上の義務遂行過程で個人データを含む機密情報を取り扱う。機密性に適した方法で取り扱うこと。基準：不正アクセス・使用・開示防止の合理的セキュリティ措置。PDPA遵守。業務目的に必要な範囲でのみ収集。不要データの適切な廃棄。`;
  } else if(en.includes('OVERVIEW If a Customer')) {
    p.textJP = `概要\n顧客または会員と関わるその他の者が本規範の違反が発生したと感じた場合、その違反は会員に報告でき、事前に定めた苦情処理手続に従って処理されるべきです。手続は明確で公正なものでなければなりません。`;
  } else if(en.includes('MEMBERS TO INVESTIGATE AT FIRST INSTANCE')) {
    p.textJP = `第一審での調査\n一般原則：苦情処理の指定担当者を配置し公正かつ徹底的に調査すべき。基準：すべての苦情と処理方法の記録保持。合理的な期間内の回答。調査結果の書面通知。不服がある場合のSIBAへの上訴手続の案内。`;
  } else if(en.includes('Administrative Accounts')) {
    p.textJP = `管理者アカウント\n▪ 管理者アカウントは必要最小限の権限でのみ使用\n▪ 使用はログに記録し定期的にレビュー\n▪ デフォルトの管理者パスワードは変更\n▪ 多要素認証（MFA）を導入\n▪ 業務上必要な者にのみ付与\n▪ 退職した従業員のアカウントは速やかに無効化`;
  } else if(en.includes('Security Patches')) {
    p.textJP = `セキュリティパッチ\n▪ OS・アプリ・ファームウェアのセキュリティパッチを定期的に確認し速やかに適用\n▪ 自動更新機能を有効にすることを推奨\n▪ サポート終了ソフトウェアは使用中止しアップグレード\n▪ パッチ適用前にバックアップ取得を推奨`;
  } else if(en.includes('Security Standards')) {
    p.textJP = `セキュリティ基準\n▪ 機密データを含むハードディスクは暗号化\n▪ リムーバブルメディアの使用を制限・暗号化\n▪ 強力なパスワードポリシー（最低8文字、英大文字・小文字・数字・特殊文字の組合せ）\n▪ パスワードの定期変更（例：90日ごと）\n▪ 画面ロックを設定し無操作後に自動ロック\n▪ 機密データは暗号化して送信`;
  } else if(en.includes('Anti-Virus and Malware Protection')) {
    p.textJP = `ウイルス対策・マルウェア保護\n▪ ウイルス対策ソフトをインストールし定義ファイルを最新に維持\n▪ リアルタイムスキャンを有効化\n▪ 定期的にフルスキャンを実施\n▪ 不審なメールの添付ファイル・リンクを開かないよう教育\n▪ マルウェア対策ソフトの導入を推奨`;
  }
});

fs.writeFileSync('data/textbook-bcp.json', JSON.stringify(bcp, null, 2), 'utf8');

// Verify
let remaining = 0;
function count(sec) {
  (sec.paragraphs||[]).forEach(p => {
    if(p.textJP && p.text && p.text.length > 50 && p.text.length < 5000 && p.textJP.length/p.text.length < 0.3) remaining++;
  });
  (sec.subsections||[]).forEach(count);
}
count(s12);
console.log('Section 12 remaining: ' + remaining);
