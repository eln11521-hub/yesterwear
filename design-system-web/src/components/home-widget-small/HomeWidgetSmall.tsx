import { deltaDisplay, deltaState, type WeatherVM } from "../../app/weather";
import "./HomeWidgetSmall.css";

export type HomeWidgetSmallProps = {
  location: string;
  weather: WeatherVM;
  /** 昨日穿搭 garment labels. */
  yesterdayChips: string[];
  /** PRD 4.3: staleness label shown when showing cached data. */
  stale?: string;
};

/**
 * HomeWidgetSmall — the Home Screen 2×2 widget (Figma 424:10), real WidgetKit small
 * size (158×158 pt). Same design-system language as the 4×2 (mono labels, 體感 big
 * number, 比昨天 delta pill, 昨日 chips, 出門/下班 commute) condensed for the square:
 * hero (體感 + delta) on top, 昨日 + commute below the divider. Background + delta pill
 * shift with the delta state.
 */
export function HomeWidgetSmall({
  location,
  weather,
  yesterdayChips,
  stale,
}: HomeWidgetSmallProps) {
  const d = deltaDisplay(weather.overallDelta, weather.unit);
  const shortTemp = weather.nowTemp.replace(/°[CF]$/, "°"); // 體感
  const state = deltaState(weather.overallDelta);
  const chips = yesterdayChips.length ? yesterdayChips : ["—"];

  return (
    <div className="yw-home-widget-sm" data-state={state}>
      <div className="yw-home-widget-sm__card">
        <span className="yw-home-widget-sm__loc">
          {location.toUpperCase()} · 今天{stale ? ` · ${stale}` : ""}
        </span>

        <div className="yw-home-widget-sm__temp">
          <div className="yw-home-widget-sm__bigcol">
            <span className="yw-home-widget-sm__biglabel">體感</span>
            <span className="yw-home-widget-sm__big">{shortTemp}</span>
          </div>
          <span className="yw-home-widget-sm__delta">
            {d.arrow} {d.abs}° 比昨天
          </span>
        </div>

        <div className="yw-home-widget-sm__divider" />

        <div className="yw-home-widget-sm__outfit">
          <span className="yw-home-widget-sm__olabel">昨日</span>
          <div className="yw-home-widget-sm__chips">
            {chips.map((c) => (
              <span key={c} className="yw-home-widget-sm__chip">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="yw-home-widget-sm__commute">
          {weather.commute.map((c) => (
            <span key={c.slot} className="yw-home-widget-sm__commute-item">
              <span className="yw-home-widget-sm__commute-slot">{c.slot}</span>
              <span className="yw-home-widget-sm__commute-temp">{c.temp}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
