import figma from "@figma/code-connect";

import { PrimaryButton } from "./PrimaryButton";

/**
 * Code Connect: Figma「Button/Primary」(main component) ←→ React PrimaryButton.
 * Figma node: 486:24 (page「component」). `Label` → `label`; the leading icon is
 * passed as a React node in code.
 */
figma.connect(
  PrimaryButton,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=486-24",
  {
    props: {
      label: figma.string("Label"),
    },
    example: ({ label }) => <PrimaryButton label={label} />,
  },
);
