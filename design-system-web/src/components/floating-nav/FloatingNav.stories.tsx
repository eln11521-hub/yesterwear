import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { FloatingNav } from "./FloatingNav";
import { GearIcon, ThermometerIcon } from "./NavIcons";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const items = [
  { id: "weather", label: "天氣", icon: <ThermometerIcon size={18} /> },
  { id: "settings", label: "設定", icon: <GearIcon size={18} /> },
];

const meta = {
  title: "Components/Navigation/Floating Nav",
  component: FloatingNav,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("floating-nav"),
    figmaSourceUrl: FIGMA_URL,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: "var(--yw-sys-color-surface-paper)",
          padding: 32,
          borderRadius: 16,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatingNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState("weather");
    return (
      <FloatingNav items={items} activeId={active} onSelect={setActive} />
    );
  },
};
