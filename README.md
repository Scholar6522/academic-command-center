# Academic & ML Command Center

A personal academic command center for the 2026–2027 no-retake plan: GED → ACT → SAT → AP/Cambridge → mathematics/physics foundations → CS/ML growth → application readiness.

## What this repository contains

- `data/tasks.csv` — human-edited source of truth
- `data/tasks.json` — generated browser data consumed by the dashboard
- `index.html` + `app.js` + `styles.css` — static dashboard UI
- `scripts/validate_tasks.py` — validates CSV schema, dates, IDs, progress values, and dependency structure
- `scripts/build_dashboard.py` — rebuilds the generated markdown dashboard
- `scripts/sync_json.py` — syncs CSV to JSON
- `scripts/sync_github_issues.py` — GitHub Issue sync helper
- `docs/` — generated and reference documentation
- `.github/workflows/` — validation, issue sync, and Pages deployment
- `.github/prompts/` — reusable Copilot prompt starters

## Repository structure

```
.
├── AGENTS.md
├── README.md
├── index.html
├── app.js
├─��� styles.css
├── data/
│   ├── tasks.csv
│   └── tasks.json
├── scripts/
│   ├── build_dashboard.py
│   ├── sync_github_issues.py
│   ├── sync_json.py
│   └── validate_tasks.py
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COPILOT_PLAYBOOK.md
│   ├── DASHBOARD.md
│   ├── NO_RETAKE_READINESS.md
│   ├── PRODUCT_SPEC.md
│   └── WEEKLY_REVIEW.md
├── .github/
│   ├── copilot-instructions.md
│   ├── ISSUE_TEMPLATE/
│   │   └── academic-task.yml
│   ├── prompts/
│   │   ├── add-task.prompt.md
│   │   ├── build-dashboard.prompt.md
│   │   ├── exam-readiness-audit.prompt.md
│   │   └── weekly-review.prompt.md
│   └── workflows/
│       ├── deploy-pages.yml
│       ├── sync-progress.yml
│       └── validate.yml
└── assets/
    └── README.md
```

## Roadmap image note

The dashboard references `assets/academic-ml-roadmap.png`. If that file is not uploaded yet, the page will show the image area with a clear fallback message instead of breaking. Please upload your master roadmap image to:

`assets/academic-ml-roadmap.png`

This is a required visual reference for the dashboard hero/roadmap section.

## How to run locally

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

The dashboard reads `data/tasks.json`, so treat `data/tasks.csv` as the human-editable source of truth.

## How to update tasks

Edit `data/tasks.csv` and then regenerate the browser data:

```bash
python scripts/sync_json.py
python scripts/validate_tasks.py
python scripts/build_dashboard.py
```

This keeps the CSV and JSON in sync without requiring manual edits in both places.

## Self-update / issue sync model

This repository is set up to support issue-backed progress tracking, but GitHub does not magically know when offline work happens. The dashboard/pipeline will only update from GitHub Issues or manual CSV edits.

At minimum, the flow is:

- update a task in `data/tasks.csv` directly, or
- close/update the corresponding GitHub Issue checklist, or
- add a `Progress: 0-100` override in the issue body

The repo includes a helper script and automation workflow for syncing issue state back into task data where safe.

## GitHub Pages deployment

GitHub Pages is configured via `.github/workflows/deploy-pages.yml`. A repository setting still needs to be enabled in GitHub to publish the static site from GitHub Actions.

## Copilot usage

Use the repo prompts in `.github/prompts/` as starting points for:

- building the dashboard,
- weekly review planning,
- adding tasks,
- exam readiness audits.

## Validation

Run:

```bash
python scripts/validate_tasks.py
python scripts/build_dashboard.py
```

## Important limitation

Offline study still requires a human action before it appears in the tracked data:

- closing/updating the issue,
- checking issue checklist items,
- or editing the CSV directly.

This is intentional: the repo prioritizes evidence over vanity metrics.

## Design principle

This is not a generic task manager. It is a high-stakes academic command center focused on:

1. readiness,
2. deadlines,
3. dependencies,
4. measurable performance,
5. evidence,
6. sustainable workload,
7. the long-term ML/CS trajectory.

## License

This project is provided as a local personal planning repository for academic use.

