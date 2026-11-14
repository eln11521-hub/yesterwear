import { useLayoutEffect, useRef, useState } from "react";

import refreshUrl from "../../assets/icon/refresh.svg?url";

import tagUrl from "../../assets/icon/tag.svg?url";
import { MOCK_WEATHER, suggestOutfit, type WeatherVM } from "../../app/weather";
import { WeatherIcon } from "../../components/weather-icon/WeatherIcon";
import { Icon } from "../../components/_ui/Icon";
import { ForecastRow } from "../../components/forecast-row/ForecastRow";
import { HourlyForecast } from "../../components/hourly-forecast/HourlyForecast";
import { garmentIcon } from "../../components/outfit-chip/garments";
import { OutfitChip } from "../../components/outfit-chip/OutfitChip";
import { PrimaryButton } from "../../components/primary-button/PrimaryButton";
import { SecondaryButton } from "../../components/secondary-button/SecondaryButton";
import { TopBar } from "../../components/top-bar/TopBar";
import { WidgetPromoCard } from "../../components/widget-promo-card/WidgetPromoCard";
import "./HomeScreen.css";

export type HomeScreenProps = {
  weather?: WeatherVM;
  /** Garment labels for the 昨日穿搭 row, ranked by warmth (app/outfit
   *  rankedChips) — the row shows the first few and folds the rest into「+N」. */
  yesterdayChips?: string[];
  /** Today already recorded: the CTA turns into the outlined 查看今日穿搭 pill.
   *  (Today's picks stay in the record sheet, not on Home.) */
  recorded?: boolean;
  advice?: string;
  /**
   * Cross-location state — set only when today's city differs from where
   * "yesterday" was anchored (the user's lived weather). Drives the 昨日 city
   * label + the secondary 當地昨日 reference row. Omit for same-city.
   */
  crossLocation?: {
    /** City where yesterday's anchor was recorded, e.g. 艾德蒙頓. */
    yesterdayCity: string;
    /** Secondary 當地昨日 reference: yesterday's weather in *today's* city. */
    localYesterday?: { city: string; feels: string };
  };
  ctaLabel?: string;
  onRecord?: () => void;
  /** Reload weather + location (pull-to-refresh). */
  onRefresh?: () => void;
  /** Shows the pull-to-refresh spinner while a reload is in flight. */
  refreshing?: boolean;
  /** Top-bar location tapped → open the place switcher. */
  onLocationPress?: () => void;
  /** Top-bar gear tapped → open Settings. */
  onSettingsPress?: () => void;
};

/** Pull distance (px) that triggers a refresh; the list follows at half speed. */
const PTR_THRESHOLD = 64;

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="yw-home__seclabel">
      <span className="yw-home__dot" aria-hidden />
      {children}
    </div>
  );
}

/** Small location pin (currentColor), used to flag a cross-location comparison. */
function PinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** 「較昨日下降 2°」 from a commute delta like ↓2° / ↑1° / ±0°. */
function deltaPhrase(delta: string): string {
  const n = delta.replace(/[^\d]/g, "");
  if (delta.includes("↓")) return `較昨日下降 ${n}°`;
  if (delta.includes("↑")) return `較昨日上升 ${n}°`;
  return "與昨日持平";
}

/** Hero summary (Figma 665:2194): 出門 / 下班 feels-like + change vs yesterday, and
 *  a rain reminder when rain is possible. */
function commuteSentence(commute: WeatherVM["commute"], rainPossible: boolean): string {
  const [leave, ret] = commute;
  const parts = [
    leave ? `出門時間體感溫度 ${leave.temp}，${deltaPhrase(leave.delta)}` : "",
    ret ? `下班時間體感溫度為 ${ret.temp}，${deltaPhrase(ret.delta)}` : "",
  ].filter(Boolean);
  return parts.join("；") + "。" + (rainPossible ? "今日有降雨機率，記得攜帶雨具。" : "");
}

/**
 * Hero summary: the NEXT commute (出門 or 下班, from the settings) and how its
 * feels-like compares with the same hour the day before — today's against
 * yesterday, or, once today's have passed, tomorrow's against today. Plus a rain
 * reminder when rain is possible. Falls back to both commutes when the hourly
 * data isn't there (older caches).
 */
function nextCommuteSentence(weather: WeatherVM, rainPossible: boolean): string {
  const rainNote = rainPossible ? "今日有降雨機率，記得攜帶雨具。" : "";
  const next = weather.hourly?.find((h) => !h.past && !h.now && h.slot);
  const cmp = weather.dayCompare;
  if (!next || !cmp) return commuteSentence(weather.commute, rainPossible);
  const before = next.day ? cmp.today[next.hour] : cmp.yesterday[next.hour];
  const d = next.temp - before;
  const ref = next.day ? "今天" : "昨日";
  const diff = d === 0 ? `與${ref}持平` : `較${ref}${d > 0 ? "上升" : "下降"} ${Math.abs(d)}°`;
  const when = next.day ? (next.slot === "出門" ? "明早" : "明天") : "今天";
  const hh = String(next.hour).padStart(2, "0");
  return `${when} ${hh}:00 ${next.slot}時間體感溫度 ${next.temp}°，${diff}。${rainNote}`;
}

