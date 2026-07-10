export type SpeciesDifficultyProfile = {
  species: string;
  techniqueDifficulty: 1 | 2 | 3 | 4 | 5;
  kayakPracticality: 1 | 2 | 3 | 4 | 5;
  shorePracticality: 1 | 2 | 3 | 4 | 5;
  gearSpecialization: 1 | 2 | 3 | 4 | 5;
  notes: string;
};

export const speciesDifficultyProfiles: SpeciesDifficultyProfile[] = [
  {
    species: "Smallmouth Bass",
    techniqueDifficulty: 3,
    kayakPracticality: 4,
    shorePracticality: 2,
    gearSpecialization: 2,
    notes: "Strong trophy opportunity in Tennessee, especially clear rocky reservoirs and rivers. Good early project, but not easy."
  },
  {
    species: "Largemouth Bass",
    techniqueDifficulty: 2,
    kayakPracticality: 5,
    shorePracticality: 3,
    gearSpecialization: 2,
    notes: "Very accessible and kayak-friendly, but true trophy-size fish can be less predictable."
  },
  {
    species: "Spotted Bass",
    techniqueDifficulty: 3,
    kayakPracticality: 4,
    shorePracticality: 2,
    gearSpecialization: 2,
    notes: "Good rocky reservoir target. Often accessible, but trophy size may be more water-specific."
  },
  {
    species: "Black Crappie",
    techniqueDifficulty: 2,
    kayakPracticality: 4,
    shorePracticality: 3,
    gearSpecialization: 2,
    notes: "Good seasonal trophy target around docks, brush, timber, and spring banks."
  },
  {
    species: "White Crappie",
    techniqueDifficulty: 2,
    kayakPracticality: 4,
    shorePracticality: 3,
    gearSpecialization: 2,
    notes: "Good early trophy target when seasonal patterns are clear, especially spring and brush/dock patterns."
  },
  {
    species: "Walleye",
    techniqueDifficulty: 4,
    kayakPracticality: 2,
    shorePracticality: 2,
    gearSpecialization: 3,
    notes: "Timing-dependent and often tied to night fishing, current, trolling, or deep structure."
  },
  {
    species: "Sauger",
    techniqueDifficulty: 4,
    kayakPracticality: 2,
    shorePracticality: 3,
    gearSpecialization: 3,
    notes: "Often river and tailwater-oriented. Seasonal windows can be strong, but tactics are specialized."
  },
  {
    species: "Muskellunge",
    techniqueDifficulty: 5,
    kayakPracticality: 2,
    shorePracticality: 1,
    gearSpecialization: 5,
    notes: "Specialist trophy target with low encounter rates and specialized gear."
  },
  {
    species: "Blue Catfish",
    techniqueDifficulty: 3,
    kayakPracticality: 2,
    shorePracticality: 3,
    gearSpecialization: 3,
    notes: "Strong trophy potential, but big-fish tactics, anchoring, current, and safety matter."
  },
  {
    species: "Flathead Catfish",
    techniqueDifficulty: 4,
    kayakPracticality: 2,
    shorePracticality: 3,
    gearSpecialization: 4,
    notes: "Advanced trophy target often requiring live bait, night fishing, heavy cover, and patience."
  },
  {
    species: "Channel Catfish",
    techniqueDifficulty: 2,
    kayakPracticality: 4,
    shorePracticality: 4,
    gearSpecialization: 2,
    notes: "Accessible and practical from kayak or shore, though trophy-size fish may require selective waters."
  },
  {
    species: "Striped Bass",
    techniqueDifficulty: 4,
    kayakPracticality: 2,
    shorePracticality: 2,
    gearSpecialization: 4,
    notes: "Powerful open-water or tailwater target. Often requires bait, electronics, trolling, or chasing schools."
  },
  {
    species: "Hybrid Striped Bass",
    techniqueDifficulty: 3,
    kayakPracticality: 3,
    shorePracticality: 2,
    gearSpecialization: 3,
    notes: "More attainable than pure striped bass in some waters, but still often bait-school and timing dependent."
  }
];

const defaultProfile: SpeciesDifficultyProfile = {
  species: "Unknown",
  techniqueDifficulty: 3,
  kayakPracticality: 3,
  shorePracticality: 3,
  gearSpecialization: 3,
  notes: "No difficulty profile yet. Use local scouting and confidence levels from your own data."
};

function normalizeSpeciesName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getSpeciesDifficultyProfile(species: string): SpeciesDifficultyProfile {
  const normalized = normalizeSpeciesName(species);
  const match = speciesDifficultyProfiles.find((profile) => normalizeSpeciesName(profile.species) === normalized);
  if (match) return match;
  return { ...defaultProfile, species: species.trim() || defaultProfile.species };
}
