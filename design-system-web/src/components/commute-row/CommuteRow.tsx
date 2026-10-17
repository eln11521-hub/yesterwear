import type { CSSProperties } from "react";

import "./CommuteRow.css";

export type CommuteRowProps = {
  /** Slot label, e.g. 出門 */
  slot: string;
  /** Time, e.g. 08:00 */
  time: string;
  /** Temperature, e.g. 16° */
  temp: string;
  /** Delta vs. yesterday, e.g. ↓2° (colored by direction). */
  delta: string;
};

function deltaColor(d: string): string {
  if (d.includes("↓")) return "var(--yw-sys-color-delta-cold)";
  if (d.includes("↑")) return "var(--yw-sys-color-delta-warm)";
  return "var(--yw-sys-color-delta-neutral)";
}

/**
 * CommuteRow — a commute time slot. Centered column: IBM Plex Mono slot label
 * (#8c8680 10.5px), DM Sans Bold 24px temp, and 較昨日 + a state-colored delta.
 * Source: Figma 174:53.
 */
export function CommuteRow({ slot, time, temp, delta }: CommuteRowProps) {
  return (
    <div className="yw-commute-row">
      <span className="yw-commute-row__slot">
        {slot} {time}
      </span>
      <span className="yw-commute-row__temp">{temp}</span>
      <span className="yw-commute-row__delta">
        較昨日{" "}
        <span
          className="yw-commute-row__delta-val"
          style={{ color: deltaColor(delta) } as CSSProperties}
        >
          {delta}
        </span>
      </span>
    </div>
  );
}
