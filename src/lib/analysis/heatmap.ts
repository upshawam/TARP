import type { CatchRecord } from "../../types/CatchRecord";

const WINDOW_DAYS = 21;

// Cumulative days before each month (non-leap year baseline)
const CUM_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

export function dayOfYearFor(month: number, day: number): number {
  return (CUM_DAYS[month - 1] ?? 0) + day;
}

export function dayOfYearForDate(date: Date): number {
  return dayOfYearFor(date.getMonth() + 1, date.getDate());
}

export type DayHeat = {
  heat: number;  // 0–100 normalised
  count: number; // raw ±21-day window record count
};

/**
 * For each day-of-year (1–365) compute the number of trophy records
 * that fall within a ±21 day window around that day, then normalise
 * the result to 0–100.  Returns a Map keyed by day-of-year.
 */
export function buildYearlyHeatMap(records: CatchRecord[]): Map<number, DayHeat> {
  const raw = new Array<number>(366).fill(0);

  for (const record of records) {
    if (record.month === null || record.day === null) continue;
    const doy = dayOfYearFor(record.month, record.day);
    if (doy >= 1 && doy <= 365) raw[doy]++;
  }

  const windowCounts = new Array<number>(366).fill(0);
  for (let doy = 1; doy <= 365; doy++) {
    let count = 0;
    for (let offset = -WINDOW_DAYS; offset <= WINDOW_DAYS; offset++) {
      let d = doy + offset;
      if (d < 1) d += 365;
      if (d > 365) d -= 365;
      count += raw[d];
    }
    windowCounts[doy] = count;
  }

  const maxCount = Math.max(...windowCounts.slice(1));

  const result = new Map<number, DayHeat>();
  for (let doy = 1; doy <= 365; doy++) {
    const count = windowCounts[doy];
    result.set(doy, {
      count,
      heat: maxCount > 0 ? Math.round(count / maxCount * 100) : 0,
    });
  }
  return result;
}

/** Returns background + text colour for a 0–100 heat value. */
export function heatColor(heat: number): { background: string; color: string } {
  if (heat <= 0)  return { background: "#e8e8e4", color: "#888888" };
  if (heat <= 25) return { background: "#d4efd4", color: "#2d5c2d" };
  if (heat <= 50) return { background: "#90d080", color: "#1a3d1a" };
  if (heat <= 70) return { background: "#ffd166", color: "#7a4800" };
  if (heat <= 85) return { background: "#f4845f", color: "#5a1500" };
  return              { background: "#e63946", color: "#ffffff" };
}

export const HEAT_LEGEND = [
  { label: "Slow",  heat: 0  },
  { label: "Fair",  heat: 20 },
  { label: "Good",  heat: 45 },
  { label: "Great", heat: 65 },
  { label: "Hot",   heat: 78 },
  { label: "Peak",  heat: 92 },
] as const;
