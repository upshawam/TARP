import { useMemo, useState } from "react";
import type { CatchRecord } from "../../types/CatchRecord";
import { formatLength, formatMonthDay, monthName } from "../../lib/utils/formatters";

type SortKey = "species" | "angler" | "length" | "date" | "county" | "month";

type Props = {
  rows: CatchRecord[];
};

function sortValue(record: CatchRecord, key: SortKey): string | number {
  switch (key) {
    case "species":
      return record.normalizedSpecies;
    case "angler":
      return record.angler ?? "";
    case "length":
      return record.lengthInches ?? -1;
    case "date":
      return record.dateCaught ?? "";
    case "county":
      return record.county ?? "";
    case "month":
      return record.month ?? -1;
  }
}

function displayDate(record: CatchRecord): string {
  if (record.dateCaught) return record.dateCaught;
  if (record.month && record.day) return formatMonthDay(record.month, record.day);
  if (record.month) return monthName(record.month);
  return "Unknown";
}

export default function WaterbodyEntriesTable({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("length");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const left = sortValue(a, sortKey);
      const right = sortValue(b, sortKey);

      if (typeof left === "number" && typeof right === "number") {
        return sortDirection === "asc" ? left - right : right - left;
      }

      return sortDirection === "asc"
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
  }, [rows, sortDirection, sortKey]);

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "length" ? "desc" : "asc");
  }

  function sortLabel(label: string, key: SortKey) {
    const active = sortKey === key;
    const arrow = active ? (sortDirection === "asc" ? " ▲" : " ▼") : "";
    return `${label}${arrow}`;
  }

  if (!rows.length) return <p className="label">No entries to show.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("species")}>{sortLabel("Species", "species")}</button></th>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("angler")}>{sortLabel("Angler", "angler")}</button></th>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("length")}>{sortLabel("Length", "length")}</button></th>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("county")}>{sortLabel("County", "county")}</button></th>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("date")}>{sortLabel("Date", "date")}</button></th>
          <th><button className="table-sort-button" type="button" onClick={() => handleSort("month")}>{sortLabel("Month", "month")}</button></th>
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row) => (
          <tr key={row.id}>
            <td>{row.normalizedSpecies}</td>
            <td>{row.angler ?? "Unknown"}</td>
            <td>{formatLength(row.lengthInches)}</td>
            <td>{row.county ?? "Unknown"}</td>
            <td>{displayDate(row)}</td>
            <td>{row.month ? monthName(row.month) : "Unknown"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}