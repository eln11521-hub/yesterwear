import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { WidgetPromoCard } from "./WidgetPromoCard";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-200";

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
  title: "Components/Surfaces/Widget Promo Card",
  component: WidgetPromoCard,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("widget-promo-card"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    title: "把 Widget 加到桌面",
    subtitle: "長按桌面 →「+」→ 搜尋加入",
  },
  decorators: [paperDecorator],
} satisfies Meta<typeof WidgetPromoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
