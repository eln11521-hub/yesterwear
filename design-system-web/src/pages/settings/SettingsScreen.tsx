import { type ReactNode, useState } from "react";

import type { LocationMode, TempUnit } from "../../app/useSettingsStore";
import { geocodeCity, type GeoLocation } from "../../app/weatherApi";
import { FloatingNav } from "../../components/floating-nav/FloatingNav";
import {
  GearIcon,
  ThermometerIcon,
} from "../../components/floating-nav/NavIcons";
import "./SettingsScreen.css";

export type SettingsScreenProps = {
  leaveTime?: string;
  returnTime?: string;
  locationMode?: LocationMode;
  location?: GeoLocation;
  onLeaveChange?: (t: string) => void;
  onReturnChange?: (t: string) => void;
  onModeChange?: (m: LocationMode) => void;
  onLocationChange?: (loc: GeoLocation) => void;
  unit?: TempUnit;
  onUnitChange?: (u: TempUnit) => void;
  notifCommute?: boolean;
  onNotifCommuteChange?: (b: boolean) => void;
  leaveAlert?: string;
  returnAlert?: string;
  onLeaveAlertChange?: (t: string) => void;
  onReturnAlertChange?: (t: string) => void;
  notifEvening?: boolean;
  onNotifEveningChange?: (b: boolean) => void;
  eveningTime?: string;
  onEveningTimeChange?: (t: string) => void;
  /** Called when notification permission transitions to granted (PRD 4-3). */
  onNotifPermissionGranted?: () => void;
  navActiveId?: string;
  onNavSelect?: (id: string) => void;
};

