import figma from "@figma/code-connect";

import { MetricItem } from "./MetricItem";

/** Code Connect: Figma「Metric Item」(504:225) ←→ React MetricItem. */
figma.connect(
  MetricItem,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=504-225",
  {
    props: {
      label: figma.string("Label"),
      value: figma.string("Value"),
    },
    example: ({ label, value }) => <MetricItem label={label} value={value} />,
  },
);
