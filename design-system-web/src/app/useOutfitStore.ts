import { useCallback, useEffect, useState } from "react";

import {
  type BaseLayer,
  type DailyOutfitRecord,
  type OuterLayer,
  type OutfitSource,
  todayISO,
} from "./outfit";

const KEY = "yw-outfit-store";

type StoreState = {
  yesterday: DailyOutfitRecord | null;
  today: DailyOutfitRecord | null;
};

function isoMinusDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Reconcile stored records against the real calendar date (rolling yesterday+today). */
function reconcile(stored: StoreState, now = new Date()): StoreState {
  const t = todayISO(now);
  const y = isoMinusDays(t, 1);
  let { yesterday, today } = stored;

  if (today) {
    if (today.date === t) {
      // still today — keep
    } else if (today.date === y) {
      yesterday = today; // crossed one day
      today = null;
    } else {
      today = null; // stale
    }
  }
  if (yesterday && yesterday.date !== y) yesterday = null;
  return { yesterday, today };
}

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { yesterday: null, today: null };
    return reconcile(JSON.parse(raw) as StoreState);
  } catch {
    return { yesterday: null, today: null };
  }
}

function persist(state: StoreState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function useOutfitStore() {
  const [state, setState] = useState<StoreState>({
    yesterday: null,
    today: null,
  });

  useEffect(() => {
    setState(load());
  }, []);

  const saveToday = useCallback(
    (input: {
      top: BaseLayer;
      outer: OuterLayer;
      thumbnailRef?: string | null;
      source?: OutfitSource;
    }) => {
      setState((prev) => {
        const next: StoreState = {
          yesterday: prev.yesterday,
          today: {
            date: todayISO(),
            top: input.top,
            outer: input.outer,
            thumbnailRef: input.thumbnailRef ?? null,
            source: input.source ?? "manual",
          },
        };
        persist(next);
        return next;
      });
    },
    [],
  );

  /** Demo helper: simulate crossing midnight — today becomes yesterday. */
  const simulateNextDay = useCallback(() => {
    setState((prev) => {
      if (!prev.today) return prev;
      const y = isoMinusDays(todayISO(), 1);
      const next: StoreState = {
        yesterday: { ...prev.today, date: y },
        today: null,
      };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    persist({ yesterday: null, today: null });
    setState({ yesterday: null, today: null });
  }, []);

  return { ...state, saveToday, simulateNextDay, reset };
}
