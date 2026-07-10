import { useMemo, useState } from "react";
import type { CatchRecord } from "../types/CatchRecord";
import { getSpeciesSummary } from "../lib/analysis/analysis";
import { researchInsights } from "../data/researchInsights";
import { tarpFishProfiles } from "../data/tarpFishProfiles";

type Props = { records: CatchRecord[] };

type SourcedTip = {
  text: string;
  sourceLabel: string;
  sourceUrl: string;
};

export default function FishGallery({ records }: Props) {
  const [query, setQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string>(tarpFishProfiles[0]?.species ?? "");

  const filteredFish = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tarpFishProfiles;
    return tarpFishProfiles.filter((fish) => fish.displayName.toLowerCase().includes(needle));
  }, [query]);

  const activeFish = useMemo(() => {
    const fromSelected = filteredFish.find((fish) => fish.species === selectedSpecies);
    if (fromSelected) return fromSelected;
    return filteredFish[0] ?? tarpFishProfiles[0];
  }, [filteredFish, selectedSpecies]);

  const summary = useMemo(() => {
    if (!activeFish) return null;
    return getSpeciesSummary(records, activeFish.species);
  }, [records, activeFish]);

  const researchTips = useMemo(() => {
    if (!activeFish) return [] as SourcedTip[];

    const bySpecies = researchInsights.filter((insight) => insight.species === activeFish.species);
    const items: SourcedTip[] = bySpecies.flatMap((insight) =>
      insight.tips.map((tip) => ({
        text: tip,
        sourceLabel: insight.sourceLabel,
        sourceUrl: insight.sourceUrl
      }))
    );

    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.text}|${item.sourceLabel}|${item.sourceUrl}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [activeFish]);

  if (!activeFish) {
    return (
      <section>
        <div className="page-header">
          <h2>TARP Fish Gallery</h2>
          <p>No fish profiles are available yet.</p>
        </div>
      </section>
    );
  }

  const bestMonths = summary?.bestMonths.slice(0, 3) ?? [];
  const topWaters = summary?.topWaterbodies.slice(0, 5) ?? [];

  return (
    <section>
      <div className="page-header">
        <h2>TARP Fish Gallery</h2>
        <p>Browse every Angler Recognition Program fish, click a species, and build your cheat sheet.</p>
      </div>

      <div className="controls">
        <label htmlFor="fish-search">Find fish</label>
        <input
          id="fish-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by fish name"
        />
      </div>

      <div className="fish-gallery-layout">
        <div className="card fish-detail">
          <h3>{activeFish.displayName}</h3>
          <div className="fish-detail-media">
            {activeFish.imageUrl ? (
              <img src={activeFish.imageUrl} alt={activeFish.displayName} />
            ) : (
              <div className="fish-placeholder fish-placeholder-large">Image pending</div>
            )}
          </div>

          <p className="fish-detail-length">
            Required TARP length: <strong>{activeFish.requiredLengthInches}"</strong>
          </p>

          <div className="fish-cheat-block">
            <h4>Starter tips</h4>
            <ul>
              {activeFish.starterTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="fish-cheat-block">
            <h4>Research-backed tips</h4>
            {researchTips.length === 0 ? (
              <p className="label">No species-specific tips yet. Add notes in src/data/researchInsights.ts.</p>
            ) : (
              <ul>
                {researchTips.map((tip) => (
                  <li key={`${tip.text}-${tip.sourceLabel}`}>{tip.text}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="fish-cheat-block">
            <h4>TARP history in your data</h4>
            <p className="label">Total entries: {summary?.totalEntries ?? 0}</p>
            <p className="label">Trophy entries: {summary?.trophyEntries ?? 0}</p>
            <p className="label">Best months: {bestMonths.map((month) => `${month.name} (${month.count})`).join(", ") || "No data"}</p>
            <p className="label">Top waterbodies: {topWaters.map((water) => `${water.name} (${water.count})`).join(", ") || "No data"}</p>
          </div>

          <div className="fish-cheat-block fish-sources">
            <h4>Sources</h4>
            <a href={activeFish.idPageUrl} target="_blank" rel="noreferrer">Fish identification illustrations</a>
            <a href={activeFish.tarpPageUrl} target="_blank" rel="noreferrer">TARP minimum length table</a>
            {Array.from(new Map(researchTips.map((tip) => [tip.sourceUrl, tip.sourceLabel])).entries()).map(([url, label]) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
            <p className="label">{activeFish.imageAttribution}</p>
          </div>
        </div>

        <div className="card">
          <h3>All TARP Fish ({filteredFish.length})</h3>
          <div className="fish-grid">
            {filteredFish.map((fish) => {
              const isActive = fish.species === activeFish.species;
              return (
                <button
                  key={fish.species}
                  type="button"
                  className={`fish-tile ${isActive ? "is-active" : ""}`}
                  onClick={() => setSelectedSpecies(fish.species)}
                >
                  <div className="fish-tile-media">
                    {fish.imageUrl ? (
                      <img src={fish.imageUrl} alt={fish.displayName} loading="lazy" />
                    ) : (
                      <div className="fish-placeholder">Image pending</div>
                    )}
                  </div>
                  <div className="fish-tile-info">
                    <strong>{fish.displayName}</strong>
                    <span>{fish.requiredLengthInches}" minimum</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
