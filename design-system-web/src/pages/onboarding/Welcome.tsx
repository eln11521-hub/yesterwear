import { useState } from "react";

import mascotWelcome from "../../assets/mascot/mascot-welcome.svg?url";
import "./Welcome.css";

/** Decorative swoosh (Figma 483:637), placed at the node's x=188 y=107. */
const DECO =
  "M 0 238.15 C 16.48 230.45 97.76 226.68 207.71 224.42 C 246.90 223.61 255.15 233.42 258.93 237.79 C 276.07 257.62 278.91 261.17 279.92 293.65 C 280.75 320.27 255.59 339.53 250.85 344.00 C 226.90 366.60 187.93 374.09 158.87 357.95 C 132.43 343.26 131.10 321.54 131.19 303.53 C 131.30 281.50 141.45 251.99 159.74 214.87 C 185.33 173.24 219.07 129.68 264.74 83.39 C 291.67 58.19 326.22 29.53 361.83 0";

export type WelcomeProps = {
  /** Called once the native permission prompts have been answered. */
  onDone?: () => void;
};

/**
 * Welcome — the single-screen onboarding (Figma 481:30). Orange splash with the
 * 兔子與太陽 mascot. "Get started" asks for location + notification access through
 * the browser/OS **native** permission dialogs, then completes onboarding.
 */
export function Welcome({ onDone }: WelcomeProps) {
  const [busy, setBusy] = useState(false);

  async function requestLocation() {
    if (!("geolocation" in navigator)) return;
    // Triggers the native location permission prompt; resolve either way.
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        () => resolve(),
        { timeout: 10000, maximumAge: 0 },
      );
    });
  }

  async function requestNotifications() {
    if (!("Notification" in window)) return;
    // Triggers the native notification permission prompt.
    try {
      await Notification.requestPermission();
    } catch {
      /* Older Safari uses a callback signature — ignore and move on. */
    }
  }

  async function handleStart() {
    if (busy) return;
    setBusy(true);
    await requestLocation();
    await requestNotifications();
    setBusy(false);
    onDone?.();
  }

  return (
    <div className="yw-welcome">
      <svg
        className="yw-welcome__deco"
        viewBox="0 0 340 720"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g transform="translate(188 107)">
          <path
            d={DECO}
            stroke="#ffffff"
            strokeOpacity={0.2}
            strokeWidth={20}
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className="yw-welcome__head">
        <h1 className="yw-welcome__title">Yesterwear</h1>
        <p className="yw-welcome__subtitle">Dress by yesterday</p>
      </div>

      <div className="yw-welcome__art">
        <img
          className="yw-welcome__mascot"
          src={mascotWelcome}
          alt="Yesterwear 吉祥物"
        />
      </div>

      <p className="yw-welcome__body">
        Stop guessing the degrees — just dress warmer or cooler than yesterday.
      </p>

      <button
        type="button"
        className="yw-welcome__cta"
        onClick={handleStart}
        disabled={busy}
      >
        {busy ? "Setting up…" : "Get started"}
      </button>
    </div>
  );
}
