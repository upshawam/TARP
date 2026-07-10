import Papa from "papaparse";
import type { CatchRecord } from "../../types/CatchRecord";
import { buildColumnMap } from "./normalizeColumns";
import { normalizeRecord } from "./normalizeRecord";

export type ParseResult = {
  records: CatchRecord[];
  headers: string[];
  warnings: string[];
};

export function parseTarpCsv(csvText: string, sourceFile = "tarp.csv"): ParseResult {
  if (!csvText.trim()) {
    return { records: [], headers: [], warnings: ["The CSV file is empty."] };
  }

  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
  });

  const rows = parsed.data.filter(Boolean);
  const headers = parsed.meta.fields ?? [];
  const warnings: string[] = [];

  if (headers.length === 0) {
    return { records: [], headers, warnings: ["Could not read CSV headers. Make sure the file has a header row."] };
  }

  const columnMap = buildColumnMap(headers);

  if (!columnMap.species) warnings.push(`Species column not found. Looked for: species, kind of fish, fish species. Headers found: ${headers.slice(0, 6).join(", ")}`);
  if (!columnMap.waterbody) warnings.push(`Waterbody column not found. Looked for: waterbody, body of water caught, water body. Headers found: ${headers.slice(0, 6).join(", ")}`);
  if (!columnMap.length && !columnMap.weight) warnings.push("No length or weight column found. Trophy filtering will not work.");
  if (!columnMap.dateCaught) warnings.push("Date column not found. Month/year filtering will be unavailable.");

  const allRecords = rows.map((row, index) => normalizeRecord(row, columnMap, index, sourceFile));
  const records = allRecords.filter((record) => record.normalizedSpecies && record.normalizedWaterbody);

  // Warn if the filter dropped everything — likely a column mapping problem
  if (rows.length > 0 && records.length === 0) {
    warnings.push(
      `Loaded ${rows.length} rows but none passed the species+waterbody filter. ` +
      `Check that your CSV has recognizable species and waterbody columns. ` +
      `Detected columns: ${headers.join(", ")}`
    );
  } else if (rows.length > 0 && records.length < rows.length * 0.5) {
    warnings.push(
      `${rows.length - records.length} of ${rows.length} rows were skipped because species or waterbody was blank.`
    );
  }

  return { records, headers, warnings };
}
