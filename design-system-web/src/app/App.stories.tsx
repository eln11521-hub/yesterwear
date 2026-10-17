import type { Meta, StoryObj } from "@storybook/react-vite";

import { App } from "./App";

const meta = {
  title: "App/昨日天氣對比 MVP",
  component: App,
  parameters: {
    layout: "centered",
    figmaSourceUrl:
      "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--yw-sys-color-surface-paper)",
          padding: 24,
          borderRadius: 16,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Full MVP loop: tap 記錄今天穿搭 → pick layers (optionally 拍照記錄) → 儲存 →
 * dashboard updates. Use 模擬跨日 to see today become 昨日穿搭 the next day.
 */
export const Default: Story = {};
