import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type ShadowRole = {
  label: string;
  token: string;
  guidance: string;
};

type ShadowSection = {
  title: string;
  summary: string;
  roles: ShadowRole[];
};

const shadowGuides = storybookCopy.shadowGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = shadowGuides.sections as ShadowSection[];
const allShadowTokenNames = Array.from(
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
  return tokenByName.get(tokenName)?.value ?? shadowGuides.unknownValue;
}

function ShadowTokenMeta({
  token,
  resolvedTokens,
}: {
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <dl className="yw-foundation-token-meta">
      <div>
        <dt>{shadowGuides.tokenLabel}</dt>
        <dd>
          <code>{token}</code>
        </dd>
      </div>
      <div>
        <dt>{shadowGuides.valueLabel}</dt>
        <dd>
          <code>{getAuthoredValue(token)}</code>
        </dd>
      </div>
      <div>
        <dt>{shadowGuides.resolvedLabel}</dt>
        <dd>
          <code>{resolvedTokens[token]}</code>
        </dd>
      </div>
    </dl>
  );
}

function ShadowCard({
  role,
  resolvedTokens,
}: {
  role: ShadowRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const shadowStyle = {
    "--yw-shadow-guide-shadow": `var(${role.token})`,
  } as CSSProperties;

  return (
    <article className="yw-shadow-card">
      <div className="yw-shadow-card__visual" style={shadowStyle}>
        <div className="yw-shadow-card__track">
          <span aria-label={role.label} className="yw-shadow-card__sample" />
        </div>
        <code>{resolvedTokens[role.token]}</code>
      </div>

      <div className="yw-shadow-card__content">
        <h3 className="yw-shadow-card__title">{role.label}</h3>
        <div className="yw-guide-usage">
          <span>{shadowGuides.usageLabel}</span>
          <p>{role.guidance}</p>
        </div>
        <ShadowTokenMeta resolvedTokens={resolvedTokens} token={role.token} />
      </div>
    </article>
  );
}

export function ShadowGuides() {
  const resolvedTokens = useResolvedTokens(allShadowTokenNames);
  const tokenCounts = useMemo(
    () => ({
      roles: sections.reduce((count, section) => count + section.roles.length, 0),
      groups: sections.length,
      rules: shadowGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{shadowGuides.eyebrow}</div>
          <h1 className="yw-story-title">{shadowGuides.title}</h1>
          <p className="yw-story-lead">{shadowGuides.lead}</p>
        </header>

        <section aria-label={shadowGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shadowGuides.shadowTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.roles}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shadowGuides.groupTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.groups}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{shadowGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{shadowGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {shadowGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{shadowGuides.shadowTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>

              <div className="yw-shadow-grid">
                {section.roles.map((role) => (
                  <ShadowCard key={role.token} resolvedTokens={resolvedTokens} role={role} />
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
