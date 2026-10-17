import figma from "@figma/code-connect";

import { SectionBadge } from "./SectionBadge";

/**
 * Code Connect: Figma「Section Badge」variant set ←→ React SectionBadge.
 * Figma node: 485:25 (page「component」). Variant `State` 必選/可選 maps to the
 * React `tone` required/optional (and drives the displayed label).
 */
figma.connect(
  SectionBadge,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=485-25",
  {
    props: {
      tone: figma.enum("State", {
        必選: "required",
        可選: "optional",
      }),
      label: figma.enum("State", {
        必選: "必選",
        可選: "可選",
      }),
    },
    example: ({ tone, label }) => <SectionBadge tone={tone} label={label} />,
  },
);
