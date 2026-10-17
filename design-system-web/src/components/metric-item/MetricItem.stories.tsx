import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { MetricItem } from "./MetricItem";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
      fontFamily: "var(--yw-sys-font-ui)",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Metric Item",
  component: MetricItem,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("metric-item"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { label: "濕度", value: "65%" },
  decorators: [paperDecorator],
} satisfies Meta<typeof MetricItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The four hero metrics as laid out on the home screen. */
export const HeroGrid: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        columnGap: 32,
        rowGap: 12,
      }}
    >
      <MetricItem label="降雨" value="0%" />
      <MetricItem label="濕度" value="65%" />
      <MetricItem label="較昨天" value="↓3°" />
      <MetricItem label="體感" value="16°C" />
    </div>
  ),
};
