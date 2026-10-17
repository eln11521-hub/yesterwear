import type { Meta, StoryObj } from "@storybook/react-vite";

import { MOCK_WEATHER } from "../../app/weather";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { HomeWidgetSmall } from "./HomeWidgetSmall";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=424-10";

const meta = {
  title: "Components/Widgets/Home Widget (Small)",
  component: HomeWidgetSmall,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("home-widget-small"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    location: "Edmonton",
    weather: MOCK_WEATHER,
    yesterdayChips: ["長袖上衣", "薄外套"],
  },
} satisfies Meta<typeof HomeWidgetSmall>;

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
