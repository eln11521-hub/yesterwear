import type { Condition, WeatherVM } from "./weather";
import { toTraditional } from "./traditional";

export type GeoLocation = { name: string; lat: number; lon: number };

/** Default city for the MVP (configurable; geolocation can be added later). */
export const DEFAULT_LOCATION: GeoLocation = {
  name: "Edmonton",
  lat: 53.5461,
  lon: -113.4938,
};

const WEEKDAY = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

function decode(code: number): { condition: Condition; label: string } {
  if (code === 0) return { condition: "sun", label: "晴天" };
  if (code <= 2) return { condition: "partly", label: "多雲時晴" };
  if (code === 3) return { condition: "overcast", label: "陰天" };
  if (code <= 48) return { condition: "fog", label: "起霧" }; // 45,48
  if (code <= 67) return { condition: "rain", label: "下雨" }; // 51–67
  if (code <= 77) return { condition: "snow", label: "下雪" }; // 71–77
  if (code <= 82) return { condition: "rain", label: "陣雨" }; // 80–82
  if (code <= 86) return { condition: "snow", label: "陣雪" }; // 85,86
  return { condition: "thunder", label: "雷雨" }; // 95–99
}

function headlineFor(delta: number): string {
  if (delta <= -3) return "比昨天涼一些";
  if (delta <= -1) return "比昨天略涼";
  if (delta >= 3) return "比昨天暖一些";
  if (delta >= 1) return "比昨天略暖";
  return "和昨天差不多";
}

function deltaText(delta: number): string {
  const r = Math.round(delta);
  if (r < 0) return `↓${Math.abs(r)}°`;
  if (r > 0) return `↑${r}°`;
  return "±0°";
}

type OMResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export type CommuteTimes = { leaveTime: string; returnTime: string };
const DEFAULT_COMMUTE: CommuteTimes = { leaveTime: "08:00", returnTime: "18:00" };

