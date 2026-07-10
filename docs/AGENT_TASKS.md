# Coding Agent Instructions

Read `docs/PROJECT_SPEC.md` first.

Build this project as a React + TypeScript + Vite app that can be hosted on GitHub Pages.

## Current MVP tasks

1. Load TARP data from `public/data/tarp.csv`.
2. Parse CSV in the browser using PapaParse.
3. Normalize common TARP columns into `CatchRecord` objects.
4. Show a Dashboard with:
   - total records
   - species count
   - waterbody count
   - top trophy waters this month
5. Build Species Explorer:
   - species dropdown
   - trophy-only summary
   - top waterbodies
   - best months
   - top counties
   - biggest entries table
6. Build Waterbody Explorer:
   - waterbody dropdown
   - species produced
   - top species by trophy count
   - best months for selected species/waterbody
7. Build Trophy Planner:
   - species selector
   - month selector
   - ranked recommendations
   - generated practical plan
8. Keep everything frontend-only.

## Do not add yet

- Backend
- SQLite
- Prisma
- Auth
- Mapbox
- External APIs
- Server functions

## Data privacy

If the CSV contains angler names, the app should not display them by default. Focus on species, length, weight, date, waterbody, and county.
