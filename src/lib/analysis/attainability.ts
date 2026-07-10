import type { CatchRecord } from "../../types/CatchRecord";
import type { SpeciesRule } from "../../types/SpeciesRule";
import { getSpeciesRule, speciesRules as defaultSpeciesRules } from "../../data/speciesRules";
import { getSpeciesDifficultyProfile } from "../../data/speciesDifficultyProfiles";
import { isTrophy } from "./trophyFilters";
import { monthName } from "../utils/formatters";

export type EarlyTargetRanking = {
  species: string;
  trophyThreshold: string;
  attainabilityScore: number;
  difficultyLabel: string;
  trophyEntries: number;
  uniqueWaterbodies: number;
  bestWaterbody: string;
  bestMonths: string[];
  kayakPracticality: number;
  shorePracticality: number;
  techniqueDifficulty: number;
  gearSpecialization: number;
  notes: string;
  reasoning: string;
};

type AttainabilityInput = {
  trophyEntryCount: number;
  maxTrophyEntryCount: number;
  uniqueWaterbodyCount: number;
  maxUniqueWaterbodyCount: number;
  topThreeMonthPct: number;
  recentPct: number;
  kayakPracticality: number;
  shorePracticality: number;
  techniqueDifficulty: number;
  gearSpecialization: number;
  nearbyOpportunityScore?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toPct(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return clamp((numerator / denominator) * 100, 0, 100);
}

function logScaledScore(value: number, maxValue: number): number {
  if (maxValue <= 0) return 0;
  if (value <= 0) return 0;
  return clamp((Math.log(value + 1) / Math.log(maxValue + 1)) * 100, 0, 100);
}

function linearScaledScore(value: number, maxValue: number): number {
  if (maxValue <= 0) return 0;
  return toPct(value, maxValue);
}

function scaleOneToFive(value: number): number {
  return clamp(((value - 1) / 4) * 100, 0, 100);
}

function reverseScaleOneToFive(value: number): number {
  return clamp(((5 - value) / 4) * 100, 0, 100);
}

function thresholdLabel(rule: SpeciesRule | undefined): string {
  if (!rule) return "Trophy size";

  if (rule.preferredMetric === "length" && rule.trophyLengthInches !== null) {
    return `${rule.trophyLengthInches}\"+`;
  }

  if (rule.preferredMetric === "weight" && rule.trophyWeightPounds !== null) {
    return `${rule.trophyWeightPounds} lb+`;
  }

  if (rule.preferredMetric === "either") {
    const length = rule.trophyLengthInches !== null ? `${rule.trophyLengthInches}\"+` : null;
    const weight = rule.trophyWeightPounds !== null ? `${rule.trophyWeightPounds} lb+` : null;
    if (length && weight) return `${length} or ${weight}`;
    return length ?? weight ?? "Trophy size";
  }

  return "Trophy size";
}

function topMonths(records: CatchRecord[], limit = 3): string[] {
  const monthCounts = new Map<number, number>();

  for (const record of records) {
    if (!record.month) continue;
    monthCounts.set(record.month, (monthCounts.get(record.month) ?? 0) + 1);
  }

  return [...monthCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([month]) => monthName(month));
}

function topThreeMonthPct(records: CatchRecord[]): number {
  const validMonths = records.filter((record) => record.month !== null);
  if (!validMonths.length) return 50;

  const monthCounts = new Map<number, number>();
  for (const record of validMonths) {
    const month = record.month as number;
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
  }

  const topThreeTotal = [...monthCounts.values()]
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, count) => sum + count, 0);

  return toPct(topThreeTotal, validMonths.length);
}

function recentPct(records: CatchRecord[]): number {
  const validYears = records.map((record) => record.year).filter((year): year is number => year !== null);
  if (!validYears.length) return 50;

  const newestYear = Math.max(...validYears);
  const windowStart = newestYear - 3;
  const recentCount = validYears.filter((year) => year >= windowStart).length;
  return toPct(recentCount, validYears.length);
}

export function calculateAttainabilityScore(input: AttainabilityInput): number {
  const recordVolumeScore = logScaledScore(input.trophyEntryCount, input.maxTrophyEntryCount);
  const waterbodySpreadScore = linearScaledScore(input.uniqueWaterbodyCount, input.maxUniqueWaterbodyCount);
  const nearbyOpportunityScore = clamp(input.nearbyOpportunityScore ?? 50, 0, 100);
  const seasonalClarityScore = clamp(input.topThreeMonthPct, 0, 100);
  const recentScore = clamp(input.recentPct, 0, 100);

  const kayakScore = scaleOneToFive(input.kayakPracticality);
  const shoreScore = scaleOneToFive(input.shorePracticality);
  const accessScore = clamp(kayakScore * 0.75 + shoreScore * 0.25, 0, 100);

  const techniqueEase = reverseScaleOneToFive(input.techniqueDifficulty);
  const gearEase = reverseScaleOneToFive(input.gearSpecialization);
  const simplicityScore = clamp((techniqueEase + gearEase) / 2, 0, 100);

  const score =
    recordVolumeScore * 0.25 +
    waterbodySpreadScore * 0.15 +
    nearbyOpportunityScore * 0.20 +
    seasonalClarityScore * 0.10 +
    recentScore * 0.10 +
    accessScore * 0.10 +
    simplicityScore * 0.10;

  return Math.round(clamp(score, 0, 100));
}

