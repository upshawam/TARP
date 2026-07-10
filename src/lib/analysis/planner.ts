import type { CatchRecord } from "../../types/CatchRecord";
import type { FishingPlan, GeoPoint, PlannerMode, WaterbodyRecommendation } from "../../types/FishingPlan";
import { getSpeciesRule } from "../../data/speciesRules";
import { getStrategyTemplate } from "../../data/strategyTemplates";
import { waterbodyCoordinates } from "../../data/waterbodyCoordinates";
import { groupBy } from "../utils/groupBy";
import { monthName } from "../utils/formatters";
import { distanceMiles } from "../utils/geo";
import { filterTrophies } from "./trophyFilters";
import { calculateOpportunityScore, confidenceLevel } from "./scoring";
import { topCounties, topDateWindows, topMonths, topSpecies as rankSpecies } from "./rankings";
import { getResearchMatchForRecommendation } from "./research";
import { buildEarlyTargetRankings } from "./attainability";

type PlanOptions = {
  origin?: GeoPoint | null;
  radiusMiles?: number | null;
  targetDate?: Date;
  mode?: PlannerMode;
};

// ±21 day rolling window centred on today's day-of-year.
// This gives ~855 records for mid-July vs. 116 for an exact day — enough
// statistical signal to rank reliably while staying seasonally tight.
const WINDOW_DAYS = 21;

function dayOfYear(month: number, day: number): number {
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let d = day;
  for (let m = 1; m < month; m++) d += daysInMonth[m];
  return d;
}

function buildSeasonalWindow(targetDate?: Date): { today: Date; label: string; windowLabel: string; inWindow: (record: CatchRecord) => boolean } {
  const today = targetDate ?? new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayDOY = dayOfYear(month, day);
  const lo = todayDOY - WINDOW_DAYS;
  const hi = todayDOY + WINDOW_DAYS;

  const inWindow = (record: CatchRecord): boolean => {
    if (record.month === null || record.day === null) return false;
    const doy = dayOfYear(record.month, record.day);
    // Wrap-around for year boundary (e.g. late Dec / early Jan)
    if (lo < 1) return doy >= (365 + lo) || doy <= hi;
    if (hi > 365) return doy >= lo || doy <= (hi - 365);
    return doy >= lo && doy <= hi;
  };

  const fromMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - WINDOW_DAYS);
  const toMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() + WINDOW_DAYS);
  const fmt = (d: Date) => `${monthName(d.getMonth() + 1)} ${d.getDate()}`;

  return {
    today,
    label: `${monthName(month)} ${day}`,
    windowLabel: `${fmt(fromMonth)} – ${fmt(toMonth)} (±${WINDOW_DAYS} days)`,
    inWindow
  };
}

function normalizeOrigin(origin?: GeoPoint | null): GeoPoint | null {
  if (!origin) return null;
  if (!Number.isFinite(origin.latitude) || !Number.isFinite(origin.longitude)) return null;
  return origin;
}

// Seasonal fit: how well does this waterbody's historical catch pattern
// align with the ±21 day window?  Returns 0–100.
function seasonalFitScore(records: CatchRecord[], inWindow: (r: CatchRecord) => boolean): number {
  if (!records.length) return 0;
  const windowCount = records.filter(inWindow).length;
  return Math.round(windowCount / records.length * 100);
}

function combinedScore(baseScore: number, timeScore: number | null, proximityScore: number | null): number {
  const weights = [
    { score: baseScore, weight: 0.55 },
    ...(timeScore === null ? [] : [{ score: timeScore, weight: 0.25 }]),
    ...(proximityScore === null ? [] : [{ score: proximityScore, weight: 0.20 }])
  ];
  const weightSum = weights.reduce((sum, item) => sum + item.weight, 0) || 1;
  return weights.reduce((sum, item) => sum + item.score * item.weight, 0) / weightSum;
}

function distanceLabel(distance: number | null): string {
  if (distance === null) return "Distance unavailable";
  if (distance < 25) return `~${Math.round(distance)} mi away`;
  if (distance < 100) return `~${Math.round(distance)} mi drive`;
  return `~${Math.round(distance)} mi trip`;
}

