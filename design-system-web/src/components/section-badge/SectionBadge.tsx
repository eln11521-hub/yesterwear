import "./SectionBadge.css";

export type SectionBadgeProps = {
  label: string;
  /** required → warm tint (必選); optional → neutral (可選). */
  tone?: "required" | "optional";
};

/**
 * SectionBadge — a small status badge shown beside a section label.
 * Source: Figma 226:3150 (必選 / 可選). Tint derived from the warm delta token
 * (exact Figma fill to be confirmed).
 */
export function SectionBadge({ label, tone = "required" }: SectionBadgeProps) {
  return (
    <span className="yw-section-badge" data-tone={tone}>
      {label}
    </span>
  );
}
