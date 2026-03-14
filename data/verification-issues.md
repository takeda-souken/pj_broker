# Textbook Verification Issues

## BCP

### bcp-031 — FAIL (正答の誤り)
- **問題**: In general insurance, at what point must insurable interest exist?
- **現在の正答**: index 1「At the time of loss only」
- **正しい正答**: index 2「Both at inception and at the time of loss」
- **根拠**: Ch4 §2.11, p.74 — 非海上の一般保険は inception AND loss の両方で必要。「loss only」は海上保険のルール。
- **修正**: answer を 1 → 2 に変更。explanation も修正要。

### bcp-051 — 軽微（distractor の根拠不足）
- **問題**: Who CANNOT sign the proposal form on behalf of the proposer?
- **正答**: index 1「The insurance agent」— テキスト §2.21 で裏付けあり（PASS）
- **課題**: 他の選択肢（legal guardian, POA, company officer）が署名できるという根拠はテキストに明記なし
- **修正**: explanation に「一般契約法の原則に基づく」旨を補足

### bcp-024 — FAIL (テキストにない用語)
- **問題**: A warehouse manager who becomes careless about fire safety after obtaining insurance — this is an example of...
- **現在の正答**: index 2「Morale hazard」
- **課題**: BCP テキスト（Ch3 §4.5-4.9）は「morale hazard」という用語を使っていない。carelessness も deliberate fraud も一律「moral hazard」として分類。moral/morale の区別は外部の保険理論（Vaughan等）からの引用。
- **修正案**: (A) 正答を「Moral hazard」に変更し、explanation を修正。または (B) explanation に「一般的な保険理論では moral/morale を区別するが、BCP テキストでは一括して moral hazard」と注記。

### bcp-021 — WARN (explanation の理由付けがテキストと異なる)
- **問題**: Why only 'pure risks' are insurable, while 'speculative risks' are not?
- **現在の正答**: index 1 — 正答自体は正しい（PASS）
- **課題**: explanation が「moral hazard issues」を理由としているが、テキスト §2.8 の理由は「speculative risks are generally created by the persons involved」
- **修正**: explanation の理由付けをテキストに合わせる

### bcp-121 — FAIL (数字の誤り)
- **問題**: How many categories of regulatory instruments does MAS issue?
- **現在の正答**: index 0 — 選択肢テキストに「Eight」と記載
- **課題**: テキスト Ch2 §1.4 は **9種類** を列挙（Acts, Subsidiary Legislation, Directions, Directives, Notices, Guidelines, Practice Notes, Circulars, Policy Statements）。選択肢に9項目列挙しているのに「Eight」と表記。
- **修正**: 選択肢と explanation の「Eight」→「Nine」に変更

### bcp-049 — FAIL (正答の誤り)
- **問題**: What happens to an agent's apparent authority upon the principal's death?
- **現在の正答**: index 1「Apparent authority continues until third parties receive notice」
- **正しい正答**: index 0「Apparent authority also terminates immediately upon the principal's death」
- **根拠**: Ch5 §9.6 — 法律の作用による終了（death, insanity）は「regardless of whether the third party was aware of it」で即座に終了。§9.5 の「notice まで継続」ルールは voluntary termination のみに適用。
- **修正**: answer を 1 → 0 に変更。explanation も修正要。

### bcp-030 — FAIL (用語の不一致)
- **問題**: A client installs sprinkler systems and conducts fire drills — which risk management method?
- **現在の正答**: index 2「Risk reduction / minimisation」
- **課題**: テキスト Ch3 §5.1 のリスク管理4手法は Avoidance, **Control**, Retention, Transfer。「Risk reduction / minimisation」はテキストの公式用語ではない。選択肢に「Control」が存在しない。
- **修正**: 選択肢を「Risk control — reducing frequency and severity of potential loss」に変更

## PGI

### pgi-056 — FAIL (正答の誤り)
- **問題**: What is the purpose of the GIFT scheme in motor insurance?
- **現在の正答**: index 1「Standardise towing and storage charges after accidents」
- **正しい正答**: GIFT = GIA Insurance Fraud Tip-off scheme — rewards individuals up to S$10,000 for reporting fraud leading to prosecution and conviction
- **根拠**: Ch1 §7.17–7.19, p.34
- **修正**: 正答と全選択肢を書き換え。GIFT の正しい定義に基づく問題に再構成

### pgi-219 — FAIL (問題内容がテキストと不一致)
- **問題**: Loss of Use of Hotel Facilities benefit の内容
- **現在の正答**: index 1「Coverage for loss of prepaid hotel facilities (e.g. spa, golf) due to illness or injury」
- **正しい内容**: テキスト Ch4 §5.58–5.59, p.152 によると、LUHF は「ホテルがストライキ等で substantial services を24時間以上停止した場合に S$100/24h、最大 S$200 を支払う」もの。illness/injury による prepaid facility loss とは全く異なる
- **修正**: 問題・全選択肢・explanation をテキストの定義に基づき全面書き換え

### pgi-042 — WARN (数値がテキストと異なる)
- **問題**: What age thresholds typically attract higher premiums?
- **現在の正答**: index 0「Under 25, over 65, less than 2 years」
- **課題**: テキスト §5.6(c), p.16 は「usually above 70 / usually under 27」。25/65 は一部保険会社の値
- **修正**: 選択肢をテキストの主要値（under 27, over 70）に合わせる

### pgi-060 — WARN (Maco の説明が不正確)
- **問題**: What is Maco?
- **現在の正答**: index 1「Electronic filing and tracking of motor accident claims」
- **課題**: テキスト §8.26–8.31, p.40 によると Maco は「オンラインの損害額シミュレーター」（Singapore Courts + SAL 開発、2022年3月）。filing/tracking ではない
- **修正**: 正答を「Online simulator that generates approximate motor accident claim amounts」に変更
