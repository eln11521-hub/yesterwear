import figma from "@figma/code-connect";

import { SecondaryButton } from "./SecondaryButton";

/**
 * Code Connect: Figma「Button/Secondary」(main component) ←→ React SecondaryButton.
 * Figma node: 486:31 (page「component」). `Label` → `label`; the leading icon is
 * passed as a React node in code.
 */
figma.connect(
  SecondaryButton,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=486-31",
  {
    props: {
      label: figma.string("Label"),
    },
    example: ({ label }) => <SecondaryButton label={label} />,
  },
);
