import type { ReactNode } from "react";

import "./SecondaryButton.css";

export type SecondaryButtonProps = {
  label: string;
  /** Optional leading line icon. */
  icon?: ReactNode;
  disabled?: boolean;
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
  onClick,
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      className="yw-secondary-button"
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
