const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function monthName(month: number): string {
  return monthNames[month - 1] ?? "Unknown";
}

export function formatLength(value: number | null): string {
  return value === null ? "Unknown" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}\"`;
}

export function formatMonthDay(month: number | null, day: number | null): string {
  if (!month || !day) return "Unknown";
  return `${monthName(month)} ${day}`;
}
