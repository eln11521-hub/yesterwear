import type { CSSProperties } from "react";

import "./Icon.css";

/**
 * Icon — renders a monochrome SVG (imported as a URL) via CSS mask so it inherits
 * `currentColor`. Use for line icons that must recolor with state (e.g. white when
 * a chip or nav item is active). For multi-color art (e.g. the rain icon) use <img>.
 */
export function Icon({
  src,
  size = 16,
  className,
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  const style = {
    width: size,
    height: size,
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
  } as CSSProperties;
  return (
    <span
      className={`yw-icon${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden
    />
  );
}
