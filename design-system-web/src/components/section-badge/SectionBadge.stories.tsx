import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { SectionBadge } from "./SectionBadge";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=226-3150";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
      display: "flex",
      gap: 12,
      alignItems: "center",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Section Badge",
  component: SectionBadge,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("section-badge"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { label: "必選", tone: "required" },
  decorators: [paperDecorator],
} satisfies Meta<typeof SectionBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Required: Story = { args: { label: "必選", tone: "required" } };
export const Optional: Story = { args: { label: "可選", tone: "optional" } };
