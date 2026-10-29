import "./CommuteRow.css";

export type CommuteRowProps = {
  /** Slot label, e.g. 出門 */
  slot: string;
  /** Time, e.g. 08:00 */
  time: string;
  /** Temperature, e.g. 16° */
  temp: string;
  /** Delta vs. yesterday, e.g. ↓2°. */
  delta: string;
};

/**
 * CommuteRow — a commute time slot. Centered column: IBM Plex Mono slot label
 * (#8c8680 10.5px), DM Sans Bold 24px temp, and a muted 較昨日 delta line.
 * Source: Figma Commute Row 504:231.
 */
export function CommuteRow({ slot, time, temp, delta }: CommuteRowProps) {
  return (
    <div className="yw-commute-row">
      <span className="yw-commute-row__slot">
        {slot} {time}
      </span>
      <span className="yw-commute-row__temp">{temp}</span>
      <span className="yw-commute-row__delta">較昨日 {delta}</span>
    </div>
  );
}
