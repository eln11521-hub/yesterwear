import { useState, type ReactNode } from "react";

import type { HourlyPoint } from "../../app/weather";
import { SegmentedControl } from "../segmented-control/SegmentedControl";
import { WeatherIcon } from "../weather-icon/WeatherIcon";
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
  /** Which tab opens first. */
  initialTab?: Tab;
};

type Tab = "today" | "compare";

/** Plot size in viewBox units; the SVG stretches to the card width. */
const W = 300;
const H = 112;

/**
 * HourlyForecast — 各時段體感溫度 (Figma 608:1520), two tabs under one commute line:
 *  - 今天各時段: a horizontal strip of hours (3h back → 24h ahead) — time, icon,
 *    feels-like, actual; 現在 and the 出門 / 下班 hours sit on white chips.
 *  - 相比昨天: an overview chart of today's
 * feels-like (solid — ink up to now, lighter for the forecast) against
 * yesterday's (dashed) across 00–24, with a dot at now and the user's 出門 /
 * 下班 hours marked (a dashed rule, a ring on today's line, a tag above). It's for the shape of
 * the day, not exact readings: the legend shows both values at now, and
 * dragging across the chart reads any hour. Above it, one line about the next
 * commute against the same hour the day before.
 */
export function HourlyForecast({
  today,
  yesterday,
  items = [],
  header,
  initialTab = "today",
}: HourlyForecastProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const nowItem = items.find((h) => h.now);
  // 出門 / 下班 hours from the user's settings (the window tags them).
  const commutes = [
    ...new Map(items.filter((h) => h.slot).map((h) => [h.slot!, h.hour] as const)).entries(),
  ].map(([label, hour]) => ({ label, hour }));
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

      <SegmentedControl
        tone="inset"
        label="各時段體感溫度"
        options={[
          { value: "today", label: "今天各時段" },
          { value: "compare", label: "相比昨天" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "today" ? (
        <div className="yw-hourly__body">
          <div className="yw-hourly__scroll">
            <div className="yw-hourly__cols" role="list">
              {items.map((h) => (
                <div
                  key={`${h.day}-${h.hour}`}
                  className="yw-hourly__col"
                  data-now={h.now || undefined}
                  data-slot={h.slot && !h.past ? true : undefined}
                  data-past={h.past || undefined}
                  role="listitem"
                >
                  <span className="yw-hourly__time">
                    {h.now ? "現在" : h.slot && !h.past ? h.slot : `${pad(h.hour)}:00`}
                  </span>
                  <WeatherIcon condition={h.condition} size={18} />
                  <span className="yw-hourly__temp">{h.temp}°</span>
                  <span className="yw-hourly__actual">實際 {h.actual}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="yw-hourly__legend">
            {/* which hour the values are for: 現在 04:00, or the dragged hour */}
            <span className="yw-hourly__at" aria-live="polite">
              {hover == null ? `現在 ${pad(at)}:00` : `${pad(at)}:00`}
            </span>
            <span>
              <i className="yw-hourly__key" data-kind="today" />
              今天
              <b className="yw-hourly__num">{today[at]}°</b>
            </span>
            <span>
              <i className="yw-hourly__key" data-kind="yesterday" />
              昨天<b className="yw-hourly__num">{yesterday[at]}°</b>
            </span>
          </div>

          {commutes.length ? (
            <div className="yw-hourly__marks" aria-hidden>
              {commutes.map((c) => (
                <span
                  key={c.label}
                  style={{
                    left: `${(c.hour / 23) * 100}%`,
                    // keep tags near either end inside the plot
                    transform: `translateX(${c.hour < 2 ? 0 : c.hour > 21 ? -100 : -50}%)`,
                  }}
                >
                  {c.label} {pad(c.hour)}:00
                </span>
              ))}
            </div>
          ) : null}

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
              {commutes.map((c) => (
                <line
                  key={c.label}
                  className="yw-hourly__commute"
                  x1={x(c.hour)}
                  x2={x(c.hour)}
                  y1={0}
                  y2={H}
                />
              ))}
              <path className="yw-hourly__line" data-kind="yesterday" d={path(yesterday)} />
              <path className="yw-hourly__line" data-kind="forecast" d={path(today, nowHour)} />
              <path className="yw-hourly__line" data-kind="today" d={path(today, 0, nowHour)} />
              {hover != null ? (
                <line className="yw-hourly__cursor" x1={x(hover)} x2={x(hover)} y1={0} y2={H} />
              ) : null}
            </svg>
            {/* dots in HTML so they stay round while the SVG stretches */}
            {commutes.map((c) => (
              <span
                key={c.label}
                className="yw-hourly__cdot"
                style={{ left: `${(c.hour / 23) * 100}%`, top: y(today[c.hour]) }}
                aria-hidden
              />
            ))}
            <span
              className="yw-hourly__dot"
              style={{ left: `${(at / 23) * 100}%`, top: y(today[at]) }}
              aria-hidden
            />
            <span className="yw-hourly__yhi" aria-hidden>
              {hi}°
            </span>
            <span className="yw-hourly__ylo" aria-hidden>
              {lo}°
            </span>
          </div>

          <div className="yw-hourly__xaxis" aria-hidden>
            {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
              <span key={h} style={{ left: `${(h / 23) * 100}%` }}>
                {h}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
