import figma from "@figma/code-connect";

import { OutfitChip } from "./OutfitChip";

/**
 * Code Connect: Figma「Outfit Chip」(main component) ←→ React OutfitChip.
 * Figma node: 485:17 (page「component」). The Figma `Icon` instance-swap maps to
 * the React `iconSrc` url (picked in code from garments.ts); `Label` → `label`.
 */
figma.connect(
  OutfitChip,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=485-17",
  {
    props: {
      label: figma.string("Label"),
    },
    example: ({ label }) => <OutfitChip label={label} />,
  },
);

/**
 * Compact variant — Figma「Outfit Chip (Compact)」(505:165), used on the home
 * screen (29-tall, 14px icon). Maps to the same React OutfitChip with `compact`.
 */
figma.connect(
  OutfitChip,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=505-165",
  {
    props: {
      label: figma.string("Label"),
    },
    example: ({ label }) => <OutfitChip compact label={label} />,
  },
);
