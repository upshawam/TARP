import { researchInsights } from "../../data/researchInsights";

type MatchInput = {
  waterbody: string;
  species: string;
  month: number;
  limit?: number;
};

export type ResearchMatch = {
  tips: string[];
  sources: string[];
  appliesTo: string[];
};

function scoreMatch(input: MatchInput, insight: (typeof researchInsights)[number]): number {
  const monthMatch = insight.months.includes(input.month);
  const speciesMatch = insight.species ? insight.species === input.species : false;
  const waterbodyMatch = insight.waterbody ? insight.waterbody === input.waterbody : false;
  const hasSpecificTarget = Boolean(insight.species || insight.waterbody);

  // Require seasonal alignment, and for targeted tips require either species or waterbody match.
  if (!monthMatch) return 0;
  if (hasSpecificTarget && !speciesMatch && !waterbodyMatch) return 0;

  let score = 3;
  if (speciesMatch) score += 4;
  if (waterbodyMatch) score += 4;
  if (speciesMatch && waterbodyMatch) score += 2;

  return score;
}

function applyLabel(insight: (typeof researchInsights)[number]): string {
  const speciesLabel = insight.species ?? "Any species";
  const waterbodyLabel = insight.waterbody ? ` at ${insight.waterbody}` : "";
  return `${speciesLabel}${waterbodyLabel}`;
}

export function getResearchMatchForRecommendation(input: MatchInput): ResearchMatch {
  const ranked = researchInsights
    .map((insight) => ({ insight, score: scoreMatch(input, insight) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, input.limit ?? 2);

  if (!ranked.length) {
    return { tips: [], sources: [], appliesTo: [] };
  }

  const tips = ranked.flatMap((item) => item.insight.tips).slice(0, 5);
  const sources = Array.from(
    new Set(ranked.map((item) => `${item.insight.title} (${item.insight.sourceLabel})`))
  );
  const appliesTo = Array.from(new Set(ranked.map((item) => applyLabel(item.insight))));

  return { tips, sources, appliesTo };
}
