import type { ReactNode } from "react";

import "./SecondaryButton.css";

export type SecondaryButtonProps = {
  label: string;
  /** Optional leading line icon. */
  icon?: ReactNode;
  disabled?: boolean;
  /** "pill" = fully rounded, 14px Bold on a white fill — the Home CTA once today
   *  is recorded (更新今日穿搭), same size as the PrimaryButton pill. */
  shape?: "rounded" | "pill";
  onClick?: () => void;
};

/**
 * SecondaryButton — outlined pill action, lower emphasis than PrimaryButton.
 * Source: Figma 記錄穿搭 Sheet (226:3150) 拍照記錄.
 */
export function SecondaryButton({
  label,
  icon,
  disabled = false,
  shape = "rounded",
  onClick,
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      className="yw-secondary-button"
      data-shape={shape}
      disabled={disabled}
      onClick={onClick}
    >
      {icon ? (
        <span className="yw-secondary-button__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  );
}
