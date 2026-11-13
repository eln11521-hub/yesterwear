import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { Snackbar } from "./Snackbar";

const meta = {
  title: "Components/Feedback/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: getComponentStoryParameters("snackbar"),
  args: { message: "儲存成功！" },
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** After 儲存今日紀錄 / 更新今日穿搭. Press 再顯示一次 to replay. */
export const Default: Story = {
  render: (args) => {
    const [n, setN] = useState(0);
    const [shown, setShown] = useState(true);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start", padding: 16 }}>
        <button
          type="button"
          onClick={() => {
            setN(n + 1);
            setShown(true);
          }}
        >
          再顯示一次
        </button>
        {shown ? <Snackbar key={n} {...args} onDone={() => setShown(false)} /> : null}
      </div>
    );
  },
};
