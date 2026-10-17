import type { Meta, StoryObj } from "@storybook/react-vite";

import { Onboarding } from "./Onboarding";

const meta = {
  title: "Pages/Onboarding — Legacy (Stamp)",
  component: Onboarding,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    figmaSourceUrl:
      "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=3-2",
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
} satisfies Meta<typeof Onboarding>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Step 1 歡迎頁; press 下一步 to advance the page dots through the flow. */
export const Default: Story = {};
