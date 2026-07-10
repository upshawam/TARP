import type { CatchRecord } from "../../types/CatchRecord";
import { topMonths } from "./rankings";

export function bestMonthNames(records: CatchRecord[], limit = 3): string[] {
  return topMonths(records, limit).map((item) => item.name);
}