function bestSpeciesForRecords(records: CatchRecord[]): string {
  return rankSpecies(records, 1)[0]?.name ?? "Unknown";
}

function biggestRecorded(records: CatchRecord[]): string {
  const biggest = [...records].sort((a, b) => (b.lengthInches ?? 0) - (a.lengthInches ?? 0))[0];
  return biggest?.lengthInches ? `${biggest.lengthInches}\"` : "Unknown";
}

function yearsRepresented(records: CatchRecord[]): number {
  return new Set(records.map((record) => record.year).filter(Boolean)).size;
}

export function buildRecommendations(records: CatchRecord[], species: string | undefined, options: PlanOptions = {}): WaterbodyRecommendation[] {
  const { inWindow, windowLabel, today } = buildSeasonalWindow(options.targetDate);
  const mode = options.mode ?? "upside";
  const origin = normalizeOrigin(options.origin);
  const radiusMiles = options.radiusMiles ?? null;
  const targetMonth = today.getMonth() + 1;
  const attainabilityBySpecies = new Map(
    buildEarlyTargetRankings(records).map((row) => [row.species, row.attainabilityScore] as const)
  );

  // All trophy records, then narrow to the ±21 day seasonal window
  const allTrophies = species ? filterTrophies(records, species).filter((r) => r.normalizedSpecies === species) : filterTrophies(records);
  const windowRecords = allTrophies.filter(inWindow);
  // Fall back to all trophies if the window is sparse (shouldn't happen with 9k records, but be safe)
  const base = windowRecords.length >= 10 ? windowRecords : allTrophies;
  const grouped = groupBy(base, (r) => r.normalizedWaterbody);

  const results: WaterbodyRecommendation[] = [];

  for (const [waterbody, waterbodyRecords] of Object.entries(grouped)) {
      const coordinate = waterbodyCoordinates[waterbody];
      const distance = origin && coordinate
        ? distanceMiles(origin, { latitude: coordinate.latitude, longitude: coordinate.longitude })
        : null;

      // Skip if outside user's radius filter
      if (radiusMiles !== null && origin && (distance === null || distance > radiusMiles)) {
        continue;
      }

      const score = calculateOpportunityScore(waterbodyRecords, allTrophies);
      const timeFitScore = seasonalFitScore(allTrophies.filter((r) => r.normalizedWaterbody === waterbody), inWindow);
      const proximityScore = distance === null ? null : Math.max(0, 100 - distance / 3);
      const combined = combinedScore(score, timeFitScore, proximityScore);
      const bestMonths = topMonths(waterbodyRecords, 3).map((item) => item.name);
      const strongestCounties = topCounties(waterbodyRecords, 3).map((item) => item.name);
      const bestDateWindows = topDateWindows(waterbodyRecords, 3).map((item) => item.name);
      const topSpeciesHere = rankSpecies(waterbodyRecords, 5);
      const bestSpecies = topSpeciesHere[0]?.name ?? "Unknown";
      const structures = getStrategyTemplate(bestSpecies).slice(0, 5);
      const speciesAttainability = attainabilityBySpecies.get(bestSpecies) ?? 50;
      const finalScore = mode === "easiest"
        ? Math.round(combined * 0.55 + speciesAttainability * 0.45)
        : Math.round(combined);
      const research = getResearchMatchForRecommendation({
        waterbody,
        species: bestSpecies,
        month: targetMonth,
      });

      results.push({
        waterbody,
        opportunityScore: finalScore,
        timeFitScore,
        distanceMiles: distance === null ? null : Math.round(distance * 10) / 10,
        bestSpecies,
        topSpeciesAtWaterbody: topSpeciesHere,
        trophyEntries: waterbodyRecords.length,
        biggestRecorded: biggestRecorded(waterbodyRecords),
        bestMonths,
        strongestCounties,
        bestDateWindows,
        structures,
        researchTips: research.tips,
        researchSources: research.sources,
        researchAppliesTo: research.appliesTo,
        reasoning: `${waterbody} has ${waterbodyRecords.length} trophy entries in the ${windowLabel} window. Strongest months: ${bestMonths.join(", ") || "not clear"}. Best fish here: ${bestSpecies}${distance === null ? "" : `; ${distanceLabel(distance)}`}.${mode === "easiest" ? ` Attainability bias: ${speciesAttainability}/100.` : ""}`,
        caveats: [
          ...(waterbodyRecords.length < 8 ? ["Small sample — treat as a lead, not a guarantee."] : []),
          ...(mode === "easiest" ? ["High TARP count does not guarantee easy fishing. It may reflect popularity and angler effort."] : []),
          ...(distance === null && origin ? ["No coordinate stored for this waterbody — travel distance not estimated."] : [])
        ]
      });
  }

  return results
    .sort((a, b) => b.opportunityScore - a.opportunityScore || b.trophyEntries - a.trophyEntries)
    .slice(0, 12);
}