/** Fetch live weather from Open-Meteo and map it to the app's WeatherVM. */
export async function fetchWeather(
  loc: GeoLocation = DEFAULT_LOCATION,
  commute: CommuteTimes = DEFAULT_COMMUTE,
  unit: "C" | "F" = "C",
): Promise<WeatherVM> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
    `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&past_days=1&forecast_days=7&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = (await res.json()) as OMResponse;

  const { current, hourly, daily } = data;

  // Display converts to the chosen unit; delta LOGIC stays °C.
  const toDisp = (c: number) => Math.round(unit === "F" ? c * (9 / 5) + 32 : c);
  const suffix = unit === "F" ? "°F" : "°C";
  const fmtDelta = (dc: number) => {
    const m = Math.round(unit === "F" ? dc * (9 / 5) : dc);
    if (m < 0) return `↓${Math.abs(m)}°`;
    if (m > 0) return `↑${m}°`;
    return "±0°";
  };

  const nowHour = current.time.slice(0, 13); // yyyy-mm-ddTHH
  const findHour = (iso: string) =>
    hourly.time.findIndex((t) => t.slice(0, 13) === iso.slice(0, 13));

  let nowIdx = findHour(current.time);
  if (nowIdx < 0) nowIdx = hourly.time.findIndex((t) => t >= nowHour);
  if (nowIdx < 0) nowIdx = 24; // fallback to first "today" hour

  // PRD 3.3: 溫差 = 今日體感溫度 − 昨日實際溫度
  const apparentDeltaAt = (idx: number) =>
    idx >= 24
      ? hourly.apparent_temperature[idx] - hourly.temperature_2m[idx - 24]
      : 0;

  const overallDelta = apparentDeltaAt(nowIdx);
  const today = current.time.slice(0, 10);

  const commuteAt = (slot: string, timeStr: string) => {
    const hh = timeStr.slice(0, 2);
    const idx = findHour(`${today}T${hh}:00`);
    // 體感溫度 (apparent) — the decision-relevant reading, consistent with the delta.
    const temp = idx >= 0 ? toDisp(hourly.apparent_temperature[idx]) : 0;
    const delta = idx >= 0 ? apparentDeltaAt(idx) : 0;
    return { slot, time: timeStr, temp: `${temp}°`, delta: fmtDelta(delta) };
  };

  const rainNow =
    nowIdx >= 0 ? (hourly.precipitation_probability[nowIdx] ?? 0) : 0;

  // daily[0] = yesterday, daily[1] = today, ...
  const forecast = daily.time.slice(1).map((iso, i) => {
    const di = i + 1;
    const { condition } = decode(daily.weather_code[di]);
    const low = toDisp(daily.temperature_2m_min[di]);
    const high = toDisp(daily.temperature_2m_max[di]);
    const pop = daily.precipitation_probability_max[di] ?? 0;
    const weekday =
      i === 0 ? "今天" : WEEKDAY[new Date(iso + "T00:00:00").getDay()];
    return {
      day: weekday,
      condition,
      low,
      high,
      ...(/rain|snow|thunder/.test(condition) && pop >= 40 ? { pop } : {}),
      ...(i === 0 ? { current: toDisp(current.apparent_temperature) } : {}),
    };
  });

  // 今天各時段: hourly[24..47] is today (past_days=1), feels-like per hour.
  const leaveHH = Number(commute.leaveTime.slice(0, 2));
  const returnHH = Number(commute.returnTime.slice(0, 2));
  const hourlyToday = Array.from({ length: 24 }, (_, hour) => {
    const idx = 24 + hour;
    const { condition } = decode(hourly.weather_code[idx] ?? 0);
    const pop = hourly.precipitation_probability[idx] ?? 0;
    return {
      hour,
      temp: toDisp(hourly.apparent_temperature[idx]),
      condition,
      ...(/rain|snow|thunder/.test(condition) && pop >= 40 ? { pop } : {}),
      ...(idx === nowIdx ? { now: true } : {}),
      ...(hour === leaveHH ? { slot: "出門" as const } : {}),
      ...(hour === returnHH && hour !== leaveHH ? { slot: "下班" as const } : {}),
    };
  });

  const cond = decode(current.weather_code);
  // PRD 4.2: rain hint when today's precipitation probability > 50%.
  const rain = (daily.precipitation_probability_max[1] ?? 0) > 50;

  return {
    location: loc.name,
    date: dateLabel(current.time),
    headline: headlineFor(overallDelta),
    // Hero big number = 體感 (feels-like) — the decision-relevant reading.
    nowTemp: `${toDisp(current.apparent_temperature)}${suffix}`,
    condition: cond.condition,
    conditionLabel: cond.label,
    metrics: [
      // Figma 174:2 order: 氣溫 · 較昨天 · 降雨 · 濕度
      { label: "氣溫", value: `${toDisp(current.temperature_2m)}${suffix}` },
      { label: "較昨天", value: fmtDelta(overallDelta) },
      { label: "降雨", value: `${Math.round(rainNow)}%` },
      { label: "濕度", value: `${Math.round(current.relative_humidity_2m)}%` },
    ],
    commute: [
      commuteAt("出門", commute.leaveTime),
      commuteAt("下班", commute.returnTime),
    ],
    hourly: hourlyToday,
    forecast,
    overallDelta,
    unit,
    rain,
    updatedAt: Date.now(),
  };
}

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
};

/** City search via Open-Meteo geocoding (no key). Returns up to 5 matches. */
export async function geocodeCity(query: string): Promise<GeoLocation[]> {
  const q = query.trim();
  if (!q) return [];
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}` +
    `&count=5&language=zh&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geocode ${res.status}`);
  const data = (await res.json()) as { results?: GeoResult[] };
  return (data.results ?? []).map((r) => ({
    name: toTraditional(r.admin1 && r.admin1 !== r.name ? `${r.name}, ${r.admin1}` : r.name),
    lat: r.latitude,
    lon: r.longitude,
  }));
}

function dateLabel(iso: string): string {
  const d = new Date(iso);
  return `· 今天 ${WEEKDAY[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
}
