import { useState, type ReactNode } from "react";

import type { HourlyPoint } from "../../app/weather";
import "./HourlyForecast.css";

export type HourlyForecastProps = {
  /** Today 00–23 feels-like (display unit). */
  today: number[];
  /** Yesterday 00–23 feels-like (display unit). */
  yesterday: number[];
  /** The 3h-back → 24h-ahead window — gives "now" and the next commute (incl. tomorrow). */
  items?: HourlyPoint[];
  /** Section title (the card's Section Header). */
  header?: ReactNode;
};

/** Plot size in viewBox units; the SVG stretches to the card width. */
const W = 300;
const H = 112;

/**
 * HourlyForecast — 各時段體感溫度 as one overview chart (Figma 608:1520): today's
 * feels-like (solid — ink up to now, lighter for the forecast) against
 * yesterday's (dashed) across 00–24, with a dot at now. It's for the shape of
 * the day, not exact readings: the legend shows both values at now, and
 * dragging across the chart reads any hour. Above it, one line about the next
 * commute against the same hour the day before.
 */
export function HourlyForecast({ today, yesterday, items = [], header }: HourlyForecastProps) {
  const nowItem = items.find((h) => h.now);
  const nowHour = nowItem?.hour ?? new Date().getHours();
  const [hover, setHover] = useState<number | null>(null);
  const at = hover ?? nowHour;

  const all = [...today, ...yesterday];
  const lo = Math.min(...all);
  const hi = Math.max(Math.max(...all), lo + 1);
  const x = (h: number) => (h / 23) * W;
  const y = (v: number) => 8 + ((hi - v) / (hi - lo)) * (H - 16);
  const path = (vals: number[], from = 0, to = vals.length - 1) =>
    vals
      .slice(from, to + 1)
      .map((v, i) => `${i ? "L" : "M"}${x(from + i)} ${y(v)}`)
      .join(" ");

  // Next commute: today's against yesterday; once today's have passed, tomorrow's
  // against today (the same hour the day before either way).
  const next = items.find((h) => !h.past && !h.now && h.slot);
  const summary = next
    ? (() => {
        const before = next.day ? today[next.hour] : yesterday[next.hour];
        const d = next.temp - before;
        const when = next.day ? (next.slot === "出門" ? "明早" : "明天") : "今天";
        const ref = next.day ? "今天" : "昨天";
        const diff = d === 0 ? `和${ref}差不多` : `比${ref}${d > 0 ? "高" : "低"} ${Math.abs(d)}°`;
        return `${when} ${pad(next.hour)}:00 ${next.slot}體感 ${next.temp}°，${diff}`;
      })()
    : null;

  function scrub(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const h = Math.round(((e.clientX - r.left) / r.width) * 23);
    setHover(Math.max(0, Math.min(23, h)));
  }

  return (
    <div className="yw-hourly">
      {header ? <div className="yw-hourly__head">{header}</div> : null}
      {summary ? <p className="yw-hourly__summary">{summary}</p> : null}

      <div className="yw-hourly__legend">
        <span>
          <i className="yw-hourly__key" data-kind="today" />
          {hover == null ? "今天" : `今天 ${pad(at)}:00`}
          <b className="yw-hourly__num">{today[at]}°</b>
        </span>
        <span>
          <i className="yw-hourly__key" data-kind="yesterday" />
          昨天<b className="yw-hourly__num">{yesterday[at]}°</b>
        </span>
      </div>

      <div className="yw-hourly__plot">
        <svg
          className="yw-hourly__chart"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={`今天與昨天的體感溫度，現在今天 ${today[nowHour]}°、昨天 ${yesterday[nowHour]}°`}
          onPointerDown={scrub}
          onPointerMove={(e) => (e.buttons || e.pointerType === "mouse") && scrub(e)}
          onPointerLeave={() => setHover(null)}
          onPointerUp={(e) => e.pointerType !== "mouse" && setHover(null)}
        >
          {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
            <line key={h} className="yw-hourly__grid" x1={x(h)} x2={x(h)} y1={0} y2={H} />
          ))}
          <path className="yw-hourly__line" data-kind="yesterday" d={path(yesterday)} />
          <path className="yw-hourly__line" data-kind="forecast" d={path(today, nowHour)} />
          <path className="yw-hourly__line" data-kind="today" d={path(today, 0, nowHour)} />
          {hover != null ? (
            <line className="yw-hourly__cursor" x1={x(hover)} x2={x(hover)} y1={0} y2={H} />
          ) : null}
        </svg>
        {/* dots in HTML so they stay round while the SVG stretches */}
        <span
          className="yw-hourly__dot"
          style={{ left: `${(at / 23) * 100}%`, top: y(today[at]) }}
          aria-hidden
        />
        <span className="yw-hourly__yhi" aria-hidden>{hi}°</span>
        <span className="yw-hourly__ylo" aria-hidden>{lo}°</span>
      </div>

      <div className="yw-hourly__xaxis" aria-hidden>
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} style={{ left: `${(h / 23) * 100}%` }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
