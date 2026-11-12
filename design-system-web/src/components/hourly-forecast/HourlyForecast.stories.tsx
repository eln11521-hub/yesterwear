import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { MOCK_WEATHER } from "../../app/weather";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { HourlyForecast } from "./HourlyForecast";

const cardDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-raised)",
      padding: "12px 16px",
      maxWidth: 308,
      borderRadius: 24,
      overflow: "hidden",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Hourly Forecast",
  component: HourlyForecast,
  tags: ["autodocs"],
  parameters: getComponentStoryParameters("hourly-forecast"),
  args: {
    today: MOCK_WEATHER.dayCompare!.today,
    yesterday: MOCK_WEATHER.dayCompare!.yesterday,
    items: MOCK_WEATHER.hourly,
  },
  decorators: [cardDecorator],
} satisfies Meta<typeof HourlyForecast>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 今天各時段: the hours strip (現在 and 出門 / 下班 on white chips). */
export const Default: Story = {};

/** 相比昨天: today (solid — ink up to now, lighter ahead) against yesterday
 *  (dashed), 00–24. Drag across the chart to read an hour in the legend. */
export const CompareTab: Story = { args: { initialTab: "compare" } };

/** Today much warmer than yesterday all day. */
export const WarmerDay: Story = {
  args: {
    today: MOCK_WEATHER.dayCompare!.yesterday.map((v) => v + 5),
    yesterday: MOCK_WEATHER.dayCompare!.yesterday,
    initialTab: "compare",
  },
};
