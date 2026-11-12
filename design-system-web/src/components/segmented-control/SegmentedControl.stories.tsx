import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { SegmentedControl } from "./SegmentedControl";

const meta = {
  title: "Components/Selection/Segmented Control",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: getComponentStoryParameters("segmented-control"),
  args: {
    options: [
      { value: "C", label: "攝氏 °C" },
      { value: "F", label: "華氏 °F" },
    ],
    value: "C",
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Settings: on the paper ground. */
export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState(args.value);
    return (
      <div style={{ maxWidth: 340, padding: 16, background: "var(--yw-sys-color-surface-paper)" }}>
        <SegmentedControl {...args} value={v} onChange={setV} />
      </div>
    );
  },
};

/** Home 各時段體感溫度 tabs: inset tone on a raised card. */
export const OnCard: Story = {
  args: {
    options: [
      { value: "today", label: "今天各時段" },
      { value: "compare", label: "相比昨天" },
    ],
    value: "today",
    tone: "inset",
  },
  render: (args) => {
    const [v, setV] = useState(args.value);
    return (
      <div style={{ maxWidth: 308, padding: 16, borderRadius: 24, background: "var(--yw-sys-color-surface-raised)" }}>
        <SegmentedControl {...args} value={v} onChange={setV} />
      </div>
    );
  },
};
