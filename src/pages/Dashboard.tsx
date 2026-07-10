import type { CatchRecord } from "../types/CatchRecord";
import { getDashboardSummary } from "../lib/analysis/analysis";
import { buildEarlyTargetRankings } from "../lib/analysis/attainability";
import RankedTable from "../components/tables/RankedTable";
import BarChartCard from "../components/charts/BarChartCard";

type Props = {
  records: CatchRecord[];
  onOpenEarlyTargets: () => void;
};

export default function Dashboard({ records, onOpenEarlyTargets }: Props) {
  const summary = getDashboardSummary(records);
  const earlyTargets = buildEarlyTargetRankings(records).slice(0, 5).map((row) => ({
    name: row.species,
    count: row.attainabilityScore
  }));

  return (
    <section>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>High-level trophy trends from your TARP dataset.</p>
      </div>

      <div className="grid cols-4">
        <div className="card"><div className="metric">{summary.totalRecords}</div><div className="label">Total records</div></div>
        <div className="card"><div className="metric">{summary.speciesCount}</div><div className="label">Species</div></div>
        <div className="card"><div className="metric">{summary.waterbodyCount}</div><div className="label">Waterbodies</div></div>
        <div className="card"><div className="metric">{summary.trophyCount}</div><div className="label">Trophy records by current rules</div></div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <BarChartCard title="Top Trophy Waters" data={summary.topTrophyWaters} />
        <BarChartCard title="Top Trophy Species" data={summary.topTrophySpecies} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card"><h3>Top Trophy Waters</h3><RankedTable rows={summary.topTrophyWaters} nameLabel="Waterbody" /></div>
        <div className="card">
          <h3>All Ranked Trophy Species</h3>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            <RankedTable rows={summary.allRankedTrophySpecies} nameLabel="Species" />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Best Early Trophy Targets</h3>
        <p className="label" style={{ marginTop: 0 }}>
          High TARP count does not guarantee easy fishing. It may reflect popularity and angler effort.
        </p>
        <RankedTable rows={earlyTargets} nameLabel="Species" countLabel="Attainability" />
        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={onOpenEarlyTargets}>Open Early Targets</button>
        </div>
      </div>
    </section>
  );
}
