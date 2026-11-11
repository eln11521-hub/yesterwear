import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { MOCK_WEATHER } from "../../app/weather";
import { getComponentStoryParameters } from "../../storybook/componentCatalog";
import { HourlyForecast } from "./HourlyForecast";

const cardDecorator = (Story: () => ReactNode) => (
  <div
    style={{
      background: "var(--yw-sys-color-surface-raised)",
      padding: "12px 16px",
      maxWidth: 308,
      borderRadius: 24,
      overflow: "hidden",
    }}
  >
    <Story />
  </div>
);

const meta = {
  title: "Components/Data Display/Hourly Forecast",
  component: HourlyForecast,
  tags: ["autodocs"],
  parameters: getComponentStoryParameters("hourly-forecast"),
  args: { items: MOCK_WEATHER.hourly },
  decorators: [cardDecorator],
} satisfies Meta<typeof HourlyForecast>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Today 00–23; the current hour (09:00) is dotted and centered. */
export const Default: Story = {};

/** Rainy afternoon — wet hours show their rain probability. */
export const Rainy: Story = {
  args: {
    items: MOCK_WEATHER.hourly.map((h) =>
      h.hour >= 14 && h.hour <= 19 ? { ...h, condition: "rain", pop: 60 + (h.hour - 14) * 5 } : h,
    ),
  },
};

/** A typical Taipei day: gaps of 0–1°, and 體感 rising above 實際 in the
 *  afternoon — cold bars hang down, warm bars rise, equal hours read 「0°」. */
export const CloseAndCrossing: Story = {
  args: {
    items: MOCK_WEATHER.hourly.map((h, i) => {
      const F = [21, 22, 23, 22, 22, 22, 23, 23];
      const A = [22, 23, 23, 23, 23, 23, 22, 21];
      const k = i % F.length;
      return { ...h, temp: F[k], actual: A[k] };
    }),
  },
};
