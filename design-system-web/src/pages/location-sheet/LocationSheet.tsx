import { useState } from "react";

import checkUrl from "../../assets/icon/check.svg?url";
import { Icon } from "../../components/_ui/Icon";
import type { LocationMode } from "../../app/useSettingsStore";
import { geocodeCity, type GeoLocation } from "../../app/weatherApi";
import "./LocationSheet.css";

export type LocationSheetProps = {
  /** The place the dashboard is showing now. */
  location: GeoLocation;
  mode: LocationMode;
  /** Most-recent-first picked cities. */
  recents: GeoLocation[];
  /** Pick a city (fixed location). */
  onSelect?: (location: GeoLocation) => void;
  /** Resolve the device location; resolves false when it isn't available. */
  onUseGps?: () => Promise<boolean>;
};

const samePlace = (a: GeoLocation, b: GeoLocation) =>
  Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

/** Solid map pin (same glyph as the TopBar). */
function PinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      />
    </svg>
  );
}

/**
 * LocationSheet — 切換地點, raised from the Home top-bar location. One place at
 * a time (single select): 使用目前位置 (GPS), a city search, or 最近使用. Picking
 * one switches the dashboard to that place's weather. Follows the sheet / settings
 * patterns (white sheet, grouped white cards with hairline rows).
 */
export function LocationSheet({ location, mode, recents, onSelect, onUseGps }: LocationSheetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [searched, setSearched] = useState(false);
  const [gpsState, setGpsState] = useState<"idle" | "locating" | "denied">("idle");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResults(await geocodeCity(query));
    } catch {
      setResults([]);
    }
    setSearched(true);
  }

  async function useGps() {
    if (!onUseGps) return;
    setGpsState("locating");
    setGpsState((await onUseGps()) ? "idle" : "denied");
  }

  const isPicked = (r: GeoLocation) => mode === "manual" && samePlace(r, location);

  return (
    <div className="yw-loc-sheet">
      <span className="yw-loc-sheet__handle" aria-hidden />
      <h2 className="yw-loc-sheet__title">切換地點</h2>

      <form className="yw-loc-sheet__search" onSubmit={search}>
        <input
          className="yw-loc-sheet__input"
          placeholder="搜尋城市…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="yw-loc-sheet__search-btn" type="submit">
          搜尋
        </button>
      </form>

      {searched ? (
        <section className="yw-loc-sheet__group">
          <div className="yw-loc-sheet__seclabel">
            <span className="yw-loc-sheet__dot" aria-hidden />
            搜尋結果
          </div>
          {results.length ? (
            <div className="yw-loc-sheet__card" role="radiogroup">
              {results.map((r) => (
                <Row key={`${r.lat},${r.lon}`} label={r.name} picked={isPicked(r)} onClick={() => onSelect?.(r)} />
              ))}
            </div>
          ) : (
            <p className="yw-loc-sheet__note">找不到「{query}」，換個關鍵字試試。</p>
          )}
        </section>
      ) : null}

      <section className="yw-loc-sheet__group">
        <div className="yw-loc-sheet__seclabel">
          <span className="yw-loc-sheet__dot" aria-hidden />
          目前位置
        </div>
        <div className="yw-loc-sheet__card" role="radiogroup">
          <Row
            icon={<PinIcon />}
            label={gpsState === "locating" ? "定位中…" : "使用目前位置"}
            hint={mode === "gps" ? location.name : undefined}
            picked={mode === "gps"}
            onClick={useGps}
          />
        </div>
        {gpsState === "denied" ? (
          <p className="yw-loc-sheet__note">無法取得定位，請開啟定位權限或改用搜尋。</p>
        ) : null}
      </section>

      {recents.length ? (
        <section className="yw-loc-sheet__group">
          <div className="yw-loc-sheet__seclabel">
            <span className="yw-loc-sheet__dot" aria-hidden />
            最近使用
          </div>
          <div className="yw-loc-sheet__card" role="radiogroup">
            {recents.map((r) => (
              <Row key={`${r.lat},${r.lon}`} label={r.name} picked={isPicked(r)} onClick={() => onSelect?.(r)} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Row({
  label,
  hint,
  icon,
  picked,
  onClick,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  picked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="yw-loc-sheet__row"
      role="radio"
      aria-checked={picked}
      onClick={onClick}
    >
      {icon ? <span className="yw-loc-sheet__row-icon">{icon}</span> : null}
      <span className="yw-loc-sheet__row-label">{label}</span>
      {hint ? <span className="yw-loc-sheet__row-hint">{hint}</span> : null}
      <span className="yw-loc-sheet__check" aria-hidden>
        {picked ? <Icon src={checkUrl} size={18} /> : null}
      </span>
    </button>
  );
}
