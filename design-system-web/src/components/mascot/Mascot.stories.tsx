import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { Mascot } from "./Mascot";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=173-2893";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Brand/Mascot",
  component: Mascot,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("mascot"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { size: 108 },
  decorators: [paperDecorator],
} satisfies Meta<typeof Mascot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 64 } };

/**
 * Temperature-delta axis. All three share the neutral art today; cold/warm
 * illustrations drop into Mascot's MASCOT_ART map with no screen changes.
 */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
      {(["cold", "neutral", "warm"] as const).map((state) => (
        <div key={state} style={{ textAlign: "center" }}>
          <Mascot {...args} state={state} />
          <div
            style={{
              marginTop: 8,
              font: "600 11px/1 var(--yw-ref-font-mono, monospace)",
              color: "var(--yw-sys-color-text-muted)",
            }}
          >
            {state}
          </div>
        </div>
      ))}
    </div>
  ),
};
