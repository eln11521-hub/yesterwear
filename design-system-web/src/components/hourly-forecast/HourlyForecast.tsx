import type { ReactNode } from "react";

import type { HourlyPoint } from "../../app/weather";
import { WeatherIcon } from "../weather-icon/WeatherIcon";
import "./HourlyForecast.css";

export type HourlyForecastProps = {
  /** 3 hours before now → now → 24 hours ahead (feels-like + actual, display unit). */
  items: HourlyPoint[];
  /** Section title (the card's Section Header), shown left of the range label. */
  header?: ReactNode;
};

/** Gap bars: 16px per degree, capped at 5° so one extreme hour can't stretch the card. */
const PER_DEG = 16;
const MAX_DEG = 5;
/** Room for a bar's label beyond its end. */
const LABEL_H = 20;

/**
 * HourlyForecast — 各時段體感溫度 (Figma 608:1520): the next-commute line, then
 * two rows that scroll together edge to edge:
 *  - hour columns to read values — time · icon · 體感 (large) · 實際 (small);
 *  - a gap-bar row to read the difference — 體感 colder than 實際 hangs down in
 *    the cold colour, warmer rises in the warm colour, equal is a short dash
 *    with 「0°」; each bar is labelled −2° / +1°.
 * Past hours are muted, 現在 is set in ink.
 */
export function HourlyForecast({ items, header }: HourlyForecastProps) {
  const nowIdx = Math.max(0, items.findIndex((h) => h.now));
  const diffs = items.map((h) => h.temp - h.actual);
  const up = Math.min(MAX_DEG, Math.max(0, ...diffs));
  const down = Math.min(MAX_DEG, Math.max(0, ...diffs.map((d) => -d)));
  // Baseline sits below the tallest warm bar (+ its label); the row ends below the
  // deepest cold bar (+ its label). Equal hours need a little room for 「0°」.
  const base = up * PER_DEG + LABEL_H;
  const rowH = base + down * PER_DEG + LABEL_H;

  // 今天 18:00 下班體感 X°，比實際低 Y° — the next commute (出門 or 下班) after
  // now: today's 下班 in the afternoon, tomorrow's 出門 once that has passed.
  const next = items.find((h, i) => i > nowIdx && h.slot);
  const gap = next ? next.actual - next.temp : 0;

  return (
    <div className="yw-hourly">
      {header ? <div className="yw-hourly__head">{header}</div> : null}

      {next ? (
        <p className="yw-hourly__summary">
          {next.day ? (next.slot === "出門" ? "明早" : "明天") : "今天"} {pad(next.hour)}:00{" "}
          {next.slot}體感 {next.temp}°，
          {gap === 0 ? "與實際相同" : `比實際${gap > 0 ? "低" : "高"} ${Math.abs(gap)}°`}
        </p>
      ) : null}

      <div className="yw-hourly__body">
        <div className="yw-hourly__scroll">
          <div className="yw-hourly__track">
            <div className="yw-hourly__cols" role="list">
              {items.map((h) => (
                <div
                  key={`${h.day}-${h.hour}`}
                  className="yw-hourly__col"
                  data-now={h.now || undefined}
                  data-past={h.past || undefined}
                  role="listitem"
                >
                  <span className="yw-hourly__time">{h.now ? "現在" : `${pad(h.hour)}:00`}</span>
                  <WeatherIcon condition={h.condition} size={18} />
                  <span className="yw-hourly__temp">{h.temp}°</span>
                  <span className="yw-hourly__actual">實際 {h.actual}°</span>
                </div>
              ))}
            </div>

            <div
              className="yw-hourly__gaps"
              style={{ blockSize: rowH, ["--yw-hourly-base" as string]: `${base}px` }}
              aria-hidden
            >
              {items.map((h, i) => {
                const d = diffs[i];
                const len = Math.min(MAX_DEG, Math.abs(d)) * PER_DEG;
                const kind = d < 0 ? "cold" : d > 0 ? "warm" : "same";
                return (
                  <div
                    key={`${h.day}-${h.hour}`}
                    className="yw-hourly__gapcol"
                    data-kind={kind}
                    data-past={h.past || undefined}
                  >
                    <span
                      className="yw-hourly__bar"
                      style={
                        kind === "cold"
                          ? { top: base, blockSize: len }
                          : kind === "warm"
                            ? { top: base - len, blockSize: len }
                            : undefined
                      }
                    />
                    <span
                      className="yw-hourly__gapval"
                      style={{ top: kind === "warm" ? base - len - LABEL_H + 2 : base + len + 4 }}
                    >
                      {d > 0 ? "+" : d < 0 ? "−" : ""}
                      {Math.abs(d)}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="yw-hourly__legend" aria-hidden>
        <span><i className="yw-hourly__key" data-kind="cold" />體感比實際冷</span>
        <span><i className="yw-hourly__key" data-kind="warm" />體感比實際暖</span>
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
