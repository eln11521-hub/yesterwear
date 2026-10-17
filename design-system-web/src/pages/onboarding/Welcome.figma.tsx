import figma from "@figma/code-connect";

import { Welcome } from "./Welcome";

/**
 * Code Connect: Figma「Welcome」screen component (539:324, page「component」) ←→
 * React Welcome. Single-screen onboarding; "Get started" asks for location +
 * notification access via the native permission prompts, then completes.
 */
figma.connect(
  Welcome,
  "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=539-324",
  {
    props: {},
    example: () => <Welcome />,
  },
);
