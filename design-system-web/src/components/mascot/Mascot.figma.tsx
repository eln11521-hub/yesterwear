import figma from "@figma/code-connect";

import { Mascot } from "./Mascot";

/** Code Connect: Figma「Mascot」(504:209) ←→ React Mascot (raster brand illustration). */
figma.connect(
  Mascot,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=504-209",
  {
    props: {},
    example: () => <Mascot size={100} />,
  },
);
