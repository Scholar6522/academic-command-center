# Academic & ML Command Center

## Mission

Track the 2026–2027 academic and ML roadmap with a focus on readiness, deadlines, dependencies, and evidence-driven progress.

## Key principles

- `data/tasks.csv` is the source of truth.
- `data/tasks.json` is generated from the CSV.
- The dashboard should prioritize readiness over vanity completion metrics.
- Dates and targets remain stable unless the user explicitly changes them.

## Architecture summary

- Static HTML/CSS/JS frontend served directly or through GitHub Pages.
- CSV-backed task data, synced into JSON via Python scripts.
- Markdown dashboard generated from task data.
- Optional GitHub Issue sync for progress updates and evidence-based completions.

## Data flow

1. Human edits `data/tasks.csv`.
2. `scripts/sync_json.py` rebuilds `data/tasks.json`.
3. `scripts/validate_tasks.py` checks schema and values.
4. `scripts/build_dashboard.py` generates `docs/DASHBOARD.md`.
5. The static frontend loads the JSON and renders filters, metrics, and roadmap.

## Operational notes

- Use the repository prompts in `.github/prompts/` for Copilot-assisted planning.
- GitHub issue sync is helpful but not a substitute for offline evidence, which still requires a CSV edit or issue update.
- The dashboard should remain usable on mobile and desktop.

