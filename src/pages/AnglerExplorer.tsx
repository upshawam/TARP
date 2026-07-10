import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import { getAnglerSummary } from "../lib/analysis/analysis";
import { rankBy } from "../lib/analysis/rankings";
import { filterTrophies } from "../lib/analysis/trophyFilters";
import RankedTable from "../components/tables/RankedTable";
import FishTable from "../components/tables/FishTable";
import BarChartCard from "../components/charts/BarChartCard";

type Props = {
  records: CatchRecord[];
  anglers: string[];
  waterbodies: string[];
};

export default function AnglerExplorer({ records, anglers, waterbodies }: Props) {
  const defaultAngler = anglers.includes("Cole Adams") ? "Cole Adams" : (anglers[0] ?? "");
  const [selectedAngler, setSelectedAngler] = useState<string>(defaultAngler);
  const [anglerQuery, setAnglerQuery] = useState<string>(defaultAngler);
  const [selectedWaterbody, setSelectedWaterbody] = useState<string>("All Waterbodies");

  const activeAngler = anglers.includes(selectedAngler) ? selectedAngler : anglers[0] ?? selectedAngler;
  const trophies = useMemo(() => filterTrophies(records), [records]);
  const anglerTrophies = useMemo(() => trophies.filter((record) => Boolean(record.angler)), [trophies]);

  const topAnglersOverall = useMemo(
    () => rankBy(anglerTrophies, (record) => record.angler, Number.POSITIVE_INFINITY),
    [anglerTrophies]
  );

  const topAnglersByWaterbody = useMemo(() => {
    if (selectedWaterbody === "All Waterbodies") {
      return topAnglersOverall;
    }

    const waterbodyTrophies = anglerTrophies.filter((record) => record.normalizedWaterbody === selectedWaterbody);
    return rankBy(waterbodyTrophies, (record) => record.angler, Number.POSITIVE_INFINITY);
  }, [selectedWaterbody, topAnglersOverall, anglerTrophies]);

  const filteredAnglers = useMemo(() => {
    const query = anglerQuery.trim().toLowerCase();
    if (!query) return anglers;
    return anglers.filter((name) => name.toLowerCase().includes(query));
  }, [anglerQuery, anglers]);

  function applyAnglerSelection(name: string) {
    setSelectedAngler(name);
    setAnglerQuery(name);
  }

  function chooseFromQuery() {
    const query = anglerQuery.trim().toLowerCase();
    if (!query) return;

    const exact = anglers.find((name) => name.toLowerCase() === query);
    if (exact) {
      applyAnglerSelection(exact);
      return;
    }

    const startsWith = anglers.find((name) => name.toLowerCase().startsWith(query));
    if (startsWith) {
      applyAnglerSelection(startsWith);
      return;
    }

    const contains = anglers.find((name) => name.toLowerCase().includes(query));
    if (contains) {
      applyAnglerSelection(contains);
    }
  }

  const summary = useMemo(() => getAnglerSummary(records, activeAngler), [records, activeAngler]);

  return (
    <section>
      <div className="page-header">
        <h2>Angler Explorer</h2>
        <p>Track who is consistently landing trophy fish and drill into each angler's catch history.</p>
      </div>

      <div className="controls">
        <label>Search angler</label>
        <input
          type="text"
          placeholder="Type a name..."
          value={anglerQuery}
          list="angler-name-suggestions"
          onChange={(event) => {
            const next = event.target.value;
            setAnglerQuery(next);

            const exact = anglers.find((name) => name.toLowerCase() === next.trim().toLowerCase());
            if (exact) {
              setSelectedAngler(exact);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              chooseFromQuery();
            }
          }}
        />
        <datalist id="angler-name-suggestions">
          {filteredAnglers.slice(0, 50).map((name) => <option key={name} value={name} />)}
        </datalist>

        <button type="button" onClick={chooseFromQuery}>Find angler</button>

        <label>Selected angler</label>
        <div className="label" style={{ minWidth: 180 }}>{activeAngler || "No angler selected"}</div>

        <label>Top anglers by waterbody</label>
        <select value={selectedWaterbody} onChange={(event) => setSelectedWaterbody(event.target.value)}>
          <option value="All Waterbodies">All Waterbodies</option>
          {waterbodies.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      <div className="grid cols-4">
        <div className="card"><div className="metric">{summary.totalEntries}</div><div className="label">Total entries</div></div>
        <div className="card"><div className="metric">{summary.trophyEntries}</div><div className="label">Trophy entries</div></div>
        <div className="card"><div className="metric">{summary.topWaterbodies[0]?.name ?? "-"}</div><div className="label">Top trophy water</div></div>
        <div className="card"><div className="metric">{summary.topSpecies[0]?.name ?? "-"}</div><div className="label">Top trophy species</div></div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <BarChartCard title={`Top Species for ${activeAngler}`} data={summary.topSpecies} />
        <BarChartCard title={`Top Waterbodies for ${activeAngler}`} data={summary.topWaterbodies} />
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Top Trophy Anglers (Overall)</h3>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            <RankedTable rows={topAnglersOverall} nameLabel="Angler" countLabel="Trophy entries" />
          </div>
        </div>
        <div className="card">
          <h3>
            Top Trophy Anglers {selectedWaterbody === "All Waterbodies" ? "(All Waterbodies)" : `(${selectedWaterbody})`}
          </h3>
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            <RankedTable rows={topAnglersByWaterbody} nameLabel="Angler" countLabel="Trophy entries" />
          </div>
        </div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>{activeAngler} Trophy Log</h3>
          {summary.trophyList.length ? (
            <div style={{ maxHeight: 460, overflowY: "auto" }}>
              <FishTable rows={summary.trophyList} />
            </div>
          ) : (
            <p className="label">No trophy records found for this angler.</p>
          )}
        </div>
        <div className="card">
          <h3>Biggest Entries ({activeAngler})</h3>
          <FishTable rows={summary.biggestEntries} />
        </div>
      </div>
    </section>
  );
}
