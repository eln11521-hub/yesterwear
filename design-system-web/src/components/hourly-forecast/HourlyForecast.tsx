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

/** Column width 48 + gap 4 — the chart's x step, so points sit under their column. */
const STEP = 52;
const COL = 48;
/** Plot height, plus room above / below for the value labels. */
const PLOT_H = 96;
const LABEL_PAD = 24;

/**
 * HourlyForecast — 各時段體感溫度 (Figma 608:1520): the next-commute line, hour
 * columns (time · icon), then feels-like (solid) vs actual (dashed) lines with the
 * gap shaded and each value written at its point, then the legend.
 *
 * Labels: the higher of the two values sits above its point, the lower below —
 * so when the lines cross (體感 > 實際) the labels swap sides with them. When
 * they're equal there is one point and one label, 「=23°」. The y-scale hugs the
 * data so a 1° gap still reads. Columns + chart scroll edge to edge.
 */
export function HourlyForecast({ items, header }: HourlyForecastProps) {
  const nowIdx = Math.max(0, items.findIndex((h) => h.now));
  const all = items.flatMap((h) => [h.temp, h.actual]);
  const lo = Math.min(...all) - 1;
  const hi = Math.max(Math.max(...all) + 1, lo + 4);
  const x = (i: number) => i * STEP + COL / 2;
  const y = (v: number) => LABEL_PAD + ((hi - v) / (hi - lo)) * PLOT_H;
  const width = items.length * STEP - 4;
  const height = PLOT_H + LABEL_PAD * 2;
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const band =
    path(items.map((h) => h.actual)) +
    items
      .map((h, i) => [h, i] as const)
      .reverse()
      .map(([h, i]) => ` L${x(i)} ${y(h.temp)}`)
      .join("") +
    " Z";
  const now = items[nowIdx];

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
                  aria-label={`${h.now ? "現在" : `${pad(h.hour)}:00`}，體感 ${h.temp}°，實際 ${h.actual}°`}
                >
                  <span className="yw-hourly__time">{h.now ? "現在" : `${pad(h.hour)}:00`}</span>
                  <WeatherIcon condition={h.condition} size={18} />
                </div>
              ))}
            </div>

            <svg
              className="yw-hourly__chart"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={now ? `現在體感 ${now.temp}°，實際 ${now.actual}°` : "體感與實際溫度"}
            >
              <path className="yw-hourly__band" d={band} />
              <path className="yw-hourly__line" data-kind="actual" d={path(items.map((h) => h.actual))} />
              <path className="yw-hourly__line" data-kind="feels" d={path(items.map((h) => h.temp))} />
              {items.map((h, i) => {
                const cx = x(i);
                const past = h.past || undefined;
                if (h.temp === h.actual) {
                  return (
                    <g key={i} data-past={past}>
                      <circle className="yw-hourly__dot" data-kind="feels" cx={cx} cy={y(h.temp)} r={3} />
                      <text className="yw-hourly__val" data-kind="feels" x={cx} y={y(h.temp) - 8}>
                        ={h.temp}°
                      </text>
                    </g>
                  );
                }
                // Higher value above its point, lower below — swaps when lines cross.
                const feelsUp = h.temp > h.actual;
                return (
                  <g key={i} data-past={past}>
                    <circle className="yw-hourly__dot" data-kind="actual" cx={cx} cy={y(h.actual)} r={3} />
                    <circle className="yw-hourly__dot" data-kind="feels" cx={cx} cy={y(h.temp)} r={3} />
                    <text
                      className="yw-hourly__val"
                      data-kind="feels"
                      x={cx}
                      y={feelsUp ? y(h.temp) - 8 : y(h.temp) + 18}
                    >
                      {h.temp}°
                    </text>
                    <text
                      className="yw-hourly__val"
                      data-kind="actual"
                      x={cx}
                      y={feelsUp ? y(h.actual) + 16 : y(h.actual) - 8}
                    >
                      {h.actual}°
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="yw-hourly__legend" aria-hidden>
        <span><i className="yw-hourly__key" data-kind="feels" />體感溫度</span>
        <span><i className="yw-hourly__key" data-kind="actual" />實際溫度</span>
        <span><i className="yw-hourly__key" data-kind="gap" />溫差</span>
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
