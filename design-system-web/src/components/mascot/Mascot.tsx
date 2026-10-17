import type { DeltaState } from "../../app/weather";
import mascotNeutral from "../../assets/mascot/mascot.svg?url";
import "./Mascot.css";

/**
 * Art keyed on the temperature-delta axis (cold / neutral / warm) — the
 * product's core 昨日對比 promise. All three currently point at the same
 * neutral illustration; when cold/warm art lands, drop the files into
 * assets/mascot/ and swap the two references below. No screen code changes.
 */
const MASCOT_ART: Record<DeltaState, string> = {
  cold: mascotNeutral,
  neutral: mascotNeutral,
  warm: mascotNeutral,
};

export type MascotProps = {
  /** Rendered width in px (aspect ratio is preserved). */
  size?: number;
  /** Temperature-delta expression. Omit for the neutral illustration. */
  state?: DeltaState;
  alt?: string;
};

/**
 * Mascot — the brand illustration (兔子與太陽). Crisp transparent vector SVG
 * exported from Figma (Mascot component 504:209). Source: 174:2 插圖.
 * State-driven on the temperature-delta axis; defaults to the neutral art.
 */
export function Mascot({
  size = 108,
  state = "neutral",
  alt = "昨日天氣對比 吉祥物",
}: MascotProps) {
  return (
    <img
      className="yw-mascot"
      src={MASCOT_ART[state] ?? MASCOT_ART.neutral}
      width={size}
      alt={alt}
      data-state={state}
    />
  );
}
