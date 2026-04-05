# FinTrack – Finance Dashboard

A personal finance dashboard built as part of the Zorvyn FinTech internship assignment.

The goal was to build a clean UI where users can track income, expenses, and understand their spending patterns. I kept the stack simple — React with Vite, CSS modules for styling, and no external UI libraries so I had full control over the design.

## Getting Started

Clone/unzip the project and run:

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Structure

```
src/
├── components/          # reusable UI components
│   ├── Sidebar.jsx / .module.css
│   ├── StatCard.jsx / .module.css
│   ├── TransactionRow.jsx / .module.css
│   ├── TransactionModal.jsx / .module.css
│   ├── BarChart.jsx / .module.css
│   └── CategoryDonut.jsx / .module.css
│
├── pages/               # page-level components
│   ├── Dashboard.jsx / .module.css
│   ├── Transactions.jsx / .module.css
│   └── Insights.jsx / .module.css
│
├── context/
│   └── AppContext.jsx   # global state (transactions, role, dark mode)
│
├── hooks/
│   └── useTransactions.js
│
├── data/
│   └── transactions.js  # mock data + constants
│
├── utils/
│   └── helpers.js
│
├── App.jsx
└── index.css
```

## Features

**Dashboard** — balance/income/expense cards, monthly bar chart, spending donut chart, recent transactions

**Transactions** — searchable, filterable (type + category), sortable list with add/edit/delete for admins

**Insights** — savings rate, top spending category, month-by-month comparison, spending breakdown with progress bars

**Role-Based UI** — switch Admin/Viewer in the sidebar. Admins can add/edit/delete; Viewers are read-only.

**Dark Mode** — toggle in the sidebar bottom

**Data Persistence** — transactions saved to localStorage

## Tech Decisions

No chart library — built bar chart and donut chart from scratch with divs and SVG. Felt unnecessary to add a dependency for this amount of data.

CSS Modules for scoped component-level styles.

Context API instead of Redux — the state here is simple enough.

## What I'd Add With More Time

- Date range filter
- CSV export
- More months of data
- Unit tests for helper functions
- Persistent dark mode preference
# fintech-inter
