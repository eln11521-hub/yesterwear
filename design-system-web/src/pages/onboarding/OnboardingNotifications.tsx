import bellLgUrl from "../../assets/icon/bell-lg.svg?url";
import { Icon } from "../../components/_ui/Icon";

/**
 * OnboardingNotifications — Step 3 通知許可 (Figma 4:28 / PRD 5.2).
 * Comes after 地點許可 (whether granted or denied). Declining never blocks the
 * flow — the Widget still works; we only record the state. Commute times are not
 * asked here; they inherit the settings defaults (出門 08:00 / 下班 18:00).
 */
export function OnboardingNotifications() {
  // Functional preview: tapping the card fires the real notification prompt.
  const requestNotify = () => {
    try {
      void Notification?.requestPermission?.();
    } catch {
      /* ignore — prototype */
    }
  };

  return (
    <div className="yw-ob__body">
      <span className="yw-ob__step">Step 3 · 通知許可</span>
      <h1 className="yw-ob__title">開啟通知</h1>
      <p className="yw-ob__subtext">
        出門前提醒你今天比昨天冷還是熱、要不要帶傘。不開也沒關係，Widget
        一樣能用。
      </p>

      <div className="yw-ob__illus">
        <Icon src={bellLgUrl} size={52} />
      </div>

      <button type="button" className="yw-ob__perm" onClick={requestNotify}>
        <span className="yw-ob__perm-title">允許傳送通知</span>
        <span className="yw-ob__perm-body">
          出門前與下班前，各提醒一次溫差與降雨。
        </span>
      </button>
    </div>
  );
}
