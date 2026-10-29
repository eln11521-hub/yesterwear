import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useState } from "react";

import { ACCESSORY_LAYER, BOTTOM_LAYER, OUTER_LAYER, TOP_LAYER } from "../../app/outfit";
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

/** Multi-select chip group — every record-sheet section toggles independently. */
function ChipGroup({ items, initial }: { items: readonly string[]; initial: string[] }) {
  const [chosen, setChosen] = useState<string[]>(initial);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxWidth: 320 }}>
      {items.map((label) => (
        <OutfitChip
          key={label}
          label={label}
          iconSrc={garmentIcon[label]}
          selected={chosen.includes(label)}
          onClick={() =>
            setChosen((c) => (c.includes(label) ? c.filter((x) => x !== label) : [...c, label]))
          }
        />
      ))}
    </div>
  );
}

/** 上身 (multi-select, at least one). */
export const TopLayer: Story = {
  render: () => <ChipGroup items={TOP_LAYER} initial={["背心無袖", "襯衫"]} />,
};

/** 外套 / 疊搭 (multi-select). */
export const OuterLayer: Story = {
  render: () => <ChipGroup items={OUTER_LAYER} initial={["薄外套"]} />,
};

/** 下身 (multi-select). */
export const BottomLayer: Story = {
  render: () => <ChipGroup items={BOTTOM_LAYER} initial={["長褲"]} />,
};

/** 配件 (multi-select). */
export const Accessories: Story = {
  render: () => <ChipGroup items={ACCESSORY_LAYER} initial={["圍巾", "雨傘"]} />,
};
