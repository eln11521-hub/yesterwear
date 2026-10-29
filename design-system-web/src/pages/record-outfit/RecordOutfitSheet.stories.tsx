import type { Meta, StoryObj } from "@storybook/react-vite";

import sampleThumb from "../../assets/photo/autumn-sky.jpg";
import { RecordOutfitSheet } from "./RecordOutfitSheet";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=226-3150";

const meta = {
  title: "Pages/Record Outfit Sheet",
  component: RecordOutfitSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    figmaSourceUrl: FIGMA_URL,
    backgrounds: { default: "paper" },
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
} satisfies Meta<typeof RecordOutfitSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 主動線 — manual: every group is multi-select (上身 needs ≥ 1), then 儲存.
 *  The sheet height is fixed; the chip groups scroll between the head and the
 *  pinned actions. */
export const Default: Story = {};

/** Layered day — several items in each group; the sheet stays the same height. */
export const Layered: Story = {
  args: {
    initial: {
      tops: ["背心無袖", "襯衫"],
      outers: ["鋪棉背心", "毛呢大衣"],
      bottoms: ["牛仔褲"],
      accessories: ["圍巾", "雨傘"],
    },
  },
};

/** 輔助線 — after 拍照記錄, recognition prefills the tags and the sheet enters the
 *  待確認 state: thumbnail beside the prefilled tags for comparison, still editable. */
export const PhotoPending: Story = {
  args: {
    initial: { tops: ["帽T衛衣"], outers: ["連帽外套"] },
    initialThumb: sampleThumb,
  },
};

/** 信心度處理 — the outer layer came back below threshold, so it is left blank
 *  (外套待選) with a prompt to pick manually, rather than risk a wrong prefill. */
export const PhotoLowConfidence: Story = {
  args: {
    initial: { tops: ["帽T衛衣"], outers: [] },
    initialThumb: sampleThumb,
  },
};
