import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import cameraUrl from "../../assets/icon/camera.svg?url";
import { Icon } from "../_ui/Icon";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { SecondaryButton } from "./SecondaryButton";

const FIGMA_URL =
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=226-3150";

const CameraIcon = () => <Icon src={cameraUrl} size={18} />;

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
  title: "Components/Actions/Secondary Button",
  component: SecondaryButton,
  tags: ["autodocs"],
  parameters: {
    ...getComponentStoryParameters("secondary-button"),
    figmaSourceUrl: FIGMA_URL,
  },
  args: { label: "拍照記錄" },
  decorators: [paperDecorator],
} satisfies Meta<typeof SecondaryButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: { label: "拍照記錄", icon: <CameraIcon /> },
};

export const Disabled: Story = {
  args: { label: "拍照記錄", icon: <CameraIcon />, disabled: true },
};
