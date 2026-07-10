import type { RankedItem } from "../lib/analysis/rankings";

export type PlannerMode = "upside" | "easiest";

export type GeoPoint = {
  latitude: number;
  longitude: number;
  label?: string;
};

export type WaterbodyRecommendation = {
  waterbody: string;
  opportunityScore: number;
  timeFitScore: number | null;
  distanceMiles: number | null;
  bestSpecies: string;
  topSpeciesAtWaterbody: RankedItem[];
  trophyEntries: number;
  biggestRecorded: string;
  bestMonths: string[];
  strongestCounties: string[];
  bestDateWindows: string[];
  structures: string[];
  researchTips: string[];
  researchSources: string[];
  researchAppliesTo: string[];
  reasoning: string;
  caveats: string[];
};

export type FishingPlan = {
  mode: PlannerMode;
  species: string;
  scopeLabel: string;
  trophyThreshold: string;
  targetDateLabel: string;
  windowLabel: string;
  originLabel: string;
  topSpecies: RankedItem[];
  topRecommendations: WaterbodyRecommendation[];
  bestMonths: string[];
  bestDateWindows: string[];
  strategySummary: string;
  confidence: "High" | "Medium" | "Low";
};
