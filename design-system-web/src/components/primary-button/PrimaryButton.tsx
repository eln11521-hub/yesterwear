import type { ReactNode } from "react";

import "./PrimaryButton.css";

export type PrimaryButtonProps = {
  label: string;
  /** Optional leading line icon. */
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

/**
 * PrimaryButton — the primary call-to-action: ink-filled pill, white label,
 * optional line icon. Source: Figma 174:2 記錄今天穿搭 / 226:3150 儲存今日紀錄.
 */
export function PrimaryButton({
  label,
  icon,
  disabled = false,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className="yw-primary-button"
      disabled={disabled}
      onClick={onClick}
    >
      {icon ? (
        <span className="yw-primary-button__icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  );
}
