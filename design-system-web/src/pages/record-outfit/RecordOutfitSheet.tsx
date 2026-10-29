import { useRef, useState } from "react";

import cameraUrl from "../../assets/icon/camera.svg?url";
import checkUrl from "../../assets/icon/check.svg?url";
import { EMPTY_PICKS, OUTFIT_GROUPS, type OutfitPicks } from "../../app/outfit";
import { Icon } from "../../components/_ui/Icon";
import { garmentIcon } from "../../components/outfit-chip/garments";
import { OutfitChip } from "../../components/outfit-chip/OutfitChip";
import { PrimaryButton } from "../../components/primary-button/PrimaryButton";
import { SecondaryButton } from "../../components/secondary-button/SecondaryButton";
import { SectionBadge } from "../../components/section-badge/SectionBadge";
import "./RecordOutfitSheet.css";

export type RecordOutfitSheetProps = {
  /** Pre-selected items per group (today's record, else today's suggestion). */
  initial?: Partial<OutfitPicks>;
  /** Seed the 待確認 (pending) state with an already-attached thumbnail — used by
   *  stories/previews to show the photo-confirmation step (real capture goes
   *  through 拍照記錄). */
  initialThumb?: string;
  onSave?: (
    record: OutfitPicks & {
      thumbnailRef: string | null;
      source: "manual" | "photo_confirmed";
    },
  ) => void;
};

/** On-device recognition result. A layer left `null` = confidence below threshold,
 *  so we leave it blank rather than risk a wrong prefill (寧缺勿錯填). */
type Recognition = { tops: string[] | null; outers: string[] | null };

/**
 * On web there is no Core ML / ML Kit, so recognition is simulated. Native builds
 * run the model on-device (photo never leaves the device) and return the same
 * shape; low-confidence layers come back as null.
 */
function recognizeOutfit(): Recognition {
  return { tops: ["帽T衛衣"], outers: ["連帽外套"] };
}

type GroupKey = keyof OutfitPicks;

/**
 * RecordOutfitSheet — the 記錄今天穿搭 bottom sheet (Figma 226:3150).
 *
 * 主動線 (default): toggle any number of items in 上身 (at least one) / 外套 /
 * 下身 / 配件 → 儲存今日紀錄. The sheet has a fixed height: the title stays on top,
 * the actions stay at the bottom and only the chip groups scroll.
 * 輔助線 (optional): 拍照記錄 → on-device recognition prefills the labels and the
 * sheet enters a 待確認 state showing the thumbnail beside the prefilled tags for
 * comparison; everything stays editable and nothing auto-saves. The photo is kept
 * only as the next-day anchor thumbnail (source = "photo_confirmed").
 */
export function RecordOutfitSheet({
  initial = { tops: ["長袖上衣"], outers: ["薄外套"] },
  initialThumb,
  onSave,
}: RecordOutfitSheetProps) {
  const [picks, setPicks] = useState<OutfitPicks>({ ...EMPTY_PICKS, ...initial });
  const [thumb, setThumb] = useState<string | null>(initialThumb ?? null);
  const [pending, setPending] = useState(Boolean(initialThumb));
  // Recognition couldn't tell the outer layer → show 外套待選 until one is picked.
  const [outerUnsure, setOuterUnsure] = useState(false);
  // Seeded thumbnail = a previously-saved today photo reopened via 更新穿搭 (not a
  // fresh recognition), so its hint is informational rather than a confirm prompt.
  const [hint, setHint] = useState<string | null>(
    initialThumb ? "幫你記得今天穿了什麼。" : null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function toggle(group: GroupKey, label: string) {
    setPicks((prev) => {
      const on = prev[group].includes(label);
      // 上身 must keep at least one item.
      if (on && group === "tops" && prev.tops.length === 1) return prev;
      const order = OUTFIT_GROUPS.find((g) => g.key === group)!.items as readonly string[];
      const next = on ? prev[group].filter((x) => x !== label) : [...prev[group], label];
      next.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      return { ...prev, [group]: next };
    });
    if (group === "outers") setOuterUnsure(false);
  }

  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumb(URL.createObjectURL(file));
    const r = recognizeOutfit();
    setPicks((prev) => ({
      ...prev,
      tops: r.tops ?? prev.tops,
      outers: r.outers ?? [], // low confidence → leave blank
    }));
    setOuterUnsure(!r.outers);
    setHint(
      r.outers
        ? "已依照片幫你選好標籤，對一下、不對就改。"
        : "外套看不太出來，先留空，請你手動選。",
    );
    setPending(true);
    e.target.value = ""; // allow re-picking the same file
  }

  function removePhoto() {
    setThumb(null);
    setPending(false);
    setOuterUnsure(false);
    setHint(null);
  }

  function handleSave() {
    onSave?.({
      ...picks,
      thumbnailRef: thumb,
      source: thumb ? "photo_confirmed" : "manual",
    });
  }

  return (
    <div className="yw-sheet">
      <div className="yw-sheet__head">
        <span className="yw-sheet__handle" aria-hidden />
        <h2 className="yw-sheet__title">記錄今天穿搭</h2>
        <p className="yw-sheet__sub">每一區都可以複選，上身至少選一件。</p>
      </div>

      <div className="yw-sheet__body">
        {pending && thumb ? (
          <div className="yw-sheet__pending">
            <img className="yw-sheet__pending-thumb" src={thumb} alt="今日穿搭照片" />
            <div className="yw-sheet__pending-body">
              <p className="yw-sheet__pending-hint">
                {hint ?? "已依照片幫你選好標籤，對一下、不對就改。"}
              </p>
              <div className="yw-sheet__pending-labels">
                {[...picks.tops, ...picks.outers].map((label) => (
                  <span key={label} className="yw-sheet__pending-pill">
                    {label}
                  </span>
                ))}
                {outerUnsure ? (
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

        {OUTFIT_GROUPS.map((g) => (
          <div key={g.key} className="yw-sheet__section">
            <div className="yw-sheet__seclabel">
              <span className="yw-sheet__dot" aria-hidden />
              {g.label}
              <SectionBadge
                label={g.required ? "必選" : "可選"}
                tone={g.required ? "required" : "optional"}
              />
              {picks[g.key].length ? (
                <span className="yw-sheet__count">已選 {picks[g.key].length}</span>
              ) : null}
            </div>
            <div className="yw-sheet__chips" role="group" aria-label={g.label}>
              {g.items.map((label) => (
                <OutfitChip
                  key={label}
                  label={label}
                  iconSrc={garmentIcon[label]}
                  selected={picks[g.key].includes(label)}
                  onClick={() => toggle(g.key, label)}
                />
              ))}
            </div>
          </div>
        ))}
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
