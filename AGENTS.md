# Agent operating rules

Before making changes:
1. Read `README.md`, `.github/copilot-instructions.md`, and relevant files under `docs/`.
2. Inspect `data/tasks.csv` before changing schedule logic.
3. Preserve the user's exam dates and targets unless explicitly instructed otherwise.

When adding features:
- Keep the app usable on desktop and mobile.
- Avoid unnecessary dependencies.
- Make derived metrics data-driven.
- Preserve accessibility and clear error states.
- Update documentation for user-facing behavior.

Validation:
- `python scripts/validate_tasks.py`
- If `data/tasks.csv` changed, regenerate `docs/DASHBOARD.md` with `python scripts/build_dashboard.py`.

