import mascotPng from "../../assets/mascot/mascot.png";
import { MOCK_WEATHER, metricValue } from "../../app/weather";

/**
 * WelcomeStamp — the Step 1 hero, drawn as an illustrated postage stamp rather
 * than a literal widget screenshot. A perforated paper stamp sits on a warm
 * muted ground (washi tape + a passport-style postmark for craft), and inside it
 * the widget's real fields are stacked stamp-collage style: date pill → mascot +
 * 現在體感 → 比昨天 signal → 氣溫/濕度 → 昨日穿搭 → 出門/下班. All info the Lock
 * Widget shows is present; the composition just reads as an illustration.
 */

// Stamp geometry — fixed so the perforation circles stay round (no distortion).
const W = 256;
const H = 366;
const R = 12; // rounded corner
const STEP = 15; // perforation spacing

function perforations() {
  const cols = Math.round((W - 2 * R) / STEP);
  const rows = Math.round((H - 2 * R) / STEP);
  const holes: { cx: number; cy: number }[] = [];
  for (let i = 0; i <= cols; i++) {
    const x = R + (i * (W - 2 * R)) / cols;
    holes.push({ cx: x, cy: 0 }, { cx: x, cy: H });
  }
  for (let j = 0; j <= rows; j++) {
    const y = R + (j * (H - 2 * R)) / rows;
    holes.push({ cx: 0, cy: y }, { cx: W, cy: y });
  }
  return holes;
}

function Sun() {
  const rays = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <g transform="translate(208 58)">
      {rays.map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={Math.cos(r) * 20}
            y1={Math.sin(r) * 20}
            x2={Math.cos(r) * 27}
            y2={Math.sin(r) * 27}
            stroke="#111"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        );
      })}
      <circle r={15} fill="#f3c24c" stroke="#111" strokeWidth={2.8} />
      <circle cx={-5} cy={-1} r={1.5} fill="#111" />
      <circle cx={5} cy={-1} r={1.5} fill="#111" />
    </g>
  );
}

function Postmark() {
  return (
    <g transform="translate(224 330) rotate(-10)" opacity={0.42}>
      <circle r={25} fill="none" stroke="#111" strokeWidth={1.2} strokeDasharray="2 3" />
      <circle r={18} fill="none" stroke="#111" strokeWidth={1} />
      <text
        x={0}
        y={-4}
        textAnchor="middle"
        fontFamily="var(--yw-sys-font-mono)"
        fontSize={10}
        fill="#111"
      >
        8·20
      </text>
      <text
        x={0}
        y={7}
        textAnchor="middle"
        fontFamily="var(--yw-sys-font-mono)"
        fontSize={5}
        letterSpacing={1}
        fill="#111"
      >
        昨日
      </text>
    </g>
  );
}

function Pin() {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function WelcomeStamp() {
  const w = MOCK_WEATHER;
  const feels = w.nowTemp.replace(/°[CF]$/, "°"); // 現在體感
  const air = metricValue(w, "氣溫").replace(/°[CF]$/, "°");
  const humidity = metricValue(w, "濕度");
  const delta = metricValue(w, "較昨天"); // e.g. ↓3°
  const date = w.date.replace(/^·\s*/, ""); // 今天 週四 8/20
  const chips = ["長袖上衣", "薄外套"];
  const holes = perforations();

  return (
    <div className="yw-wstamp-ground">
      <div className="yw-wstamp">
        <svg
          className="yw-wstamp__paper"
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <mask id="yw-wstamp-perf">
              <rect x={0} y={0} width={W} height={H} rx={R} fill="#fff" />
              {holes.map((h, i) => (
                <circle key={i} cx={h.cx} cy={h.cy} r={4} fill="#000" />
              ))}
            </mask>
          </defs>
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
            rx={R}
            fill="#fffdfb"
            mask="url(#yw-wstamp-perf)"
          />
          {/* classic stamp inner frame */}
          <rect
            x={13}
            y={13}
            width={W - 26}
            height={H - 26}
            rx={6}
            fill="none"
            stroke="#111"
            strokeWidth={1}
            strokeDasharray="1.5 4"
            opacity={0.4}
          />
          {/* washi tape over the top edge */}
          <g transform={`translate(${W / 2} 8) rotate(-4)`}>
            <rect x={-44} y={-12} width={88} height={24} fill="#e7c88c" opacity={0.6} />
            <rect x={-44} y={-12} width={88} height={24} fill="none" stroke="#c9a866" strokeWidth={0.75} opacity={0.5} />
          </g>
          <Sun />
          <Postmark />
        </svg>

        <div className="yw-wstamp__content">
          <span className="yw-wstamp__date">{date}</span>
          <span className="yw-wstamp__loc">
            <Pin /> {w.location.toUpperCase()}
          </span>

          <div className="yw-wstamp__hero">
            <img className="yw-wstamp__bunny" src={mascotPng} alt="" width={44} />
            <div className="yw-wstamp__bigcol">
              <span className="yw-wstamp__biglabel">現在體感</span>
              <span className="yw-wstamp__big">{feels}</span>
            </div>
          </div>

          <span className="yw-wstamp__delta">
            {delta} 比昨天
          </span>

          <span className="yw-wstamp__metrics">
            氣溫 {air}　濕度 {humidity}
          </span>

          <span className="yw-wstamp__rule" />

          <div className="yw-wstamp__outfit">
            <span className="yw-wstamp__olabel">昨日穿搭</span>
            <span className="yw-wstamp__chips">
              {chips.map((c) => (
                <span key={c} className="yw-wstamp__chip">
                  {c}
                </span>
              ))}
            </span>
          </div>

          <span className="yw-wstamp__commute">
            {w.commute.map((c) => `${c.slot} 體感 ${c.temp}`).join("　")}
          </span>
        </div>
      </div>
    </div>
  );
}
