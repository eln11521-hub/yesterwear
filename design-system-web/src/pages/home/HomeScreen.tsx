import { Fragment } from "react";

import tagUrl from "../../assets/icon/tag.svg?url";
import { MOCK_WEATHER, suggestOutfit, type WeatherVM } from "../../app/weather";
import { WeatherIcon } from "../../components/weather-icon/WeatherIcon";
import { Icon } from "../../components/_ui/Icon";
import { CommuteRow } from "../../components/commute-row/CommuteRow";
import { FloatingNav } from "../../components/floating-nav/FloatingNav";
import { GearIcon, ThermometerIcon } from "../../components/floating-nav/NavIcons";
import { ForecastRow } from "../../components/forecast-row/ForecastRow";
import { garmentIcon } from "../../components/outfit-chip/garments";
import { OutfitChip } from "../../components/outfit-chip/OutfitChip";
import { PrimaryButton } from "../../components/primary-button/PrimaryButton";
import { TopBar } from "../../components/top-bar/TopBar";
import { WidgetPromoCard } from "../../components/widget-promo-card/WidgetPromoCard";
import "./HomeScreen.css";

export type HomeScreenProps = {
  weather?: WeatherVM;
  /** Garment labels for the 昨日穿搭 row (「不加外套」already omitted). */
  yesterdayChips?: string[];
  /** Garment labels for the 今日建議穿搭 row. */
  suggestedChips?: string[];
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
  /** Reload weather + location (wired to the top-bar refresh button). */
  onRefresh?: () => void;
  /** Spins the refresh icon while a reload is in flight. */
  refreshing?: boolean;
  navActiveId?: string;
  onNavSelect?: (id: string) => void;
};

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

/** 實際氣溫 delta color: rising → warm, falling → cold, flat → neutral. */
function deltaColor(d: string): string {
  if (d.includes("↑")) return "var(--yw-sys-color-delta-warm)";
  if (d.includes("↓")) return "var(--yw-sys-color-delta-cold)";
  return "var(--yw-sys-color-delta-neutral)";
}

const DEFAULT_SUGGESTION = suggestOutfit(MOCK_WEATHER, null);

/**
 * HomeScreen — the 174:2 Dashboard (v4d). Paper ground with #f5f5f5 cards: a
 * hero (現在體感 + condition + comparison headline, 實際氣溫/濕度 + 較昨日 pill),
 * then commute → outfit → CTA → week forecast → widget promo. Presentational:
 * pass props for real data.
 */
export function HomeScreen({
  weather = MOCK_WEATHER,
  yesterdayChips = ["長袖上衣", "薄外套"],
  suggestedChips = [DEFAULT_SUGGESTION.top, DEFAULT_SUGGESTION.outer],
  advice = DEFAULT_SUGGESTION.advice,
  crossLocation,
  ctaLabel = "記錄今天穿搭",
  onRecord,
  onRefresh,
  refreshing = false,
  navActiveId = "weather",
  onNavSelect,
}: HomeScreenProps) {
  const weekMin = Math.min(...weather.forecast.map((f) => f.low));
  const weekMax = Math.max(...weather.forecast.map((f) => f.high));
  const metric = (label: string) =>
    weather.metrics.find((m) => m.label === label)?.value ?? "";
  const airTemp = metric("氣溫");
  const airDelta = metric("較昨天");
  const rain = metric("降雨");
  const humidity = metric("濕度");
  const rainPossible = Number.parseInt(rain, 10) > 0;
  return (
    <div className="yw-home">
      <div className="yw-home__top">
        <TopBar
          location={weather.location}
          date={weather.date}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </div>

      <div className="yw-home__scroll">
        {/* Hero: 現在體感 + condition/headline, then the metrics rows (Figma 173:2893) */}
        <section className="yw-home__hero">
          <div className="yw-home__hero-top">
            <div className="yw-home__now">
              <span className="yw-home__now-label">現在體感</span>
              <span className="yw-home__now-temp">{weather.nowTemp}</span>
            </div>
            <div className="yw-home__hero-info">
              <span className="yw-home__now-cond">
                <WeatherIcon condition={weather.condition} size={20} />{" "}
                {weather.conditionLabel}
              </span>
              <h1 className="yw-home__headline">{weather.headline}</h1>
            </div>
          </div>

          <hr className="yw-home__hero-divider" />
          <div className="yw-home__hero-metrics">
            <div className="yw-home__hm-row">
              <span className="yw-home__hm-label">實際氣溫</span>
              <span className="yw-home__hm-value">{airTemp}</span>
              <span
                className="yw-home__hm-pill"
                style={{ background: deltaColor(airDelta) }}
              >
                較昨日 {airDelta}
              </span>
            </div>
            <div className="yw-home__hm-row">
              <span className="yw-home__hm-label">濕度</span>
              <span className="yw-home__hm-value">{humidity}</span>
            </div>
          </div>

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
          <SecLabel>通勤時段溫度</SecLabel>
          <div className="yw-home__commute">
            {weather.commute.map((c, i) => (
              <Fragment key={c.slot}>
                {i > 0 ? <span className="yw-home__vrule" /> : null}
                <CommuteRow {...c} />
              </Fragment>
            ))}
            <span className="yw-home__vrule" />
            {/* 降雨 reuses the commute column visual (value + optional note) */}
            <div className="yw-commute-row">
              <span className="yw-commute-row__slot">降雨</span>
              <span className="yw-commute-row__temp">{rain}</span>
              {rainPossible ? (
                <span className="yw-commute-row__delta">攜帶雨具</span>
              ) : null}
            </div>
          </div>
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
          <div className="yw-home__chips">
            {yesterdayChips.length ? (
              yesterdayChips.map((label) => (
                <OutfitChip
                  key={label}
                  compact
                  label={label}
                  iconSrc={garmentIcon[label]}
                />
              ))
            ) : (
              <span className="yw-home__empty">尚無昨日紀錄</span>
            )}
          </div>
          <SecLabel>今日建議穿搭</SecLabel>
          <div className="yw-home__chips">
            {suggestedChips.map((label) => (
              <OutfitChip
                key={label}
                compact
                label={label}
                iconSrc={garmentIcon[label]}
              />
            ))}
          </div>
          <p className="yw-home__suggestion">
            {advice.startsWith("建議：") ? (
              <>
                <strong>建議：</strong>
                {advice.slice("建議：".length)}
              </>
            ) : (
              advice
            )}
          </p>
        </section>

        <PrimaryButton
          shape="pill"
          label={ctaLabel}
          icon={<Icon src={tagUrl} size={18} />}
          onClick={onRecord}
        />

        <section className="yw-home__block">
          <h2 className="yw-home__h2">未來一週天氣</h2>
          <div className="yw-home__card yw-home__forecast">
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
          </div>
        </section>

        <WidgetPromoCard
          title="把 Widget 加到桌面"
          subtitle="長按桌面 →「+」→ 搜尋加入"
        />
        <div className="yw-home__nav-spacer" />
      </div>

      <div className="yw-home__nav">
        <FloatingNav
          activeId={navActiveId}
          onSelect={onNavSelect}
          items={[
            { id: "weather", label: "天氣", icon: <ThermometerIcon /> },
            { id: "settings", label: "設定", icon: <GearIcon /> },
          ]}
        />
      </div>
    </div>
  );
}
