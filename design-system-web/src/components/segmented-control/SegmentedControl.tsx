import "./SegmentedControl.css";

export type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange?: (value: T) => void;
  /** Track colour: "raised" on the paper ground (Settings), "inset" on a raised card. */
  tone?: "raised" | "inset";
  /** Accessible name of the group. */
  label?: string;
};

/**
 * SegmentedControl — 2–3 equal segments on a rounded track; the active one is a
 * white pill (Figma 497:137). Used for Settings' 定位方式 / 溫度單位 and the Home
 * 各時段體感溫度 tabs.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  tone = "raised",
  label,
}: SegmentedControlProps<T>) {
  return (
    <div className="yw-segmented" data-tone={tone} role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className="yw-segmented__seg"
          data-active={o.value === value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
