import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { MOCK_WEATHER } from "../../app/weather";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { LockWidget } from "./LockWidget";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=173-2940";

/** Lock-screen wallpaper so the glass card reads (widget is white-on-tint). */
const wallpaper = (Story: () => ReactNode) => (
  <div
    style={{
      background: "linear-gradient(160deg, #c9a75c 0%, #b8873f 100%)",
      padding: 40,
      borderRadius: 24,
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Widgets/Lock Widget",
  component: LockWidget,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("lock-widget"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    location: "Edmonton",
    weather: MOCK_WEATHER,
    yesterdayChips: ["長袖上衣", "薄外套"],
  },
  decorators: [wallpaper],
} satisfies Meta<typeof LockWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 跨地點 — 昨日在不同城市：比昨天前面加一個定位小圖示（鎖定畫面不顯示城市名）。 */
export const CrossLocation: Story = {
  args: { crossLocation: true },
};