function minus30(t: string): string {
  const [h, m] = t.split(":").map(Number);
  let total = h * 60 + m - 30;
  if (total < 0) total += 1440;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange?: (b: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="yw-settings__toggle"
      data-on={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      <span className="yw-settings__toggle-knob" />
    </button>
  );
}

function SecLabel({ children }: { children: ReactNode }) {
  return (
    <div className="yw-settings__seclabel">
      <span className="yw-settings__dot" aria-hidden />
      {children}
    </div>
  );
}

/**
 * SettingsScreen — 設定頁 (PRD 3.2.2). Built from the design system (paper frame,
 * bullet section labels, floating nav, tokens). Commute times + location drive the
 * weather fetch; single location only (MVP).
 */
export function SettingsScreen({
  leaveTime = "08:00",
  returnTime = "18:00",
  locationMode = "gps",
  location = { name: "台北", lat: 25.033, lon: 121.5654 },
  onLeaveChange,
  onReturnChange,
  onModeChange,
  onLocationChange,
  unit = "C",
  onUnitChange,
  notifCommute = true,
  onNotifCommuteChange,
  leaveAlert,
  returnAlert,
  onLeaveAlertChange,
  onReturnAlertChange,
  notifEvening = true,
  onNotifEveningChange,
  eveningTime = "21:30",
  onEveningTimeChange,
  onNotifPermissionGranted,
  navActiveId = "settings",
  onNavSelect,
}: SettingsScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [geoState, setGeoState] = useState<
    "idle" | "locating" | "denied" | "ok"
  >("idle");
  const [showSysNote, setShowSysNote] = useState(false);
  const [notifPerm, setNotifPerm] = useState<
    NotificationPermission | "unsupported"
  >(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const notifGranted = notifPerm === "granted";

  async function requestNotif() {
    if (typeof Notification === "undefined") {
      setNotifPerm("unsupported");
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setNotifPerm(p);
      if (p === "granted") onNotifPermissionGranted?.();
    } catch {
      setNotifPerm("denied");
    }
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    try {
      setResults(await geocodeCity(query));
    } catch {
      setResults([]);
    }
  }

  function useGps() {
    if (!navigator.geolocation) {
      setGeoState("denied");
      return;
    }
    setGeoState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState("ok");
        onLocationChange?.({
          name: "目前位置",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => setGeoState("denied"),
    );
  }

  return (
    <div className="yw-settings">
      <div className="yw-settings__top">
        <h1 className="yw-settings__title">設定</h1>
      </div>

      <div className="yw-settings__scroll">
        {/* 通勤時段 */}
        <section className="yw-settings__group">
          <SecLabel>通勤時段</SecLabel>
          <div className="yw-settings__card">
            <label className="yw-settings__row">
              <span className="yw-settings__row-label">出門時間</span>
              <input
                className="yw-settings__time"
                type="time"
                value={leaveTime}
                onChange={(e) => onLeaveChange?.(e.target.value)}
              />
            </label>
            <div className="yw-settings__rowdiv" />
            <label className="yw-settings__row">
              <span className="yw-settings__row-label">下班時間</span>
              <input
                className="yw-settings__time"
                type="time"
                value={returnTime}
                onChange={(e) => onReturnChange?.(e.target.value)}
              />
            </label>
          </div>
          <p className="yw-settings__note">
            決定 Widget 與通知中出門／下班時段的溫度比對基準。
          </p>
        </section>

        {/* 地點設定 */}
        <section className="yw-settings__group">
          <SecLabel>地點設定</SecLabel>
          <div className="yw-settings__segmented" role="tablist">
            <button
              type="button"
              className="yw-settings__seg"
              data-active={locationMode === "gps"}
              onClick={() => onModeChange?.("gps")}
            >
              GPS 自動定位
            </button>
            <button
              type="button"
              className="yw-settings__seg"
              data-active={locationMode === "manual"}
              onClick={() => onModeChange?.("manual")}
            >
              手動輸入城市
            </button>
          </div>

          {locationMode === "gps" ? (
            <div className="yw-settings__card">
              <div className="yw-settings__row">
                <span className="yw-settings__row-label">目前地點</span>
                <span className="yw-settings__row-value">{location.name}</span>
              </div>
              <div className="yw-settings__rowdiv" />
              <button
                type="button"
                className="yw-settings__row yw-settings__row--action"
                onClick={useGps}
              >
                <span className="yw-settings__row-label">
                  {geoState === "locating" ? "定位中…" : "使用目前位置"}
                </span>
                <span className="yw-settings__chev" aria-hidden>
                  ›
                </span>
              </button>
              {geoState === "denied" ? (
                <>
                  <div className="yw-settings__rowdiv" />
                  <p className="yw-settings__hintline">
                    尚未取得定位權限,可
                    <button
                      type="button"
                      className="yw-settings__link"
                      onClick={() => setShowSysNote(true)}
                    >
                      前往系統設定
                    </button>
                    或改用手動輸入城市。
                    {showSysNote ? "（web 預覽無法開啟系統設定）" : ""}
                  </p>
                </>
              ) : null}
            </div>
          ) : (
            <div className="yw-settings__card">
              <form className="yw-settings__search" onSubmit={search}>
                <input
                  className="yw-settings__search-input"
                  placeholder="搜尋城市…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="yw-settings__search-btn" type="submit">
                  搜尋
                </button>
              </form>
              {results.length > 0 ? (
                <ul className="yw-settings__results">
                  {results.map((r) => (
                    <li key={`${r.lat},${r.lon}`}>
                      <button
                        type="button"
                        onClick={() => {
                          onLocationChange?.(r);
                          setResults([]);
                          setQuery("");
                        }}
                      >
                        {r.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="yw-settings__rowdiv" />
              <div className="yw-settings__row">
                <span className="yw-settings__row-label">目前地點</span>
                <span className="yw-settings__row-value">{location.name}</span>
              </div>
            </div>
          )}
          <p className="yw-settings__note">
            {locationMode === "manual"
              ? "固定城市模式下，旅行時資料不會跟著你移動。"
              : "自動定位：旅行跨城市時，昨日仍以你昨天所在地的體感為基準。"}
          </p>
        </section>

        {/* 溫度單位 */}
        <section className="yw-settings__group">
          <SecLabel>溫度單位</SecLabel>
          <div className="yw-settings__segmented">
            <button
              type="button"
              className="yw-settings__seg"
              data-active={unit === "C"}
              onClick={() => onUnitChange?.("C")}
            >
              攝氏 °C
            </button>
            <button
              type="button"
              className="yw-settings__seg"
              data-active={unit === "F"}
              onClick={() => onUnitChange?.("F")}
            >
              華氏 °F
            </button>
          </div>
          <p className="yw-settings__note">
            跟隨系統地區(美國 °F,其餘 °C)。全域生效,溫差同步換算,色彩門檻不變。
          </p>
        </section>

        {/* 通知管理 */}
        <section className="yw-settings__group">
          <SecLabel>通知管理</SecLabel>

          <div className="yw-settings__card" data-disabled={!notifGranted}>
            {/* 4-1 通勤提醒 */}
            <div className="yw-settings__row">
              <span className="yw-settings__row-label">通勤提醒</span>
              <Toggle
                checked={notifCommute}
                onChange={onNotifCommuteChange}
                disabled={!notifGranted}
              />
            </div>
            {notifGranted && notifCommute ? (
              <>
                <div className="yw-settings__rowdiv" />
                <label className="yw-settings__row">
                  <span className="yw-settings__row-label">出門提醒時間</span>
                  <input
                    className="yw-settings__time"
                    type="time"
                    value={leaveAlert ?? minus30(leaveTime)}
                    onChange={(e) => onLeaveAlertChange?.(e.target.value)}
                  />
                </label>
                <div className="yw-settings__rowdiv" />
                <label className="yw-settings__row">
                  <span className="yw-settings__row-label">下班提醒時間</span>
                  <input
                    className="yw-settings__time"
                    type="time"
                    value={returnAlert ?? minus30(returnTime)}
                    onChange={(e) => onReturnAlertChange?.(e.target.value)}
                  />
                </label>
              </>
            ) : null}

            <div className="yw-settings__rowdiv" />

            {/* 4-2 晚間天氣預覽 */}
            <div className="yw-settings__row">
              <span className="yw-settings__row-label">晚間天氣預覽</span>
              <Toggle
                checked={notifEvening}
                onChange={onNotifEveningChange}
                disabled={!notifGranted}
              />
            </div>
            {notifGranted && notifEvening ? (
              <>
                <div className="yw-settings__rowdiv" />
                <label className="yw-settings__row">
                  <span className="yw-settings__row-label">推播時間</span>
                  <input
                    className="yw-settings__time"
                    type="time"
                    min="20:00"
                    max="23:00"
                    value={eveningTime}
                    onChange={(e) => onEveningTimeChange?.(e.target.value)}
                  />
                </label>
              </>
            ) : null}
          </div>

          {!notifGranted ? (
            <p className="yw-settings__hintline">
              尚未開啟通知權限,
              <button
                type="button"
                className="yw-settings__link"
                onClick={requestNotif}
              >
                前往系統設定
              </button>
              後即可開啟提醒。
              {notifPerm === "denied" ? "（web 需於瀏覽器設定開啟）" : ""}
            </p>
          ) : null}
          <p className="yw-settings__note">
            通勤提醒為出門／下班前 30 分;晚間預覽預設 21:30(可設 20:00–23:00)。僅在溫差 ≥ 3° 或降雨 &gt; 50% 時推播。
          </p>
        </section>

        <div className="yw-settings__nav-spacer" />
      </div>

      <div className="yw-settings__nav">
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
