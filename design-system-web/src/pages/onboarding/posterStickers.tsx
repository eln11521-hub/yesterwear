/* Loose felt-marker stickers for the Style B poster onboarding. Each is a puffy
   colored body + a black hand-drawn outline — no white edge, no shadow. */

const CREAM = "#eaddba";
const TAUPE = "#a2937d";
const ORANGE = "#f48b16";
const INK = "#1b1b1b";

/* Step 1 quadrant-collage palette (warm/dry ↔ cold/humid) */
const STRAW = "#e2c07a";
const SKY = "#a9c9d6";
const SLICKER = "#ecc24d";
const OAT = "#d7c39c";
const RIBBON = "#b8894e";

/** Colored body (puffed via same-color stroke) + black outline + detail slot. */
function Shape({
  d,
  color,
  children,
}: {
  d: string;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <path d={d} fill={color} stroke={color} strokeWidth={8} strokeLinejoin="round" />
      <path
        d={d}
        fill="none"
        stroke={INK}
        strokeWidth={4.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {children}
    </>
  );
}

const detail = {
  fill: "none",
  stroke: INK,
  strokeWidth: 3.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SweaterSticker({ color = CREAM }: { color?: string } = {}) {
  const D =
    "M 24 150 Q 32 96 58 46 Q 72 42 88 46 Q 110 64 132 46 Q 148 42 162 46 " +
    "Q 188 96 196 150 L 170 156 Q 164 120 150 92 L 150 186 Q 110 192 70 186 " +
    "L 70 92 Q 56 120 50 156 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 220 210" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d={D} fill={color} stroke={color} strokeWidth={11} strokeLinejoin="round" />
      <path d={D} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      <g {...detail}>
        <path d="M 88 54 Q 110 72 132 54" />
        <path d="M 72 176 Q 110 182 148 176" />
        <path d="M 27 148 L 47 154" />
        <path d="M 30 138 L 50 144" />
        <path d="M 193 148 L 173 154" />
        <path d="M 190 138 L 170 144" />
      </g>
      <g fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.35}>
        <path d="M 92 96 L 92 174" />
        <path d="M 110 92 L 110 178" />
        <path d="M 128 96 L 128 174" />
      </g>
    </svg>
  );
}

export function SockSticker() {
  const D =
    "M 44 16 L 76 16 L 78 100 Q 80 120 64 126 Q 34 138 16 128 " +
    "Q 6 122 12 110 Q 30 104 46 96 L 44 16 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={ORANGE}>
        <g {...detail}>
          {/* cuff ribbing */}
          <path d="M 46 26 L 74 26" />
          <path d="M 46 34 L 75 34" />
          {/* heel + knit hints */}
          <path d="M 60 96 Q 70 108 62 120" />
        </g>
        <g fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" opacity={0.3}>
          <path d="M 55 42 L 57 92" />
          <path d="M 66 42 L 68 90" />
        </g>
      </Shape>
    </svg>
  );
}

export function PinSticker() {
  const D =
    "M 60 12 C 30 12 14 36 14 60 C 14 96 60 140 60 140 C 60 140 106 96 106 60 " +
    "C 106 36 90 12 60 12 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={CREAM}>
        <circle cx={60} cy={58} r={16} fill="none" stroke={INK} strokeWidth={3.4} />
      </Shape>
    </svg>
  );
}

export function BellSticker() {
  const D =
    "M 65 20 C 42 20 36 44 36 68 C 36 92 24 100 20 110 L 110 110 " +
    "C 106 100 94 92 94 68 C 94 44 88 20 65 20 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 130 140" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={TAUPE}>
        <g {...detail}>
          <path d="M 65 12 L 65 20" />
          <path d="M 54 118 Q 65 130 76 118" />
        </g>
      </Shape>
    </svg>
  );
}

export function WidgetSticker() {
  const D =
    "M 26 22 L 104 22 Q 116 22 116 34 L 116 104 Q 116 116 104 116 " +
    "L 26 116 Q 14 116 14 104 L 14 34 Q 14 22 26 22 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 130 138" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={CREAM}>
        <g {...detail}>
          {/* little sun */}
          <circle cx={44} cy={52} r={11} />
          <path d="M 44 33 L 44 37" />
          <path d="M 44 67 L 44 71" />
          <path d="M 25 52 L 29 52" />
          <path d="M 59 52 L 63 52" />
          {/* widget text lines */}
          <path d="M 30 88 L 100 88" />
          <path d="M 30 100 L 78 100" />
        </g>
      </Shape>
    </svg>
  );
}

export function CheckSticker() {
  const D = "M 65 12 A 53 53 0 1 0 65 118 A 53 53 0 1 0 65 12 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={TAUPE}>
        <path
          d="M 42 66 L 58 82 L 90 46"
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Shape>
    </svg>
  );
}

/* -------- Step 1 quadrant collage: original clothing motifs -------- */

/** Short-sleeve tee — warm + humid (muggy). */
export function TeeSticker() {
  const D =
    "M 62 30 Q 90 46 118 30 L 146 44 L 168 78 L 144 92 L 138 82 " +
    "L 138 150 L 42 150 L 42 82 L 36 92 L 12 78 L 34 44 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 180 162" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={SKY}>
        <path d="M 62 30 Q 90 48 118 30" {...detail} />
        <g fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={0.32}>
          <path d="M 60 146 L 120 146" />
          <path d="M 90 96 L 90 142" />
        </g>
      </Shape>
    </svg>
  );
}

/** Wide-brim sun hat — warm + dry (sunny). */
export function SunHatSticker() {
  const CROWN = "M 54 96 Q 50 44 92 42 Q 134 44 130 96 Z";
  const DOME = "M 54 92 Q 50 44 92 42 Q 134 44 130 92";
  return (
    <svg className="yw-sticker" viewBox="0 0 184 132" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* colored bodies (crown first, brim over its base) */}
      <path d={CROWN} fill={STRAW} stroke={STRAW} strokeWidth={8} strokeLinejoin="round" />
      <ellipse cx={92} cy={98} rx={82} ry={22} fill={STRAW} stroke={STRAW} strokeWidth={8} />
      {/* ink outlines */}
      <path d={DOME} fill="none" stroke={INK} strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={92} cy={98} rx={82} ry={22} fill="none" stroke={INK} strokeWidth={4.4} />
      {/* ribbon band */}
      <path d="M 56 86 Q 92 100 128 86" fill="none" stroke={RIBBON} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
}

/** Hooded raincoat / parka — cold + humid (rainy). */
export function RaincoatSticker() {
  const D =
    "M 60 36 Q 86 22 112 36 L 140 60 L 150 152 L 22 152 L 32 60 Z";
  return (
    <svg className="yw-sticker" viewBox="0 0 172 168" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <Shape d={D} color={SLICKER}>
        <g {...detail}>
          {/* hood opening + center zipper */}
          <path d="M 74 44 Q 86 60 98 44" />
          <path d="M 86 54 L 86 150" />
          {/* arm seams */}
          <path d="M 60 58 L 50 150" />
          <path d="M 112 58 L 122 150" />
        </g>
        {/* buttons */}
        <g fill={INK}>
          <circle cx={86} cy={84} r={3.4} />
          <circle cx={86} cy={110} r={3.4} />
          <circle cx={86} cy={136} r={3.4} />
        </g>
      </Shape>
    </svg>
  );
}
