import type { CatchRecord } from "../../types/CatchRecord";
import { waterbodyAliases } from "../../data/waterbodyAliases";
import { speciesAliases } from "../../data/speciesAliases";
import { titleCase } from "../utils/titleCase";
import type { NormalizedColumnMap } from "./normalizeColumns";

function asString(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeNameToken(token: string): string {
  const cleaned = token.trim();
  if (!cleaned) return "";

  // Keep roman numeral suffixes as uppercase
  if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(cleaned)) {
    return cleaned.toUpperCase();
  }

  // Keep initials consistent (T or T. -> T.)
  if (/^[a-z]\.??$/i.test(cleaned)) {
    return `${cleaned.charAt(0).toUpperCase()}.`;
  }

  // Normalize common suffixes
  if (/^(jr|jr\.|sr|sr\.)$/i.test(cleaned)) {
    return `${cleaned.charAt(0).toUpperCase()}${cleaned.charAt(1).toLowerCase()}.`;
  }

  // Preserve hyphen and apostrophe name segments while title-casing each part
  return cleaned
    .toLowerCase()
    .split("-")
    .map((hyphenPart) => hyphenPart
      .split("'")
      .map((apostrophePart) => apostrophePart
        ? apostrophePart.charAt(0).toUpperCase() + apostrophePart.slice(1)
        : ""
      )
      .join("'"))
    .join("-");
}

function normalizeAnglerName(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";

  // Handle suffix after comma, e.g. "Testerman, III"
  const [primary, ...suffixParts] = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  const normalizedPrimary = primary
    .split(" ")
    .filter(Boolean)
    .map(normalizeNameToken)
    .join(" ");

  if (!suffixParts.length) return normalizedPrimary;

  const normalizedSuffix = suffixParts
    .map((part) => part.split(" ").filter(Boolean).map(normalizeNameToken).join(" "))
    .join(", ");

  return `${normalizedPrimary}, ${normalizedSuffix}`;
}

function parseNumber(value: unknown): number | null {
  const text = asString(value).trim();
  if (!text) return null;

  // Handle fractional notation: "42 1/8" → 42.125
  const fractionMatch = text.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const whole = Number(fractionMatch[1]);
    const num = Number(fractionMatch[2]);
    const den = Number(fractionMatch[3]);
    if (den !== 0) return whole + num / den;
  }

  // Handle plain decimal/integer, strip anything that isn't a digit or dot
  const cleaned = text.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function parseDate(value: unknown): { iso: string | null; year: number | null; month: number | null; day: number | null } {
  const text = asString(value);
  if (!text) return { iso: null, year: null, month: null, day: null };

  // Handle MM/DD/YYYY with day=00 (TARP placeholder: "01/00/1900" means unknown date)
  const slashParts = text.match(/^(\d{1,2})\/0*(\d+)\/(\d{4})$/);
  if (slashParts) {
    const month = Number(slashParts[1]);
    const day = Number(slashParts[2]);
    const year = Number(slashParts[3]);
    // Day 0 or month 0 means the date is unknown in TARP exports
    if (day === 0 || month === 0) return { iso: null, year: null, month: null, day: null };
    // Clamp to valid ranges before constructing
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(year, month - 1, day);
      if (!Number.isNaN(date.getTime())) {
        return {
          iso: date.toISOString().slice(0, 10),
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        };
      }
    }
    return { iso: null, year: null, month: null, day: null };
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return { iso: null, year: null, month: null, day: null };
  return {
    iso: date.toISOString().slice(0, 10),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

export function normalizeSpecies(value: string): string {
  const cleaned = value.trim().replace(/\s+/g, " ");
  const lower = cleaned.toLowerCase();
  return speciesAliases[lower] ?? titleCase(cleaned);
}

export function normalizeWaterbody(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, " ");
  const compact = cleaned.replace(/[.,()#]/g, " ").replace(/\s+/g, " ").trim();
  return waterbodyAliases[cleaned] ?? waterbodyAliases[compact] ?? titleCase(cleaned);
}

export function normalizeRecord(
  raw: Record<string, unknown>,
  columnMap: NormalizedColumnMap,
  index: number,
  sourceFile: string
): CatchRecord {
  const species = asString(raw[columnMap.species ?? ""]);
  const waterbody = asString(raw[columnMap.waterbody ?? ""]);
  const dateParts = parseDate(raw[columnMap.dateCaught ?? ""]);

  return {
    id: `${sourceFile}-${index}`,
    species,
    normalizedSpecies: normalizeSpecies(species),
    lengthInches: parseNumber(raw[columnMap.length ?? ""]),
    weightPounds: parseNumber(raw[columnMap.weight ?? ""]),
    dateCaught: dateParts.iso,
    year: dateParts.year,
    month: dateParts.month,
    day: dateParts.day,
    waterbody,
    normalizedWaterbody: normalizeWaterbody(waterbody),
    county: asString(raw[columnMap.county ?? ""]) || null,
    region: asString(raw[columnMap.region ?? ""]) || null,
    angler: normalizeAnglerName(asString(raw[columnMap.angler ?? ""])) || null,
    method: asString(raw[columnMap.method ?? ""]) || null,
    notes: asString(raw[columnMap.notes ?? ""]) || null,
    sourceFile,
    importedAt: new Date().toISOString(),
    raw
  };
}
