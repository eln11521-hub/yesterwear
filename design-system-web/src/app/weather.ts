import { type DailyOutfitRecord, heaviest, outfitChips, type OutfitPicks } from "./outfit";

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
  /** Today 00–23, feels-like temperature per hour (今天各時段溫度). */
  hourly: HourlyPoint[];
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

export type HourlyPoint = {
  /** Hour of day 0–23. */
  hour: number;
  /** Feels-like temperature in the display unit. */
  temp: number;
  condition: Condition;
  /** Precipitation probability, only when wet weather is likely (≥ 40%). */
  pop?: number;
  /** The current hour. */
  now?: boolean;
  /** Commute marker for this hour. */
  slot?: "出門" | "下班";
};

/** Mock day: feels-like curve with a 15:00 peak, now = 09:00. */
function mockHourly(): HourlyPoint[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const temp = Math.round(12 + 6 * Math.sin(((hour - 9) / 24) * 2 * Math.PI));
    const condition: Condition = hour < 6 || hour > 19 ? "partly" : hour >= 16 ? "overcast" : "sun";
    return {
      hour,
      temp,
      condition,
      ...(hour === 9 ? { now: true } : {}),
      ...(hour === 8 ? { slot: "出門" as const } : {}),
      ...(hour === 18 ? { slot: "下班" as const } : {}),
    };
  });
}

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
  hourly: mockHourly(),
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

export type OutfitSuggestion = OutfitPicks & { advice: string };

/** One step warmer for the outermost layer (colder-than-yesterday days). */
const WARMER_OUTER: Record<string, string> = {
  薄外套: "厚外套夾克",
  連帽外套: "厚外套夾克",
  鋪棉背心: "厚外套夾克",
  防風防水外套: "厚外套夾克",
  西裝外套: "毛呢大衣",
  厚外套夾克: "羽絨外套",
  毛呢大衣: "羽絨外套",
  羽絨外套: "羽絨外套",
};
const COLD_ACCESSORIES = ["毛帽", "圍巾", "手套"];

/**
 * Suggest today's outfit from the delta vs. yesterday + yesterday's actual outfit.
 * Mirrors the app's relative "add/keep/reduce a layer" logic: colder → the
 * outermost layer goes one step warmer, warmer → drop the outermost layer, close
 * → repeat yesterday. Rain adds 雨傘.
 */
export function suggestOutfit(
  weather: WeatherVM,
  yesterday: DailyOutfitRecord | null,
): OutfitSuggestion {
  const tops = yesterday?.tops.length ? yesterday.tops : ["長袖上衣"];
  const yOuters = yesterday ? yesterday.outers : ["薄外套"];
  const bottoms = yesterday?.bottoms ?? [];
  let accessories = yesterday?.accessories ?? [];
  const yOuter = heaviest(yOuters);
  const withRain = (xs: string[]) =>
    weather.rain && !xs.includes("雨傘") ? [...xs, "雨傘"] : xs;

  if (weather.overallDelta <= -3) {
    const up = WARMER_OUTER[yOuter ?? ""] ?? "厚外套夾克";
    if (up === yOuter && !accessories.includes("圍巾")) accessories = [...accessories, "圍巾"];
    const change = up === "厚外套夾克" ? "換件厚外套" : `換上「${up}」`;
    return {
      tops,
      outers: [up],
      bottoms,
      accessories: withRain(accessories),
      advice: yesterday
        ? `建議：比昨天冷，在「${tops.join("＋")}」的基礎上${change}。`
        : "建議：比昨天明顯變冷，多加一層外套。",
    };
  }
  if (weather.overallDelta >= 3) {
    return {
      tops,
      outers: yOuters.filter((o) => o !== yOuter),
      bottoms,
      accessories: withRain(accessories.filter((a) => !COLD_ACCESSORIES.includes(a))),
      advice: !yesterday
        ? "建議：比昨天明顯變熱，減少疊搭。"
        : yOuter
          ? `建議：比昨天熱，可比「${yOuter}」再減一層。`
          : "建議：比昨天熱，換件更薄的上衣。",
    };
  }
  return {
    tops,
    outers: yOuters,
    bottoms,
    accessories: withRain(accessories),
    advice: yesterday
      ? `建議：體感接近昨天，可參考「${outfitChips(yesterday).join("＋")}」。`
      : "建議：體感與昨天接近，維持平常穿搭即可。",
  };
}
