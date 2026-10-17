import figma from "@figma/code-connect";

import { FloatingNav } from "./FloatingNav";

/**
 * Code Connect: Figma「Floating Nav」variant set ←→ React FloatingNav.
 * Figma node: 499:140 (page「component」). Variant `Active` 天氣/設定 maps to the
 * React `activeId` (weather/settings); items/icons are supplied in code.
 */
figma.connect(
  FloatingNav,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=499-140",
  {
    props: {
      activeId: figma.enum("Active", {
        天氣: "weather",
        設定: "settings",
      }),
    },
    example: ({ activeId }) => (
      <FloatingNav
        activeId={activeId}
        items={[
          { id: "weather", label: "天氣", icon: null },
          { id: "settings", label: "設定", icon: null },
        ]}
      />
    ),
  },
);
