import { useRef, useState } from "react";

import cameraUrl from "../../assets/icon/camera.svg?url";
import checkUrl from "../../assets/icon/check.svg?url";
import {
  BASE_LAYER,
  type BaseLayer,
  OUTER_LAYER,
  type OuterLayer,
} from "../../app/outfit";
import { Icon } from "../../components/_ui/Icon";
import { garmentIcon } from "../../components/outfit-chip/garments";
import { OutfitChip } from "../../components/outfit-chip/OutfitChip";
import { PrimaryButton } from "../../components/primary-button/PrimaryButton";
import { SecondaryButton } from "../../components/secondary-button/SecondaryButton";
import { SectionBadge } from "../../components/section-badge/SectionBadge";
import "./RecordOutfitSheet.css";

export type RecordOutfitSheetProps = {
  initialTop?: string;
  initialOuter?: string;
  /** Seed the 待確認 (pending) state with an already-attached thumbnail — used by
   *  stories/previews to show the photo-confirmation step (real capture goes
   *  through 拍照記錄). */
  initialThumb?: string;
  onSave?: (record: {
    top: string;
    outer: string;
    thumbnailRef: string | null;
    source: "manual" | "photo_confirmed";
  }) => void;
};

/** On-device recognition result. A layer left `null` = confidence below threshold,
 *  so we leave it blank rather than risk a wrong prefill (寧缺勿錯填). */
type Recognition = { top: BaseLayer | null; outer: OuterLayer | null };

/**
 * On web there is no Core ML / ML Kit, so recognition is simulated. Native builds
 * run the model on-device (photo never leaves the device) and return the same
 * shape; low-confidence layers come back as null.
 */
function recognizeOutfit(): Recognition {
  return { top: "帽T衛衣（單穿）", outer: "連帽外套" };
}

/**
 * RecordOutfitSheet — the 記錄今天穿搭 bottom sheet (Figma 226:3150).
 *
 * 主動線 (default): pick 上身基礎層 (required) + 外套疊搭層 (optional) → 儲存今日紀錄.
 * 輔助線 (optional): 拍照記錄 → on-device recognition prefills the labels and the
 * sheet enters a 待確認 state showing the thumbnail beside the prefilled tags for
 * comparison; everything stays editable and nothing auto-saves. The photo is kept
 * only as the next-day anchor thumbnail (source = "photo_confirmed").
 */
export function RecordOutfitSheet({
  initialTop = "長袖上衣",
  initialOuter = "薄外套",
  initialThumb,
  onSave,
}: RecordOutfitSheetProps) {
  const [base, setBase] = useState(initialTop);
  const [outer, setOuter] = useState(initialOuter);
  const [thumb, setThumb] = useState<string | null>(initialThumb ?? null);
  const [pending, setPending] = useState(Boolean(initialThumb));
  // Seeded thumbnail = a previously-saved today photo reopened via 更新穿搭 (not a
  // fresh recognition), so its hint is informational rather than a confirm prompt.
  const [hint, setHint] = useState<string | null>(
    initialThumb ? "幫你記得今天穿了什麼。" : null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumb(URL.createObjectURL(file));
    const r = recognizeOutfit();
    if (r.top) setBase(r.top);
    setOuter(r.outer ?? ""); // low confidence → leave blank
    setHint(
      r.outer
        ? "已依照片幫你選好標籤，對一下、不對就改。"
        : "外套看不太出來，先留空，請你手動選。",
    );
    setPending(true);
    e.target.value = ""; // allow re-picking the same file
  }

  function removePhoto() {
    setThumb(null);
    setPending(false);
    setHint(null);
  }

  function handleSave() {
    onSave?.({
      top: base,
      outer: outer || "不加外套",
      thumbnailRef: thumb,
      source: thumb ? "photo_confirmed" : "manual",
    });
  }

  return (
    <div className="yw-sheet">
      <span className="yw-sheet__handle" aria-hidden />
      <h2 className="yw-sheet__title">記錄今天穿搭</h2>

      {pending && thumb ? (
        <div className="yw-sheet__pending">
          <img className="yw-sheet__pending-thumb" src={thumb} alt="今日穿搭照片" />
          <div className="yw-sheet__pending-body">
            <p className="yw-sheet__pending-hint">
              {hint ?? "已依照片幫你選好標籤，對一下、不對就改。"}
            </p>
            <div className="yw-sheet__pending-labels">
              <span className="yw-sheet__pending-pill">{base}</span>
              {outer && outer !== "不加外套" ? (
                <span className="yw-sheet__pending-pill">{outer}</span>
              ) : null}
              {outer === "" ? (
                <span className="yw-sheet__pending-pill yw-sheet__pending-pill--empty">
                  外套待選
                </span>
              ) : null}
            </div>
            <button
              type="button"
              className="yw-sheet__pending-remove"
              onClick={removePhoto}
            >
              移除照片
            </button>
          </div>
        </div>
      ) : null}

      <div className="yw-sheet__section">
        <div className="yw-sheet__seclabel">
          <span className="yw-sheet__dot" aria-hidden />
          上身基礎層
          <SectionBadge label="必選" tone="required" />
        </div>
        <div className="yw-sheet__chips">
          {BASE_LAYER.map((label) => (
            <OutfitChip
              key={label}
              label={label}
              iconSrc={garmentIcon[label]}
              selected={base === label}
              onClick={() => setBase(label)}
            />
          ))}
        </div>
      </div>

      <div className="yw-sheet__section">
        <div className="yw-sheet__seclabel">
          <span className="yw-sheet__dot" aria-hidden />
          外套 / 疊搭層
          <SectionBadge label="可選" tone="optional" />
        </div>
        <div className="yw-sheet__chips">
          {OUTER_LAYER.map((label) => (
            <OutfitChip
              key={label}
              label={label}
              iconSrc={garmentIcon[label]}
              selected={outer === label}
              onClick={() => setOuter(label)}
            />
          ))}
        </div>
      </div>

      <div className="yw-sheet__actions">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={onPickPhoto}
        />
        <SecondaryButton
          label={thumb ? "重新拍照" : "拍照記錄"}
          icon={<Icon src={cameraUrl} size={18} />}
          onClick={() => fileRef.current?.click()}
        />
        <PrimaryButton
          label="儲存今日紀錄"
          icon={<Icon src={checkUrl} size={18} />}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
