import { useEffect, useState } from "react";

import { MOCK_WEATHER, type WeatherVM } from "./weather";
import {
  type CommuteTimes,
  DEFAULT_LOCATION,
  fetchWeather,
  type GeoLocation,
} from "./weatherApi";

export type WeatherStatus = "loading" | "live" | "cached" | "error";

const DEFAULT_COMMUTE: CommuteTimes = { leaveTime: "08:00", returnTime: "18:00" };
const CACHE_KEY = "yw-weather-cache";

function readCache(): WeatherVM | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as WeatherVM) : null;
  } catch {
    return null;
  }
}

function writeCache(w: WeatherVM) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(w));
  } catch {
    /* ignore */
  }
}

/**
 * useWeather — live weather from Open-Meteo. PRD 4.3 fallback: on failure it keeps
 * the last successful cache (with its timestamp) instead of clearing or erroring,
 * so the UI stays populated and the caller can show "更新於 X 前".
 */
export function useWeather(
  loc: GeoLocation = DEFAULT_LOCATION,
  commute: CommuteTimes = DEFAULT_COMMUTE,
  unit: "C" | "F" = "C",
) {
  const [weather, setWeather] = useState<WeatherVM>(
    () => readCache() ?? MOCK_WEATHER,
  );
  const [status, setStatus] = useState<WeatherStatus>("loading");
  /** Bumped by refresh() to re-run the fetch effect on demand. */
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    fetchWeather(loc, commute, unit)
      .then((w) => {
        if (!alive) return;
        writeCache(w);
        setWeather(w);
        setStatus("live");
      })
      .catch(() => {
        if (!alive) return;
        const cached = readCache();
        if (cached) {
          setWeather(cached);
          setStatus("cached");
        } else {
          setWeather(MOCK_WEATHER);
          setStatus("error");
        }
      });
    return () => {
      alive = false;
    };
  }, [
    loc.lat,
    loc.lon,
    loc.name,
    commute.leaveTime,
    commute.returnTime,
    unit,
    reloadKey,
  ]);

  /** Re-fetch weather + location data for the current spot. */
  const refresh = () => setReloadKey((k) => k + 1);

  return { weather, status, refresh };
}
