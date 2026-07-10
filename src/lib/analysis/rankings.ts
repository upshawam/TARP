import type { CatchRecord } from "../../types/CatchRecord";
import { groupBy } from "../utils/groupBy";
import { formatMonthDay, monthName } from "../utils/formatters";

export type RankedItem = {
  name: string;
  count: number;
};

export function rankBy(records: CatchRecord[], getKey: (record: CatchRecord) => string | null | undefined, limit = 10): RankedItem[] {
  const grouped = groupBy(records, (record) => getKey(record) || "Unknown");
  return Object.entries(grouped)
    .map(([name, items]) => ({ name, count: items.length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function topWaterbodies(records: CatchRecord[], limit = 10): RankedItem[] {
  return rankBy(records, (record) => record.normalizedWaterbody, limit);
}

export function topCounties(records: CatchRecord[], limit = 10): RankedItem[] {
  return rankBy(records, (record) => record.county, limit);
}

export function topSpecies(records: CatchRecord[], limit = 10): RankedItem[] {
  return rankBy(records, (record) => record.normalizedSpecies, limit);
}

export function topMonths(records: CatchRecord[], limit = 12): RankedItem[] {
  const ranked = rankBy(records.filter((record) => record.month !== null), (record) => String(record.month), limit);
  return ranked.map((item) => ({ ...item, name: monthName(Number(item.name)) }));
}

export function topDateWindows(records: CatchRecord[], limit = 10): RankedItem[] {
  const ranked = rankBy(
    records.filter((record) => record.month !== null && record.day !== null),
    (record) => `${record.month}-${record.day}`,
    limit
  );

  return ranked.map((item) => {
    const [monthText, dayText] = item.name.split("-");
    return {
      ...item,
      name: formatMonthDay(Number(monthText), Number(dayText))
    };
  });
}

export function biggestFish(records: CatchRecord[], limit = 10): CatchRecord[] {
  return [...records]
    .sort((a, b) => (b.lengthInches ?? 0) - (a.lengthInches ?? 0))
    .slice(0, limit);
}
