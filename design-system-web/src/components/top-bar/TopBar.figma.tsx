import figma from "@figma/code-connect";

import { TopBar } from "./TopBar";

/** Code Connect: Figma「Top Bar」(504:220) ←→ React TopBar. */
figma.connect(
  TopBar,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=504-220",
  {
    props: {
      location: figma.string("Location"),
      date: figma.string("Date"),
    },
    example: ({ location, date }) => <TopBar location={location} date={date} />,
  },
);
