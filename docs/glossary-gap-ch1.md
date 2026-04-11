# Glossary Gap Report — BCP Chapter 1

> **作成者**: 水無瀬杏（翻訳担当）
> **日付**: 2026-04-11
> **目的**: Ch1翻訳中に発見した、glossary.jsonに未登録の用語一覧。
> 後続章でも頻出するため、glossaryへの追加を推奨する。

## 追加推奨: 高（全モジュールで頻出する基本用語）

| English | 杏が使った訳語 | 出現箇所 | 備考 |
|---------|--------------|----------|------|
| Insurance Broker | 保険ブローカー | 2.24-2.32, 3.4, 6.8 他 | 最頻出。ComGI/PGIでも多用 |
| Insurance Agent | 保険代理店 | 2.20-2.23, 3.4 他 | 最頻出 |
| Reinsurance Broker | 再保険ブローカー | 2.33, 6.10 他 | 再保険章でも頻出 |
| Intermediary | 仲介者 | 2.17-2.19 他 | "Insurance Intermediary"は登録済みだが単独のIntermediaryは未登録 |
| Premium | 保険料 | 2.20, 2.28 他 | 全モジュール最頻出の基本用語 |
| Policyholder | 保険契約者 | 2.32 他 | 同上 |
| Insured | 被保険者 | 2.26, 2.28 他 | 同上 |
| Commission | コミッション | 2.20, 2.28, 2.31 | 報酬形態として頻出 |
| Loss Adjuster | 損害査定人 | 9.1, 6.12 | Loss Assessor（被保険者側）は登録済み。Loss Adjuster（保険者側）は未登録 |
| Licensed Insurer | 免許保険者 | 3.1, 3.4, 5.2, 5.3 | 規制文脈で頻出 |
| Solvency Margin | ソルベンシー・マージン | 2.11 | 規制章でも出る |

## 追加推奨: 中（BCP・特定モジュールで繰り返し出現）

| English | 杏が使った訳語 | 出現箇所 | 備考 |
|---------|--------------|----------|------|
| Rating Agency | 格付機関 | 8.1-8.3 | BCP Ch8で重要 |
| Managing Agent | マネージング・エージェント | 2.15 | ロイズ特有。ComGIでも出る可能性 |
| Mediation | 調停 | 7.4, 7.10, 7.14 | FIDReC文脈で頻出 |
| Adjudicator | 裁定人 | 7.10-7.12 | Adjudication（裁定）は登録済みだが人を表す語は未登録 |
| Ceding Company | 出再会社 | 2.8 | Cedant（出再者）は登録済みだが同義語 |
| Retrocession | 再々保険（レトロセッション） | 2.8 | Retrocedent/Retrocessionaireは登録済みだがプロセス名が未登録 |
| Direct Life Insurer | 元受生命保険者 | 2.5, 3.4 | Direct Insurer（元受保険者）の下位区分 |
| Direct General Insurer | 元受損害保険者 | 2.5, 3.4 | 同上 |
| Direct Composite Insurer | 元受複合保険者 | 2.5, 3.4 | 同上 |
| Authorised Reinsurer | 認可再保険者 | 2.7, 3.1, 3.4 | Licensed Insurerとの区別が重要 |
| Foreign Insurer | 外国保険者 | 3.4 | 規制文脈 |
| Agency Agreement | 代理店契約 | 2.20, 2.31 | 契約章でも出る |
| Principal | 元受保険者（代理文脈） | 2.18, B1A | 代理法の文脈。複数の意味がある |
| Marine Mutual | 海上相互保険組合 | 2.16 | P&I Clubとセットで出る |
| Insurance Fund | 保険基金 | 2.11 | 規制文脈 |

## 追加推奨: 低（出現頻度が限定的、または文脈で明らか）

| English | 杏が使った訳語 | 出現箇所 | 備考 |
|---------|--------------|----------|------|
| Corporate Agent | 法人代理店 | B1A | 個人代理店との対比 |
| Individual Agent | 個人代理店 | B1A | 同上 |
| Underwriting Member | 引受メンバー | 2.13-2.15 | ロイズ特有 |
| Names (Lloyd's) | ネーム | 2.13 | ロイズ特有の呼称 |
| Case Manager | ケースマネージャー | 7.10, 7.11 | FIDReC特有 |
| Dispute Resolution | 紛争解決 | 7.2, 7.10 | 一般用語 |
| Code of Conduct | 行動規範 | 7.19 | Code of Practice（倫理行動規範）は登録済み |
| Representative Office | 駐在員事務所 | 3.4 | 低頻度 |
| Broking Staff | ブローキング・スタッフ | 3.4 | 低頻度 |
| Lloyd's Act 1871 | Lloyd's Act 1871 | 2.12 | 法律名。そのまま |

## 注記

- **Loss Adjuster vs Loss Assessor**: glossaryには Loss Assessor = 損害鑑定人（被保険者側）が登録済み。Loss Adjuster = 損害査定人（保険者側）は別の役割であり、BCP Ch7（Claims）で詳しく扱われる。両者の区別はCGI試験で問われる可能性が高い
- **Principal**: 代理法の文脈では「本人」（被代理人）、保険の文脈では「元受保険者」の意味で使われる。glossaryに登録する場合はタグで区別が必要
- **Commission vs Brokerage**: Brokerage（仲立手数料）は登録済み。Commission（コミッション）は未登録だが、代理店報酬として頻出。両者の違いは試験ポイント
