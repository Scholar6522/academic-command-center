#!/usr/bin/env python3
import csv
from datetime import datetime
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / "data" / "tasks.csv"
required = [
    "ID", "Track", "Task", "Type", "Start", "Deadline", "Priority", "Target",
    "Status", "Progress", "Readiness", "Evidence", "Dependencies", "Notes"
]
allowed_status = {"Not Started", "In Progress", "Blocked", "Complete"}
errors = []

with path.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    if reader.fieldnames != required:
        errors.append(f"Unexpected headers: {reader.fieldnames}")
    rows = list(reader)

ids = [r["ID"] for r in rows]
if len(ids) != len(set(ids)):
    errors.append("Duplicate task IDs found")

for r in rows:
    for field in ["Start", "Deadline"]:
        if not r.get(field):
            continue
        try:
            datetime.strptime(r[field], "%Y-%m-%d")
        except ValueError:
            errors.append(f"{r['ID']}: invalid {field} date {r[field]!r}")
    try:
        p = int(r["Progress"])
        if not 0 <= p <= 100:
            errors.append(f"{r['ID']}: Progress must be 0–100")
    except ValueError:
        errors.append(f"{r['ID']}: invalid Progress")
    if r["Status"] not in allowed_status:
        errors.append(f"{r['ID']}: invalid Status {r['Status']!r}")

    dep_ids = [piece.strip() for piece in (r.get("Dependencies") or "").split(";") if piece.strip()]
    for dep in dep_ids:
        if dep not in ids:
            errors.append(f"{r['ID']}: dependency {dep!r} not found")

if errors:
    for e in errors:
        print(f"ERROR: {e}")
    raise SystemExit(1)

print(f"Validated {len(rows)} tasks successfully.")

