import type { Meta, StoryObj } from "@storybook/react-vite";

import "./TemplateFoundation.css";

const colorGroups = [
  {
    heading: "溫差狀態 Delta",
    items: [
      { label: "降溫 cold", token: "--yw-sys-color-delta-cold" },
      { label: "持平 neutral", token: "--yw-sys-color-delta-neutral" },
      { label: "升溫 warm", token: "--yw-sys-color-delta-warm" },
    ],
  },
  {
    heading: "表面 Surfaces",
    items: [
      { label: "paper", token: "--yw-sys-color-surface-paper" },
      { label: "raised / card", token: "--yw-sys-color-surface-raised" },
      { label: "white", token: "--yw-sys-color-surface-white" },
      { label: "line", token: "--yw-sys-color-line" },
    ],
  },
  {
    heading: "文字 Text",
    items: [
      { label: "primary (ink)", token: "--yw-sys-color-text-primary" },
      { label: "secondary", token: "--yw-sys-color-text-secondary" },
      { label: "tertiary", token: "--yw-sys-color-text-tertiary" },
    ],
  },
];

const typeScale = [
  { label: "Hero", token: "--yw-sys-type-hero-size", weight: 600 },
  { label: "Title", token: "--yw-sys-type-title-size", weight: 600 },
  { label: "Body", token: "--yw-sys-type-body-size", weight: 500 },
  { label: "Caption", token: "--yw-sys-type-caption-size", weight: 500 },
  { label: "Micro", token: "--yw-sys-type-micro-size", weight: 600 },
];

const spacing = ["xs", "sm", "md", "lg", "xl", "2xl"];
const radius = ["sm", "md", "lg", "xl", "2xl", "full"];

function Foundations() {
  return (
    <section className="yw-foundation">
      <header className="yw-foundation__header">
        <p>昨日天氣對比 · Foundations</p>
        <h2>Design Tokens</h2>
      </header>

      {colorGroups.map((group) => (
        <div key={group.heading} className="yw-foundation__section">
          <h3 className="yw-foundation__h3">{group.heading}</h3>
          <div className="yw-foundation__grid">
            {group.items.map((item) => (
              <article className="yw-foundation__swatch" key={item.token}>
                <span
                  className="yw-foundation__color"
                  style={{
                    background: `var(${item.token})`,
                    border: "1px solid var(--yw-sys-color-line)",
                  }}
                />
                <div>
                  <strong>{item.label}</strong>
                  <code>{item.token}</code>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      <div className="yw-foundation__section">
        <h3 className="yw-foundation__h3">字級 Type scale</h3>
        {typeScale.map((t) => (
          <div
            key={t.token}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              padding: "6px 0",
              borderBottom: "1px solid var(--yw-sys-color-line)",
            }}
          >
            <span
              style={{
                fontSize: `var(${t.token})`,
                fontWeight: t.weight,
                fontFamily: "var(--yw-sys-font-ui)",
                color: "var(--yw-sys-color-text-primary)",
              }}
            >
              比昨天涼一些 18°
            </span>
            <code style={{ marginInlineStart: "auto" }}>{t.label}</code>
          </div>
        ))}
      </div>

      <div className="yw-foundation__section">
        <h3 className="yw-foundation__h3">間距 Spacing（4pt grid）</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          {spacing.map((s) => (
            <div key={s} style={{ textAlign: "center" }}>
              <div
                style={{
                  inlineSize: `var(--yw-sys-spacing-${s})`,
                  blockSize: `var(--yw-sys-spacing-${s})`,
                  background: "var(--yw-sys-color-delta-warm)",
                  borderRadius: 2,
                }}
              />
              <code style={{ fontSize: 10 }}>{s}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="yw-foundation__section">
        <h3 className="yw-foundation__h3">圓角 Radius</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {radius.map((r) => (
            <div key={r} style={{ textAlign: "center" }}>
              <div
                style={{
                  inlineSize: 56,
                  blockSize: 56,
                  background: "var(--yw-sys-color-surface-raised)",
                  border: "1px solid var(--yw-sys-color-line)",
                  borderRadius: `var(--yw-sys-radius-${r})`,
                }}
              />
              <code style={{ fontSize: 10 }}>{r}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: "Foundations/Design Tokens",
  component: Foundations,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Foundations>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
