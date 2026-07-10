import type { SpeciesRule } from "../types/SpeciesRule";

// Thresholds are derived from the minimum qualifying length observed in the TARP export.
// All records in a TARP CSV are already trophy-qualifying entries; these thresholds
// allow the app to display the correct trophy target and filter consistently.
export const speciesRules: SpeciesRule[] = [
  // Bass
  { species: "Smallmouth Bass",     trophyLengthInches: 20,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Largemouth Bass",     trophyLengthInches: 22,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Spotted Bass",        trophyLengthInches: 18,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Cherokee Bass",       trophyLengthInches: 28,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "White Bass",          trophyLengthInches: 18,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Yellow Bass",         trophyLengthInches: 11,  trophyWeightPounds: null, preferredMetric: "length" },
  // Stripers
  { species: "Striped Bass",        trophyLengthInches: 36,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Hybrid Striped Bass", trophyLengthInches: 24,  trophyWeightPounds: null, preferredMetric: "length" },
  // Panfish
  { species: "Black Crappie",       trophyLengthInches: 12,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "White Crappie",       trophyLengthInches: 14,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Bluegill",            trophyLengthInches: 10,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Redear Sunfish",      trophyLengthInches: 11,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Rock Bass",           trophyLengthInches: 10,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Yellow Perch",        trophyLengthInches: 11,  trophyWeightPounds: null, preferredMetric: "length" },
  // Pike / Muskie
  { species: "Muskellunge",         trophyLengthInches: 40,  trophyWeightPounds: null, preferredMetric: "length" },
  // Walleye / Sauger
  { species: "Walleye",             trophyLengthInches: 28,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Sauger",              trophyLengthInches: 20,  trophyWeightPounds: null, preferredMetric: "length" },
  // Catfish
  { species: "Blue Catfish",        trophyLengthInches: 34,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Flathead Catfish",    trophyLengthInches: 34,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Channel Catfish",     trophyLengthInches: 28,  trophyWeightPounds: null, preferredMetric: "length" },
  // Drum / Carp
  { species: "Freshwater Drum",     trophyLengthInches: 28,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Common Carp",         trophyLengthInches: 34,  trophyWeightPounds: null, preferredMetric: "length" },
  // Trout
  { species: "Rainbow Trout",       trophyLengthInches: 24,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Brown Trout",         trophyLengthInches: 26,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Brook Trout",         trophyLengthInches: 10,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Lake Trout",          trophyLengthInches: 28,  trophyWeightPounds: null, preferredMetric: "length" },
  // Other
  { species: "Longnose Gar",        trophyLengthInches: 45,  trophyWeightPounds: null, preferredMetric: "length" },
  { species: "Bowfin",              trophyLengthInches: 26,  trophyWeightPounds: null, preferredMetric: "length" },
];

export function getSpeciesRule(species: string): SpeciesRule | undefined {
  return speciesRules.find((rule) => rule.species === species);
}
