import type { CSSProperties } from "react";

import type { Condition } from "../../app/weather";
import { WeatherIcon } from "../weather-icon/WeatherIcon";
import "./ForecastRow.css";

/** @deprecated use `Condition`; kept for back-compat. */
export type ForecastCondition = Condition;

export type ForecastRowProps = {
  /** Day label, e.g. 今天 / 週五 */
  day: string;
  condition: Condition;
  /** This day's low / high in °C. */
  low: number;
  high: number;
  /** The week's overall low / high, used to position the range bar. */
  weekMin: number;
  weekMax: number;
  /** Precipitation probability shown under the icon (e.g. rainy days). */
  pop?: number;
  /** When set, a white knob marks the current temperature (today). */
  current?: number;
};

/**
 * ForecastRow — one day of the weekly forecast. Icons and bar match Figma 174:87:
 * day 12 #555553, low 14 #8e8e8c, high 14 Medium ink; a 4px bar (ink 8% track,
 * body-ink fill, Figma 608:1555), rain chance under the icon, optional today knob.
 */
export function ForecastRow({
  day,
  condition,
  low,
  high,
  weekMin,
  weekMax,
  pop,
  current,
}: ForecastRowProps) {
  const span = Math.max(weekMax - weekMin, 1);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const left = clamp(((low - weekMin) / span) * 100);
  const width = clamp(((high - low) / span) * 100);
  // Apparent temp can fall outside the week's low–high range (e.g. wind chill);
  // clamp so the knob always rides the bar instead of escaping into the labels.
  const knob = current != null ? clamp(((current - weekMin) / span) * 100) : null;

  return (
    <div className="yw-forecast-row">
      <span className="yw-forecast-row__day">{day}</span>
      <span className="yw-forecast-row__icon">
        <WeatherIcon condition={condition} size={22} />
        {pop != null ? (
          <span className="yw-forecast-row__pop">{pop}%</span>
        ) : null}
      </span>
      <span className="yw-forecast-row__low">{low}°</span>
      <span className="yw-forecast-row__bar">
        <span
          className="yw-forecast-row__fill"
          style={{ left: `${left}%`, width: `${width}%` } as CSSProperties}
        />
        {knob != null ? (
          <span
            className="yw-forecast-row__knob"
            style={{ left: `${knob}%` } as CSSProperties}
          />
        ) : null}
      </span>
      <span className="yw-forecast-row__high">{high}°</span>
    </div>
  );
}
