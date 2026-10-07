# Academic & ML Command Center

A personal academic / ML roadmap tracker for a high-readiness no-retake plan.

## Overview

This dashboard is structured around evidence, deadlines, dependencies, and exam risk rather than simple completion-count vanity metrics.

## Repository status

- Source of truth: `data/tasks.csv`
- Browser data: `data/tasks.json`
- Validation: `python scripts/validate_tasks.py`
- Dashboard generator: `python scripts/build_dashboard.py`

## Update flow

1. Edit the schedule in `data/tasks.csv`.
2. Regenerate the browser JSON via `python scripts/sync_json.py`.
3. Validate with `python scripts/validate_tasks.py`.
4. Regenerate docs with `python scripts/build_dashboard.py`.

## Important note

The roadmap image file is expected at `assets/academic-ml-roadmap.png`. If it is not uploaded yet, the dashboard keeps the reference in place and shows a fallback note instead of breaking the page.

