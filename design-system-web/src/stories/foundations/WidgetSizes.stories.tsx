import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Widget size specs — real WidgetKit point dimensions on iPhone 16 (393 × 852 pt).
 * These are the physical sizes the widgets render at; the outlines below are drawn
 * at 1:1 so the design-system widget cards should match them exactly.
 */
type Spec = {
  name: string;
  kind: string;
  w: number;
  h: number;
  radius: number;
};

const SPECS: Spec[] = [
  { name: "鎖定畫面 2×1", kind: "accessoryRectangular", w: 172, h: 76, radius: 18 },
  { name: "主畫面 2×2（Small）", kind: "systemSmall", w: 158, h: 158, radius: 22 },
  { name: "主畫面 4×2（Medium）", kind: "systemMedium", w: 338, h: 158, radius: 24 },
];

const mono = "var(--yw-sys-font-mono)";
const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  color: "var(--yw-sys-color-text-label)",
};

function WidgetSizes() {
  return (
    <div
      style={{
        fontFamily: "var(--yw-sys-font-ui)",
        color: "var(--yw-sys-color-text-primary)",
        background: "var(--yw-sys-color-surface-paper)",
        padding: 28,
        borderRadius: 16,
        maxInlineSize: 760,
      }}
    >
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 600 }}>
        Widget 尺寸規格
      </h2>
      <p style={{ margin: "0 0 24px", fontSize: 13, ...label, color: "var(--yw-sys-color-text-secondary)" }}>
        iPhone 16 · 393 × 852 pt。以下外框為 1:1 實際尺寸,widget 卡片需吻合。
      </p>

      <table style={{ borderCollapse: "collapse", inlineSize: "100%", marginBlockEnd: 28, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "start", ...label }}>
            <th style={{ textAlign: "start", padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)" }}>Widget</th>
            <th style={{ textAlign: "start", padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)" }}>WidgetKit family</th>
            <th style={{ textAlign: "start", padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)" }}>尺寸 (pt)</th>
            <th style={{ textAlign: "start", padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)" }}>圓角</th>
          </tr>
        </thead>
        <tbody>
          {SPECS.map((s) => (
            <tr key={s.name}>
              <td style={{ padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)" }}>{s.name}</td>
              <td style={{ padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)", fontFamily: mono, fontSize: 12, color: "var(--yw-sys-color-text-label)" }}>{s.kind}</td>
              <td style={{ padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)", fontFamily: mono }}>{s.w} × {s.h}</td>
              <td style={{ padding: "8px 12px", borderBlockEnd: "1px solid var(--yw-sys-color-line)", fontFamily: mono }}>{s.radius}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
        {SPECS.map((s) => (
          <div key={s.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={label}>
              {s.name} · {s.w} × {s.h}
            </span>
            <div
              style={{
                inlineSize: s.w,
                blockSize: s.h,
                borderRadius: s.radius,
                border: "1.5px dashed var(--yw-sys-color-text-tertiary)",
                background: "var(--yw-sys-color-surface-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: mono,
                fontSize: 12,
                color: "var(--yw-sys-color-text-label)",
              }}
            >
              {s.w} × {s.h}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundations/Widget Sizes",
  component: WidgetSizes,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    figmaSourceUrl:
      "https://www.figma.com/design/wyeoKr5nbQmvV9gMWAOoyN?node-id=425-10",
  },
} satisfies Meta<typeof WidgetSizes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
