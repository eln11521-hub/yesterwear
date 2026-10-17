import type { ReactNode } from "react";

import "./FloatingNav.css";

export type FloatingNavItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

export type FloatingNavProps = {
  items: FloatingNavItem[];
  activeId: string;
  onSelect?: (id: string) => void;
};

/**
 * FloatingNav — detached bottom navigation pill. The active tab is an ink
 * rounded-rect with icon + white label; inactive tabs are quiet. Source: Figma 174:2.
 */
export function FloatingNav({ items, activeId, onSelect }: FloatingNavProps) {
  return (
    <nav className="yw-floating-nav">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className="yw-floating-nav__item"
            data-active={active}
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect?.(item.id)}
          >
            <span className="yw-floating-nav__icon" aria-hidden>
              {item.icon}
            </span>
            <span className="yw-floating-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
