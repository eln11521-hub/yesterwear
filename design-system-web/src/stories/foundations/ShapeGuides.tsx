import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type ShapeRole = {
  label: string;
  token: string;
  guidance: string;
  topOnly?: boolean;
};

type ShapeSection = {
  title: string;
  summary: string;
  roles: ShapeRole[];
};

const shapeGuides = storybookCopy.shapeGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = shapeGuides.sections as ShapeSection[];
const allShapeTokenNames = Array.from(
  new Set(sections.flatMap((section) => section.roles.map((role) => role.token))),
);

function useResolvedTokens(tokens: string[]): ResolvedTokenMap {
  const [resolvedTokens, setResolvedTokens] = useState<ResolvedTokenMap>({});

  useEffect(() => {
    const styles = window.getComputedStyle(document.documentElement);
    const nextResolvedTokens = Object.fromEntries(
      tokens.map((token) => [token, styles.getPropertyValue(token).trim()]),
    );
    setResolvedTokens(nextResolvedTokens);
  }, [tokens]);

  return resolvedTokens;
}

function getAuthoredValue(tokenName: string): string {
  return tokenByName.get(tokenName)?.value ?? shapeGuides.unknownValue;
}

function ShapeTokenMeta({
  token,
  resolvedTokens,
}: {
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <dl className="yw-foundation-token-meta">
      <div>
        <dt>{shapeGuides.tokenLabel}</dt>
        <dd>
          <code>{token}</code>
        </dd>
      </div>
      <div>
        <dt>{shapeGuides.valueLabel}</dt>
        <dd>
          <code>{getAuthoredValue(token)}</code>
        </dd>
      </div>
      <div>
        <dt>{shapeGuides.resolvedLabel}</dt>
        <dd>
          <code>{resolvedTokens[token]}</code>
        </dd>
      </div>
    </dl>
  );
}

function ShapeCard({
  role,
  resolvedTokens,
}: {
  role: ShapeRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const shapeStyle = {
    "--yw-shape-guide-radius": `var(${role.token})`,
  } as CSSProperties;

  return (
    <article className="yw-shape-card">
      <div className="yw-shape-card__visual" style={shapeStyle}>
        <div className="yw-shape-card__track">
          <span
            aria-label={role.label}
            className="yw-shape-card__sample"
            data-top-only={role.topOnly ? "true" : undefined}
          />
        </div>
        <code>{resolvedTokens[role.token]}</code>
      </div>

      <div className="yw-shape-card__content">
        <h3 className="yw-shape-card__title">{role.label}</h3>
        <div className="yw-guide-usage">
          <span>{shapeGuides.usageLabel}</span>
          <p>{role.guidance}</p>
        </div>
        <ShapeTokenMeta resolvedTokens={resolvedTokens} token={role.token} />
      </div>
    </article>
  );
}

export function ShapeGuides() {
  const resolvedTokens = useResolvedTokens(allShapeTokenNames);
  const tokenCounts = useMemo(
    () => ({
      roles: sections.reduce((count, section) => count + section.roles.length, 0),
      groups: sections.length,
      rules: shapeGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{shapeGuides.eyebrow}</div>
          <h1 className="yw-story-title">{shapeGuides.title}</h1>
          <p className="yw-story-lead">{shapeGuides.lead}</p>
        </header>

        <section aria-label={shapeGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shapeGuides.cornerTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.roles}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shapeGuides.groupTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.groups}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shapeGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{shapeGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {shapeGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{shapeGuides.cornerTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>

              <div className="yw-shape-grid">
                {section.roles.map((role) => (
                  <ShapeCard key={role.token} resolvedTokens={resolvedTokens} role={role} />
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
