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
const CHART_H = 112;

/**
 * HourlyForecast — 各時段體感溫度 (Figma 608:1520): a summary line for the next
 * commute, a legend, then hour columns (time · icon · 體感 · 實際) above a chart of
 * feels-like (solid) vs actual (dashed) with the gap shaded. Columns and chart
 * scroll together; the °C axis stays put. Past hours are muted, 現在 is a white chip.
 */
export function HourlyForecast({ items, header }: HourlyForecastProps) {
  const nowIdx = Math.max(0, items.findIndex((h) => h.now));
  const all = items.flatMap((h) => [h.temp, h.actual]);
  const lo = Math.floor(Math.min(...all) / 4) * 4;
  const hi = Math.ceil(Math.max(...all) / 4) * 4 || lo + 4;
  const ticks: number[] = [];
  for (let t = lo; t <= hi; t += 4) ticks.push(t);
  const x = (i: number) => i * STEP + COL / 2;
  const y = (v: number) => ((hi - v) / (hi - lo || 1)) * CHART_H;
  const width = items.length * STEP - 4;
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
      <div className="yw-hourly__head">
        {header}
        <span className="yw-hourly__range">前 3 小時・未來 24 小時</span>
      </div>

      {next ? (
        <p className="yw-hourly__summary">
          {next.day ? (next.slot === "出門" ? "明早" : "明天") : "今天"}{" "}
          <span className="yw-hourly__num">{pad(next.hour)}:00</span> {next.slot}體感 <b className="yw-hourly__num">{next.temp}°</b>，
          {gap === 0 ? (
            "與實際相同"
          ) : (
            <>
              比實際{gap > 0 ? "低" : "高"}{" "}
              <b className="yw-hourly__num yw-hourly__gap">{Math.abs(gap)}°</b>
            </>
          )}
        </p>
      ) : null}

      <div className="yw-hourly__legend" aria-hidden>
        <span><i className="yw-hourly__key" data-kind="feels" />體感溫度</span>
        <span><i className="yw-hourly__key" data-kind="actual" />實際溫度</span>
        <span><i className="yw-hourly__key" data-kind="gap" />溫差</span>
      </div>

      <div className="yw-hourly__body">
        <div className="yw-hourly__axis" aria-hidden>
          <span className="yw-hourly__unit">°C</span>
          {ticks.map((t) => (
            <span key={t} className="yw-hourly__tick" style={{ top: y(t) }}>
              {t}°
            </span>
          ))}
        </div>

        <div className="yw-hourly__scroll">
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

          <svg
            className="yw-hourly__chart"
            width={width}
            height={CHART_H + 8}
            viewBox={`0 0 ${width} ${CHART_H + 8}`}
            role="img"
            aria-label={now ? `現在體感 ${now.temp}°，實際 ${now.actual}°` : "體感與實際溫度"}
          >
            {ticks.map((t) => (
              <line key={t} className="yw-hourly__grid" x1={0} x2={width} y1={y(t)} y2={y(t)} />
            ))}
            <path className="yw-hourly__band" d={band} />
            <line className="yw-hourly__nowline" x1={x(nowIdx)} x2={x(nowIdx)} y1={0} y2={CHART_H} />
            <path className="yw-hourly__line" data-kind="actual" d={path(items.map((h) => h.actual))} />
            <path className="yw-hourly__line" data-kind="feels" d={path(items.map((h) => h.temp))} />
            {now ? (
              <>
                <circle className="yw-hourly__dot" data-kind="actual" cx={x(nowIdx)} cy={y(now.actual)} r={4} />
                <circle className="yw-hourly__dot" data-kind="feels" cx={x(nowIdx)} cy={y(now.temp)} r={4} />
              </>
            ) : null}
          </svg>
        </div>
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
