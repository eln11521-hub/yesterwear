import type { Meta, StoryObj } from "@storybook/react-vite";

import { MOCK_WEATHER } from "../../app/weather";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { HomeWidgetMedium } from "./HomeWidgetMedium";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=216-2";

const meta = {
  title: "Components/Widgets/Home Widget (Medium)",
  component: HomeWidgetMedium,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("home-widget-medium"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    location: "Edmonton",
    weather: MOCK_WEATHER,
    yesterdayChips: ["長袖上衣", "薄外套"],
  },
} satisfies Meta<typeof HomeWidgetMedium>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Cooler than yesterday (default) — cool-tinted background + slate delta pill. */
export const Cooler: Story = {};

/** Similar to yesterday — neutral cream background + grey pill. */
export const Neutral: Story = {
  args: { weather: { ...MOCK_WEATHER, overallDelta: 0 } },
};

/** Warmer than yesterday — warm-tinted background + orange pill. */
export const Warmer: Story = {
  args: { weather: { ...MOCK_WEATHER, overallDelta: 4 } },
};

/** 跨地點 — 昨日在不同城市：昨日欄加定位圖示 + 城市名（當地昨日補充列只在 App 內）。 */
export const CrossLocation: Story = {
  args: { yesterdayCity: "艾德蒙頓" },
};
