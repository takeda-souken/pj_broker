import json, re, sys
sys.stdout.reconfigure(encoding='utf-8')

modules = [
    ('BCP', 'data/bcp.json'),
    ('ComGI', 'data/comgi.json'),
    ('PGI', 'data/pgi.json'),
    ('HI', 'data/hi.json'),
]

print('=== YEAR SAMPLES (first 8) ===')
count = 0
for mod, path in modules:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        en_years = set(re.findall(r'\b(19\d{2}|20\d{2})\b', q.get('explanation', '')))
        if en_years and 'explanationJP' in q:
            jp_years = set(re.findall(r'\b(19\d{2}|20\d{2})\b', q['explanationJP']))
            missing = en_years - jp_years
            if missing and count < 8:
                count += 1
                print(f'\n[{count}] {q["id"]} missing years: {missing}')
                for yr in list(missing)[:1]:
                    idx = q['explanation'].find(yr)
                    if idx >= 0:
                        start = max(0, idx-60)
                        end = min(len(q['explanation']), idx+len(yr)+60)
                        print(f'  EN: ...{q["explanation"][start:end]}...')
                jp = q['explanationJP']
                print(f'  JP: {jp[:150]}...')


print('\n\n=== GLOSSARY SAMPLES (first 8) ===')
glossary_map = {
    'insurer': '保険者',
    'indemnity': '損害填補',
    'premium': '保険料',
    'subrogation': '保険代位',
}
count = 0
for mod, path in modules:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for q in data:
        if 'explanationJP' not in q:
            continue
        explanation_lower = q.get('explanation', '').lower()
        ejp = q['explanationJP']
        for en_term, jp_term in glossary_map.items():
            if re.search(r'\b' + re.escape(en_term) + r'\b', explanation_lower) and jp_term not in ejp:
                if count < 8:
                    count += 1
                    alt_terms = {
                        '保険者': ['保険会社', '保険引受人'],
                        '損害填補': ['損害てん補', '損害補償', '填補', 'てん補', '補償'],
                        '保険料': ['プレミアム', '掛金'],
                        '保険代位': ['代位'],
                    }
                    found_alt = None
                    for alt in alt_terms.get(jp_term, []):
                        if alt in ejp:
                            found_alt = alt
                            break
                    print(f'\n[{count}] {q["id"]}: "{en_term}" -> expected "{jp_term}"')
                    if found_alt:
                        print(f'  ACTUAL: used "{found_alt}" instead')
                    else:
                        print(f'  JP excerpt: {ejp[:150]}...')
