# Copilot Playbook

Use Copilot as the builder, reviewer, and planning assistant.

## Best first prompt

> Read the repository instructions, inspect the current application, then improve the dashboard without changing any dates or score targets. First explain the proposed change, then implement it, validate it, and summarize the files changed.

## Feature prompts

### Timeline
> Make the timeline easier to scan. Highlight the current month, show exam milestones, and surface overloaded months without changing schedule data.

### Readiness
> Add an exam readiness workflow using practice scores, recent timed tests, error-log status, and prerequisite completion. Keep `Exam Ready` separate from `Complete`.

### Weekly planner
> Add a weekly planner that converts tasks into daily study blocks while respecting dependencies and avoiding excessive load during exam-heavy periods.

### ML portfolio
> Build a portfolio view for CS/ML work with project title, problem, dataset, method, metric, GitHub URL, demo URL, and completion status.

### Analytics
> Add score/progress trend charts using only locally stored data. Never invent historical scores.

