import type { DailyOutfitRecord } from "./outfit";

export type Condition =
  | "sun"
  | "partly"
  | "overcast"
  | "fog"
  | "rain"
  | "snow"
  | "thunder";

export type WeatherVM = {
  location: string;
  date: string;
  headline: string;
  nowTemp: string;
  condition: Condition;
  conditionLabel: string;
  metrics: { label: string; value: string }[];
  commute: { slot: string; time: string; temp: string; delta: string }[];
  forecast: {
    day: string;
    condition: Condition;
    low: number;
    high: number;
    pop?: number;
    current?: number;
  }[];
  /** Overall feels-like delta vs. yesterday, always in °C (drives headline,
   * suggestion, and color thresholds — logic stays °C regardless of display unit). */
  overallDelta: number;
  /** Display unit for temperatures. Delta color logic remains °C-based. */
  unit: "C" | "F";
  /** PRD 4.2: today's precipitation probability > 50%. */
  rain: boolean;
  /** PRD 4.3: epoch ms of the successful fetch (for staleness display). */
  updatedAt?: number;
};

/** "更新於 X 前" — human staleness label for cached data (PRD 4.3). */
export function agoText(ts?: number): string {
  if (!ts) return "";
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "剛剛更新";
  if (mins < 60) return `更新於 ${mins} 分鐘前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `更新於 ${hours} 小時前`;
  return `更新於 ${Math.floor(hours / 24)} 天前`;
}

/** MVP static weather (no API yet) — values match the reviewed Figma home screen. */
export const MOCK_WEATHER: WeatherVM = {
  location: "Edmonton",
  date: "· 今天 週四 8/20",
  headline: "比昨天涼一些",
  nowTemp: "16°C",
  condition: "sun",
  conditionLabel: "晴天",
  metrics: [
    { label: "氣溫", value: "18°C" },
    { label: "較昨天", value: "↑1°" },
    { label: "降雨", value: "20%" },
    { label: "濕度", value: "65%" },
  ],
  commute: [
    { slot: "出門", time: "08:00", temp: "16°", delta: "↓2°" },
    { slot: "下班", time: "18:00", temp: "14°", delta: "↓4°" },
  ],
  forecast: [
    { day: "今天", condition: "partly", low: 11, high: 18, current: 16 },
    { day: "週五", condition: "sun", low: 13, high: 20 },
    { day: "週六", condition: "partly", low: 12, high: 19 },
    { day: "週日", condition: "partly", low: 12, high: 19 },
    { day: "週一", condition: "partly", low: 12, high: 19 },
    { day: "週二", condition: "partly", low: 12, high: 19 },
    { day: "週三", condition: "partly", low: 12, high: 19 },
    { day: "週四", condition: "rain", low: 10, high: 15, pop: 65 },
  ],
  overallDelta: -3,
  unit: "C",
  rain: false,
};

/** Overall-delta arrow + magnitude for widgets (比昨天 ↓ 3°), unit-aware.
 * overallDelta is always °C; magnitude converts for display (±3°C → ±5°F). */
export function deltaDisplay(
  overallDelta: number,
  unit: "C" | "F" = "C",
): { arrow: string; abs: number } {
  const mag = unit === "F" ? overallDelta * (9 / 5) : overallDelta;
  const arrow = overallDelta < 0 ? "↓" : overallDelta > 0 ? "↑" : "±";
  return { arrow, abs: Math.abs(Math.round(mag)) };
}

/** Delta-state color token for widget accents (cold / neutral / warm). */
export function deltaStateColor(overallDelta: number): string {
  if (overallDelta <= -3) return "var(--yw-sys-color-delta-cold)";
  if (overallDelta >= 3) return "var(--yw-sys-color-delta-warm)";
  return "var(--yw-sys-color-delta-neutral)";
}

export type DeltaState = "cold" | "neutral" | "warm";
export function deltaState(overallDelta: number): DeltaState {
  if (overallDelta <= -3) return "cold";
  if (overallDelta >= 3) return "warm";
  return "neutral";
}

export function metricValue(w: WeatherVM, label: string): string {
  return w.metrics.find((m) => m.label === label)?.value ?? "";
}

export type OutfitSuggestion = {
  top: string;
  outer: string;
  advice: string;
};

/**
 * Suggest today's outfit from the delta vs. yesterday + yesterday's actual outfit.
 * Mirrors the app's relative "add/keep/reduce a layer" logic.
 */
export function suggestOutfit(
  weather: WeatherVM,
  yesterday: DailyOutfitRecord | null,
): OutfitSuggestion {
  const base = yesterday?.top ?? "長袖上衣";
  const yOuter = yesterday?.outer ?? "薄外套";

  if (weather.overallDelta <= -3) {
    return {
      top: base,
      outer: "厚外套夾克",
      advice: yesterday
        ? `建議：比昨天冷，在「${yesterday.top}」的基礎上換件厚外套。`
        : "建議：比昨天明顯變冷，多加一層外套。",
    };
  }
  if (weather.overallDelta >= 3) {
    return {
      top: base,
      outer: "不加外套",
      advice: yesterday
        ? `建議：比昨天熱，可比「${yOuter}」再減一層。`
        : "建議：比昨天明顯變熱，減少疊搭。",
    };
  }
  return {
    top: base,
    outer: yOuter,
    advice: yesterday
      ? `建議：體感接近昨天，可參考「${yOuter}」。`
      : "建議：體感與昨天接近，維持平常穿搭即可。",
  };
}
