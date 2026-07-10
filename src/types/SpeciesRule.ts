export type SpeciesRule = {
  species: string;
  trophyLengthInches: number | null;
  trophyWeightPounds: number | null;
  preferredMetric: "length" | "weight" | "either";
  notes?: string;
};
