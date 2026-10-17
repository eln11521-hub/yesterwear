import { conditionLabel, weatherIcon, type WeatherIconName } from "./weatherIcons";
import "./WeatherIcon.css";

export type WeatherIconProps = {
  /** Weather icon name: sun / partly / rain / overcast / thunder / snow / fog / wind / hail. */
  condition: WeatherIconName;
  /** Rendered square size in px. */
  size?: number;
  /** Accessible label; defaults to the condition's 中文 label. */
  alt?: string;
};

/**
 * WeatherIcon — the brand's multi-color weather glyph set (晴天 / 多雲時晴 /
 * 雨天 / 陰天 / 雷雨 / 下雪 / 起霧 / 大風 / 冰雹), rendered as an <img> so its
 * colors are preserved. Used by the forecast rows, the hero condition line, and
 * the widgets. Source: Figma 20:2 (Weather Icon).
 */
export function WeatherIcon({ condition, size = 24, alt }: WeatherIconProps) {
  return (
    <img
      className="yw-weather-icon"
      src={weatherIcon[condition]}
      width={size}
      height={size}
      alt={alt ?? conditionLabel[condition]}
    />
  );
}
