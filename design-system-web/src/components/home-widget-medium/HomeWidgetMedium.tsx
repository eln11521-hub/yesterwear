import rainUmbrellaUrl from "../../assets/weather/rain-umbrella.svg?url";
import { deltaDisplay, deltaState, type WeatherVM } from "../../app/weather";
import { Icon } from "../_ui/Icon";
import { Mascot } from "../mascot/Mascot";
import "./HomeWidgetMedium.css";

/** Small location pin (currentColor) flagging a cross-location 昨日. */
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

export type HomeWidgetMediumProps = {
  location: string;
  weather: WeatherVM;
  /** 昨日穿搭 garment labels. */
  yesterdayChips: string[];
  /**
   * City where 昨日 was anchored — set only when it differs from today's city.
   * Adds a pin + city name to the 昨日 label (the 當地昨日 row stays app-only).
   */
  yesterdayCity?: string;
  /** PRD 4.3: staleness label shown when showing cached data. */
  stale?: string;
};

/**
 * HomeWidgetMedium — the Home Screen 4×2 widget (Figma 390:2). White card with the
 * app's mascot + info + commute (出門 / 下班). The tinted gradient background and the
 * delta pill shift with the delta state (cold → cool, warm → warm).
 */
export function HomeWidgetMedium({
  location,
  weather,
  yesterdayChips,
  yesterdayCity,
  stale,
}: HomeWidgetMediumProps) {
  const d = deltaDisplay(weather.overallDelta, weather.unit);
  const shortTemp = weather.nowTemp.replace(/°[CF]$/, "°");
  const state = deltaState(weather.overallDelta);

  return (
    <div className="yw-home-widget" data-state={state}>
      <div className="yw-home-widget__card">
        <div className="yw-home-widget__top">
          <div className="yw-home-widget__mascot">
            <Mascot size={58} state={state} />
          </div>
          <div className="yw-home-widget__info">
            <div className="yw-home-widget__locrow">
              <span className="yw-home-widget__loc">
                {location.toUpperCase()} · 今天{stale ? ` · ${stale}` : ""}
              </span>
              {weather.rain ? (
                <span className="yw-home-widget__rain">
                  <Icon src={rainUmbrellaUrl} size={12} /> 攜帶雨具
                </span>
              ) : null}
            </div>
            <div className="yw-home-widget__temp">
              <div className="yw-home-widget__bigcol">
                <span className="yw-home-widget__biglabel">體感</span>
                <span className="yw-home-widget__big">{shortTemp}</span>
              </div>
              <span className="yw-home-widget__delta">
                {d.arrow} {d.abs}° 比昨天
              </span>
            </div>
            <div className="yw-home-widget__outfit">
              <span className="yw-home-widget__olabel">
                昨日
                {yesterdayCity ? (
                  <span className="yw-home-widget__ocity">
                    <PinIcon />
                    {yesterdayCity}
                  </span>
                ) : null}
              </span>
              <div className="yw-home-widget__chips">
                {yesterdayChips.map((c) => (
                  <span key={c} className="yw-home-widget__chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="yw-home-widget__divider" />

        <div className="yw-home-widget__commute">
          {weather.commute.map((c) => (
            <span key={c.slot} className="yw-home-widget__commute-item">
              <span className="yw-home-widget__commute-slot">
                {c.slot} {c.time}
              </span>
              <span className="yw-home-widget__commute-felt">體感</span>
              <span className="yw-home-widget__commute-temp">{c.temp}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
