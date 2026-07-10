export type TarpFishProfile = {
  species: string;
  displayName: string;
  requiredLengthInches: number;
  imageUrl: string | null;
  imageAttribution: string;
  idPageUrl: string;
  tarpPageUrl: string;
  starterTips: string[];
};

const fishIdPage = "https://www.eregulations.com/tennessee/fishing/fish-identification";
const tarpPage = "https://www.eregulations.com/tennessee/fishing/angler-recognition-program";
const illustrationAttribution = "Illustrations © Joseph R. Tomelleri via Tennessee eRegulations";
const bowfinImageUrl = "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmE1MTdkNDM0M2MwODE5MWEyYzM2Y2VkOTg2ZDkyZGQ6ZmlsZV8wMDAwMDAwMGQ0Yjg3MWY3OGVhNjZkMWMwNmNiOWZiYiIsImdpem1vX2lkIjpudWxsLCJ0cyI6IjIwNjQ0IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiIxNTcyOTAyYTI5ODM1NWYxNDE3ZWM5NDI4OGY3MmQyNzRiNTk3OTdkMTY2ZmYzMmQzNmI0OGM0M2YwZmJmOTlkIiwidiI6IjAiLCJjcyI6bnVsbCwiY2RuIjpudWxsLCJmbiI6bnVsbCwiY2QiOm51bGwsImNwIjpudWxsLCJtYSI6bnVsbH0=";
const longnoseGarImageUrl = "https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmE1MTdjZTdkM2Q0ODE5MWJlMmEwZTVjN2QyMDQ1MjE6ZmlsZV8wMDAwMDAwMDk1MTA3MjBjOTg3ZTMyYjU4NWMwN2M2NiIsImdpem1vX2lkIjpudWxsLCJ0cyI6IjIwNjQ0IiwicCI6InB5aSIsImNpZCI6IjEiLCJzaWciOiJhOGU5NDdhZTkwZDUxZmNjMjA5MDdiZmZhNTE4OTFmNWEwZmQ0YmUzMzEwNzUwYzkyMjI1YmQ2YWMxY2NhMzdiIiwidiI6IjAiLCJjcyI6bnVsbCwiY2RuIjpudWxsLCJmbiI6bnVsbCwiY2QiOm51bGwsImNwIjpudWxsLCJtYSI6bnVsbH0=";

