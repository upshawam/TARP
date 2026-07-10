export type ResearchInsight = {
  id: string;
  title: string;
  sourceLabel: string;
  sourceUrl: string;
  months: number[];
  species?: string;
  waterbody?: string;
  tips: string[];
};

const sourceLabel = "Game and Fish: Tennessee Fishing Calendar (2019)";
const sourceUrl = "https://www.gameandfishmag.com/editorial/TennesseeFishingCalendar2019/358771";

export const researchInsights: ResearchInsight[] = [
  {
    id: "jan-melton-muskie",
    title: "January: Melton Hill muskie",
    sourceLabel,
    sourceUrl,
    months: [1],
    species: "Muskellunge",
    waterbody: "Melton Hill Lake",
    tips: [
      "Work blowdowns and the canal area near Bull Run in cold weather.",
      "Throw large spinners, jointed plugs, or large swimbaits.",
      "Prioritize catch-and-release for stocked muskie fisheries."
    ]
  },
  {
    id: "feb-dalehollow-smallmouth",
    title: "February: Dale Hollow smallmouth",
    sourceLabel,
    sourceUrl,
    months: [2],
    species: "Smallmouth Bass",
    waterbody: "Dale Hollow Lake",
    tips: [
      "Use float-and-fly around bluffs and rock banks.",
      "Fish slowly with light line in clear water.",
      "Target suspended fish with long pauses."
    ]
  },
  {
    id: "mar-tailwater-whitebass",
    title: "March: white bass river runs",
    sourceLabel,
    sourceUrl,
    months: [3],
    species: "White Bass",
    tips: [
      "Target moving water and current seams during spawning runs.",
      "Cast twister tails or spinners in white, chartreuse, or pink.",
      "Bank access can be productive where schools push near shore."
    ]
  },
  {
    id: "apr-douglas-crappie",
    title: "April: Douglas crappie",
    sourceLabel,
    sourceUrl,
    months: [4],
    species: "Black Crappie",
    waterbody: "Douglas Lake",
    tips: [
      "Focus on shallow spawning zones near shale banks and points.",
      "Use tube jigs, minnows, flies, or roadrunners under corks.",
      "Drift parallel in 5-10 feet when spider rigging."
    ]
  },
  {
    id: "may-kentucky-redear",
    title: "May: Kentucky Lake redear",
    sourceLabel,
    sourceUrl,
    months: [5],
    species: "Redear Sunfish",
    waterbody: "Kentucky Lake",
    tips: [
      "Search shallow bays and backwaters with hard gravel bottoms.",
      "Present redworms or nightcrawler pieces on light line.",
      "Drag baits near bottom with subtle weight."
    ]
  },
  {
    id: "jun-chickamauga-largemouth",
    title: "June: Chickamauga largemouth",
    sourceLabel,
    sourceUrl,
    months: [6],
    species: "Largemouth Bass",
    waterbody: "Chickamauga Lake",
    tips: [
      "Post-spawn bass group on ledges, channel drops, and humps.",
      "Use electronics to locate schools following shad.",
      "Deep cranks, long worms, swimbaits, and lizards are reliable."
    ]
  },
  {
    id: "jul-wattsbar-whitebass",
    title: "July: Watts Bar white bass",
    sourceLabel,
    sourceUrl,
    months: [7],
    species: "White Bass",
    waterbody: "Watts Bar Lake",
    tips: [
      "Scan humps for shad and schools during daytime heat.",
      "Bounce jigging spoons on bottom when fish are deep.",
      "Throw flash baits at dawn and dusk surface feeds."
    ]
  },
  {
    id: "aug-mississippi-bluecat",
    title: "August: Mississippi River catfish",
    sourceLabel,
    sourceUrl,
    months: [8],
    species: "Blue Catfish",
    waterbody: "Mississippi River",
    tips: [
      "Drift ledges and manmade structure with current-aware boat control.",
      "Use cut shad or other fresh cut bait with heavy tackle.",
      "Rig three-way setups to keep bait just off bottom."
    ]
  },
  {
    id: "sep-clinch-trout",
    title: "September: Clinch tailwater trout",
    sourceLabel,
    sourceUrl,
    months: [9],
    species: "Rainbow Trout",
    waterbody: "Clinch River",
    tips: [
      "Wade current seams during low generation windows.",
      "Use corn, worms, powerbait, or small spinners for eater-size fish.",
      "When generation is on, drift with jerkbaits, swimbaits, or large spinners for trophies."
    ]
  },
  {
    id: "oct-norris-walleye",
    title: "October: Norris walleye",
    sourceLabel,
    sourceUrl,
    months: [10],
    species: "Walleye",
    waterbody: "Norris Lake",
    tips: [
      "Night casting around isolated flooded brush can produce larger fish.",
      "Work stickbaits with a slow v-wake retrieve.",
      "Under-lights minnow presentations can add bonus crappie."
    ]
  },
  {
    id: "nov-tnriver-crappie",
    title: "November: Tennessee River crappie",
    sourceLabel,
    sourceUrl,
    months: [11],
    species: "White Crappie",
    waterbody: "Tennessee River",
    tips: [
      "Flip small jigs under docks and slips where shad gather.",
      "Slow-roll high-contrast colors in cooler water.",
      "Pull crankbaits when large shad schools are located."
    ]
  },
  {
    id: "dec-pickwick-sauger",
    title: "December: Pickwick sauger",
    sourceLabel,
    sourceUrl,
    months: [12],
    species: "Sauger",
    waterbody: "Pickwick Lake",
    tips: [
      "Fish current seams below dams with bright hair jigs tipped with minnows.",
      "Expect snags in rock but stay in the strike zone.",
      "Mix casting and vertical drifts based on current strength."
    ]
  }
];
