"""Create pgi.json and hi.json: merge real questions + fill with placeholders."""
import json, os

def make_dummy(id_str, topic, n):
    return {
        "id": id_str,
        "topic": topic,
        "question": f"[PLACEHOLDER] {topic} — Question {n}",
        "choices": ["A) Placeholder A", "B) Placeholder B", "C) Placeholder C", "D) Placeholder D"],
        "answer": 0,
        "explanation": "This is a placeholder question. Real content will be generated from the textbook.",
        "jpComparison": "（準備中）",
        "keywords": ["placeholder"],
        "difficulty": 2
    }

DATA = "c:/pj_broker/data"

# === PGI ===
pgi_topics = [
    ("Private Motor Car Insurance", 60),
    ("Personal Property Insurance", 55),
    ("Personal Accident Insurance", 55),
    ("Travel Insurance", 55),
    ("Personal Liability Insurance", 45),
    ("Critical Illness & Hospital Cash Insurance", 60),
    ("Foreign Domestic Worker & Golfer Insurance", 30),
]

pgi_real = []
for f in ['pgi-ch1-gen.json','pgi-ch3-gen.json','pgi-ch4-gen.json','pgi-ch5-gen.json']:
    path = os.path.join(DATA, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as fh:
            pgi_real.extend(json.load(fh))

pgi_all = []
idx = 1
for topic, target in pgi_topics:
    real = [q for q in pgi_real if q['topic'] == topic]
    for q in real:
        q['id'] = f'pgi-{idx:03d}'
        pgi_all.append(q)
        idx += 1
    for i in range(target - len(real)):
        pgi_all.append(make_dummy(f'pgi-{idx:03d}', topic, i+1))
        idx += 1

with open(os.path.join(DATA, 'pgi.json'), 'w', encoding='utf-8') as f:
    json.dump(pgi_all, f, ensure_ascii=False, indent=2)

real_c = len([q for q in pgi_all if 'PLACEHOLDER' not in q['question']])
print(f'PGI: {len(pgi_all)} total ({real_c} real, {len(pgi_all)-real_c} placeholder)')

# === HI ===
hi_topics = [
    ("Healthcare Environment in Singapore", 30),
    ("Medical Expense Insurance", 45),
    ("Group Hospital & Surgical Insurance", 40),
    ("Disability Income Insurance", 40),
    ("Long-Term Care Insurance", 35),
    ("Critical Illness Insurance", 40),
    ("Other Types of Health Insurance", 30),
    ("Managed Healthcare", 35),
    ("Healthcare Financing", 45),
    ("Common Policy Provisions", 40),
    ("Health Insurance Pricing", 40),
    ("Health Insurance Underwriting", 40),
    ("MAS 120 Disclosure & Advisory Process", 40),
]

hi_real = []
for f in ['hi-ch1-gen.json']:
    path = os.path.join(DATA, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as fh:
            hi_real.extend(json.load(fh))

hi_all = []
idx = 1
for topic, target in hi_topics:
    real = [q for q in hi_real if q['topic'] == topic]
    for q in real:
        q['id'] = f'hi-{idx:03d}'
        hi_all.append(q)
        idx += 1
    for i in range(target - len(real)):
        hi_all.append(make_dummy(f'hi-{idx:03d}', topic, i+1))
        idx += 1

with open(os.path.join(DATA, 'hi.json'), 'w', encoding='utf-8') as f:
    json.dump(hi_all, f, ensure_ascii=False, indent=2)

real_c = len([q for q in hi_all if 'PLACEHOLDER' not in q['question']])
print(f'HI: {len(hi_all)} total ({real_c} real, {len(hi_all)-real_c} placeholder)')

# Summary
for name, qs in [('PGI', pgi_all), ('HI', hi_all)]:
    topics = {}
    for q in qs:
        t = q['topic']
        is_real = 'PLACEHOLDER' not in q['question']
        if t not in topics: topics[t] = [0, 0]
        topics[t][0 if is_real else 1] += 1
    print(f'\n{name} topics:')
    for t, (r, d) in topics.items():
        status = f'{r} real + {d} placeholder' if d else f'{r} real'
        print(f'  {t}: {r+d} ({status})')
