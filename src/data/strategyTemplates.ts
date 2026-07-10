export const speciesStrategyTemplates: Record<string, string[]> = {
  "Smallmouth Bass": [
    "Long points dropping into deep water",
    "Creek-mouth points",
    "Bluff ends",
    "Channel swings",
    "Bluff-to-gravel transitions",
    "Offshore humps",
    "Saddles",
    "Wind-blown rocky banks"
  ],
  "Largemouth Bass": ["Grass", "Wood", "Docks", "Shallow cover", "Creek arms", "Summer ledges"],
  "Spotted Bass": ["Rocky points", "Bluff walls", "Offshore rock piles", "Creek channels", "Main-lake humps"],
  "Cherokee Bass": ["Rocky points", "Bluff walls", "Offshore humps", "Creek channels", "Main-lake rock piles"],
  "White Bass": ["Tailwaters", "Rip-rap banks", "Feeder creek mouths", "Open-water schools", "Points"],
  "Yellow Bass": ["Brush piles", "Creek channels", "Standing timber", "Points", "Shallow flats"],
  "Striped Bass": ["Tailwaters", "Open-water baitfish schools", "Points", "Channel ledges", "Night lights"],
  "Hybrid Striped Bass": ["Open-water schools", "Points", "Channel edges", "Tailwaters", "Night lights"],
  "Walleye": ["Tailwaters", "Gravel shoals", "Night banks", "Points", "Pre-spawn river runs"],
  "Sauger": ["Tailwaters", "Gravel bars", "River channel edges", "Night banks", "Winter deep holes"],
  "Black Crappie": ["Brush piles", "Docks", "Standing timber", "Creek channels", "Spawning banks"],
  "White Crappie": ["Brush piles", "Docks", "Standing timber", "Creek channels", "Spawning banks"],
  "Bluegill": ["Spawning beds", "Dock shade", "Submerged brush", "Weed edges", "Creek mouths"],
  "Redear Sunfish": ["Deep brush", "Shell beds", "Dock pilings", "Spawning flats", "Creek channel edges"],
  "Rock Bass": ["Rocky banks", "Boulders", "Creek channels", "Bluff bases", "Root wads"],
  "Yellow Perch": ["Deep structure", "Weed edges", "Rocky points", "Creek channels", "Open-water schools"],
  "Muskellunge": ["Weed edges", "Points", "Shallow bays", "Transition zones", "Boat docks"],
  "Blue Catfish": ["River holes", "Current seams", "Outside bends", "Dam tailwaters", "Deep flats"],
  "Flathead Catfish": ["Log jams", "Deep holes", "Outside bends", "Rock piles", "Night ambush spots"],
  "Channel Catfish": ["Channel edges", "Tailwaters", "Gravel runs", "Scour holes", "Bait drops"],
  "Freshwater Drum": ["Sand flats", "Gravel bars", "Tailwaters", "Current seams", "Deep channel edges"],
  "Common Carp": ["Shallow flats", "Weed edges", "Mud bottoms", "Coves", "Feeder creeks"],
  "Rainbow Trout": ["Tailwaters", "Deep pools", "Rip-rap runs", "Seam water below dams", "Cold tributaries"],
  "Brown Trout": ["Deep pools", "Undercut banks", "Large boulders", "Tailwaters", "Cold tributary mouths"],
  "Brook Trout": ["Cold headwater streams", "Spring-fed pools", "Shade cover", "Small tributary runs"],
  "Lake Trout": ["Deep structure", "Offshore humps", "Cold thermocline", "Rocky points", "Open water"],
  "Longnose Gar": ["Shallow backwaters", "Weed edges", "Calm coves", "Creek mouths", "Sunning flats"],
  "Bowfin": ["Shallow vegetation", "Backwater sloughs", "Stumps", "Lily pads", "Flooded timber"],
};

export function getStrategyTemplate(species: string): string[] {
  return speciesStrategyTemplates[species] ?? ["Top historical waterbodies", "Best months", "Areas with repeated trophy entries"];
}
