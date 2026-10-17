import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeScreen } from "./HomeScreen";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const meta = {
  title: "Pages/Home",
  component: HomeScreen,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    figmaSourceUrl: FIGMA_URL,
  },
} satisfies Meta<typeof HomeScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * 跨地點情境 — 使用者昨天在艾德蒙頓、今天在多倫多。比較對象是「昨天艾德蒙頓的體感」
 * ⇄「今天多倫多的體感」。昨日欄標上城市 + 📍,並在 hero 下方顯示次要的「當地昨日」
 * 參考列(多倫多昨天),此列不參與溫差 pill 與色彩計算。建議文案用跨地點版本。
 */
export const CrossLocation: Story = {
  args: {
    crossLocation: {
      yesterdayCity: "艾德蒙頓",
      localYesterday: { city: "多倫多", feels: "20°" },
    },
    advice: "比昨天在艾德蒙頓冷 5°，昨天那套要再加一層。",
  },
};
