export type NormalizedColumnMap = {
  species?: string;
  length?: string;
  weight?: string;
  dateCaught?: string;
  waterbody?: string;
  county?: string;
  region?: string;
  angler?: string;
  method?: string;
  notes?: string;
};

const columnAliases: Record<keyof NormalizedColumnMap, string[]> = {
  // Generic aliases first, then TARP export-specific column names
  species: [
    "species", "fish species", "type",
    // TARP export: "Kind of Fish (Species)" -> "kind of fish species"
    "kind of fish species", "kind of fish"
  ],
  length: [
    "length", "length inches", "length in", "inches", "fish length", "length inches",
    // TARP export: "Length of fish" -> "length of fish"
    "length of fish"
  ],
  weight: [
    "weight", "weight pounds", "weight lbs", "lbs", "pounds", "fish weight", "weight lbs",
    "weight of fish"
  ],
  dateCaught: ["date", "date caught", "caught date", "catch date"],
  waterbody: [
    "waterbody", "water body", "body of water", "lake", "river", "reservoir", "water",
    // TARP export: "Body of Water Caught" -> "body of water caught"
    "body of water caught"
  ],
  county: ["county"],
  region: ["region"],
  angler: [
    "angler", "name", "angler name",
    // TARP export: "Angler's Name" -> "anglers name"
    "anglers name"
  ],
  method: ["method", "bait", "lure", "technique"],
  notes: ["notes", "comments"]
};

function cleanHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    // Collapse apostrophes/quotes so "Angler's" becomes "anglers" not "angler s"
    .replace(/['''"`]/g, "")
    // Replace remaining non-alphanumeric characters (parens, slashes, etc.) with a space
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function buildColumnMap(headers: string[]): NormalizedColumnMap {
  const cleaned = headers.map((header) => ({ original: header, cleaned: cleanHeader(header) }));
  const result: NormalizedColumnMap = {};

  for (const [target, aliases] of Object.entries(columnAliases) as [keyof NormalizedColumnMap, string[]][]) {
    const match = cleaned.find((header) => aliases.includes(header.cleaned));
    if (match) result[target] = match.original;
  }

  return result;
}
