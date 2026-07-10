import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import { getSpeciesSummary } from "../lib/analysis/analysis";
import RankedTable from "../components/tables/RankedTable";
import FishTable from "../components/tables/FishTable";
import BarChartCard from "../components/charts/BarChartCard";

type Props = { records: CatchRecord[]; species: string[] };

export default function SpeciesExplorer({ records, species }: Props) {
  const [selectedSpecies, setSelectedSpecies] = useState("Smallmouth Bass");
  const activeSpecies = species.includes(selectedSpecies) ? selectedSpecies : species[0] ?? selectedSpecies;
  const summary = useMemo(() => getSpeciesSummary(records, activeSpecies), [records, activeSpecies]);

  return (
    <section>
      <div className="page-header">
        <h2>Species Explorer</h2>
        <p>Find the best trophy waters, counties, months, and biggest entries for one species.</p>
      </div>

      <div className="controls">
        <label>Species</label>
        <select value={activeSpecies} onChange={(event) => setSelectedSpecies(event.target.value)}>
          {species.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid cols-3">
        <div className="card"><div className="metric">{summary.totalEntries}</div><div className="label">Total entries</div></div>
        <div className="card"><div className="metric">{summary.trophyEntries}</div><div className="label">Trophy entries</div></div>
        <div className="card"><div className="metric">{summary.bestMonths[0]?.name ?? "-"}</div><div className="label">Best month</div></div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <BarChartCard title="Top Waterbodies" data={summary.topWaterbodies} />
        <BarChartCard title="Best Months" data={summary.bestMonths} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card"><h3>Top Counties</h3><RankedTable rows={summary.topCounties} nameLabel="County" /></div>
        <div className="card"><h3>Biggest Entries</h3><FishTable rows={summary.biggestEntries} /></div>
      </div>
    </section>
  );
}
