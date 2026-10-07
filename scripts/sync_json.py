#!/usr/bin/env python3
import csv
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "tasks.csv"
OUT_PATH = ROOT / "docs" / "DASHBOARD.md"
STATUS_ORDER = ["Not Started", "In Progress", "Blocked", "Complete"]
MONTH_ORDER = [
    "2026-10", "2026-11", "2026-12",
    "2027-01", "2027-02", "2027-03", "2027-04", "2027-05",
    "2027-06", "2027-07", "2027-08"
]

with CSV_PATH.open(newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))


def pct(items):
    if not items:
        return 0
    return round(sum(int(r["Progress"]) for r in items) / len(items))

status_counts = Counter(r["Status"] for r in rows)
track_counts = defaultdict(list)
month_counts = defaultdict(list)
for r in rows:
    track_counts[r["Track"]].append(r)
    month_counts[r["Deadline"][:7]].append(r)

completed = [r for r in rows if r["Status"] == "Complete"]
overdue = [
    r for r in rows
    if r["Status"] != "Complete" and r["Deadline"] and r["Deadline"] < date.today().isoformat()
]
critical_open = [r for r in rows if r["Priority"] == "Critical" and r["Status"] != "Complete"]

lines = []
lines.append("# Progress Dashboard\n")
lines.append(f"> Last generated: `{date.today().isoformat()}`\n")
lines.append(f"**Overall progress:** {pct(rows)}%  |  **Tasks:** {len(rows)}  |  **Complete:** {len(completed)}  |  **Open:** {len(rows)-len(completed)}\n")

lines.append("## Status")
lines.append("")
lines.append("| Status | Count |")
lines.append("|---|---:|")
for s in STATUS_ORDER:
    lines.append(f"| {s} | {status_counts.get(s, 0)} |")

lines.append("\n## Progress by track")
lines.append("")
lines.append("| Track | Tasks | Avg progress |")
lines.append("|---|---:|---:|")
for track in sorted(track_counts):
    tr = track_counts[track]
    lines.append(f"| {track} | {len(tr)} | {pct(tr)}% |")

lines.append("\n## Monthly workload")
lines.append("")
lines.append("| Month | Tasks | Avg progress |")
lines.append("|---|---:|---:|")
for month in MONTH_ORDER:
    m = month_counts.get(month, [])
    if m:
        lines.append(f"| {month} | {len(m)} | {pct(m)}% |")

lines.append("\n## Critical open work")
lines.append("")
lines.append("| ID | Task | Deadline | Status | Progress |")
lines.append("|---|---|---|---|---:|")
for r in sorted(critical_open, key=lambda x: x["Deadline"]):
    lines.append(f"| {r['ID']} | {r['Task']} | {r['Deadline']} | {r['Status']} | {r['Progress']}% |")

lines.append("\n## Overdue")
lines.append("")
if overdue:
    lines.append("| ID | Task | Deadline | Status |")
    lines.append("|---|---|---|---|")
    for r in sorted(overdue, key=lambda x: x["Deadline"]):
        lines.append(f"| {r['ID']} | {r['Task']} | {r['Deadline']} | {r['Status']} |")
else:
    lines.append("No overdue tasks according to the current `tasks.csv`. ✅")

lines.append("\n## How to update")
lines.append("")
lines.append("Edit `tasks.csv` and commit. GitHub Actions will regenerate this dashboard.")

OUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {OUT_PATH}")