export function getDifficultyLabel(score: number): string {
  if (score >= 80) return "Starter trophy";
  if (score >= 65) return "Realistic target";
  if (score >= 50) return "Moderate challenge";
  if (score >= 35) return "Advanced target";
  return "Specialist target";
}

export function buildEarlyTargetRankings(records: CatchRecord[], speciesRules: SpeciesRule[] = defaultSpeciesRules): EarlyTargetRanking[] {
  const ruleMap = new Map<string, SpeciesRule>();
  for (const rule of speciesRules) {
    ruleMap.set(rule.species, rule);
  }

  const bySpecies = new Map<string, CatchRecord[]>();
  for (const record of records) {
    const list = bySpecies.get(record.normalizedSpecies) ?? [];
    list.push(record);
    bySpecies.set(record.normalizedSpecies, list);
  }

  const speciesRows = [...bySpecies.entries()].map(([species, speciesRecords]) => {
    const rule = ruleMap.get(species) ?? getSpeciesRule(species);
    const trophyRecords = speciesRecords.filter((record) => isTrophy(record, rule));

    const waterCounts = new Map<string, number>();
    for (const record of trophyRecords) {
      const water = record.normalizedWaterbody || "Unknown";
      waterCounts.set(water, (waterCounts.get(water) ?? 0) + 1);
    }

    const bestWaterbody = [...waterCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "Unknown";

    return {
      species,
      rule,
      trophyRecords,
      trophyEntries: trophyRecords.length,
      uniqueWaterbodies: new Set(trophyRecords.map((record) => record.normalizedWaterbody).filter(Boolean)).size,
      bestWaterbody,
      bestMonths: topMonths(trophyRecords, 3),
      topThreeMonthPct: topThreeMonthPct(trophyRecords),
      recentPct: recentPct(trophyRecords),
      profile: getSpeciesDifficultyProfile(species),
    };
  }).filter((row) => row.trophyEntries > 0);

  const maxTrophyEntries = Math.max(...speciesRows.map((row) => row.trophyEntries), 0);
  const maxUniqueWaterbodies = Math.max(...speciesRows.map((row) => row.uniqueWaterbodies), 0);

  const rankings: EarlyTargetRanking[] = speciesRows.map((row) => {
    const attainabilityScore = calculateAttainabilityScore({
      trophyEntryCount: row.trophyEntries,
      maxTrophyEntryCount: maxTrophyEntries,
      uniqueWaterbodyCount: row.uniqueWaterbodies,
      maxUniqueWaterbodyCount: maxUniqueWaterbodies,
      topThreeMonthPct: row.topThreeMonthPct,
      recentPct: row.recentPct,
      kayakPracticality: row.profile.kayakPracticality,
      shorePracticality: row.profile.shorePracticality,
      techniqueDifficulty: row.profile.techniqueDifficulty,
      gearSpecialization: row.profile.gearSpecialization,
      nearbyOpportunityScore: 50,
    });

    return {
      species: row.species,
      trophyThreshold: thresholdLabel(row.rule),
      attainabilityScore,
      difficultyLabel: getDifficultyLabel(attainabilityScore),
      trophyEntries: row.trophyEntries,
      uniqueWaterbodies: row.uniqueWaterbodies,
      bestWaterbody: row.bestWaterbody,
      bestMonths: row.bestMonths,
      kayakPracticality: row.profile.kayakPracticality,
      shorePracticality: row.profile.shorePracticality,
      techniqueDifficulty: row.profile.techniqueDifficulty,
      gearSpecialization: row.profile.gearSpecialization,
      notes: row.profile.notes,
      reasoning: `Ranks well because it has ${row.trophyEntries} trophy entries across ${row.uniqueWaterbodies} waters, clear seasonal windows (${row.bestMonths.join(", ") || "mixed"}), and kayak practicality ${row.profile.kayakPracticality}/5.`
    };
  });

  return rankings.sort((a, b) => b.attainabilityScore - a.attainabilityScore || b.trophyEntries - a.trophyEntries || a.species.localeCompare(b.species));
}
