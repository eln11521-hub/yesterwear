import arrowUrl from "../../assets/icon/arrow-right.svg?url";
import { Icon } from "../_ui/Icon";
import "./WidgetPromoCard.css";

export type WidgetPromoCardProps = {
  title: string;
  subtitle: string;
  onAction?: () => void;
};

/**
 * WidgetPromoCard — warm promo banner (bg #f5c88a) prompting the user to add the
 * home-screen widget, with a trailing ink circular action. Source: Figma 174:200.
 */
export function WidgetPromoCard({
  title,
  subtitle,
  onAction,
}: WidgetPromoCardProps) {
  return (
    <div className="yw-widget-promo-card">
      <span className="yw-widget-promo-card__deco" aria-hidden>
      <svg
        className="yw-widget-promo-card__curve"
        viewBox="0 0 128 124"
        fill="none"
        overflow="visible"
      >
        <path
          d="M 0 83.82 C 5.80 81.11 34.41 79.78 73.11 78.98 C 86.90 78.70 89.80 82.15 91.13 83.69 C 97.16 90.67 97.28 96.25 97.23 109.92 C 97.22 113.07 95.58 114.91 93.91 116.48 C 85.48 124.44 63.46 123.56 51.85 122.07 C 46.67 121.40 46.14 113.17 46.17 106.83 C 46.21 99.08 49.79 88.69 56.22 75.62 C 65.23 60.97 77.10 45.64 93.18 29.35 C 102.65 20.48 114.82 10.39 127.35 0"
          stroke="#ffffff"
          strokeOpacity={0.43}
          strokeWidth={20}
          strokeLinecap="round"
        />
      </svg>
      </span>
      <div className="yw-widget-promo-card__text">
        <p className="yw-widget-promo-card__title">{title}</p>
        <p className="yw-widget-promo-card__subtitle">{subtitle}</p>
      </div>
      <button
        type="button"
        className="yw-widget-promo-card__action"
        aria-label={title}
        onClick={onAction}
      >
        <Icon src={arrowUrl} size={18} />
      </button>
    </div>
  );
}
