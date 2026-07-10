# Personal TARP Fishing Planner

A local-first React/Vite app for analyzing Tennessee Angler Recognition Program data and generating trophy-fishing plans.

## Setup

```bash
npm install
npm run dev
```

## Add your data

Place your CSV file here:

```text
public/data/tarp.csv
```

The app will try to load it automatically.

## GitHub Pages

This repo is configured for GitHub Pages project hosting at:

`https://upshawam.github.io/TARP/`

The Vite base path is already set in `vite.config.ts`:

```ts
base: "/TARP/"
```

Deployment is handled by GitHub Actions on pushes to `main` via:

`.github/workflows/deploy-pages.yml`

To publish updates:

1. Commit and push to `main`
2. In GitHub repo settings, ensure Pages source is set to `GitHub Actions`

For local verification:

```bash
npm run build
```
