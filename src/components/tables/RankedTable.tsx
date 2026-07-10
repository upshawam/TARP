import type { RankedItem } from "../../lib/analysis/rankings";

type Props = {
  rows: RankedItem[];
  nameLabel?: string;
  countLabel?: string;
};

export default function RankedTable({ rows, nameLabel = "Name", countLabel = "Count" }: Props) {
  if (!rows.length) return <p className="label">No data yet.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>{nameLabel}</th>
          <th>{countLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
