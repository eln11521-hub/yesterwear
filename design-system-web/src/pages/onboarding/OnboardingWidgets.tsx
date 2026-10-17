import deltaDownUrl from "../../assets/icon/delta-down.svg?url";
import deltaFlatUrl from "../../assets/icon/delta-flat.svg?url";
import deltaUpUrl from "../../assets/icon/delta-up.svg?url";
import puzzleLgUrl from "../../assets/icon/puzzle-lg.svg?url";
import { Icon } from "../../components/_ui/Icon";

/** The three delta-color states, using the same tokens the real widget renders. */
const SWATCHES = [
  { key: "cold", label: "降溫", icon: deltaDownUrl },
  { key: "neutral", label: "持平", icon: deltaFlatUrl },
  { key: "warm", label: "升溫", icon: deltaUpUrl },
] as const;

/**
 * OnboardingWidgets — Step 4 認識 Widget (Figma 46:2 / PRD 5.2).
 * Introduces the two widget types and shows the dynamic temperature-delta color
 * system (降溫 / 持平 / 升溫) so the color language is learned before install.
 */
export function OnboardingWidgets() {
  return (
    <div className="yw-ob__body">
      <span className="yw-ob__step">Step 4 · 認識 Widget</span>
      <h1 className="yw-ob__title">兩種 Widget</h1>
      <p className="yw-ob__subtext">
        鎖定畫面一眼就懂；主畫面的背景色會隨「今天比昨天冷或熱」變化。
      </p>

      <div className="yw-ob__illus">
        <Icon src={puzzleLgUrl} size={52} />
      </div>

      <div className="yw-ob__swatches">
        {SWATCHES.map((s) => (
          <div key={s.key} className={`yw-ob__swatch yw-ob__swatch--${s.key}`}>
            <Icon src={s.icon} size={18} />
            <span className="yw-ob__swatch-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
