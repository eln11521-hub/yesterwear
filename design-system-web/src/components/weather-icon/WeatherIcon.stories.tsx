import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import rainUmbrellaUrl from "../../assets/weather/rain-umbrella.svg?url";
import sunConditionUrl from "../../assets/weather/sun-condition.svg?url";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { WeatherIcon } from "./WeatherIcon";
import { conditionLabel } from "./weatherIcons";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
      fontFamily: "var(--yw-sys-font-ui)",
      color: "var(--yw-sys-color-text-primary)",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Weather Icon",
  component: WeatherIcon,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("weather-icon"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { condition: "sun", size: 40 },
  decorators: [paperDecorator],
} satisfies Meta<typeof WeatherIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

const cell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  color: "var(--yw-sys-color-text-muted)",
};

export const Default: Story = {};

/** The full weather icon set used across forecast, hero, and widgets. */
export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 28,
        alignItems: "flex-start",
        maxInlineSize: 420,
      }}
    >
      {(
        [
          "sun",
          "partly",
          "rain",
          "overcast",
          "thunder",
          "snow",
          "fog",
          "wind",
          "hail",
        ] as const
      ).map((c) => (
        <div key={c} style={cell}>
          <WeatherIcon condition={c} size={40} />
          <span>{conditionLabel[c]}</span>
          <code style={{ fontFamily: "var(--yw-sys-font-mono)", fontSize: 11 }}>
            {c}
          </code>
        </div>
      ))}
    </div>
  ),
};

/** Related weather glyphs that are not condition variants: the hero sun and the
 *  commute umbrella. */
export const RelatedGlyphs: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={cell}>
        <img src={sunConditionUrl} width={40} height={40} alt="晴天（hero）" />
        <span>晴天（hero）</span>
        <code style={{ fontFamily: "var(--yw-sys-font-mono)", fontSize: 11 }}>
          sun-condition
        </code>
      </div>
      <div style={cell}>
        <img src={rainUmbrellaUrl} width={40} height={40} alt="攜帶雨具" />
        <span>攜帶雨具</span>
        <code style={{ fontFamily: "var(--yw-sys-font-mono)", fontSize: 11 }}>
          rain-umbrella
        </code>
      </div>
    </div>
  ),
};
