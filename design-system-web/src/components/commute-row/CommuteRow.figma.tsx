import figma from "@figma/code-connect";

import { CommuteRow } from "./CommuteRow";

/**
 * Code Connect: Figma「Commute Row」(504:231) ←→ React CommuteRow.
 * The Figma `Slot` text carries slot + time together (e.g. 出門 08:00); in code
 * they are separate `slot` / `time` props.
 */
figma.connect(
  CommuteRow,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=504-231",
  {
    props: {
      slot: figma.string("Slot"),
      temp: figma.string("Temp"),
      delta: figma.string("Delta"),
    },
    example: ({ slot, temp, delta }) => (
      <CommuteRow slot={slot} time="08:00" temp={temp} delta={delta} />
    ),
  },
);