const starterTipsBySpecies: Record<string, string[]> = {
  "Largemouth Bass": [
    "Start on cover first: docks, laydowns, grass lines, and shallow wood near bait.",
    "Rotate jigs, Texas-rig plastics, and spinnerbaits to match clarity and wind.",
    "When bites fade shallow, slide to first breakline and nearby channel swings."
  ],
  "Spotted Bass": [
    "Target rock transitions, bluff ends, and current-facing points in cleaner water.",
    "Use finesse worms, small swimbaits, and underspins around suspended fish.",
    "Watch for schooling windows and keep a topwater or spoon ready."
  ],
  "Smallmouth Bass": [
    "Focus on clear rocky banks, gravel points, and current seams near deeper water.",
    "Match forage with craw-pattern baits, jerkbaits, and compact football jigs.",
    "In calm post-frontal periods, downsize line and slow your cadence."
  ],
  "Striped Bass": [
    "Locate shad schools first, then fish the same depth zone with live bait or spoons.",
    "Use trolling and drifting passes over channel edges and deep structure.",
    "At dawn and low light, keep topwater and fast reaction baits ready for feeds."
  ],
  "Hybrid Striped Bass": [
    "Look for roaming bait schools on main-lake points and open-water breaks.",
    "Cast swimbaits or spoons into schooling fish, then follow with vertical jigging.",
    "When wind pushes bait, focus windblown banks and adjacent channel drops."
  ],
  "White Bass": [
    "Target spring current runs and feeding schools near river inflow areas.",
    "Throw inline spinners, grubs, and jigging spoons in white or chartreuse tones.",
    "If fish are mobile, fan-cast quickly and move until you reconnect."
  ],
  "Yellow Bass": [
    "Search warm backwaters and calmer pockets near bait concentrations.",
    "Use small jigs, tiny crankbaits, or bait under light line for numbers.",
    "Keep retrieves steady and subtle because fish often travel in compact pods."
  ],
  "Black Crappie": [
    "Fish brush piles, timber edges, and docks with controlled slow presentations.",
    "Use small plastics or minnows, and adjust depth by one foot at a time.",
    "During spawn windows, check shallow protected pockets first thing each morning."
  ],
  "White Crappie": [
    "Prioritize stained-water cover and creek arms with standing timber.",
    "Run minnows or small jigs through multiple depth bands until fish stack.",
    "When schools scatter, longline or slow troll to relocate active groups."
  ],
  "Bluegill": [
    "Target shallow flats and bedding colonies around sand, gravel, or mixed bottom.",
    "Use worms or micro-jigs under a float and keep bait just above bottom.",
    "If fish get pressured, step down hook size and reduce float movement."
  ],
  "Redear Sunfish": [
    "Work warm clear coves with shell, gravel, or firm bottom near light cover.",
    "Present redworms and crawler pieces slowly on bottom with minimal weight.",
    "Probe slightly deeper than bluegill beds when shallow fish stop biting."
  ],
  "Rock Bass": [
    "Focus shaded rock banks, current breaks, and boulder seams in creeks and rivers.",
    "Cast compact tubes, small cranks, or live bait tight to hard cover.",
    "Make repeated short casts to the same pocket because fish hold tight."
  ],
  Sauger: [
    "Fish current seams, dam tailraces, and channel edges with bottom contact.",
    "Use bright hair jigs or plastics tipped with minnows in stained water.",
    "If current increases, switch to heavier heads and slower drifts."
  ],
  Walleye: [
    "Focus low-light periods on points, ledges, and transition banks.",
    "Run jerkbaits, blade baits, or live bait rigs near bottom in clear water.",
    "When daytime is tough, work deeper structure with controlled vertical moves."
  ],
  "Yellow Perch": [
    "Target creek embayments and moderate-depth flats near weeds or brush.",
    "Use small minnows or tiny jigs and keep presentations close to bottom.",
    "When schools are found, stay tight to them and fish vertically."
  ],
  Muskellunge: [
    "Focus major points, timber edges, and bait-rich transitions with big profiles.",
    "Rotate bucktails, jerkbaits, and swimbaits until fish show follow behavior.",
    "Always finish with a figure-eight at boatside to convert trailing fish."
  ],
  "Brook Trout": [
    "Fish cold upper-stream pockets, plunge pools, and shaded current seams.",
    "Present small flies, inline spinners, or natural baits with stealthy approaches.",
    "In clear water, lengthen leaders and minimize wading disturbance."
  ],
  "Brown Trout": [
    "Target low-light ambush lanes near undercut banks, timber, and depth changes.",
    "Use streamers, jerkbaits, or larger minnows to trigger predatory fish.",
    "After rain or generation, work edges where cleaner and stained water meet."
  ],
  "Rainbow Trout": [
    "Start in current seams and oxygen-rich runs where food funnels naturally.",
    "Use small spinners, drift rigs, or nymph-style flies at controlled speed.",
    "Adjust weight constantly to keep bait in the strike zone without snagging."
  ],
  "Lake Trout": [
    "Key on deeper cold-water basins and steep drop zones near forage.",
    "Vertical jig heavy spoons or tube baits directly under marked fish.",
    "If suspended fish are high, troll through their band with matched lure depth."
  ],
  "Channel Catfish": [
    "Fish current breaks, flats near channel edges, and riprap after dark.",
    "Use cut bait, nightcrawlers, or stink baits based on local bite preference.",
    "Anchor quietly and fan multiple rods at staggered distances."
  ],
  "Blue Catfish": [
    "Target deep channels, ledges, and structure in major rivers and reservoirs.",
    "Drift fresh cut bait with enough weight to maintain near-bottom contact.",
    "When you mark bait and arches together, shorten drifts and repeat passes."
  ],
  "Flathead Catfish": [
    "Focus logjams, deep holes, and heavy cover near current transitions.",
    "Use sturdy rigs with live bait and fish tight to structure at night.",
    "Set drifts or anchors so baits sit just upstream of likely ambush points."
  ],
  "Common Carp": [
    "Prebait quiet zones and fish margins where carp cruise and tail.",
    "Present corn, dough, or pack-bait rigs with minimal terminal hardware.",
    "Use long leaders and low drag settings to handle strong first runs."
  ],
  "Freshwater Drum": [
    "Work bottom-oriented structure on flats, channel edges, and current transitions.",
    "Use jigs, worms, or cut bait with slow hops and pauses near bottom.",
    "When schools are located, hold position and repeat identical drifts."
  ],
  Bowfin: [
    "Target weedy backwaters, oxbows, and shallow cover with warm water.",
    "Throw spinnerbaits, frogs, or live bait close to vegetation edges.",
    "Use abrasion-resistant leader material because bowfin roll and twist hard."
  ],
  "Longnose Gar": [
    "Look for surface fish in warm backwaters, slack pools, and river margins.",
    "Present live minnows slowly near the surface or just under it.",
    "Use firm sweeping hooksets and keep steady tension during jumps."
  ]
};

