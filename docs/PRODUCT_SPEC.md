# Product Specification

## Goal
Make it impossible to lose sight of what to do next while preserving the larger academic trajectory.

## Core screens
1. Command Center — progress, risk, next deadlines, current month.
2. Roadmap — month-by-month timeline from Oct 2026 to Aug 2027.
3. Task Explorer — searchable/filterable tasks.
4. Exam Readiness — score targets, readiness state, evidence, and risk.
5. CS/ML Portfolio — project evidence, GitHub links, and technical skills.

## Data model
Task fields:
- ID
- Track
- Task
- Type
- Start
- Deadline
- Priority
- Target
- Status
- Progress
- Readiness
- Evidence
- Dependencies
- Notes

Recommended future fields:
- Actual score
- Practice score
- Last reviewed
- Study hours planned
- Study hours completed
- GitHub URL
- Project URL
- Resource URL

## No-retake behavior
Exam tasks should surface risk when:
- deadline is near and readiness is not `Exam Ready`
- readiness is `Needs Remediation`
- prerequisite tasks are incomplete

## Preferred future enhancements
- calendar view
- drag-and-drop monthly planning
- study-session logger
- score trend charts
- spaced-repetition review queue
- GitHub contribution/commit panel
- automatic overdue flags
- exam readiness calculator
- dependency graph

