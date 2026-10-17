import figma from "@figma/code-connect";

import { WeatherIcon } from "./WeatherIcon";

/**
 * Code Connect: Figma「Weather Icon」variant set (507:284) ←→ React WeatherIcon.
 * Variant `Condition` Sun/Partly/Rain maps to the React `condition` prop.
 */
figma.connect(
  WeatherIcon,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=507-284",
  {
    props: {
      condition: figma.enum("Condition", {
        Sun: "sun",
        Partly: "partly",
        Rain: "rain",
        Overcast: "overcast",
        Thunder: "thunder",
        Snow: "snow",
        Fog: "fog",
        Wind: "wind",
        Hail: "hail",
      }),
    },
    example: ({ condition }) => <WeatherIcon condition={condition} />,
  },
);
