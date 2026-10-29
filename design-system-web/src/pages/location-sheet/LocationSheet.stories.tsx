import type { Meta, StoryObj } from "@storybook/react-vite";

import { LocationSheet } from "./LocationSheet";

const EDMONTON = { name: "Edmonton", lat: 53.5461, lon: -113.4938 };
const TAIPEI = { name: "台北", lat: 25.033, lon: 121.5654 };
const TOKYO = { name: "東京", lat: 35.6895, lon: 139.6917 };

const meta = {
  title: "Pages/Location Sheet",
  component: LocationSheet,
  parameters: { layout: "centered" },
  args: {
    location: TAIPEI,
    mode: "manual",
    recents: [TAIPEI, TOKYO, EDMONTON],
    onUseGps: async () => true,
  },
} satisfies Meta<typeof LocationSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A picked city (台北) is checked in 最近使用. */
export const PickedCity: Story = {};

/** GPS mode: 使用目前位置 is checked and shows the resolved place. */
export const Gps: Story = {
  args: { mode: "gps", location: { name: "目前位置", lat: 25.04, lon: 121.56 } },
};

/** First use — no recents yet. */
export const NoRecents: Story = { args: { recents: [] } };
