import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import type { PlannerMode } from "../types/FishingPlan";
import type { WaterbodyRecommendation } from "../types/FishingPlan";
import { generateFishingPlan } from "../lib/analysis/planner";
import { buildYearlyHeatMap } from "../lib/analysis/heatmap";
import RankedTable from "../components/tables/RankedTable";
import TrophyCalendar from "../components/calendar/TrophyCalendar";

const RADIUS_OPTIONS = [25, 50, 100, 150, 200, null] as const;
type Radius = typeof RADIUS_OPTIONS[number];

type Props = { records: CatchRecord[]; species: string[] };

export default function TrophyPlanner({ records, species: _species }: Props) {
  const [plannerMode, setPlannerMode]             = useState<PlannerMode>("upside");
  const [originLatitude, setOriginLatitude]       = useState("");
  const [originLongitude, setOriginLongitude]     = useState("");
  const [locationStatus, setLocationStatus]       = useState<string | null>(null);
  const [radiusMiles, setRadiusMiles]             = useState<Radius>(100);
  const [expandedWaterbody, setExpandedWaterbody] = useState<string | null>(null);
  const [selectedDate, setSelectedDate]           = useState<Date>(() => new Date());
  const [showCalendar, setShowCalendar]           = useState(false);

  const heatMap = useMemo(() => buildYearlyHeatMap(records), [records]);

  const origin = useMemo(() => {
    const lat = Number(originLatitude);
    const lon = Number(originLongitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || (!lat && !lon)) return null;
    return { latitude: lat, longitude: lon, label: "My location" };
  }, [originLatitude, originLongitude]);

  const plan = useMemo(
    () =>
      generateFishingPlan(records, undefined, {
        mode: plannerMode,
        origin,
        radiusMiles: origin ? radiusMiles : null,
        targetDate: selectedDate,
      }),
    [records, plannerMode, origin, radiusMiles, selectedDate]
  );

  const monthRows = plan.bestMonths.map((name, i) => ({ name, count: plan.bestMonths.length - i }));

  const today = new Date();
  const isToday =
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth()    === today.getMonth()    &&
    selectedDate.getDate()     === today.getDate();

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setExpandedWaterbody(null);
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("Browser geolocation is not available.");
      return;
    }
    setLocationStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOriginLatitude(pos.coords.latitude.toFixed(5));
        setOriginLongitude(pos.coords.longitude.toFixed(5));
        setLocationStatus("Location loaded.");
      },
      () => setLocationStatus("Could not read location. Enter lat/lon manually."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }

  function toggleDetail(waterbody: string) {
    setExpandedWaterbody((cur) => (cur === waterbody ? null : waterbody));
  }

  const originLabel = origin
    ? `${origin.latitude.toFixed(3)}, ${origin.longitude.toFixed(3)}`
    : "No location set";

  return (
    <section>
      <div className="page-header">
        <h2>Trophy Planner</h2>
        <p>
          {plannerMode === "upside"
            ? <>Seasonal trophy odds based on <strong>{plan.windowLabel}</strong> — what the historical TARP data says to target right now.</>
            : <>Early-success planning based on attainability, seasonal signal, and practical repeatability.</>}
        </p>
      </div>

      {/* Controls */}
      <div className="controls">
        <label>Planning mode</label>
        <select value={plannerMode} onChange={(event) => setPlannerMode(event.target.value as PlannerMode)}>
          <option value="upside">Highest Trophy Upside</option>
          <option value="easiest">Easiest Trophy Targets</option>
        </select>

        <label>Latitude</label>
        <input
          type="number" step="any" placeholder="36.16" value={originLatitude}
          onChange={(e) => setOriginLatitude(e.target.value)} style={{ width: 110 }}
        />
        <label>Longitude</label>
        <input
          type="number" step="any" placeholder="-86.78" value={originLongitude}
          onChange={(e) => setOriginLongitude(e.target.value)} style={{ width: 110 }}
        />
        <button type="button" onClick={handleUseCurrentLocation}>Use my location</button>

        {origin && (
          <>
            <label>Radius</label>
            <select
              value={radiusMiles ?? ""}
              onChange={(e) =>
                setRadiusMiles(e.target.value === "" ? null : (Number(e.target.value) as Radius))
              }
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r ?? "any"} value={r ?? ""}>{r ? `${r} mi` : "Any distance"}</option>
              ))}
            </select>
          </>
        )}

        <button
          type="button"
          className={showCalendar ? "btn-active" : ""}
          onClick={() => setShowCalendar((v) => !v)}
        >
          {showCalendar ? "Hide calendar" : "Browse calendar"}
        </button>

        {!isToday && (
          <button type="button" onClick={() => handleSelectDate(new Date())}>
            Back to today
          </button>
        )}
      </div>

      <div className="warning" style={{ marginBottom: 12 }}>
        High TARP count does not guarantee easy fishing. It may reflect popularity and angler effort.
      </div>

      {locationStatus && <div className="notice">{locationStatus}</div>}

      {/* Calendar panel (toggleable) */}
      {showCalendar && (
        <div className="grid cols-2" style={{ marginBottom: 16 }}>
          <div className="card">
            <h3>Trophy Calendar</h3>
            <p className="label" style={{ marginBottom: 12 }}>
              Click any date — including future dates — to preview the seasonal
              heat for that time of year. Colors reflect the ±21-day historical window.
            </p>
            <TrophyCalendar
              heatMap={heatMap}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </div>
          <div className="card">
            <h3>Best Fish This Window</h3>
            <p className="label" style={{ marginBottom: 10 }}>
              {isToday
                ? "Today"
                : selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}{" "}
              · {plan.windowLabel}
            </p>
            <RankedTable rows={plan.topSpecies} nameLabel="Species" countLabel={plannerMode === "easiest" ? "Attainability" : "Trophy heat"} />
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid cols-4">
        <div className="card">
          <div className="metric">{plan.targetDateLabel}</div>
          <div className="label">{isToday ? "Today" : "Selected date"}</div>
        </div>
        <div className="card">
          <div className="metric">{plan.confidence}</div>
          <div className="label">Data confidence</div>
        </div>
        <div className="card">
          <div className="metric">{plan.topRecommendations.length}</div>
          <div className="label">Waters in range</div>
        </div>
        <div className="card">
          <div className="metric">{originLabel}</div>
          <div className="label">Your location</div>
        </div>
      </div>

      {/* Generated narrative */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Generated Plan</h3>
        <p className="plan-text">{plan.strategySummary}</p>
      </div>

      {/* Best fish + months (hidden when calendar open to avoid duplication) */}
      {!showCalendar && (
        <div className="grid cols-2" style={{ marginTop: 16 }}>
          <div className="card">
            <h3>Best Fish This Window</h3>
            <RankedTable rows={plan.topSpecies} nameLabel="Species" countLabel={plannerMode === "easiest" ? "Attainability" : "Trophy heat"} />
          </div>
          <div className="card">
            <h3>Best Months Overall</h3>
            <RankedTable rows={monthRows} nameLabel="Month" countLabel="Priority" />
          </div>
        </div>
      )}

      {/* Ranked waterbody table */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3>
          Ranked Waterbodies{" "}
          {origin
            ? `· within ${radiusMiles ?? "any distance"}${radiusMiles ? " mi" : ""}`
            : "· all waters"}
        </h3>
        {plan.topRecommendations.length === 0 && (
          <p className="label">
            No waterbodies found. Try increasing the radius or removing the location filter.
          </p>
        )}
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Waterbody</th>
              <th>Score</th>
              <th>Season fit %</th>
              {origin && <th>Distance</th>}
              <th>Best species</th>
              <th>Trophies</th>
              <th>Biggest</th>
            </tr>
          </thead>
          <tbody>
            {plan.topRecommendations.map((row) => (
              <WaterbodyRow
                key={row.waterbody}
                row={row}
                showDistance={!!origin}
                expanded={expandedWaterbody === row.waterbody}
                onToggle={() => toggleDetail(row.waterbody)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function WaterbodyRow({
  row,
  showDistance,
  expanded,
  onToggle,
}: {
  row: WaterbodyRecommendation;
  showDistance: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: "pointer" }}
        className={expanded ? "row-expanded" : undefined}
      >
        <td style={{ width: 28 }}>{expanded ? "▲" : "▼"}</td>
        <td><strong>{row.waterbody}</strong></td>
        <td>{row.opportunityScore}</td>
        <td>{row.timeFitScore}%</td>
        {showDistance && (
          <td>{row.distanceMiles !== null ? `${row.distanceMiles} mi` : "–"}</td>
        )}
        <td>{row.bestSpecies}</td>
        <td>{row.trophyEntries}</td>
        <td>{row.biggestRecorded}</td>
      </tr>
      {expanded && (
        <tr>
          <td
            colSpan={showDistance ? 8 : 7}
            style={{ padding: "0 8px 16px 36px", background: "#f8f7f2" }}
          >
            <WaterbodyDetail row={row} />
          </td>
        </tr>
      )}
    </>
  );
}

function WaterbodyDetail({ row }: { row: WaterbodyRecommendation }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 12 }}>
      <div>
        <h4 style={{ margin: "0 0 6px" }}>Top species here</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {row.topSpeciesAtWaterbody.map((s) => (
            <li key={s.name}>{s.name} — {s.count} trophies</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 style={{ margin: "0 0 6px" }}>Best date windows</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {row.bestDateWindows.length
            ? row.bestDateWindows.map((d) => <li key={d}>{d}</li>)
            : <li>–</li>}
        </ul>
      </div>
      <div>
        <h4 style={{ margin: "0 0 6px" }}>Best months</h4>
        <p style={{ margin: 0 }}>{row.bestMonths.join(", ") || "–"}</p>
        <h4 style={{ margin: "10px 0 6px" }}>Strong counties</h4>
        <p style={{ margin: 0 }}>{row.strongestCounties.join(", ") || "–"}</p>
      </div>
      <div>
        <h4 style={{ margin: "0 0 6px" }}>Structure tips for {row.bestSpecies}</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {row.structures.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
      {row.researchTips.length > 0 && (
        <div style={{ gridColumn: "1 / -1" }}>
          <h4 style={{ margin: "0 0 6px" }}>Research-backed tips</h4>
          {row.researchAppliesTo.length > 0 && (
            <p className="label" style={{ margin: "0 0 8px" }}>
              Applies to: {row.researchAppliesTo.join("; ")}
            </p>
          )}
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {row.researchTips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
          <p className="label" style={{ marginTop: 8 }}>
            Source: {row.researchSources.join("; ")}
          </p>
        </div>
      )}
      {row.caveats.length > 0 && (
        <div style={{ gridColumn: "1 / -1" }}>
          {row.caveats.map((c) => (
            <div key={c} className="warning" style={{ marginTop: 6 }}>{c}</div>
          ))}
        </div>
      )}
    </div>
  );
}
