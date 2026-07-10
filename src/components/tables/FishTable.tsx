import type { CatchRecord } from "../../types/CatchRecord";
import { formatLength, monthName } from "../../lib/utils/formatters";

type Props = {
  rows: CatchRecord[];
};

export default function FishTable({ rows }: Props) {
  if (!rows.length) return <p className="label">No entries to show.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Species</th>
          <th>Length</th>
          <th>Water</th>
          <th>County</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.normalizedSpecies}</td>
            <td>{formatLength(row.lengthInches)}</td>
            <td>{row.normalizedWaterbody}</td>
            <td>{row.county ?? "Unknown"}</td>
            <td>{row.dateCaught ?? (row.month ? monthName(row.month) : "Unknown")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
