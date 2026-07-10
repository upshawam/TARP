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

If this repo is hosted on GitHub Pages under a project path, update `vite.config.ts`:

```ts
base: "/your-repo-name/"
```

Then run:

```bash
npm run build
npm run deploy
```
