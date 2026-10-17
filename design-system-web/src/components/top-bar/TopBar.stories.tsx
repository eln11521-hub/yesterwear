import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { TopBar } from "./TopBar";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-7";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      maxWidth: 360,
      borderRadius: 16,
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Navigation/Top Bar",
  component: TopBar,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("top-bar"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { location: "Edmonton", date: "· 今天 週四 8/20" },
  decorators: [paperDecorator],
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
