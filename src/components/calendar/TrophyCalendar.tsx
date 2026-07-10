import { useState } from "react";
import type { DayHeat } from "../../lib/analysis/heatmap";
import { dayOfYearFor, heatColor, HEAT_LEGEND } from "../../lib/analysis/heatmap";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type Props = {
  heatMap: Map<number, DayHeat>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export default function TrophyCalendar({ heatMap, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function jumpToToday() {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
    onSelectDate(today);
  }

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build grid: leading nulls then day numbers, padded to full weeks
  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const selKey   = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

  return (
    <div className="trophy-calendar">
      {/* Navigation */}
      <div className="cal-header">
        <button className="cal-nav-btn" type="button" onClick={prevMonth}>‹</button>
        <span className="cal-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button className="cal-nav-btn" type="button" onClick={nextMonth}>›</button>
        <button className="cal-today-btn" type="button" onClick={jumpToToday}>Today</button>
      </div>

      {/* Day-of-week headers */}
      <div className="cal-grid">
        {DAY_HEADERS.map(d => <div key={d} className="cal-day-name">{d}</div>)}

        {/* Day cells */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="cal-empty" />;

          const doy  = dayOfYearFor(viewMonth + 1, day);
          const item = heatMap.get(doy);
          const heat = item?.heat ?? 0;
          const { background, color } = heatColor(heat);
          const cellKey = `${viewYear}-${viewMonth}-${day}`;
          const isToday    = cellKey === todayKey;
          const isSelected = cellKey === selKey;

          return (
            <button
              key={day}
              type="button"
              className={[
                "cal-day",
                isToday    ? "cal-today"    : "",
                isSelected ? "cal-selected" : "",
              ].join(" ").trim()}
              style={{ background, color }}
              onClick={() => onSelectDate(new Date(viewYear, viewMonth, day))}
              title={item ? `${item.count} trophy records in ±21-day window · Heat ${heat}%` : "No data"}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        <span className="cal-legend-label">Trophy heat:</span>
        {HEAT_LEGEND.map(({ label, heat }) => {
          const c = heatColor(heat);
          return (
            <span key={label} className="cal-legend-item" style={{ background: c.background, color: c.color }}>
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