const DEFAULT_SUGGESTION = suggestOutfit(MOCK_WEATHER, null);

/**
 * HomeScreen — Figma 608:1477 (v5). Paper ground with #f5f5f5 cards, read top to
 * bottom: hero (現在體感 · 溫度 · 比較句 · 天氣 · 實際氣溫/濕度/降雨 · 通勤摘要) →
 * 昨日穿搭 + 今日建議穿搭 → 各時段體感溫度 → 未來一週天氣 → widget promo. No tab bar:
 * the header gear opens Settings, pull-to-refresh reloads, and 記錄今天穿搭 is a
 * sticky CTA at the bottom. Presentational: pass props for real data.
 */
export function HomeScreen({
  weather = MOCK_WEATHER,
  yesterdayChips = ["薄外套", "長袖上衣"],
  recorded = false,
  advice = DEFAULT_SUGGESTION.advice,
  crossLocation,
  ctaLabel,
  onRecord,
  onRefresh,
  refreshing = false,
  onLocationPress,
  onSettingsPress,
}: HomeScreenProps) {
  const pull = usePullToRefresh(onRefresh, refreshing);
  const weekMin = Math.min(...weather.forecast.map((f) => f.low));
  const weekMax = Math.max(...weather.forecast.map((f) => f.high));
  const metric = (label: string) =>
    weather.metrics.find((m) => m.label === label)?.value ?? "";
  const airTemp = metric("氣溫");
  const rain = metric("降雨");
  const humidity = metric("濕度");
  const rainPossible = Number.parseInt(rain, 10) > 0;
  return (
    <div className="yw-home">
      <div className="yw-home__top">
        <TopBar
          location={weather.location}
          onLocationClick={onLocationPress}
          onSettingsClick={onSettingsPress}
        />
      </div>

      <div className="yw-home__scroll" ref={pull.ref} {...pull.handlers}>
        <div
          className="yw-home__ptr"
          style={{ blockSize: pull.offset }}
          data-dragging={pull.dragging || undefined}
          data-loading={refreshing || undefined}
          role="status"
          aria-label={refreshing ? "天氣更新中" : undefined}
        >
          <span
            className="yw-home__ptr-icon"
            style={{ transform: refreshing ? undefined : `rotate(${pull.offset * 4}deg)` }}
          >
            <Icon src={refreshUrl} size={18} />
          </span>
        </div>
        {/* Hero (Figma 608:1479): 現在體感 → 溫度 → 比較句 → 天氣, then 實際氣溫 / 濕度 /
            降雨, then the commute summary in one sentence. */}
        <section className="yw-home__hero">
          <div className="yw-home__now">
            <div className="yw-home__now-main">
              <span className="yw-home__now-label">現在體感</span>
              <span className="yw-home__now-temp">{weather.nowTemp}</span>
            </div>
            <h1 className="yw-home__headline">{weather.headline}</h1>
            <span className="yw-home__now-cond">
              <WeatherIcon condition={weather.condition} size={20} />
              {weather.conditionLabel}
            </span>
          </div>

          <div className="yw-home__metrics">
            {[
              ["實際氣溫", airTemp],
              ["濕度", humidity],
              ["降雨", rain],
            ].map(([label, value]) => (
              <div key={label} className="yw-home__metric">
                <span className="yw-home__metric-label">{label}</span>
                <span className="yw-home__metric-value">{value}</span>
              </div>
            ))}
          </div>

          <p className="yw-home__summary">{nextCommuteSentence(weather, rainPossible)}</p>

          {/* 當地昨日補充列 — secondary, not part of the delta calc (跨地點時才顯示) */}
          {crossLocation?.localYesterday ? (
            <p className="yw-home__crosshint">
              <PinIcon size={11} />
              {crossLocation.localYesterday.city}昨天　體感{" "}
              {crossLocation.localYesterday.feels}
            </p>
          ) : null}
        </section>

        <section className="yw-home__card yw-home__block">
          <SecLabel>
            {crossLocation ? (
              <span className="yw-home__sec-city">
                昨日穿搭 · <PinIcon size={11} />
                {crossLocation.yesterdayCity}
              </span>
            ) : (
              "昨日穿搭"
            )}
          </SecLabel>
          {yesterdayChips.length ? (
            <ChipLine labels={yesterdayChips} />
          ) : (
            <span className="yw-home__empty">尚無昨日紀錄</span>
          )}
          <SecLabel>今日建議穿搭</SecLabel>
          <p className="yw-home__suggestion">{advice.replace(/^建議：/, "")}</p>
        </section>

        {/* 各時段體感溫度 — today vs yesterday overview; older cached snapshots
            have no 00–23 comparison, so hide until the next refresh. */}
        {weather.dayCompare ? (
          <section className="yw-home__card">
            <HourlyForecast
              today={weather.dayCompare.today}
              yesterday={weather.dayCompare.yesterday}
              items={weather.hourly}
              header={<SecLabel>各時段體感溫度</SecLabel>}
            />
          </section>
        ) : null}

        <section className="yw-home__card yw-home__forecast">
          <div className="yw-home__forecast-head">
            <SecLabel>未來一週天氣</SecLabel>
          </div>
          {weather.forecast.map((d) => (
            <ForecastRow
              key={d.day}
              day={d.day}
              condition={d.condition}
              low={d.low}
              high={d.high}
              weekMin={weekMin}
              weekMax={weekMax}
              pop={"pop" in d ? d.pop : undefined}
            />
          ))}
        </section>

        <WidgetPromoCard
          title="把 Widget 加到桌面"
          subtitle="長按桌面 →「+」→ 搜尋加入"
        />
        <div className="yw-home__cta-spacer" />
      </div>

      {/* Sticky CTA — solid ink (the page's only one) until today is recorded,
          then an outlined white pill: 查看今日穿搭 (the sheet's own CTA reads 更新今日穿搭). */}
      <div className="yw-home__cta">
        {recorded ? (
          <SecondaryButton
            shape="pill"
            label={ctaLabel ?? "查看今日穿搭"}
            icon={<Icon src={tagUrl} size={18} />}
            onClick={onRecord}
          />
        ) : (
          <PrimaryButton
            shape="pill"
            label={ctaLabel ?? "記錄今天穿搭"}
            icon={<Icon src={tagUrl} size={18} />}
            onClick={onRecord}
          />
        )}
      </div>
    </div>
  );
}

