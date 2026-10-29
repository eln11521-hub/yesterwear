import { useEffect, useRef } from "react";

import type { HourlyPoint } from "../../app/weather";
import { WeatherIcon } from "../weather-icon/WeatherIcon";
import "./HourlyForecast.css";

export type HourlyForecastProps = {
  /** Today's hours 00–23 (feels-like, display unit). */
  items: HourlyPoint[];
};

/**
 * HourlyForecast — 今天各時段溫度: a horizontally scrolling strip of today's
 * hours (time · weather icon · feels-like · optional rain %). The current hour
 * carries an ink dot + 「現在」, commute hours a 出門 / 下班 tag. Scrolls the
 * current hour into view on mount.
 */
export function HourlyForecast({ items }: HourlyForecastProps) {
  const nowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = nowRef.current;
    const strip = el?.parentElement;
    if (!el || !strip) return;
    // Center "now" without scrolling the page itself.
    strip.scrollLeft = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
  }, [items]);

  return (
    <div className="yw-hourly" role="list">
      {items.map((h) => (
        <div
          key={h.hour}
          ref={h.now ? nowRef : undefined}
          className="yw-hourly__item"
          data-now={h.now || undefined}
          role="listitem"
        >
          <span className="yw-hourly__dot" aria-hidden />
          <span className="yw-hourly__time">
            {h.now ? "現在" : `${String(h.hour).padStart(2, "0")}:00`}
          </span>
          <WeatherIcon condition={h.condition} size={22} />
          <span className="yw-hourly__temp">{h.temp}°</span>
          <span className="yw-hourly__pop">{h.pop != null ? `${h.pop}%` : ""}</span>
          <span className="yw-hourly__slot">{h.slot ?? ""}</span>
        </div>
      ))}
    </div>
  );
}
