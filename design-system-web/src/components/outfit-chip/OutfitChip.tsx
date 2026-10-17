import { Icon } from "../_ui/Icon";
import "./OutfitChip.css";

export type OutfitChipProps = {
  /** Garment label, e.g. 長袖上衣 */
  label: string;
  /** Garment icon SVG url (see garments.ts). */
  iconSrc?: string;
  /** Selected chips fill with ink; unselected are outlined. */
  selected?: boolean;
  /** Compact display style used on the home screen (smaller, muted label). */
  compact?: boolean;
  onClick?: () => void;
};

/**
 * OutfitChip — selectable garment pill. Default = sheet style (icon 16, ink label
 * 14px, py 9); `compact` = home style (icon 14, #8c8680 label 13px, py 6). Selected =
 * ink fill, white label + icon. Source: Figma 226:3150 / 173:2919.
 */
export function OutfitChip({
  label,
  iconSrc,
  selected = false,
  compact = false,
  onClick,
}: OutfitChipProps) {
  return (
    <button
      type="button"
      className="yw-outfit-chip"
      data-selected={selected}
      data-compact={compact}
      aria-pressed={selected}
      onClick={onClick}
    >
      {iconSrc ? <Icon src={iconSrc} size={compact ? 14 : 16} /> : null}
      <span className="yw-outfit-chip__label">{label}</span>
    </button>
  );
}
