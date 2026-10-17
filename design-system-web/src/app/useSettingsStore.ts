import { useCallback, useEffect, useState } from "react";

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
};

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
