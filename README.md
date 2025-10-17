# Jeremiah-J-Emmanuel_Campus-Life-Planner
This is for the Frontend web development individual summative lab at the African Leadership University

🏫 Campus Life Planner

Campus Life Planner is a responsive and accessible web application designed to help university students manage, track, and analyze their weekly campus events, workshops, and activities.
Built using vanilla HTML, CSS, and JavaScript, it allows users to add, edit, delete, and search events using regex-powered search, view visual statistics on a dashboard, and manage weekly time caps through a settings page.

📚 Table of Contents

Overview

Features

Tech Stack

Data Model

Regex Catalog

Accessibility (a11y)

Keyboard Map

Setup Guide

Testing Instructions

Deployment

Credits

🧭 Overview

The Campus Life Planner helps students organize and visualize their schedules.
It stores data locally using localStorage and uses Chart.js to present real-time statistics, such as:

Total time spent per day

Time per tag or activity type

Percentage of total allocated hours used

This app meets the requirements of the Summative Assignment – Building Responsive UI for the Campus Life Planner theme.

⚙️ Features

✅ Add, Edit, Delete Events
Users can create events with a title, date, duration, and tags. Edits and deletions update automatically.

✅ Persistent Storage
All records are saved to localStorage and remain after page refresh.

✅ Regex Search and Sort

Search dynamically by title, tag, or date.

Supports advanced regex like @tag:Workshop or /\b(\w+)\s+\1\b/.

Sort by date, title, duration, or tag.

✅ Highlight Matches
Search results highlight matched patterns using <mark> elements for better visibility.

✅ Settings Page
Users can:

Set their name

Set a weekly hour cap

This cap limits how many total event hours they can allocate.

✅ Dashboard (Stats)
Displays three visual charts:

Bar Chart – Hours spent each day

Horizontal Bar – Hours per tag

Donut Chart – Used vs Remaining hours

✅ Accessibility Ready

Full keyboard navigation

Semantic structure (header, main, footer, nav)

aria-live regions and descriptive labels

High-contrast and screen-reader-friendly elements

🧩 Tech Stack
Layer	Technology
# Campus Life Planner — Summative Project

This repository contains the Campus Life Planner: a responsive, accessible, vanilla HTML/CSS/JS app for tracking tasks/events with durations, tags, search, and simple stats. It’s built to meet the "Building Responsive UI" summative brief.

## Table of contents
- Overview
- Quick start
- Features
- Data model & persistence
- Regex catalog & examples
- Keyboard map
- Accessibility notes
- Tests & seed data
- Deployment
- Milestones & mapping to the rubric
- Contact / author

## Overview
The Campus Life Planner helps students plan and track events (tasks, study sessions, meetings) with durations and tags. Core principles:
- Mobile-first responsive layout (Flexbox + media queries)
- Semantic HTML and accessible interactions (ARIA, roles, keyboard support)
- Modular, minimal JavaScript (ES modules)
- Persistence via localStorage and JSON import/export
- Safe regex-based search and validation with inline feedback

## Quick start
This project uses ES modules; serve the files via a local static server (recommended) and open `index.html` in your browser.

Using Python (cross-platform):

