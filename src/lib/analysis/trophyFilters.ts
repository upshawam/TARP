import type { CatchRecord } from "../../types/CatchRecord";
import type { SpeciesRule } from "../../types/SpeciesRule";
import { getSpeciesRule } from "../../data/speciesRules";

export function isTrophy(record: CatchRecord, rule: SpeciesRule | undefined = getSpeciesRule(record.normalizedSpecies)): boolean {
  // All records in a TARP export are recognized trophies. If the species doesn't have
  // a threshold defined yet, treat it as a trophy so it appears in all analyses.
  if (!rule) return true;

  if (rule.preferredMetric === "length" && rule.trophyLengthInches !== null) {
    return record.lengthInches !== null && record.lengthInches >= rule.trophyLengthInches;
  }

  if (rule.preferredMetric === "weight" && rule.trophyWeightPounds !== null) {
    return record.weightPounds !== null && record.weightPounds >= rule.trophyWeightPounds;
  }

  if (rule.preferredMetric === "either") {
    const lengthPass = rule.trophyLengthInches !== null && record.lengthInches !== null && record.lengthInches >= rule.trophyLengthInches;
    const weightPass = rule.trophyWeightPounds !== null && record.weightPounds !== null && record.weightPounds >= rule.trophyWeightPounds;
    return lengthPass || weightPass;
  }

  return false;
}

export function filterTrophies(records: CatchRecord[], species?: string): CatchRecord[] {
  return records.filter((record) => {
    if (species && record.normalizedSpecies !== species) return false;
    return isTrophy(record);
  });
}
