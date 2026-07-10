# Personal TARP Fishing Planner App

A local-first React app for exploring Tennessee Angler Recognition Program exports and generating trophy-fish plans.

## Primary goals

1. Load TARP data from `public/data/tarp.csv`.
2. Normalize species, waterbody, county, length, weight, and date fields.
3. Explore trophy trends by species, waterbody, county, month, and year.
4. Generate practical fishing plans for each target species.
5. Run entirely in the browser so it can be hosted on GitHub Pages.

## MVP scope

Build these first:

- Dashboard
- Species Explorer
- Waterbody Explorer
- Trophy Planner
- CSV Import/Reload screen

Do not build these yet:

- Login
- Backend
- Cloud database
- Paid maps
- Weather integration
- Moon phase integration

## Data flow

```text
public/data/tarp.csv
  -> loadTarpCsv.ts
  -> parseCsv.ts
  -> normalizeRecord.ts
  -> CatchRecord[]
  -> analysis functions
  -> React pages and charts
```

## Trophy planning principle

The app should not simply say “most records equals best water.” It should separate:

- Highest trophy count
- Biggest top-end fish
- Most consistent waterbody
- Best months
- Best counties
- Most recent trend
- Practical user plan

## Strategy output format

Every generated plan should include:

1. Target species and trophy threshold
2. Top recommended waterbodies
3. Best months
4. Best counties/sections when available
5. Target structure
6. Depth ranges
7. Conditions that improve odds
8. Bait/lure plan
9. Kayak notes
10. Confidence level and caveats

## GitHub Pages note

If hosted at `https://USERNAME.github.io/REPO_NAME/`, update `vite.config.ts`:

```ts
export default defineConfig({
  base: "/REPO_NAME/",
  plugins: [react()]
});
```

Then the CSV loader will use `import.meta.env.BASE_URL` so `/data/tarp.csv` resolves correctly.
