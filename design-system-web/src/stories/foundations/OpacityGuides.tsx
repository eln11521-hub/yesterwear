import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type OpacityKind = "opacity" | "color";

type OpacityRole = {
  label: string;
  token: string;
  guidance: string;
  kind: OpacityKind;
};

type OpacitySection = {
  title: string;
  summary: string;
  roles: OpacityRole[];
};

const opacityGuides = storybookCopy.opacityGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = opacityGuides.sections as OpacitySection[];
const allOpacityTokenNames = Array.from(
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
  return tokenByName.get(tokenName)?.value ?? opacityGuides.unknownValue;
}

function OpacityTokenMeta({
  token,
  resolvedTokens,
}: {
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <dl className="yw-foundation-token-meta">
      <div>
        <dt>{opacityGuides.tokenLabel}</dt>
        <dd>
          <code>{token}</code>
        </dd>
      </div>
      <div>
        <dt>{opacityGuides.valueLabel}</dt>
        <dd>
          <code>{getAuthoredValue(token)}</code>
        </dd>
      </div>
      <div>
        <dt>{opacityGuides.resolvedLabel}</dt>
        <dd>
          <code>{resolvedTokens[token]}</code>
        </dd>
      </div>
    </dl>
  );
}

function OpacityCard({
  role,
  resolvedTokens,
}: {
  role: OpacityRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const opacityStyle = {
    "--yw-opacity-guide-token": `var(${role.token})`,
  } as CSSProperties;

  return (
    <article className="yw-opacity-card">
      <div className="yw-opacity-card__visual" style={opacityStyle}>
        <div className="yw-opacity-card__track">
          <span
            aria-label={role.label}
            className="yw-opacity-card__sample"
            data-kind={role.kind}
          />
        </div>
        <code>{resolvedTokens[role.token]}</code>
      </div>

      <div className="yw-opacity-card__content">
        <h3 className="yw-opacity-card__title">{role.label}</h3>
        <div className="yw-guide-usage">
          <span>{opacityGuides.usageLabel}</span>
          <p>{role.guidance}</p>
        </div>
        <OpacityTokenMeta resolvedTokens={resolvedTokens} token={role.token} />
      </div>
    </article>
  );
}

export function OpacityGuides() {
  const resolvedTokens = useResolvedTokens(allOpacityTokenNames);
  const tokenCounts = useMemo(
    () => ({
      roles: sections.reduce((count, section) => count + section.roles.length, 0),
      groups: sections.length,
      rules: opacityGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{opacityGuides.eyebrow}</div>
          <h1 className="yw-story-title">{opacityGuides.title}</h1>
          <p className="yw-story-lead">{opacityGuides.lead}</p>
        </header>

        <section aria-label={opacityGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{opacityGuides.opacityTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.roles}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{opacityGuides.groupTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.groups}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{opacityGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{opacityGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {opacityGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{opacityGuides.opacityTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>

              <div className="yw-opacity-grid">
                {section.roles.map((role) => (
                  <OpacityCard key={role.token} resolvedTokens={resolvedTokens} role={role} />
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
