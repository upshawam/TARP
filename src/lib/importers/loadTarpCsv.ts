import { parseTarpCsv } from "./parseCsv";

export async function loadTarpCsv() {
  const url = `${import.meta.env.BASE_URL}data/tarp.csv`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not load ${url}. Add your CSV at public/data/tarp.csv.`);
  }

  const csvText = await response.text();
  return parseTarpCsv(csvText, "tarp.csv");
}
