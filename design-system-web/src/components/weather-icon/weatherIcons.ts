import fog from "../../assets/weather/fog.svg?url";
import hail from "../../assets/weather/hail.svg?url";
import overcast from "../../assets/weather/overcast.svg?url";
import partly from "../../assets/weather/partly.svg?url";
import rain from "../../assets/weather/rain.svg?url";
import snow from "../../assets/weather/snow.svg?url";
import sun from "../../assets/weather/sun.svg?url";
import thunder from "../../assets/weather/thunder.svg?url";
import wind from "../../assets/weather/wind.svg?url";
import type { Condition } from "../../app/weather";

/**
 * WeatherIconName — the full icon set. A superset of the forecast `Condition`
 * (sun / partly / rain); the extra names are available as library glyphs even
 * though the forecast logic only produces the base three.
 */
export type WeatherIconName = Condition | "wind" | "hail";

/** Weather name → real Figma multi-color icon SVG (node 20:2 Weather Icon set). */
export const weatherIcon: Record<WeatherIconName, string> = {
  sun,
  partly,
  rain,
  overcast,
  thunder,
  snow,
  fog,
  wind,
  hail,
};

/** Human label per icon, for documentation / alt text. */
export const conditionLabel: Record<WeatherIconName, string> = {
  sun: "晴天",
  partly: "多雲時晴",
  rain: "雨天",
  overcast: "陰天／多雲",
  thunder: "雷雨",
  snow: "下雪",
  fog: "起霧",
  wind: "大風",
  hail: "冰雹",
};
