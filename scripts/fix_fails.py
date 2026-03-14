import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# === BCP fixes ===
with open('data/bcp.json', 'r', encoding='utf-8') as f:
    bcp = json.load(f)

bcp_map = {q['id']: q for q in bcp}

# 1. bcp-031: answer 1→2
q = bcp_map['bcp-031']
q['answer'] = 2
q['explanation'] = "In general (non-marine) insurance, insurable interest must exist both at inception of the policy and at the time of loss. This differs from marine insurance, where insurable interest need only exist at the time of loss. Life insurance requires insurable interest only at inception."
print(f"Fixed {q['id']}: answer -> {q['answer']}")

# 2. bcp-024: answer 2→1 (textbook uses only "moral hazard")
q = bcp_map['bcp-024']
q['answer'] = 1
q['explanation'] = "The BCP textbook (Ch3 S4.5-4.9) classifies both deliberate fraud and carelessness/indifference after obtaining insurance under the single term 'moral hazard.' While some insurance theory distinguishes 'morale hazard' (carelessness) from 'moral hazard' (deliberate fraud), the BCP textbook does not make this distinction. The correct answer per the textbook is moral hazard."
print(f"Fixed {q['id']}: answer -> {q['answer']}")

# 3. bcp-121: "Eight" → "Nine"
q = bcp_map['bcp-121']
q['choices'][0] = "Nine: Acts, Subsidiary Legislation, Directions, Directives, Notices, Guidelines, Practice Notes, Circulars, Policy Statements"
q['explanation'] = "MAS issues nine categories of regulatory instruments: (1) Acts, (2) Subsidiary Legislation, (3) Directions, (4) Directives, (5) Notices, (6) Guidelines, (7) Practice Notes, (8) Circulars, and (9) Policy Statements."
print(f"Fixed {q['id']}: choice[0] Eight->Nine")

# 4. bcp-049: answer 1→0
q = bcp_map['bcp-049']
q['answer'] = 0
q['explanation'] = "When a principal dies, both actual and apparent authority terminate immediately by operation of law, regardless of whether the third party was aware of the death (Ch5 S9.6). This is different from voluntary termination of agency (S9.5), where apparent authority may continue until third parties receive notice. Death and insanity are examples of termination by operation of law, which takes effect immediately."
print(f"Fixed {q['id']}: answer -> {q['answer']}")

# 5. bcp-030: fix choice[2] terminology
q = bcp_map['bcp-030']
q['choices'][2] = "Risk control -- taking steps to reduce the frequency and severity of potential loss"
q['explanation'] = "The BCP textbook (Ch3 S5.1) identifies four methods of handling risk: Avoidance, Control, Retention, and Transfer. Installing sprinkler systems and conducting fire drills are examples of risk control -- actively reducing the frequency and severity of potential losses rather than avoiding, retaining, or transferring the risk."
print(f"Fixed {q['id']}: choice[2] -> Risk control")

with open('data/bcp.json', 'w', encoding='utf-8') as f:
    json.dump(bcp, f, ensure_ascii=False, indent=2)
print("bcp.json saved.")

# === PGI fixes ===
with open('data/pgi.json', 'r', encoding='utf-8') as f:
    pgi = json.load(f)

pgi_map = {q['id']: q for q in pgi}

# 6. pgi-56: Complete rewrite
q = pgi_map['pgi-56']
q['question'] = "What is the purpose of the GIA Insurance Fraud Tip-off (GIFT) scheme?"
q['choices'] = [
    "To standardise towing and storage charges after motor accidents",
    "To reward individuals who report motor insurance fraud leading to successful prosecution",
    "To provide free legal advice to accident victims",
    "To track and monitor motor insurance claims electronically"
]
q['answer'] = 1
q['explanation'] = "GIFT (GIA Insurance Fraud Tip-off) is a scheme that rewards individuals with up to S$10,000 for reporting motor insurance fraud that leads to successful prosecution and conviction (Ch1 S7.17-7.19)."
print(f"Fixed {q['id']}: complete rewrite")

# 7. pgi-219: Complete rewrite
q = pgi_map['pgi-219']
q['question'] = "Under a travel insurance policy, what does the 'Loss of Use of Hotel Facilities' benefit cover?"
q['choices'] = [
    "Reimbursement when a hotel overbooks and the insured is relocated to a different hotel",
    "A daily benefit when the hotel withdraws substantial services (e.g. utilities, meals) for 24+ hours due to industrial action or unexpected strike",
    "Compensation for theft of personal belongings from the hotel room",
    "Coverage for damage caused by the insured to hotel property"
]
q['answer'] = 1
q['explanation'] = "Loss of Use of Hotel Facilities covers the situation where a hotel has withdrawn its substantial services continuously for at least 24 hours as a result of an industrial action or unexpected strike. The insurer pays a daily benefit (e.g. S$100 per 24-hour period) up to a limit (e.g. S$200). Substantial services include utilities, meals, and services of waiters and hotel chambermaids (Ch4 S5.58-5.59, p.152)."
print(f"Fixed {q['id']}: complete rewrite")

with open('data/pgi.json', 'w', encoding='utf-8') as f:
    json.dump(pgi, f, ensure_ascii=False, indent=2)
print("pgi.json saved.")

print("\n=== All 7 FAIL fixes applied ===")
