# TARP Data Sync Plan

## Current MVP approach

The app currently uses a local static CSV file:

public/data/tarp.csv

This file is exported manually from the official TARP results page and committed to the repo.

The GitHub Pages app reads this file at runtime using:

fetch(`${import.meta.env.BASE_URL}data/tarp.csv`)

This keeps the app simple, fast, and compatible with GitHub Pages.

## Why not scrape from the browser?

The app should not directly scrape or fetch the official TARP page from the browser because:

- The official page may block browser requests with CORS.
- The page structure may change.
- The app would become dependent on TN.gov availability.
- Every app visitor could trigger requests to the official page.
- It may be impolite to repeatedly hit a public agency page.

## Preferred future approach

Use a scheduled GitHub Action to update the data.

Workflow:

1. GitHub Action runs on a schedule.
2. Script checks the official TARP source.
3. Script downloads the latest data if a stable endpoint exists.
4. Script normalizes the data.
5. Script writes:
   - public/data/tarp.csv
   - public/data/tarp.json
   - public/data/last-updated.json
6. GitHub Action commits the updated files.
7. GitHub Pages rebuilds the app.

The browser app still only reads local static files from public/data.

## How to find the official data source

Open the official TARP page in Chrome.

Steps:

1. Open DevTools.
2. Go to the Network tab.
3. Refresh the page.
4. Search for requests containing:
   - json
   - csv
   - api
   - tarp
   - angler
   - summary
5. Use the page's search/filter tools and watch for new requests.
6. Inspect any response that appears to contain the TARP table rows.

Ideal result:

- JSON endpoint
- CSV endpoint
- ArcGIS REST endpoint
- Static data file

Avoid relying on fragile HTML scraping unless there is no alternative.

## Data freshness strategy

For fishing planning, daily updates are probably unnecessary.

Recommended schedule:

- Weekly update for normal use
- Daily update only if actively tracking recent additions
- Manual update is acceptable for MVP

## App behavior

The app should display a small data freshness message:

Example:

Data source: Local TARP export
Last updated: 2026-07-08
Records loaded: 9,826

If last-updated.json is missing, show:

Data source: Local TARP export
Last updated: Unknown

## Research Knowledge Layer (new)

The app can now be made smarter with a research layer that is separate from raw catch data.

Current pattern:

1. Store curated article insights in:
   - src/data/researchInsights.ts
2. Match these insights to planner recommendations by:
   - month
   - species
   - waterbody
3. Display matched tips in Trophy Planner as "Research-backed tips".

Why this helps:

- Your plan stays grounded in your own TARP results.
- External research adds tactical context (presentation, structure, timing).
- No hallucination risk from an unconstrained model response.

How to add a new article:

1. Read and summarize the article into concrete statements.
2. Add a new record in src/data/researchInsights.ts with:
   - sourceLabel
   - sourceUrl
   - months
   - optional species
   - optional waterbody
   - tips[]
3. Keep tips short, specific, and testable on the water.

## Optional LLM path (later)

If you want a chat assistant later, use retrieval-augmented generation:

1. Retrieve top matching planner stats + research insights.
2. Send only those retrieved facts to the model.
3. Ask the model to produce:
   - trip plan
   - rig sequence
   - fallback pattern if primary bite fails
4. Include source citations in the output.

Important:

- Keep the LLM advisory only.
- Do not let model output override your deterministic scoring engine.