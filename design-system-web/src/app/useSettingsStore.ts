import { useCallback, useEffect, useState } from "react";

import { toTraditional } from "./traditional";
import { DEFAULT_LOCATION, type GeoLocation } from "./weatherApi";

export type LocationMode = "gps" | "manual";
export type TempUnit = "C" | "F";

export type Settings = {
  leaveTime: string; // HH:MM
  returnTime: string;
  locationMode: LocationMode;
  location: GeoLocation;
  unit: TempUnit;
  notifCommute: boolean;
  /** Custom alert times; undefined = follow commute time − 30 min. */
  leaveAlert?: string;
  returnAlert?: string;
  notifEvening: boolean;
  eveningTime: string; // HH:MM (recommended 20:00–23:00)
  /** Most-recent-first places picked from the location switcher (max 5). */
  recentLocations: GeoLocation[];
};

const RECENT_MAX = 5;
const samePlace = (a: GeoLocation, b: GeoLocation) =>
  Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01;

const KEY = "yw-settings";

/** Follow device locale: US → °F, otherwise °C. */
function defaultUnit(): TempUnit {
  try {
    return (navigator.language || "").toLowerCase().endsWith("-us")
      ? "F"
      : "C";
  } catch {
    return "C";
  }
}

const DEFAULTS: Settings = {
  leaveTime: "08:00",
  returnTime: "18:00",
  locationMode: "gps",
  location: DEFAULT_LOCATION,
  unit: defaultUnit(),
  notifCommute: true,
  notifEvening: true,
  eveningTime: "21:30",
  recentLocations: [],
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const merged = { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
    // Migrate the previous auto-default 台北 to the current default (Edmonton),
    // without touching other user settings (unit, commute times, notifications).
    if (
      merged.location?.name === "台北" &&
      Math.abs((merged.location.lat ?? 0) - 25.033) < 0.05
    ) {
      merged.location = DEFAULT_LOCATION;
    }
    // Places saved before geocoder names were converted may hold Simplified
    // characters (東京, 东京都) — the app only shows Traditional.
    merged.location = { ...merged.location, name: toTraditional(merged.location.name) };
    merged.recentLocations = (merged.recentLocations ?? []).map((r) => ({
      ...r,
      name: toTraditional(r.name),
    }));
    return merged;
  } catch {
    return DEFAULTS;
  }
}

function persist(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** Settings store (PRD 3.2.2): commute times + single-location mode. */
export function useSettingsStore() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    setSettings(load());
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  return {
    settings,
    setLeaveTime: (leaveTime: string) => update({ leaveTime }),
    setReturnTime: (returnTime: string) => update({ returnTime }),
    setLocationMode: (locationMode: LocationMode) => update({ locationMode }),
    setLocation: (location: GeoLocation) => update({ location }),
    /**
     * Location switcher: show one place at a time. GPS follows the device;
     * a picked city fixes the location and joins 最近使用.
     */
    selectLocation: (location: GeoLocation, locationMode: LocationMode) =>
      setSettings((prev) => {
        const recents =
          locationMode === "manual"
            ? [location, ...(prev.recentLocations ?? []).filter((r) => !samePlace(r, location))].slice(0, RECENT_MAX)
            : prev.recentLocations ?? [];
        const next = { ...prev, location, locationMode, recentLocations: recents };
        persist(next);
        return next;
      }),
    setUnit: (unit: TempUnit) => update({ unit }),
    setNotifCommute: (notifCommute: boolean) => update({ notifCommute }),
    setLeaveAlert: (leaveAlert: string) => update({ leaveAlert }),
    setReturnAlert: (returnAlert: string) => update({ returnAlert }),
    setNotifEvening: (notifEvening: boolean) => update({ notifEvening }),
    setEveningTime: (eveningTime: string) => update({ eveningTime }),
    /** PRD 4-3: on permission grant, restore all notif toggles to default (on). */
    restoreNotifDefaults: () =>
      update({ notifCommute: true, notifEvening: true }),
  };
}
