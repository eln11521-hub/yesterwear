import type { ReactNode } from "react";

import "./Poster.css";

export type PosterVariant = "dark" | "light" | "cream";

export type PosterStepProps = {
  bg: string;
  kicker: string;
  headline: ReactNode;
  caption: string;
  /** The sticker art (single sticker or a collage). */
  children: ReactNode;
  stepIndex: number;
  total: number;
  cta: string;
  onNext: () => void;
  onBack?: () => void;
  /** "dark" = full-bleed photo poster; "light" = cream ground + framed photo card. */
  variant?: PosterVariant;
};

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" className="yw-poster__back" onClick={onBack} aria-label="上一步">
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

function Footer({
  stepIndex,
  total,
  cta,
  onNext,
}: Pick<PosterStepProps, "stepIndex" | "total" | "cta" | "onNext">) {
  return (
    <div className="yw-poster__footer">
      <div className="yw-poster__dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className="yw-poster__dot" data-active={i === stepIndex} />
        ))}
      </div>
      <button type="button" className="yw-poster__btn" onClick={onNext}>
        {cta}
      </button>
    </div>
  );
}

/** Shared Style-B poster layout. Dark = full-bleed photo; light = framed photo card. */
export function PosterStep({
  bg,
  kicker,
  headline,
  caption,
  children,
  stepIndex,
  total,
  cta,
  onNext,
  onBack,
  variant = "dark",
}: PosterStepProps) {
  const footer = <Footer stepIndex={stepIndex} total={total} cta={cta} onNext={onNext} />;

  if (variant === "cream") {
    return (
      <div className="yw-poster yw-poster--cream">
        {onBack ? <BackButton onBack={onBack} /> : null}
        <div className="yw-poster__content">
          <span className="yw-poster__kicker">{kicker}</span>
          <h1 className="yw-poster__headline">{headline}</h1>
          <div className="yw-poster__art yw-poster__art--chart">{children}</div>
          <p className="yw-poster__caption">{caption}</p>
        </div>
        {footer}
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className="yw-poster yw-poster--light">
        {onBack ? <BackButton onBack={onBack} /> : null}
        <div className="yw-poster__content">
          <span className="yw-poster__kicker">{kicker}</span>
          <h1 className="yw-poster__headline">{headline}</h1>
          <div className="yw-poster__photocard">
            <img src={bg} alt="" />
            <div className="yw-poster__cardart">{children}</div>
          </div>
          <p className="yw-poster__caption">{caption}</p>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="yw-poster">
      <img className="yw-poster__bg" src={bg} alt="" />
      <div className="yw-poster__veil" />
      {onBack ? <BackButton onBack={onBack} /> : null}
      <div className="yw-poster__content">
        <span className="yw-poster__kicker">{kicker}</span>
        <h1 className="yw-poster__headline">{headline}</h1>
        <div className="yw-poster__art">{children}</div>
        <p className="yw-poster__caption">{caption}</p>
      </div>
      {footer}
    </div>
  );
}