/** Most chips a 穿搭 row shows before folding the rest into「+N」. */
const ROW_MAX = 3;

/**
 * 昨日穿搭 on a single line: up to ROW_MAX chips (fewer when they don't fit the
 * width), the rest folded into「+N」, which expands the row in place (收合 folds
 * it back).
 */
function ChipLine({ labels }: { labels: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(Math.min(ROW_MAX, labels.length));
  const [expanded, setExpanded] = useState(false);
  const key = labels.join("|");

  // Start from ROW_MAX again whenever the labels or the width change, then drop
  // one chip at a time until the line fits.
  useLayoutEffect(() => {
    setShown(Math.min(ROW_MAX, labels.length));
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setShown(Math.min(ROW_MAX, labels.length)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [key, labels.length]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!expanded && el && shown > 1 && el.scrollWidth > el.clientWidth) setShown(shown - 1);
  });

  const visible = expanded ? labels : labels.slice(0, shown);
  const more = labels.length - visible.length;
  const chips = visible.map((label) => (
    <OutfitChip key={label} compact label={label} iconSrc={garmentIcon[label]} />
  ));
  const moreLabel = `+${more}`;

  return (
    <div ref={ref} className="yw-home__chipline" data-expanded={expanded || undefined}>
      {chips}
      {more > 0 ? (
        <button
          type="button"
          className="yw-home__more"
          onClick={() => setExpanded(true)}
          aria-label={`還有 ${more} 件：${labels.slice(visible.length).join("、")}`}
        >
          {moreLabel}
        </button>
      ) : expanded && labels.length > shown ? (
        <button type="button" className="yw-home__more" onClick={() => setExpanded(false)}>
          收合
        </button>
      ) : null}
    </div>
  );
}

/**
 * Pull-to-refresh for the scroll area: touch events on phones (pointer events
 * get cancelled once the browser starts scrolling) and pointer events for a
 * mouse drag in Storybook. Only engages when the list is at the top.
 */
function usePullToRefresh(onRefresh?: () => void, refreshing = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [drag, setDrag] = useState(0);

  function begin(y: number) {
    if (!onRefresh || refreshing || (ref.current?.scrollTop ?? 0) > 0) return;
    setStartY(y);
  }
  function move(y: number) {
    if (startY === null) return;
    const dy = y - startY;
    setDrag(dy <= 0 ? 0 : Math.min(dy / 2, PTR_THRESHOLD + 16));
  }
  function end() {
    if (startY === null) return;
    setStartY(null);
    if (drag >= PTR_THRESHOLD) onRefresh?.();
    setDrag(0);
  }
  const mouse = (e: React.PointerEvent) => e.pointerType === "mouse";

  return {
    ref,
    offset: refreshing ? 40 : drag,
    dragging: startY !== null && drag > 0,
    handlers: {
      onTouchStart: (e: React.TouchEvent) => begin(e.touches[0].clientY),
      onTouchMove: (e: React.TouchEvent) => move(e.touches[0].clientY),
      onTouchEnd: end,
      onTouchCancel: end,
      onPointerDown: (e: React.PointerEvent) => mouse(e) && begin(e.clientY),
      onPointerMove: (e: React.PointerEvent) => mouse(e) && move(e.clientY),
      onPointerUp: (e: React.PointerEvent) => mouse(e) && end(),
      onPointerLeave: (e: React.PointerEvent) => mouse(e) && end(),
    },
  };
}
