/**
 * Maps raw species strings (lowercased) to canonical normalized names.
 * Handles known TARP export typos and alternate common names.
 */
export const speciesAliases: Record<string, string> = {
  // Typos observed in the actual TARP CSV
  "smalmouth bass": "Smallmouth Bass",
  "smallmout bass": "Smallmouth Bass",
  "striper bass": "Striped Bass",
  "yelllow bass": "Yellow Bass",   // triple-L typo in TARP data
  // Common alternate names
  "stripe bass": "Striped Bass",
  "striper": "Striped Bass",
  "lmb": "Largemouth Bass",
  "smb": "Smallmouth Bass",
};
