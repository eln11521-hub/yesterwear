import { type ReactNode, useState } from "react";

import mapleUrl from "../../assets/photo/autumn-sky.jpg";
import { PosterStep, type PosterVariant } from "./PosterStep";
import {
  BellSticker,
  CheckSticker,
  PinSticker,
  RaincoatSticker,
  SunHatSticker,
  SweaterSticker,
  TeeSticker,
  WidgetSticker,
} from "./posterStickers";

type StepDef = {
  kicker: string;
  headline: ReactNode;
  caption: string;
  cta: string;
  art: ReactNode;
  variant?: PosterVariant;
};

const STEPS: StepDef[] = [
  {
    kicker: "Yesterday Weather · Step 01",
    variant: "cream",
    headline: (
      <>
        dress by
        <br />
        yesterday
      </>
    ),
    caption:
      "Stop guessing the degrees — just dress warmer or cooler than yesterday.",
    cta: "Get started",
    art: (
      <div className="yw-poster__quad" aria-hidden>
        <span className="yw-poster__quad-line yw-poster__quad-line--v" />
        <span className="yw-poster__quad-line yw-poster__quad-line--h" />
        <span className="yw-poster__quad-lbl yw-poster__quad-lbl--top">warm</span>
        <span className="yw-poster__quad-lbl yw-poster__quad-lbl--bottom">cold</span>
        <span className="yw-poster__quad-lbl yw-poster__quad-lbl--left">dry</span>
        <span className="yw-poster__quad-lbl yw-poster__quad-lbl--right">humid</span>
        <div className="yw-poster__quad-item yw-poster__quad-item--tl">
          <SunHatSticker />
        </div>
        <div className="yw-poster__quad-item yw-poster__quad-item--tr">
          <TeeSticker />
        </div>
        <div className="yw-poster__quad-item yw-poster__quad-item--bl">
          <SweaterSticker color="#d7c39c" />
        </div>
        <div className="yw-poster__quad-item yw-poster__quad-item--br">
          <RaincoatSticker />
        </div>
      </div>
    ),
  },
  {
    kicker: "Location · Step 02",
    variant: "light",
    headline: (
      <>
        where
        <br />
        are you?
      </>
    ),
    caption:
      "We use your spot only to pull today's and yesterday's weather. Nothing else, ever.",
    cta: "Next",
    art: (
      <div className="yw-poster__cardpin">
        <PinSticker />
      </div>
    ),
  },
  {
    kicker: "Alerts · Step 03",
    headline: (
      <>
        Open the
        <br />
        notification
      </>
    ),
    caption:
      "A heads-up before you head out — warmer, colder, or rain. Skip it; the widget still works.",
    cta: "Next",
    art: (
      <div className="yw-poster__solo yw-poster__solo--bell">
        <BellSticker />
      </div>
    ),
  },
  {
    kicker: "Widget · Step 04",
    headline: (
      <>
        meet the
        <br />
        widget
      </>
    ),
    caption:
      "Lock screen stays minimal. Home screen shifts color with today's swing against yesterday.",
    cta: "Next",
    art: (
      <div className="yw-poster__solo yw-poster__solo--widget">
        <WidgetSticker />
      </div>
    ),
  },
  {
    kicker: "All set · Step 05",
    headline: (
      <>
        you're
        <br />
        all set
      </>
    ),
    caption:
      "Long-press the home screen, hit +, search Yesterday Weather, and drop it in. Done.",
    cta: "Done",
    art: (
      <div className="yw-poster__solo yw-poster__solo--check">
        <CheckSticker />
      </div>
    ),
  },
];

/**
 * PosterFlow — the full 5-step Style B onboarding proposal. Click through with
 * Next / back. Photo + grotesque headline + mono body + felt-marker stickers.
 */
export function PosterFlow() {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const s = STEPS[step];
  const isLast = step === total - 1;

  return (
    <PosterStep
      bg={mapleUrl}
      kicker={s.kicker}
      headline={s.headline}
      caption={s.caption}
      cta={s.cta}
      variant={s.variant}
      stepIndex={step}
      total={total}
      onNext={() => setStep(isLast ? 0 : step + 1)}
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
    >
      {s.art}
    </PosterStep>
  );
}
