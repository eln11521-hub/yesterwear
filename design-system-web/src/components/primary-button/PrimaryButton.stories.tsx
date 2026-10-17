import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import checkUrl from "../../assets/icon/check.svg?url";
import tagUrl from "../../assets/icon/tag.svg?url";
import { Icon } from "../_ui/Icon";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { PrimaryButton } from "./PrimaryButton";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=174-2";

const TagIcon = () => <Icon src={tagUrl} size={18} />;

const paperDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-paper)",
      padding: 24,
      maxWidth: 340,
      borderRadius: 16,
      fontFamily: "var(--yw-sys-font-ui)",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Actions/Primary Button",
  component: PrimaryButton,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("primary-button"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { label: "記錄今天穿搭" },
  decorators: [paperDecorator],
} satisfies Meta<typeof PrimaryButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "記錄今天穿搭", icon: <TagIcon /> },
};

export const Save: Story = {
  args: { label: "儲存今日紀錄", icon: <Icon src={checkUrl} size={18} /> },
};

export const Disabled: Story = {
  args: { label: "記錄今天穿搭", icon: <TagIcon />, disabled: true },
};
