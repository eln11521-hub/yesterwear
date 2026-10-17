import checkCircleLgUrl from "../../assets/icon/check-circle-lg.svg?url";
import { Icon } from "../../components/_ui/Icon";

/**
 * OnboardingDone — Step 5 完成 (Figma 49:2 / PRD 5.2).
 * Guides the user to add the widget to their home screen; the「完成」CTA closes
 * onboarding and drops into the App home, which then loads today + yesterday data
 * to backfill the widget.
 */
export function OnboardingDone() {
  return (
    <div className="yw-ob__body">
      <span className="yw-ob__step">Step 5 · 加入 Widget</span>
      <h1 className="yw-ob__title">
        把 Widget 加到
        <br />
        你的桌面
      </h1>
      <p className="yw-ob__subtext">
        長按桌面 →「+」→ 搜尋「昨日天氣對比」→ 選擇尺寸 → 加入。
      </p>

      <div className="yw-ob__illus">
        <Icon src={checkCircleLgUrl} size={52} />
      </div>

      <p className="yw-ob__note">加好後天天在桌面就能看，不用再打開 App。</p>
    </div>
  );
}
