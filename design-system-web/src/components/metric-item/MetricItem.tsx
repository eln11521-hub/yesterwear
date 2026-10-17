import "./MetricItem.css";

export type MetricItemProps = {
  /** Small label, e.g. 濕度 */
  label: string;
  /** Reading, e.g. 65% / ↓3° / 16°C */
  value: string;
};

/**
 * MetricItem — a compact label-over-value pair used in the home hero grid
 * (降雨 / 濕度 / 較昨天 / 體感). Source: Figma 174:2.
 */
export function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div className="yw-metric-item">
      <span className="yw-metric-item__label">{label}</span>
      <span className="yw-metric-item__value">{value}</span>
    </div>
  );
}
