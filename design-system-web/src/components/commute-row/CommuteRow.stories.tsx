import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { CommuteRow } from "./CommuteRow";

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
  title: "Components/Data Display/Commute Row",
  component: CommuteRow,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("commute-row"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { slot: "出門", time: "08:00", temp: "16°", delta: "↓2°" },
  decorators: [paperDecorator],
} satisfies Meta<typeof CommuteRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The 通勤時段溫度 section: morning + evening slots side by side. */
export const CommuteSection: Story = {
  render: () => (
    <div>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 12,
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          color: "var(--yw-sys-color-text-secondary)",
        }}
      >
        通勤時段溫度
      </p>
      <div style={{ display: "flex", gap: 48 }}>
        <CommuteRow slot="出門" time="08:00" temp="16°" delta="↓2°" />
        <CommuteRow slot="下班" time="18:00" temp="14°" delta="↓4°" />
      </div>
    </div>
  ),
};