function getStarterTips(species: string): string[] {
  return starterTipsBySpecies[species] ?? [
    "Target likely feeding structure first, then expand to nearby depth transitions.",
    "Match bait size to local forage and adjust retrieve speed to water temperature.",
    "Track successful depth, cover, and conditions so patterns repeat faster."
  ];
}

export const tarpFishProfiles: TarpFishProfile[] = [
  { species: "Largemouth Bass", displayName: "Largemouth Bass", requiredLengthInches: 22, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/6.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Largemouth Bass") },
  { species: "Spotted Bass", displayName: "Spotted Bass", requiredLengthInches: 18, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/5.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Spotted Bass") },
  { species: "Smallmouth Bass", displayName: "Smallmouth Bass", requiredLengthInches: 20, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/7.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Smallmouth Bass") },
  { species: "Striped Bass", displayName: "Striped Bass", requiredLengthInches: 40, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/3.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Striped Bass") },
  { species: "Hybrid Striped Bass", displayName: "Hybrid Striped Bass (Cherokee Bass)", requiredLengthInches: 28, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/4.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Hybrid Striped Bass") },
  { species: "White Bass", displayName: "White Bass", requiredLengthInches: 18, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/9.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("White Bass") },
  { species: "Yellow Bass", displayName: "Yellow Bass", requiredLengthInches: 11, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/10.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Yellow Bass") },
  { species: "Black Crappie", displayName: "Black Crappie", requiredLengthInches: 14, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/12.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Black Crappie") },
  { species: "White Crappie", displayName: "White Crappie", requiredLengthInches: 14, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/13.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("White Crappie") },
  { species: "Bluegill", displayName: "Bluegill", requiredLengthInches: 10, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/15.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Bluegill") },
  { species: "Redear Sunfish", displayName: "Redear Sunfish", requiredLengthInches: 11, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/14.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Redear Sunfish") },
  { species: "Rock Bass", displayName: "Rock Bass", requiredLengthInches: 10, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/11.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Rock Bass") },
  { species: "Sauger", displayName: "Sauger", requiredLengthInches: 20, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/24.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Sauger") },
  { species: "Walleye", displayName: "Walleye", requiredLengthInches: 28, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/25.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Walleye") },
  { species: "Yellow Perch", displayName: "Yellow Perch", requiredLengthInches: 11, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/perch_yellow_unmodified.png", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Yellow Perch") },
  { species: "Muskellunge", displayName: "Muskellunge", requiredLengthInches: 40, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/muskellunge_2017.png", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Muskellunge") },
  { species: "Brook Trout", displayName: "Brook Trout", requiredLengthInches: 10, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/21.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Brook Trout") },
  { species: "Brown Trout", displayName: "Brown Trout", requiredLengthInches: 26, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/20.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Brown Trout") },
  { species: "Rainbow Trout", displayName: "Rainbow Trout", requiredLengthInches: 24, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/19.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Rainbow Trout") },
  { species: "Lake Trout", displayName: "Lake Trout", requiredLengthInches: 28, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/23.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Lake Trout") },
  { species: "Channel Catfish", displayName: "Channel Catfish", requiredLengthInches: 28, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/18.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Channel Catfish") },
  { species: "Blue Catfish", displayName: "Blue Catfish", requiredLengthInches: 36, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/16.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Blue Catfish") },
  { species: "Flathead Catfish", displayName: "Flathead Catfish", requiredLengthInches: 36, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/17.jpg", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Flathead Catfish") },
  { species: "Common Carp", displayName: "Common Carp", requiredLengthInches: 34, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/carp_common_2017.png", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Common Carp") },
  { species: "Freshwater Drum", displayName: "Freshwater Drum", requiredLengthInches: 28, imageUrl: "https://www.eregulations.com/assets/images/books/tnab/24tnab/drum_freshwater.png", imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Freshwater Drum") },
  { species: "Bowfin", displayName: "Bowfin", requiredLengthInches: 26, imageUrl: bowfinImageUrl, imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Bowfin") },
  { species: "Longnose Gar", displayName: "Longnose Gar", requiredLengthInches: 45, imageUrl: longnoseGarImageUrl, imageAttribution: illustrationAttribution, idPageUrl: fishIdPage, tarpPageUrl: tarpPage, starterTips: getStarterTips("Longnose Gar") }
];

export function getTarpFishProfile(species: string): TarpFishProfile | undefined {
  return tarpFishProfiles.find((profile) => profile.species === species);
}
