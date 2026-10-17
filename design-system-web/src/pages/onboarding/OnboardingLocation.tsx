import mapPinLgUrl from "../../assets/icon/map-pin-lg.svg?url";
import { Icon } from "../../components/_ui/Icon";

export type OnboardingLocationProps = {
  /** Fallback path: jump to Settings → 地點設定 to enter a city manually. */
  onManualLocation?: () => void;
};

/**
 * OnboardingLocation — Step 2 地點許可 (Figma 4:2 / PRD 5.2).
 * Explains the "why" before the OS prompt, previews the permission copy, and
 * offers two recovery paths if the user declines (system settings / manual city).
 */
export function OnboardingLocation({
  onManualLocation,
}: OnboardingLocationProps) {
  // Functional preview: tapping the card fires the real "While Using App"
  // browser geolocation prompt (MVP needs no background location).
  const requestLocation = () => {
    try {
      navigator.geolocation?.getCurrentPosition(
        () => {},
        () => {},
      );
    } catch {
      /* ignore — prototype */
    }
  };

  return (
    <div className="yw-ob__body">
      <span className="yw-ob__step">Step 2 · 地點許可</span>
      <h1 className="yw-ob__title">需要您的位置</h1>
      <p className="yw-ob__subtext">
        只用來取得你所在地今天與昨天的氣溫和體感，不會用於其他用途。
      </p>

      <div className="yw-ob__illus">
        <Icon src={mapPinLgUrl} size={52} />
      </div>

      <button type="button" className="yw-ob__perm" onClick={requestLocation}>
        <span className="yw-ob__perm-title">允許取用位置資訊</span>
        <span className="yw-ob__perm-body">
          取得今天的預報與昨天的實際氣溫，算出兩天的溫差。
        </span>
      </button>

      <div className="yw-ob__reclinks">
        <span className="yw-ob__reclabel">若拒絕定位，仍可</span>
        <button type="button" className="yw-ob__reclink" onClick={requestLocation}>
          → 到系統設定開啟定位權限
        </button>
        <button
          type="button"
          className="yw-ob__reclink"
          onClick={onManualLocation}
        >
          → 改用手動輸入城市（設定頁）
        </button>
      </div>
    </div>
  );
}
