import type { CatchRecord } from "../../types/CatchRecord";
import { filterTrophies } from "./trophyFilters";
import { biggestFish, topCounties, topMonths, topSpecies, topWaterbodies } from "./rankings";

export function getSpeciesList(records: CatchRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.normalizedSpecies).filter(Boolean))).sort();
}

export function getWaterbodyList(records: CatchRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.normalizedWaterbody).filter(Boolean))).sort();
}

export function getAnglerList(records: CatchRecord[]): string[] {
  return Array.from(new Set(records.map((record) => record.angler).filter(Boolean) as string[])).sort();
}

export function getDashboardSummary(records: CatchRecord[]) {
  const trophies = filterTrophies(records);
  return {
    totalRecords: records.length,
    speciesCount: getSpeciesList(records).length,
    waterbodyCount: getWaterbodyList(records).length,
    trophyCount: trophies.length,
    topTrophySpecies: topSpecies(trophies, 5),
    allRankedTrophySpecies: topSpecies(trophies, Number.POSITIVE_INFINITY),
    topTrophyWaters: topWaterbodies(trophies, 8)
  };
}

export function getSpeciesSummary(records: CatchRecord[], species: string) {
  const speciesRecords = records.filter((record) => record.normalizedSpecies === species);
  const trophyRecords = filterTrophies(speciesRecords, species);
  return {
    species,
    totalEntries: speciesRecords.length,
    trophyEntries: trophyRecords.length,
    topWaterbodies: topWaterbodies(trophyRecords, 10),
    topCounties: topCounties(trophyRecords, 10),
    bestMonths: topMonths(trophyRecords, 12),
    biggestEntries: biggestFish(trophyRecords.length ? trophyRecords : speciesRecords, 10)
  };
}

export function getWaterbodySummary(records: CatchRecord[], waterbody: string) {
  const waterbodyRecords = records.filter((record) => record.normalizedWaterbody === waterbody);
  const trophyRecords = filterTrophies(waterbodyRecords);
  return {
    waterbody,
    totalEntries: waterbodyRecords.length,
    trophyEntries: trophyRecords.length,
    topSpecies: topSpecies(trophyRecords, 10),
    bestMonths: topMonths(trophyRecords, 12),
    biggestEntries: biggestFish(trophyRecords.length ? trophyRecords : waterbodyRecords, 10)
  };
}

export function getAnglerSummary(records: CatchRecord[], angler: string) {
  const anglerRecords = records.filter((record) => record.angler === angler);
  const trophyRecords = filterTrophies(anglerRecords);
  const displayRecords = trophyRecords.length ? trophyRecords : anglerRecords;

  return {
    angler,
    totalEntries: anglerRecords.length,
    trophyEntries: trophyRecords.length,
    topSpecies: topSpecies(trophyRecords, 10),
    topWaterbodies: topWaterbodies(trophyRecords, 12),
    bestMonths: topMonths(trophyRecords, 12),
    biggestEntries: biggestFish(displayRecords, 20),
    trophyList: [...trophyRecords].sort((a, b) => {
      const byLength = (b.lengthInches ?? 0) - (a.lengthInches ?? 0);
      if (byLength !== 0) return byLength;
      return (b.dateCaught ?? "").localeCompare(a.dateCaught ?? "");
    })
  };
}
