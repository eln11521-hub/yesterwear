import { useState } from "react";

import { HomeWidgetMedium } from "../components/home-widget-medium/HomeWidgetMedium";
import { LockWidget } from "../components/lock-widget/LockWidget";
import { HomeScreen } from "../pages/home/HomeScreen";
import { Welcome } from "../pages/onboarding/Welcome";
import { LocationSheet } from "../pages/location-sheet/LocationSheet";
import { RecordOutfitSheet } from "../pages/record-outfit/RecordOutfitSheet";
import { SettingsScreen } from "../pages/settings/SettingsScreen";
import "./App.css";
import {
  type BaseLayer,
  comboChips,
  type OuterLayer,
  recordChips,
} from "./outfit";
import { useOutfitStore } from "./useOutfitStore";
import { useSettingsStore } from "./useSettingsStore";
import { useWeather } from "./useWeather";
import { agoText, suggestOutfit } from "./weather";

type Tab = "weather" | "settings";

const ONBOARDED_KEY = "yw-onboarded";

/**
 * App — 昨日天氣對比 MVP. Live weather (Open-Meteo) + Dashboard + record-outfit
 * sheet wired to a localStorage store with the rolling yesterday↔today time-shift,
 * plus Lock (2×1) and Home (4×2) widget previews driven by the same data.
 */
export function App() {
  const {
    settings,
    setLeaveTime,
    setReturnTime,
    setLocationMode,
    setLocation,
    selectLocation,
    setUnit,
    setNotifCommute,
    setLeaveAlert,
    setReturnAlert,
    setNotifEvening,
    setEveningTime,
    restoreNotifDefaults,
  } = useSettingsStore();
  const { weather, status, refresh } = useWeather(
    settings.location,
    { leaveTime: settings.leaveTime, returnTime: settings.returnTime },
    settings.unit,
  );
  const { yesterday, today, saveToday, simulateNextDay, reset } =
    useOutfitStore();
  const [open, setOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  /** 使用目前位置: resolve the device location and show its weather (GPS mode). */
  function locateMe(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) return resolve(false);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          selectLocation(
            { name: "目前位置", lat: pos.coords.latitude, lon: pos.coords.longitude },
            "gps",
          );
          setLocOpen(false);
          resolve(true);
        },
        () => resolve(false),
        { timeout: 10000 },
      );
    });
  }
  const [tab, setTab] = useState<Tab>("weather");
  // First-launch onboarding: show the Welcome screen until it's been completed once.
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const finishOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      /* ignore */
    }
    setOnboarded(true);
  };
  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDED_KEY);
    } catch {
      /* ignore */
    }
    setOnboarded(false);
  };

  const suggestion = suggestOutfit(weather, yesterday);
  const yesterdayChips = recordChips(yesterday);
  const widgetChips = yesterdayChips.length ? yesterdayChips : ["—"];

  const selectTab = (id: string) => setTab(id as Tab);

  const stale = status === "cached" ? agoText(weather.updatedAt) : undefined;
  const statusLabel =
    status === "live"
      ? "🟢 即時天氣"
      : status === "loading"
        ? "天氣更新中…"
        : status === "cached"
          ? `⚠️ 離線 · ${stale}`
          : "離線（範例資料）";

  return (
    <div className="yw-app">
      <div className="yw-app__phone">
        {!onboarded ? (
          <Welcome onDone={finishOnboarding} />
        ) : tab === "weather" ? (
          <>
            <HomeScreen
              weather={weather}
              yesterdayChips={yesterdayChips}
              suggestedChips={comboChips(suggestion.top, suggestion.outer)}
              advice={suggestion.advice}
              ctaLabel={today ? "更新今日穿搭" : "記錄今天穿搭"}
              onRecord={() => setOpen(true)}
              onRefresh={refresh}
              refreshing={status === "loading"}
              onLocationPress={() => setLocOpen(true)}
              navActiveId="weather"
              onNavSelect={selectTab}
            />

            {locOpen ? (
              <>
                <button
                  type="button"
                  className="yw-app__scrim"
                  aria-label="關閉"
                  onClick={() => setLocOpen(false)}
                />
                <div className="yw-app__sheet">
                  <LocationSheet
                    location={settings.location}
                    mode={settings.locationMode}
                    recents={settings.recentLocations ?? []}
                    onSelect={(loc) => {
                      selectLocation(loc, "manual");
                      setLocOpen(false);
                    }}
                    onUseGps={locateMe}
                  />
                </div>
              </>
            ) : null}

            {open ? (
              <>
                <button
                  type="button"
                  className="yw-app__scrim"
                  aria-label="關閉"
                  onClick={() => setOpen(false)}
                />
                <div className="yw-app__sheet">
                  <RecordOutfitSheet
                    initialTop={today?.top ?? suggestion.top}
                    initialOuter={today?.outer ?? suggestion.outer}
                    initialThumb={today?.thumbnailRef ?? undefined}
                    onSave={(r) => {
                      saveToday({
                        top: r.top as BaseLayer,
                        outer: r.outer as OuterLayer,
                        thumbnailRef: r.thumbnailRef,
                        source: r.source,
                      });
                      setOpen(false);
                    }}
                  />
                </div>
              </>
            ) : null}
          </>
        ) : (
          <SettingsScreen
            leaveTime={settings.leaveTime}
            returnTime={settings.returnTime}
            locationMode={settings.locationMode}
            location={settings.location}
            onLeaveChange={setLeaveTime}
            onReturnChange={setReturnTime}
            onModeChange={setLocationMode}
            onLocationChange={setLocation}
            unit={settings.unit}
            onUnitChange={setUnit}
            notifCommute={settings.notifCommute}
            onNotifCommuteChange={setNotifCommute}
            leaveAlert={settings.leaveAlert}
            returnAlert={settings.returnAlert}
            onLeaveAlertChange={setLeaveAlert}
            onReturnAlertChange={setReturnAlert}
            notifEvening={settings.notifEvening}
            onNotifEveningChange={setNotifEvening}
            eveningTime={settings.eveningTime}
            onEveningTimeChange={setEveningTime}
            onNotifPermissionGranted={restoreNotifDefaults}
            navActiveId="settings"
            onNavSelect={selectTab}
          />
        )}
      </div>

      <div className="yw-app__dev">
        <span className="yw-app__status">{statusLabel}</span>
        <button type="button" onClick={simulateNextDay} disabled={!today}>
          模擬跨日（今日→昨日）
        </button>
        <button type="button" onClick={reset}>
          重設
        </button>
        <button type="button" onClick={resetOnboarding}>
          重看 Onboarding
        </button>
        {today ? (
          <span className="yw-app__note">
            今日已記錄：{comboChips(today.top, today.outer).join(" + ")}
          </span>
        ) : null}
      </div>

      <div className="yw-app__widgets">
        <p className="yw-app__widgets-title">Widget 預覽（純顯示，零點擊）</p>
        <div className="yw-app__widget-row">
          <div>
            <span className="yw-app__widget-label">鎖定畫面 2×1</span>
            <div className="yw-app__lockbg">
              <LockWidget
                location={weather.location}
                weather={weather}
                yesterdayChips={widgetChips}
                stale={stale}
              />
            </div>
          </div>
          <div>
            <span className="yw-app__widget-label">桌面 4×2</span>
            <HomeWidgetMedium
              location={weather.location}
              weather={weather}
              yesterdayChips={widgetChips}
              stale={stale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
