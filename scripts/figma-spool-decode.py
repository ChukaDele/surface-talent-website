"""Decode Figma exports spooled by the in-app browser tool into design-dump/pages.
Payload convention: "JPG:<key>:<base64>" or "OUTLINE:<key>:<json>" (optionally padded)."""
import json, base64, glob, os, re, sys
d = os.path.expanduser('~/.claude/projects/-Users-chukwuka-Updated-Surface-Talent-Website/2845b175-b040-44c3-b429-977e8b4dd7be/tool-results/')
names = {'2010_2': 'clients', '2027_20831': 'clients-hero', '2027_20100': 'candidates', '2032_21127': 'contact', '2036_240': 'about', '2048_1072': 'jobs',
         '2050_352': 'disciplines-b', '2036_521': 'disciplines-a', '2051_190': 'disciplines-variation1', '2050_190': 'disciplines-container'}
os.makedirs('design-dump/pages', exist_ok=True)
seen = set(os.listdir('design-dump/pages'))
for f in sorted(glob.glob(d + 'mcp-Claude_Browser-javascript_tool-*.txt')):
    try: arr = json.load(open(f)); txt = arr[0]['text']
    except Exception: continue
    t = txt.strip()
    if not t.startswith('"'): continue
    try: val = json.loads(t[: t.rfind('"') + 1])
    except Exception: continue
    m = re.match(r'(JPG|OUTLINE|SVGS):([^:]+):(.*)$', val, re.S)
    if not m: continue
    kind, key, body = m.groups()
    body = body.split('\n')[0]  # drop padding
    if kind == 'JPG':
        out = f'design-dump/pages/{names.get(key, key)}.jpg'
        if os.path.basename(out) in seen: continue
        open(out, 'wb').write(base64.b64decode(body + '=' * (-len(body) % 4)))
    elif kind == 'SVGS':
        os.makedirs('public/assets/svg', exist_ok=True)
        for name, svg in json.loads(body).items():
            if not svg.startswith('<svg'): print('skip', name, svg[:40]); continue
            out = f'public/assets/svg/{name}.svg'
            if os.path.exists(out): continue
            open(out, 'w').write(svg); print(out, len(svg))
        continue
    else:
        out = f'design-dump/pages/outline-{names.get(key, key)}.json'
        if os.path.basename(out) in seen: continue
        open(out, 'w').write(body)
    print(out, os.path.getsize(out))
