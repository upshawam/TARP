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

## Automated TWRA Data Monitor

This repo now includes an automated data monitor that checks a live TWRA JSON endpoint, compares it against a tracked master CSV baseline, and records full change history artifacts.

### Source endpoint

```text
https://www.tn.gov/twra/fishing/tennessee-angler-recognition-program/_jcr_content/contentFullWidth/tn_complex_datatable.exceldriven.json
```

### How it works

1. Fetches live JSON with retry + exponential backoff.
2. Normalizes rows to the baseline column shape.
3. Compares normalized live rows to the current master CSV.
4. Detects:
	 - total count changes
	 - added rows
	 - removed rows
	 - changed rows (row-level field diffs)
5. Ignores row ordering differences.
6. Updates monitor artifacts and status page every run.
7. On detected changes, updates master CSV and writes a dated snapshot.

### Scheduled automation

Workflow: [.github/workflows/data-monitor.yml](.github/workflows/data-monitor.yml)

- Daily run on cron.
- Manual run via `workflow_dispatch`.
- On changes:
	- posts a comment to a rolling change issue
	- updates monitor artifacts
	- commits generated files
- On failure:
	- opens/updates a failure issue with diagnostics

### Generated artifacts

All generated monitor outputs are tracked in git:

- [data-monitor/master/tarp_master.csv](data-monitor/master/tarp_master.csv)
- [data-monitor/metadata.json](data-monitor/metadata.json)
- [data-monitor/change-history.json](data-monitor/change-history.json)
- [data-monitor/latest-diff.md](data-monitor/latest-diff.md)
- [data-monitor/run-result.json](data-monitor/run-result.json)
- [data-monitor/snapshots/](data-monitor/snapshots/)
- [public/data-monitor/status.html](public/data-monitor/status.html)

### Local monitor run

```bash
python scripts/data_monitor/monitor.py
```

### Status page

After Pages deployment, the monitor status page is available at:

```text
https://upshawam.github.io/TARP/data-monitor/status.html
```

### Acceptance checks

1. Manual workflow run succeeds end-to-end.
2. No-change run updates `last_checked` heartbeat and status page.
3. Change run updates master CSV, snapshots, history, and diff report.
4. Failure run opens/updates failure issue with actionable error details.
