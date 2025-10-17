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
Frontend	HTML5, CSS3, JavaScript (ES6)
Charts	Chart.js 2.9.4
Storage	localStorage
Validation & Search	Regular Expressions (Regex)
Accessibility	ARIA roles, semantic HTML, visible focus styles
🧮 Data Model

Each record follows the structure:

{
  "id": "task_001",
  "title": "AI & Ethics Seminar",
  "dueDate": "2025-10-18",
  "duration": 90,
  "tags": ["Seminar", "Technology", "Ethics"],
  "createdAt": "2025-10-01T12:00:00Z",
  "updatedAt": "2025-10-05T10:30:00Z"
}


Stored under:

localStorage['campus:events']

🧠 Regex Catalog
Field	Pattern	Purpose
Title / Description	/^\S(?:.*\S)?$/	Disallow leading/trailing spaces
Duration (Minutes)	`/^(0	[1-9]\d*)$/`
Date	`/^\d{4}-(0[1-9]	1[0-2])-(0[1-9]
Tags	/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/	Letters, spaces, and hyphens
Duplicate Word Detector	/\b(\w+)\s+\1\b/	Advanced back-reference example
Tag Search	/^@tag:\w+/	Filter by a specific tag
Case-Insensitive Search Toggle	User can toggle i flag in UI	
♿ Accessibility (a11y)

Semantic HTML5 structure (header, main, footer, nav, form)

Keyboard focus indicators on all inputs/buttons

aria-live="polite" region announces search results

Screen-reader-only (sr-only) labels for hidden form text

Works properly without a mouse

⌨️ Keyboard Map
Key	Action
Tab / Shift + Tab	Navigate through interactive elements
Enter	Activate focused button (edit, delete, etc.)
Esc	Exit edit mode or cancel actions
↑ / ↓	Navigate options in dropdowns
Ctrl + F / ⌘ + F	Focus the search bar
⚙️ Setup Guide

Clone or Download

git clone https://github.com/<your-username>/campus-life-planner.git
cd campus-life-planner


Run Locally

Open index.html in your browser.

All data loads from seed.json initially.

After you add events, they persist in localStorage.

Project Structure

├── index.html
├── dashboard.html
├── settings.html
├── about.html
├── js/
│   ├── index.js
│   ├── dashboard.js
│   ├── add-event.js
├── css/
│   ├── styles-index.css
│   ├── styles-dashboard.css
│   ├── styles-settings.css
├── seed.json

🧪 Testing Instructions

Add new events and confirm they persist after refresh.

Test invalid regex patterns in the search bar (they should show “Invalid pattern”).

Try @tag:Workshop search format to filter events by tag.

Check case sensitivity toggle.

Modify weekly cap in Settings and verify the Dashboard donut chart updates correctly.

🚀 Deployment

Hosted via GitHub Pages

👉 Live Demo Link

To deploy:

Push your code to the main branch of your GitHub repo.

Go to Settings → Pages.

Under “Branch,” select main / (root).

Wait for GitHub Pages to publish your site.

🙌 Credits

Author: Jeremiah Jewel Emmanuel
Institution: African Leadership University, Rwanda
Course: Software Engineering
Instructor: [Your Instructor’s Name or Course Code]
Year: 2025