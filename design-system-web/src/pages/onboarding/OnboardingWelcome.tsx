import { WelcomeStamp } from "./WelcomeStamp";
import "./WelcomeStamp.css";

/**
 * OnboardingWelcome — Step 1 歡迎頁 (Figma 3:2 / PRD 5.2). Value prop + an
 * illustrated postage-stamp hero (WelcomeStamp) that shows the widget's real
 * fields as an illustration rather than a literal screenshot.
 */
export function OnboardingWelcome() {
  return (
    <div className="yw-ob__body">
      <span className="yw-ob__step">Step 1 · 歡迎</span>
      <h1 className="yw-ob__title">
        用昨天的體感，
        <br />
        決定今天怎麼穿
      </h1>
      <p className="yw-ob__subtext">
        不用再猜「20°C」是什麼感覺 — 只要知道比昨天更冷或更熱，就知道怎麼穿。
      </p>
      <WelcomeStamp />
    </div>
  );
}
