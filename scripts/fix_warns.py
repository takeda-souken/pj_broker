import json, sys
sys.stdout.reconfigure(encoding='utf-8')

# === PGI WARN fixes ===
with open('data/pgi.json', 'r', encoding='utf-8') as f:
    pgi = json.load(f)
pgi_map = {q['id']: q for q in pgi}

# pgi-042: age thresholds 25/65 -> 27/70 per textbook
q = pgi_map['pgi-42']
q['choices'][0] = "Under 27, over 70, or less than 2 years driving experience"
q['explanation'] = "An additional excess applies to young drivers (usually under 27), elderly drivers (usually above 70), or inexperienced drivers (less than 2 years). Some insurers may use lower thresholds (e.g. under 25 or over 65), but the textbook's primary values are under 27 and above 70 (Ch1 S5.6(c), p.16)."
print(f"Fixed {q['id']}: age thresholds -> under 27 / over 70")

# pgi-060: Maco definition completely wrong -> rewrite
q = pgi_map['pgi-60']
q['question'] = "What is Maco?"
q['choices'] = [
    "An online platform for purchasing motor insurance policies",
    "An online claims-amount simulator that generates approximate motor accident damages figures",
    "A system for automated fault determination in motor accidents",
    "An electronic filing system for motor insurance policy renewals"
]
q['answer'] = 1
q['explanation'] = "Maco is an online motor accident claims simulator developed by the Singapore Courts and the Singapore Academy of Law (SAL) in March 2022. Users answer multiple-choice questions to generate an approximate damages figure for their motor accident claim (Ch1 S8.26-8.31, p.40)."
print(f"Fixed {q['id']}: Maco definition rewritten")

with open('data/pgi.json', 'w', encoding='utf-8') as f:
    json.dump(pgi, f, ensure_ascii=False, indent=2)
print("pgi.json saved.")

# === ComGI WARN fixes ===
with open('data/comgi.json', 'r', encoding='utf-8') as f:
    comgi = json.load(f)
comgi_map = {q['id']: q for q in comgi}

# comgi-002: explanation doesn't address palm oil nuance
q = comgi_map['comgi-002']
q['explanation'] = "A Fire Insurance policy covers property damaged by water or other extinguishing agents used to put out a fire, as this is proximately caused by fire. Choice C (spontaneous combustion of palm oil seeds) is excluded because damage to the seeds themselves from their own spontaneous heating is not covered (S2.14). However, if the fire spreads to nearby property, that spread damage IS covered -- the question asks about loss to the seeds, not the spread. Typhoon damage requires a separate Perils of Nature extension. Theft during or after fire is expressly excluded (S2.14)."
print(f"Fixed {q['id']}: explanation clarified re palm oil nuance")

# comgi-013: Penal Code reference is textbook-faithful but outdated
q = comgi_map['comgi-013']
q['explanation'] = "Under Section 378 of the Singapore Penal Code (cited in the textbook as 'Penal Code 1871', now revised as Cap. 224), theft is defined as: whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property for such taking. Crucially, this definition does NOT require force or violence -- that distinguishes theft from robbery."
print(f"Fixed {q['id']}: added note on Penal Code revision")

# comgi-024: explanation missing second trigger for total-loss basis
q = comgi_map['comgi-024']
q['explanation'] = "For total loss -- either when the equipment is beyond economic repair, OR when the repair cost equals or exceeds the actual value immediately before the damage (S4.7(b)) -- settlement is based on actual value (replacement value less depreciation), UNLESS the policy has been extended to cover full replacement value. For partial loss that can be economically repaired, the insurer pays reasonable repair costs including dismantling, re-erection, and transport fees."
print(f"Fixed {q['id']}: added second trigger condition")

# comgi-039: choice text says "non-accidental" which is wrong; question structure problematic
# The textbook just says it's excluded (no reason given). Rewrite question to test the exclusion itself.
q = comgi_map['comgi-039']
q['question'] = "Under CSR Insurance, what is the rule regarding breakage of fragile items such as glass and china?"
q['choices'] = [
    "Breakage of all fragile items is covered without exception under the All Risks basis",
    "Breakage of fragile items is excluded, but damage caused by fire or theft IS covered",
    "Breakage of fragile items is excluded with no exceptions whatsoever",
    "Breakage of fragile items is covered only if a separate Glass Insurance rider is attached"
]
q['answer'] = 1
q['explanation'] = "Under CSR Insurance, breakage of fragile items such as glass and china is generally excluded (S6.14(d)). However, if the breakage was caused by fire or theft, it IS covered. This exception recognises that fire and theft are named perils under the policy. The textbook does not provide a specific rationale for the exclusion beyond listing it among standard CSR exclusions (S6.13-6.14)."
print(f"Fixed {q['id']}: question rewritten to test exclusion rule directly")

with open('data/comgi.json', 'w', encoding='utf-8') as f:
    json.dump(comgi, f, ensure_ascii=False, indent=2)
print("comgi.json saved.")

print("\n=== All 6 WARN fixes applied ===")
