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
const fishingBookerLabel = "FishingBooker: Tennessee Fishing - The Complete Guide (2026)";
const fishingBookerUrl = "https://fishingbooker.com/blog/fishing-in-tennessee/";
const twraGuideLabel = "TWRA: Tennessee Angler Guide";
const twraGuideUrl = "https://www.tn.gov/content/dam/tn/twra/documents/fishing/anglersguide.pdf";
const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
  },
  {
    id: "fb-striper-spring-summer",
    title: "FishingBooker: spring-summer striped bass playbook",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: [3, 4, 5, 6, 7, 8],
    species: "Striped Bass",
    tips: [
      "Focus on spring and summer patterns with fish around deeper, cooler water near structure.",
      "Prioritize shad or skipjack herring presentations (live or cut bait) when possible.",
      "Run trolling or drifting with planer boards, and switch to vertical jigging for fish holding near bottom."
    ]
  },
  {
    id: "fb-smallmouth-craw-pattern",
    title: "FishingBooker: smallmouth structure and craw pattern",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: allMonths,
    species: "Smallmouth Bass",
    tips: [
      "Target clear, cooler, running water or deeper lake structure zones.",
      "Match forage with crawfish-focused presentations around rocks and structure.",
      "Cycle crankbaits, jerkbaits, and soft plastics when fish ignore live bait."
    ]
  },
  {
    id: "fb-largemouth-may-sep",
    title: "FishingBooker: largemouth warm-water cover pattern",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: [5, 6, 7, 8, 9],
    species: "Largemouth Bass",
    tips: [
      "Best action is typically May through September in warm, calmer water.",
      "Key ambush zones include feeder creeks, bays, docks, and backwaters with cover.",
      "Lead with jigs, soft plastics, and spinnerbaits; use crayfish or nightcrawlers as live bait backup."
    ]
  },
  {
    id: "fb-trout-spring-coldwater",
    title: "FishingBooker: spring trout in cold, clear water",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: [3, 4, 5],
    species: "Rainbow Trout",
    tips: [
      "Spring is a prime window for Tennessee trout.",
      "Find cold, clear running water around 65 F and prioritize stream or tailwater flow seams.",
      "In eastern mountain streams, fly presentations are a high-confidence approach."
    ]
  },
  {
    id: "fb-catfish-year-round",
    title: "FishingBooker: year-round catfish strategy",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: allMonths,
    species: "Blue Catfish",
    tips: [
      "Catfish are available year-round in Tennessee waters.",
      "For bigger fish, focus on blue catfish around open reservoirs with structure.",
      "Build bait options around worms, panfish, and fresh baitfish to match local forage."
    ]
  },
  {
    id: "fb-crappie-mar-apr",
    title: "FishingBooker: crappie peak timing",
    sourceLabel: fishingBookerLabel,
    sourceUrl: fishingBookerUrl,
    months: [3, 4],
    species: "Black Crappie",
    tips: [
      "March and April are highlighted as the strongest crappie window.",
      "Start around fishable cover and staging zones where schools can concentrate.",
      "Use compact presentations to stay in the strike zone as fish group tightly."
    ]
  },
  {
    id: "twra-smallmouth-habitat",
    title: "TWRA guide: smallmouth habitat profile",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Smallmouth Bass",
    tips: [
      "Primary habitat is clear, rocky streams and clearer reservoir zones near ledges and rock.",
      "Forage includes sunfish, shad, shiners, suckers, crayfish, and aquatic insects.",
      "When choosing between bass waters, bias toward cleaner, cooler sections for smallmouth patterns."
    ]
  },
  {
    id: "twra-largemouth-cover",
    title: "TWRA guide: largemouth warm-cover habitat",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Largemouth Bass",
    tips: [
      "Largemouth favor warmer, calmer waters with cover like brush, stumps, and fallen timber.",
      "Common prey includes insects, frogs, crayfish, minnows, sunfish, and shad.",
      "Fish high-percentage cover first, then rotate outward to nearby transition areas."
    ]
  },
  {
    id: "twra-striper-shad-schools",
    title: "TWRA guide: striper open-water forage pattern",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Striped Bass",
    tips: [
      "Striped bass often occupy open-water schools in reservoirs.",
      "Key forage is gizzard shad, threadfin shad, and other herrings.",
      "Use electronics to locate bait schools first, then work the same water column depth."
    ]
  },
  {
    id: "twra-walleye-sauger-contrast",
    title: "TWRA guide: walleye versus sauger water preference",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Walleye",
    tips: [
      "Walleye are associated with larger, clearer, deeper rivers and reservoirs.",
      "Sauger tolerate more turbid flow and are commonly found near dams and river-island current zones.",
      "If water is stained and moving, prioritize sauger-style areas; shift to clearer/deeper structure for walleye."
    ]
  },
  {
    id: "twra-catfish-depth",
    title: "TWRA guide: catfish river and reservoir setup",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Blue Catfish",
    tips: [
      "Blue catfish are common in major rivers and reservoirs and can reach the largest sizes.",
      "Flathead catfish favor deeper holes and structure near current breaks.",
      "For trophy class fish, focus deeper river-reservoir structure with sturdy terminal tackle."
    ]
  },
  {
    id: "twra-trout-tailwater",
    title: "TWRA guide: trout coldwater and tailwater emphasis",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Rainbow Trout",
    tips: [
      "Tennessee trout opportunities include mountain streams, cold tailwaters, and select reservoirs.",
      "Brook trout are native and favor cooler mountain systems; browns tolerate slightly warmer water than brook/rainbow.",
      "Check stocked tailwater and stream options when planning consistent trout opportunities."
    ]
  },
  {
    id: "twra-spotted-bass-rock",
    title: "TWRA guide: spotted bass rocky-reservoir profile",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Spotted Bass",
    tips: [
      "Spotted bass commonly overlap with smallmouth habitat and favor rocky areas.",
      "Prioritize reservoir rock structure and current-influenced points over soft-cover-only zones.",
      "When bites stall, downsize presentations to shad and crayfish profiles."
    ]
  },
  {
    id: "twra-hybrid-striped-shad",
    title: "TWRA guide: Cherokee bass forage behavior",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Hybrid Striped Bass",
    tips: [
      "Hybrid striped bass (Cherokee bass) behave similarly to striped and white bass in reservoirs.",
      "They often herd shad schools near the surface, creating short feeding windows.",
      "Keep a fast shad-imitating bait ready when surface activity appears."
    ]
  },
  {
    id: "twra-white-bass-spawn-run",
    title: "TWRA guide: white bass spring run and schooling",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: [2, 3, 4, 5],
    species: "White Bass",
    tips: [
      "White bass school in open water and feed heavily on small shad and minnows.",
      "They run upstream to spawn in spring as water temperatures rise.",
      "Focus inflows and moving-water transitions when seasonal migration starts."
    ]
  },
  {
    id: "twra-yellow-bass-backwater",
    title: "TWRA guide: yellow bass warm backwater pattern",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Yellow Bass",
    tips: [
      "Yellow bass are common in quiet pools and backwaters of larger streams and reservoirs.",
      "They generally prefer warmer water than white bass and feed in open water.",
      "Search calmer pockets with nearby bait schools before running main-current stretches."
    ]
  },
  {
    id: "twra-white-crappie-stained",
    title: "TWRA guide: white crappie stained-water edge",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "White Crappie",
    tips: [
      "White crappie are more tolerant of muddy or stained water than black crappie.",
      "They thrive in streams, lakes, and slow-moving areas of larger rivers.",
      "Probe stained creek arms and timbered pockets when clear-water bites are inconsistent."
    ]
  },
  {
    id: "twra-bluegill-shallow-spawn",
    title: "TWRA guide: bluegill shallow bedding behavior",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: [4, 5, 6, 7, 8],
    species: "Bluegill",
    tips: [
      "Bluegill use quiet shallow warm water with vegetation and mixed sand-mud-gravel bottom.",
      "They spawn in grouped shallow beds, often in late spring into summer.",
      "Look for colonies first, then keep presentations small and precise."
    ]
  },
  {
    id: "twra-redear-snail-pattern",
    title: "TWRA guide: redear snail-focused feeding",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Redear Sunfish",
    tips: [
      "Redear prefer warm, clearer non-flowing waters with vegetation and hard cover.",
      "They feed heavily on snails and other bottom-oriented invertebrates.",
      "Keep baits near bottom and check slightly deeper zones than bluegill colonies."
    ]
  },
  {
    id: "twra-rock-bass-river-reservoir",
    title: "TWRA guide: rock bass mixed-habitat pattern",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Rock Bass",
    tips: [
      "Rock bass are commonly linked to rocky habitat and current-oriented cover.",
      "They overlap with other bass/sunfish around structure-rich banks and creek runs.",
      "Work compact presentations tight to rock and wood before moving on."
    ]
  },
  {
    id: "twra-sauger-dam-current",
    title: "TWRA guide: sauger near dams and current",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Sauger",
    tips: [
      "Sauger are more tolerant of turbid water than walleye and use rivers/reservoirs.",
      "Anglers commonly locate sauger near dams and river islands.",
      "In moving water, emphasize bottom contact along seam edges."
    ]
  },
  {
    id: "twra-yellow-perch-back-embayment",
    title: "TWRA guide: yellow perch embayment migration",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: [2, 3, 4, 5],
    species: "Yellow Perch",
    tips: [
      "Yellow perch are common in clear open water of larger lakes, ponds, and quiet rivers.",
      "They can move into creeks near the back ends of reservoir embayments.",
      "Track seasonal creek movement and fish tight schools vertically when found."
    ]
  },
  {
    id: "twra-brook-trout-coldheadwater",
    title: "TWRA guide: brook trout high-coldwater focus",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Brook Trout",
    tips: [
      "Brook trout are Tennessee's native trout and hold in cold mountain systems.",
      "Brook trout habitat is generally cooler than most other trout options.",
      "Approach upstream quietly and prioritize smaller headwater features."
    ]
  },
  {
    id: "twra-brown-trout-temp-window",
    title: "TWRA guide: brown trout temperature tolerance",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Brown Trout",
    tips: [
      "Brown trout use coldwater streams, rivers, and tailraces, and tolerate slightly warmer water than brook/rainbow.",
      "They feed on aquatic insects, worms, and fish forage depending on size.",
      "When flows shift, focus transition edges where forage funnels naturally."
    ]
  },
  {
    id: "twra-lake-trout-deep-cold",
    title: "TWRA guide: lake trout deep-water pattern",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Lake Trout",
    tips: [
      "Lake trout are stocked in eastern reservoirs and usually hold in deeper, colder layers.",
      "Their forage shifts with size, including insects, snails, and fish.",
      "Prioritize deeper vertical presentations when sonar marks fish below bait."
    ]
  },
  {
    id: "twra-channel-cat-general",
    title: "TWRA guide: channel catfish statewide profile",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Channel Catfish",
    tips: [
      "Channel catfish are widespread in medium-to-large rivers and reservoirs statewide.",
      "They are common in accessible waters and respond well to varied bait options.",
      "Rotate spots between current breaks and adjacent slower holding water."
    ]
  },
  {
    id: "twra-flathead-structure",
    title: "TWRA guide: flathead deep-hole behavior",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Flathead Catfish",
    tips: [
      "Flathead catfish favor deep holes, heavy structure, and scoured areas near flow.",
      "They feed heavily on live fish including shad, drum, carp, and sunfish.",
      "Anchor or drift baits tight to deep structure edges rather than open flats."
    ]
  },
  {
    id: "twra-common-carp-shallow",
    title: "TWRA guide: carp shallow warmwater use",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Common Carp",
    tips: [
      "Common carp are associated with quieter warm sections of lakes and reservoirs.",
      "Feeding activity often increases on soft-bottomed flats and gentle transitions.",
      "Use subtle presentations and longer casts in clear, pressured water."
    ]
  },
  {
    id: "twra-freshwater-drum-river",
    title: "TWRA guide: freshwater drum in river-reservoir systems",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Freshwater Drum",
    tips: [
      "Freshwater drum commonly use river-reservoir habitat and feed near bottom.",
      "They often hold around transitions where current, depth, and forage intersect.",
      "Work bottom baits methodically before changing zone or depth."
    ]
  },
  {
    id: "twra-bowfin-vegetation",
    title: "TWRA guide: bowfin shallow cover tendency",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Bowfin",
    tips: [
      "Bowfin are tied to shallow vegetated habitats and soft-cover backwater zones.",
      "They feed opportunistically on fish and invertebrates around heavy cover.",
      "Use abrasion-resistant leader setups and keep pressure steady during fights."
    ]
  },
  {
    id: "twra-longnose-gar-warm",
    title: "TWRA guide: longnose gar warmwater profile",
    sourceLabel: twraGuideLabel,
    sourceUrl: twraGuideUrl,
    months: allMonths,
    species: "Longnose Gar",
    tips: [
      "Longnose gar are found in larger streams and reservoirs, favoring warm waters.",
      "They feed on small fish such as shiners, sunfish, shad, and minnows.",
      "Target calmer surface zones and keep steady tension through jumps and rolls."
    ]
  }
];
