import type { Meta, StoryObj } from "@storybook/react-vite";

import { PosterFlow } from "./PosterFlow";

const meta = {
  title: "Pages/Onboarding (Legacy · 5-step)",
  component: PosterFlow,
  parameters: { layout: "centered" },
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
} satisfies Meta<typeof PosterFlow>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full 5-step poster flow — click Next / back to walk through all steps. */
export const Default: Story = {};