export function generateFishingPlan(records: CatchRecord[], species?: string, options: PlanOptions = {}): FishingPlan {
  const mode = options.mode ?? "upside";
  const { label, windowLabel, inWindow } = buildSeasonalWindow(options.targetDate);
  const allTrophies = species ? filterTrophies(records, species).filter((r) => r.normalizedSpecies === species) : filterTrophies(records);
  const windowTrophies = allTrophies.filter(inWindow);
  const recommendations = buildRecommendations(records, species, { ...options, mode });
  const bestMonths = topMonths(allTrophies, 4).map((item) => item.name);
  const bestDateWindows = topDateWindows(allTrophies, 6).map((item) => item.name);
  const topSpecies = mode === "easiest"
    ? buildEarlyTargetRankings(records).slice(0, 6).map((row) => ({ name: row.species, count: row.attainabilityScore }))
    : rankSpecies(windowTrophies.length >= 10 ? windowTrophies : allTrophies, 6);
  const primarySpecies = species ?? topSpecies[0]?.name ?? "All species";
  const rule = species ? getSpeciesRule(species) : undefined;
  const structures = getStrategyTemplate(primarySpecies).slice(0, 6);
  const top = recommendations[0];
  const threshold = species
    ? rule?.trophyLengthInches ? `${rule.trophyLengthInches}\"+` : "Trophy size"
    : "Mixed standards";
  const confidence = top ? confidenceLevel(top.trophyEntries, yearsRepresented(allTrophies)) : "Low";
  const originLabel = options.origin?.label
    ? options.origin.label
    : options.origin
      ? `${options.origin.latitude.toFixed(3)}, ${options.origin.longitude.toFixed(3)}`
      : "No location set";
  const radiusLabel = options.radiusMiles ? `Within ${options.radiusMiles} mi` : "Any distance";
  const scopeLabel = species ? species : "All species";

  const strategySummary = top
    ? mode === "easiest"
      ? `Attainability mode: ${windowLabel}. Start with ${top.waterbody} for a realistic trophy attempt; best target species is ${top.bestSpecies}. This recommendation balances trophy history with practical repeatability. Focus on ${structures.join(", ")}. High TARP count does not guarantee easy fishing. It may reflect popularity and angler effort.${top.researchTips[0] ? ` Research hint: ${top.researchTips[0]}` : ""}`
      : `Seasonal window: ${windowLabel}. Historically, ${topSpecies.slice(0, 3).map((s) => s.name).join(", ") || "unknown"} are the most active trophy fish right now. Start with ${top.waterbody} — ${top.trophyEntries} trophy entries in this window, best fish: ${top.bestSpecies}. Focus on ${structures.join(", ")}. Overall peak months: ${bestMonths.join(", ") || "not clear"}.${top.researchTips[0] ? ` Research hint: ${top.researchTips[0]}` : ""}`
    : `No trophy records found for this combination. Try removing the radius filter or checking a different species.`;

  return {
    mode,
    species: scopeLabel,
    scopeLabel,
    trophyThreshold: threshold,
    targetDateLabel: label,
    windowLabel,
    originLabel: `${originLabel}${options.radiusMiles ? ` · ${radiusLabel}` : ""}`,
    topSpecies,
    topRecommendations: recommendations,
    bestMonths,
    bestDateWindows,
    strategySummary,
    confidence
  };
}
