# Finance Dashboard UI

Frontend assignment submission for a Frontend Developer Intern role.

This project is a responsive finance dashboard built with React and mock data. The focus was to keep the experience clean and intuitive while still showing reusable component design, practical state management, and frontend-only role based behavior.

## Live Demo

https://finance-dashboard-lilac-six.vercel.app/

## Tech Stack

- React with Vite
- Tailwind CSS v4
- Recharts
- Lucide React

## Requirement Coverage

- Dashboard overview with summary cards
- Time based visualization for finance trends
- Categorical spending breakdown chart
- Transactions table with search, filtering, and sorting
- Frontend role switching between Viewer and Admin
- Admin actions for adding and editing transactions
- Insights section with spending observations and monthly comparison
- Responsive layout for mobile, tablet, and desktop
- Empty states for data driven sections

## Extra Improvements

- Dark and light mode
- Local storage persistence for theme, role, and transactions
- Reusable finance selectors and formatting utilities
- Shared styling utilities for repeated typography and panel patterns

## Approach

I treated the assignment like a small but scalable product surface instead of a one-screen demo.

Key decisions:

- Kept the layout modular using focused components
- Centralized shared finance calculations into reusable utility functions
- Stored app level concerns such as role, theme, and transactions in context
- Added persistence so interactions survive refreshes
- Reused styling primitives for repeated headings, subtitles, and card shells

## Project Structure

```text
src/
  components/
    dashboard/
  context/
  data/
  pages/
  utils/
```

## Setup

```bash
git clone https://github.com/akshayUniverse/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

## Notes

- This is a frontend-only implementation
- Data starts from mocked seed transactions
- No backend or real authentication is included

## What I Focused On

- Clean information hierarchy
- Reusability in both logic and styling
- Responsive behavior without changing the core experience
- Practical UI states instead of only the happy path
