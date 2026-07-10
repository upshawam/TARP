import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import { getWaterbodySummary } from "../lib/analysis/analysis";
import RankedTable from "../components/tables/RankedTable";
import WaterbodyEntriesTable from "../components/tables/WaterbodyEntriesTable";
import BarChartCard from "../components/charts/BarChartCard";

type Props = { records: CatchRecord[]; waterbodies: string[] };

export default function WaterbodyExplorer({ records, waterbodies }: Props) {
  const [selectedWaterbody, setSelectedWaterbody] = useState("Dale Hollow Lake");
  const activeWaterbody = waterbodies.includes(selectedWaterbody) ? selectedWaterbody : waterbodies[0] ?? selectedWaterbody;
  const summary = useMemo(() => getWaterbodySummary(records, activeWaterbody), [records, activeWaterbody]);
  const waterbodyEntries = useMemo(
    () => records.filter((record) => record.normalizedWaterbody === activeWaterbody),
    [records, activeWaterbody]
  );

  return (
    <section>
      <div className="page-header">
        <h2>Waterbody Explorer</h2>
        <p>See which trophy species and months stand out on a lake, river, or reservoir.</p>
      </div>

      <div className="controls">
        <label>Waterbody</label>
        <select value={activeWaterbody} onChange={(event) => setSelectedWaterbody(event.target.value)}>
          {waterbodies.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid cols-3">
        <div className="card"><div className="metric">{summary.totalEntries}</div><div className="label">Total entries</div></div>
        <div className="card"><div className="metric">{summary.trophyEntries}</div><div className="label">Trophy entries</div></div>
        <div className="card"><div className="metric">{summary.topSpecies[0]?.name ?? "-"}</div><div className="label">Top trophy species</div></div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <BarChartCard title="Trophy Species" data={summary.topSpecies} />
        <BarChartCard title="Best Months" data={summary.bestMonths} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card"><h3>Top Species</h3><RankedTable rows={summary.topSpecies} nameLabel="Species" /></div>
        <div className="card"><h3>All Entries</h3><WaterbodyEntriesTable rows={waterbodyEntries} /></div>
      </div>
    </section>
  );
}
