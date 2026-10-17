import { useState } from "react";

import { OnboardingDone } from "./OnboardingDone";
import { OnboardingLocation } from "./OnboardingLocation";
import { OnboardingNotifications } from "./OnboardingNotifications";
import { OnboardingWelcome } from "./OnboardingWelcome";
import { OnboardingWidgets } from "./OnboardingWidgets";
import "./Onboarding.css";

export type OnboardingProps = {
  /** Called when the last step's CTA is pressed. */
  onComplete?: () => void;
  /** Step 2 fallback: open Settings → 地點設定 to type a city manually. */
  onManualLocation?: () => void;
};

/** PRD 5: 5 steps — 歡迎 / 地點許可 / 通知許可 / 認識 Widget / 完成. */
const TOTAL = 5;

/**
 * Onboarding — first-launch flow shell (phone frame, scroll body, footer with page
 * dots + CTA). Step 1 uses a single "開始" CTA; steps 2+ show 上一步 / 下一步 (Figma
 * 4:2, 4:28). Step 1 uses a single "開始" CTA; steps 2–5 show 上一步 / 下一步.
 */
export function Onboarding({ onComplete, onManualLocation }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const isLast = step === TOTAL - 1;
  const next = () => (isLast ? onComplete?.() : setStep(step + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const forwardLabel = isLast ? "完成" : "下一步";

  return (
    <div className="yw-ob">
      <div className="yw-ob__scroll">
        {step === 0 ? (
          <OnboardingWelcome />
        ) : step === 1 ? (
          <OnboardingLocation onManualLocation={onManualLocation} />
        ) : step === 2 ? (
          <OnboardingNotifications />
        ) : step === 3 ? (
          <OnboardingWidgets />
        ) : (
          <OnboardingDone />
        )}
      </div>

      <div className="yw-ob__footer">
        <div className="yw-ob__dots">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span key={i} className="yw-ob__dot" data-active={i === step} />
          ))}
        </div>
        {step === 0 ? (
          <button type="button" className="yw-ob__btn" onClick={next}>
            開始
          </button>
        ) : (
          <div className="yw-ob__btns">
            <button
              type="button"
              className="yw-ob__btn yw-ob__btn--secondary"
              onClick={back}
            >
              上一步
            </button>
            <button type="button" className="yw-ob__btn" onClick={next}>
              {forwardLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
