import { deltaDisplay, type WeatherVM } from "../../app/weather";
import { Icon } from "../_ui/Icon";
import { weatherIcon } from "../weather-icon/weatherIcons";
import "./LockWidget.css";

/** Small location pin (currentColor) — flags a cross-location comparison. */
function PinIcon() {
  return (
    <svg
      width={9}
      height={9}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export type LockWidgetProps = {
  location: string;
  weather: WeatherVM;
  /** 昨日穿搭 labels — not shown on the real 172×76 accessoryRectangular (kept for
   *  API parity with the larger widgets; 昨日穿搭 lives on the 2×2 / 4×2). */
  yesterdayChips?: string[];
  /** When true, 昨日 was anchored in a different city — show a pin (no city name). */
  crossLocation?: boolean;
  /** PRD 4.3: staleness label shown when showing cached data. */
  stale?: string;
};

/**
 * LockWidget — the Lock Screen 2×1 widget (Figma 173:2940), real WidgetKit
 * accessoryRectangular size (172×76 pt). Glassy white-on-tint, meant to sit on a
 * wallpaper. Condensed to the essentials that fit the small rectangle: location +
 * condition, and the app's signal — 現在體感 + 比昨天.
 */
export function LockWidget({
  location,
  weather,
  crossLocation,
  stale,
}: LockWidgetProps) {
  const d = deltaDisplay(weather.overallDelta, weather.unit);
  const shortTemp = weather.nowTemp.replace(/°[CF]$/, "°"); // 體感

  return (
    <div className="yw-lock-widget">
      <div className="yw-lock-widget__header">
        <span className="yw-lock-widget__loc">
          {location.toUpperCase()} · 今天{stale ? ` · ${stale}` : ""}
        </span>
        <Icon src={weatherIcon[weather.condition]} size={16} />
      </div>

      <div className="yw-lock-widget__hero">
        <div className="yw-lock-widget__bigcol">
          <span className="yw-lock-widget__biglabel">體感</span>
          <span className="yw-lock-widget__big">{shortTemp}</span>
        </div>
        <div className="yw-lock-widget__delta">
          <span className="yw-lock-widget__delta-label">
            {crossLocation ? <PinIcon /> : null}比昨天
          </span>
          <span className="yw-lock-widget__delta-val">
            {d.arrow} {d.abs}°
          </span>
        </div>
      </div>
    </div>
  );
}
