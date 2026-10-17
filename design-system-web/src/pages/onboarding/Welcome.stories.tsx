import type { Meta, StoryObj } from "@storybook/react-vite";

import { Welcome } from "./Welcome";

/**
 * Single-screen onboarding. "Get started" asks for location + notification access
 * via the browser/OS native permission prompts (these may be blocked inside the
 * Storybook iframe sandbox, but fire normally in a real app context).
 */
const meta = {
  title: "Pages/Onboarding",
  component: Welcome,
  parameters: { layout: "centered" },
  args: {
    onDone: () => console.log("onboarding done"),
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
} satisfies Meta<typeof Welcome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
