import type { CatchRecord } from "../../types/CatchRecord";
import { groupBy } from "../utils/groupBy";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateOpportunityScore(waterbodyRecords: CatchRecord[], allTrophyRecords: CatchRecord[]): number {
  const maxTrophyCount = Math.max(...Object.values(groupBy(allTrophyRecords, (r) => r.normalizedWaterbody)).map((records) => records.length), 1);
  const trophyCount = waterbodyRecords.length;
  const trophyCountScore = Math.log10(trophyCount + 1) / Math.log10(maxTrophyCount + 1) * 100;

  const currentYear = new Date().getFullYear();
  const recentCount = waterbodyRecords.filter((record) => record.year !== null && record.year >= currentYear - 5).length;
  const recentScore = trophyCount > 0 ? recentCount / trophyCount * 100 : 0;

  const lengths = waterbodyRecords.map((record) => record.lengthInches).filter((v): v is number => v !== null).sort((a, b) => b - a);
  const topLengths = lengths.slice(0, Math.min(10, lengths.length));
  const allLengths = allTrophyRecords.map((record) => record.lengthInches).filter((v): v is number => v !== null).sort((a, b) => b - a);
  const allTopAverage = average(allLengths.slice(0, Math.min(10, allLengths.length))) || 1;
  const topEndSizeScore = average(topLengths) / allTopAverage * 100;

  const yearsRepresented = new Set(waterbodyRecords.map((record) => record.year).filter(Boolean)).size;
  const allYears = new Set(allTrophyRecords.map((record) => record.year).filter(Boolean)).size || 1;
  const consistencyScore = yearsRepresented / allYears * 100;

  const monthGroups = Object.values(groupBy(waterbodyRecords.filter((record) => record.month !== null), (record) => String(record.month)));
  const bestThreeMonths = monthGroups.map((items) => items.length).sort((a, b) => b - a).slice(0, 3).reduce((sum, count) => sum + count, 0);
  const seasonalClarityScore = trophyCount > 0 ? bestThreeMonths / trophyCount * 100 : 0;

  return clampScore(
    trophyCountScore * 0.40 +
    recentScore * 0.15 +
    topEndSizeScore * 0.15 +
    consistencyScore * 0.20 +
    seasonalClarityScore * 0.10
  );
}

export function confidenceLevel(trophyCount: number, yearsRepresented: number): "High" | "Medium" | "Low" {
  if (trophyCount >= 25 && yearsRepresented >= 5) return "High";
  if (trophyCount >= 8 && yearsRepresented >= 3) return "Medium";
  return "Low";
}
