import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { garmentIcon } from "./garments";
import { OutfitChip } from "./OutfitChip";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=226-3150";

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      borderRadius: 16,
      fontFamily: "var(--yw-sys-font-ui)",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Selection/Outfit Chip",
  component: OutfitChip,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("outfit-chip"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: {
    label: "長袖上衣",
    selected: false,
    iconSrc: garmentIcon["長袖上衣"],
  },
  decorators: [paperDecorator],
} satisfies Meta<typeof OutfitChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const Compact: Story = {
  args: { compact: true, label: "薄外套", iconSrc: garmentIcon["薄外套"] },
};

/** The 上身基礎層 section from the record-outfit sheet. */
export const TopBaseLayer: Story = {
  render: () => {
    const items = [
      "短袖上衣",
      "背心無袖",
      "長袖上衣",
      "襯衫（單穿）",
      "針織衫（單穿）",
      "帽T衛衣（單穿）",
    ];
    const [chosen, setChosen] = useState("長袖上衣");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 320 }}>
        {items.map((label) => (
          <OutfitChip
            key={label}
            label={label}
            iconSrc={garmentIcon[label]}
            selected={chosen === label}
            onClick={() => setChosen(label)}
          />
        ))}
      </div>
    );
  },
};

/** The 外套 / 疊搭層 section. */
export const OuterLayer: Story = {
  render: () => {
    const items = [
      "不加外套",
      "薄外套",
      "連帽外套",
      "厚外套夾克",
      "羽絨外套大衣",
      "防風防水外套",
    ];
    const [chosen, setChosen] = useState("薄外套");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 320 }}>
        {items.map((label) => (
          <OutfitChip
            key={label}
            label={label}
            iconSrc={garmentIcon[label]}
            selected={chosen === label}
            onClick={() => setChosen(label)}
          />
        ))}
      </div>
    );
  },
};
