#!/usr/bin/env python3
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
with open(ROOT / 'data' / 'tasks.csv', newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
for r in rows:
    r['Progress'] = int(r['Progress'] or 0)
(ROOT / 'data' / 'tasks.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
print(f'Synced {len(rows)} tasks to data/tasks.json')