```powershell
# from the project root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Or using Node (if installed):

```powershell
npx http-server -p 8000
# then open http://localhost:8000
```

You can also use VS Code Live Server extension.

## Features
- Add / edit / delete events
- Title, due date, duration (minutes), tags for each record
- Cards view (mobile) and richer layout on larger screens
- Live regex search (safe compiler + case-insensitive toggle)
- Sorting by date, title, and duration
- Import / export JSON with validation
- Settings page for units and weekly cap (default cap: 600 minutes / 10 hours)
- Dashboard with totals, sum of durations, top tag, and a simple last-7-days trend
- Inline edit mode and delete confirmation

## Data model
Each record contains:
```json
{
  "id": "task_001",
  "title": "AI & Ethics Seminar",
  "dueDate": "2025-10-18",
  "duration": 90,
  "tags": ["Seminar", "Technology", "Ethics"],
  "createdAt": "2025-10-01T12:00:00Z",
  "updatedAt": "2025-10-05T10:30:00Z"
}
```
All data is auto-saved to localStorage using the key `campus:events`. The settings are stored under `campus:settings`.

## Default weekly cap
If no setting is provided, the weekly cap defaults to **600 minutes (10 hours)**. This value prevents adding events that would exceed the weekly allotment.

## Regex catalog (validation + search)
This project implements at least four validation rules plus at least one advanced regex. Use the patterns below in the app's validators and search utilities.

1. Title / Description
- Pattern: ^\\S(?:.*\\S)?$
- Purpose: forbids leading/trailing spaces and allows non-empty content
- Example: `"Lunch"` matches; `" leading"` does not.

2. Numeric (duration/pages/amount)
- Pattern: ^(0|[1-9]\\d*)(\\.\\d{1,2})?$
- Purpose: integer or decimal with up to 2 decimal places; forbids leading zeros except 0
- Example: `90`, `0`, `12.5`, `12.50` match; `01` does not.

3. Date (YYYY-MM-DD)
- Pattern: ^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$
- Purpose: Strict ISO date format
- Example: `2025-10-17` matches; `17-10-2025` does not.

4. Category / Tag
- Pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
- Purpose: Letters, spaces or hyphens between words; no leading/trailing separators
- Example: `Group-Study`, `Self Study` match; `-bad` does not.

5. Advanced / Safety checks (used for search and extra validations)
- Duplicate-word detection (back-reference): /\\b(\\w+)\\s+\\1\\b/
  - Finds repeated words like "the the"; use for warning users about typos.
- Search prefix for tag filtering: ^@tag:([A-Za-z0-9-]+)
  - Example: `@tag:study` filters to records with the `study` tag.

### Safe search compilation
The search input is compiled with a small helper that wraps `new RegExp(...)` in try/catch and returns `null` for invalid patterns. This prevents the UI from crashing on malformed regex.

## How search highlighting works
- Search input compiles to a safe RegExp (with optional 'i' flag for case-insensitive).
- Matches are wrapped in `<mark>` elements using text-safe escaping.
- The code ensures the markup does not break accessibility (no nested interactive elements inside marks).

## Keyboard map (common shortcuts)
- Tab / Shift+Tab: navigate focusable elements (forms, buttons, search)
- Enter: submit focused form or activate focused button
- `/` (slash) focuses the search bar (optional helper in-app)
- `+` or `a` when focused on main navigation: open Add new event (the `+` button)
- Arrow keys (↑ ↓): move between cards in list focus mode (if implemented)
- Escape: exit inline edit mode or close modals

Add a note in the UI (or README) if you provide any extra shortcuts.

## Accessibility (a11y) notes
- Semantic landmarks used: `header`, `nav`, `main`, `section`, `footer`.
- Labels are bound to inputs; form controls have required attributes where appropriate.
- Visible focus styles are included.
- Status messages and search errors are announced via a role="status" / `aria-live="polite"` element.
- Delete actions require confirmation and are exposed to screen readers via appropriate aria-labels.
- Keyboard-only navigation is supported for core flows: add, edit, delete, search.

## Tests & seed data
- `seed.json` contains starter records (≥10) used when no data exists in localStorage.
- There is a `tests.html` (if present) with small assertions for validators (validation rules) and the safe regex compiler.

To reset app data for testing, open the browser devtools and run:

```javascript
localStorage.removeItem('campus:events');
localStorage.removeItem('campus:settings');
location.reload();
```

## Import / Export JSON
- Export: clicks a button to download a validated JSON file of current records.
- Import: uploads a JSON file; the structure is validated against the expected schema before writing to localStorage. Invalid files are rejected with an accessible error.

## Units & Settings
- Default unit: minutes (duration). Settings allow converting minutes ↔ hours in the UI for display.
- Weekly cap: default 600 minutes; users can change this in Settings. The Dashboard shows remaining minutes and announces via aria-live whether the user is within or over the cap.

## Deployment
This project can be deployed to GitHub Pages. Add your GitHub repo URL and the GitHub Pages link here after deployment.

Checklist before submission:
- [ ] Add a 2–3 minute demo video (unlisted) showing keyboard navigation, search edge cases, import/export, and responsiveness
- [ ] Confirm `seed.json` has ≥10 diverse records
- [ ] Verify `tests.html` and validators
- [ ] Add GitHub Pages URL below and push repository

## Milestones & rubric mapping
- M1 Spec & Wireframes (10%): design rationale and accessibility plan
- M2 Semantic HTML & Base CSS (10%): mobile-first layout and media queries
- M3 Forms & Regex Validation (15%): 4+ validators and tests
- M4 Render + Sort + Regex Search (20%): rendering, sortable columns, highlight
- M5 Stats + Cap/Targets (15%): dashboard and cap logic with aria-live
- M6 Persistence + Import/Export + Settings (15%): localStorage and JSON roundtrip
- M7 Polish & A11y Audit (15%): keyboard pass, animation, README and demo video

## Contact
Author: Jeremiah Jewel Emmanuel
Email: (add your email)
GitHub: (add your GitHub profile URL)

---

If you want, I can also:
- Generate a small `README`-friendly demo script for the 2–3 minute video
- Produce the regex test cases for `tests.html`
- Add a short `CONTRIBUTING.md` and `.gitignore` if missing
