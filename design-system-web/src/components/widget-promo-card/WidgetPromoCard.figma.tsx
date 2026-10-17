import figma from "@figma/code-connect";

import { WidgetPromoCard } from "./WidgetPromoCard";

/** Code Connect: Figma「Widget Promo Card」(504:241) ←→ React WidgetPromoCard. */
figma.connect(
  WidgetPromoCard,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=504-241",
  {
    props: {
      title: figma.string("Title"),
      subtitle: figma.string("Subtitle"),
    },
    example: ({ title, subtitle }) => (
      <WidgetPromoCard title={title} subtitle={subtitle} />
    ),
  },
);
