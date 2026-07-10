import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import { buildEarlyTargetRankings, type EarlyTargetRanking } from "../lib/analysis/attainability";

type Props = {
  records: CatchRecord[];
};

type SortKey =
  | "rank"
  | "species"
  | "attainabilityScore"
  | "difficultyLabel"
  | "trophyEntries"
  | "uniqueWaterbodies"
  | "bestWaterbody"
  | "kayakPracticality"
  | "techniqueDifficulty";

export default function EarlyTargets({ records }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("attainabilityScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const rankings = useMemo(() => buildEarlyTargetRankings(records), [records]);

  const sortedRows = useMemo(() => {
    const withRank = rankings.map((row, index) => ({ ...row, rank: index + 1 }));

    return withRank.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "species" || sortKey === "difficultyLabel" || sortKey === "bestWaterbody") {
        return direction * String(a[sortKey]).localeCompare(String(b[sortKey]));
      }

      return direction * ((a[sortKey] as number) - (b[sortKey] as number));
    });
  }, [rankings, sortDirection, sortKey]);

  function onSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "species" || nextKey === "difficultyLabel" || nextKey === "bestWaterbody" ? "asc" : "desc");
  }

  function sortLabel(label: string, key: SortKey): string {
    const isActive = sortKey === key;
    const arrow = isActive ? (sortDirection === "asc" ? " ▲" : " ▼") : "";
    return `${label}${arrow}`;
  }

  return (
    <section>
      <div className="page-header">
        <h2>Early Targets</h2>
        <p>
          This ranks trophy targets by realistic attainability, not just total TARP entries. High entry counts help, but
          kayak practicality, seasonal clarity, technique difficulty, and waterbody spread also matter.
        </p>
      </div>

      <div className="warning" style={{ marginBottom: 16 }}>
        High TARP count does not guarantee easy fishing. It may reflect popularity and angler effort.
      </div>

      <div className="card">
        <h3>Attainability Rankings</h3>
        {sortedRows.length === 0 ? (
          <p className="label">No records available yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("rank")}>{sortLabel("Rank", "rank")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("species")}>{sortLabel("Species", "species")}</button></th>
                  <th>Trophy threshold</th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("attainabilityScore")}>{sortLabel("Attainability Score", "attainabilityScore")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("difficultyLabel")}>{sortLabel("Difficulty Label", "difficultyLabel")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("trophyEntries")}>{sortLabel("Trophy Entries", "trophyEntries")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("uniqueWaterbodies")}>{sortLabel("Unique Trophy Waters", "uniqueWaterbodies")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("bestWaterbody")}>{sortLabel("Best Waterbody", "bestWaterbody")}</button></th>
                  <th>Best Months</th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("kayakPracticality")}>{sortLabel("Kayak Practicality", "kayakPracticality")}</button></th>
                  <th><button className="table-sort-button" type="button" onClick={() => onSort("techniqueDifficulty")}>{sortLabel("Technique Difficulty", "techniqueDifficulty")}</button></th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => (
                  <EarlyTargetRow key={row.species} row={row} baseRank={rankings.findIndex((x) => x.species === row.species) + 1} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function EarlyTargetRow({ row, baseRank }: { row: EarlyTargetRanking; baseRank: number }) {
  return (
    <>
      <tr>
        <td>{baseRank}</td>
        <td><strong>{row.species}</strong></td>
        <td>{row.trophyThreshold}</td>
        <td>{row.attainabilityScore}</td>
        <td>{row.difficultyLabel}</td>
        <td>{row.trophyEntries}</td>
        <td>{row.uniqueWaterbodies}</td>
        <td>{row.bestWaterbody}</td>
        <td>{row.bestMonths.join(", ") || "Unknown"}</td>
        <td>{row.kayakPracticality}</td>
        <td>{row.techniqueDifficulty}</td>
      </tr>
      <tr>
        <td colSpan={11} style={{ background: "#faf8f2" }}>
          <strong>Notes:</strong> {row.notes}
          <div className="label" style={{ marginTop: 6 }}>
            <strong>Reasoning:</strong> {row.reasoning}
          </div>
        </td>
      </tr>
    </>
  );
}
