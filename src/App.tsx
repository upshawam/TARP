import { useEffect, useMemo, useState } from "react";
import { Fish } from "lucide-react";
import type { CatchRecord } from "./types/CatchRecord";
import { loadTarpCsv } from "./lib/importers/loadTarpCsv";
import { getAnglerList, getSpeciesList, getWaterbodyList } from "./lib/analysis/analysis";
import Dashboard from "./pages/Dashboard";
import SpeciesExplorer from "./pages/SpeciesExplorer";
import WaterbodyExplorer from "./pages/WaterbodyExplorer";
import TrophyPlanner from "./pages/TrophyPlanner";
import EarlyTargets from "./pages/EarlyTargets";
import AnglerExplorer from "./pages/AnglerExplorer";
import FishGallery from "./pages/FishGallery";

type Page = "dashboard" | "species" | "waterbody" | "planner" | "earlyTargets" | "anglers" | "fishGallery";

const navItems: { key: Page; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "species", label: "Species Explorer" },
  { key: "waterbody", label: "Waterbody Explorer" },
  { key: "planner", label: "Trophy Planner" },
  { key: "earlyTargets", label: "Early Targets" },
  { key: "anglers", label: "Angler Explorer" },
  { key: "fishGallery", label: "Fish Gallery" }
];

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [records, setRecords] = useState<CatchRecord[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTarpCsv()
      .then((result) => {
        setRecords(result.records);
        setWarnings(result.warnings);
        setLoadError(null);
      })
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const species = useMemo(() => getSpeciesList(records), [records]);
  const waterbodies = useMemo(() => getWaterbodyList(records), [records]);
  const anglers = useMemo(() => getAnglerList(records), [records]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Fish size={28} />
          <div>
            <h1>Personal TARP</h1>
            <p>Trophy fishing planner</p>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={page === item.key ? "active" : ""}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
          <a
            className="nav-link"
            href={`${import.meta.env.BASE_URL}data-monitor/status.html`}
            target="_blank"
            rel="noreferrer"
          >
            Data Monitor Status
          </a>
        </nav>
      </aside>

      <main className={`main-content ${page === "fishGallery" ? "main-content-wide" : ""}`}>
        {isLoading && <div className="notice">Loading `public/data/tarp.csv`...</div>}
        {loadError && (
          <div className="warning">
            {loadError}
          </div>
        )}
        {warnings.map((warning) => <div className="warning" key={warning}>{warning}</div>)}

        {page === "dashboard" && <Dashboard records={records} onOpenEarlyTargets={() => setPage("earlyTargets")} />}
        {page === "species" && <SpeciesExplorer records={records} species={species} />}
        {page === "waterbody" && <WaterbodyExplorer records={records} waterbodies={waterbodies} />}
        {page === "planner" && <TrophyPlanner records={records} species={species} />}
        {page === "earlyTargets" && <EarlyTargets records={records} />}
        {page === "anglers" && <AnglerExplorer records={records} anglers={anglers} waterbodies={waterbodies} />}
        {page === "fishGallery" && <FishGallery records={records} />}
      </main>
    </div>
  );
}
