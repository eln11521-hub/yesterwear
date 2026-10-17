import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { ForecastRow } from "./ForecastRow";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      maxWidth: 360,
      borderRadius: 16,
      fontFamily: "var(--yw-sys-font-ui)",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Forecast Row",
  component: ForecastRow,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("forecast-row"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    day: "今天",
    condition: "sun",
    low: 11,
    high: 18,
    weekMin: 9,
    weekMax: 20,
  },
  decorators: [paperDecorator],
} satisfies Meta<typeof ForecastRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The 未來一週天氣 list from the home screen. */
export const WeeklyForecast: Story = {
  render: () => {
    const week = [
      { day: "今天", condition: "partly", low: 11, high: 18, current: 16 },
      { day: "週五", condition: "sun", low: 13, high: 20 },
      { day: "週六", condition: "overcast", low: 12, high: 19 },
      { day: "週日", condition: "fog", low: 12, high: 19 },
      { day: "週一", condition: "rain", low: 12, high: 19, pop: 55 },
      { day: "週二", condition: "thunder", low: 12, high: 19, pop: 70 },
      { day: "週三", condition: "snow", low: 2, high: 9, pop: 60 },
      { day: "週四", condition: "rain", low: 10, high: 15, pop: 65 },
    ] as const;
    const weekMin = 9;
    const weekMax = 20;
    return (
      <div>
        {week.map((d) => (
          <ForecastRow
            key={d.day}
            day={d.day}
            condition={d.condition}
            low={d.low}
            high={d.high}
            weekMin={weekMin}
            weekMax={weekMax}
            pop={"pop" in d ? d.pop : undefined}
            current={"current" in d ? d.current : undefined}
          />
        ))}
      </div>
    );
  },
};
