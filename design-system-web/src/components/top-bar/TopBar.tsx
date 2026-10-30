import { GearIcon } from "../floating-nav/NavIcons";
import "./TopBar.css";

/** Solid map-pin (filled teardrop with a punched-out inner circle), currentColor. */
function PinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8Zm0 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      />
    </svg>
  );
}

export type TopBarProps = {
  /** e.g. Edmonton */
  location: string;
  /** e.g. · 今天 週四 8/20 */
  date: string;
  /** Tap the location (pin + place) to switch places. */
  onLocationClick?: () => void;
  /** Tap the gear to open Settings. */
  onSettingsClick?: () => void;
};

/**
 * TopBar — home header: location (tap to switch places) + date on the left, a
 * Settings gear on the right (44×44 hit area; refreshing is pull-to-refresh).
 * Source: Figma 174:7. Place = DM Sans SemiBold 15px; date = IBM Plex Mono
 * Regular 11px.
 */
export function TopBar({ location, date, onLocationClick, onSettingsClick }: TopBarProps) {
  return (
    <header className="yw-top-bar">
      <div className="yw-top-bar__loc">
        <button
          type="button"
          className="yw-top-bar__place-btn"
          aria-label={`目前地點：${location}，點擊切換地點`}
          onClick={onLocationClick}
          disabled={!onLocationClick}
        >
          <PinIcon />
          <span className="yw-top-bar__place">{location}</span>
        </button>
        <span className="yw-top-bar__date">{date}</span>
      </div>
      <div className="yw-top-bar__actions">
        <button
          type="button"
          className="yw-top-bar__action"
          aria-label="設定"
          onClick={onSettingsClick}
        >
          <GearIcon size={20} />
        </button>
      </div>
    </header>
  );
}
