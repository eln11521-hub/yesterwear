import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type StrokeRole = {
  label: string;
  widthToken: string;
  colorToken: string;
  guidance: string;
};

type StrokeSection = {
  title: string;
  summary: string;
  roles: StrokeRole[];
};

const strokeGuides = storybookCopy.strokeGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = strokeGuides.sections as StrokeSection[];
const allStrokeTokenNames = Array.from(
  new Set(
    sections.flatMap((section) =>
      section.roles.flatMap((role) => [role.widthToken, role.colorToken]),
    ),
  ),
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
  return tokenByName.get(tokenName)?.value ?? strokeGuides.unknownValue;
}

function StrokeTokenMeta({
  label,
  token,
  resolvedTokens,
}: {
  label: string;
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <div className="yw-guide-token-meta">
      <dt>{label}</dt>
      <dd>
        <code>{token}</code>
      </dd>
      <dd>
        <span>{strokeGuides.valueLabel}</span>
        <code>{getAuthoredValue(token)}</code>
      </dd>
      <dd>
        <span>{strokeGuides.resolvedLabel}</span>
        <code>{resolvedTokens[token]}</code>
      </dd>
    </div>
  );
}

function StrokeCard({
  role,
  resolvedTokens,
}: {
  role: StrokeRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const strokeStyle = {
    "--yw-stroke-guide-width": `var(${role.widthToken})`,
    "--yw-stroke-guide-color": `var(${role.colorToken})`,
  } as CSSProperties;

  return (
    <article className="yw-stroke-card">
      <div className="yw-stroke-card__visual" style={strokeStyle}>
        <div className="yw-stroke-card__track">
          <span aria-label={role.label} className="yw-stroke-card__sample" />
        </div>
        <code>{resolvedTokens[role.widthToken]}</code>
      </div>

      <div className="yw-stroke-card__content">
        <h3 className="yw-stroke-card__title">{role.label}</h3>
        <div className="yw-guide-usage">
          <span>{strokeGuides.usageLabel}</span>
          <p>{role.guidance}</p>
        </div>
        <dl className="yw-guide-token-list yw-guide-token-list--grid">
          <StrokeTokenMeta
            label={strokeGuides.widthLabel}
            resolvedTokens={resolvedTokens}
            token={role.widthToken}
          />
          <StrokeTokenMeta
            label={strokeGuides.colorLabel}
            resolvedTokens={resolvedTokens}
            token={role.colorToken}
          />
        </dl>
      </div>
    </article>
  );
}

export function StrokeGuides() {
  const resolvedTokens = useResolvedTokens(allStrokeTokenNames);
  const tokenCounts = useMemo(
    () => ({
      roles: sections.reduce((count, section) => count + section.roles.length, 0),
      groups: sections.length,
      rules: strokeGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{strokeGuides.eyebrow}</div>
          <h1 className="yw-story-title">{strokeGuides.title}</h1>
          <p className="yw-story-lead">{strokeGuides.lead}</p>
        </header>

        <section aria-label={strokeGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{strokeGuides.strokeTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.roles}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{strokeGuides.groupTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.groups}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{strokeGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{strokeGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {strokeGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{strokeGuides.strokeTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>

              <div className="yw-stroke-grid">
                {section.roles.map((role) => (
                  <StrokeCard
                    key={`${role.widthToken}-${role.colorToken}`}
                    resolvedTokens={resolvedTokens}
                    role={role}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
