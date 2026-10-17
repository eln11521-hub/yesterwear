import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type SizePreview = "width" | "height" | "square";

type SizeRole = {
  label: string;
  token: string;
  guidance: string;
  preview: SizePreview;
};

type SizeSection = {
  title: string;
  summary: string;
  roles: SizeRole[];
};

const sizeGuides = storybookCopy.sizeGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = sizeGuides.sections as SizeSection[];
const allSizeTokenNames = Array.from(
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
  return tokenByName.get(tokenName)?.value ?? sizeGuides.unknownValue;
}

function SizeTokenMeta({
  token,
  resolvedTokens,
}: {
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <dl className="yw-foundation-token-meta">
      <div>
        <dt>{sizeGuides.tokenLabel}</dt>
        <dd>
          <code>{token}</code>
        </dd>
      </div>
      <div>
        <dt>{sizeGuides.valueLabel}</dt>
        <dd>
          <code>{getAuthoredValue(token)}</code>
        </dd>
      </div>
      <div>
        <dt>{sizeGuides.resolvedLabel}</dt>
        <dd>
          <code>{resolvedTokens[token]}</code>
        </dd>
      </div>
    </dl>
  );
}

function SizeCard({
  role,
  resolvedTokens,
}: {
  role: SizeRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const sizeStyle = {
    "--yw-size-guide-size": `var(${role.token})`,
  } as CSSProperties;

  return (
    <article className="yw-size-card">
      <div className="yw-size-card__visual" style={sizeStyle}>
        <div className="yw-size-card__track">
          <span
            aria-label={role.label}
            className="yw-size-card__sample"
            data-preview={role.preview}
          />
        </div>
        <code>{resolvedTokens[role.token]}</code>
      </div>

      <div className="yw-size-card__content">
        <h3 className="yw-size-card__title">{role.label}</h3>
        <div className="yw-guide-usage">
          <span>{sizeGuides.usageLabel}</span>
          <p>{role.guidance}</p>
        </div>
        <SizeTokenMeta resolvedTokens={resolvedTokens} token={role.token} />
      </div>
    </article>
  );
}

export function SizeGuides() {
  const resolvedTokens = useResolvedTokens(allSizeTokenNames);
  const tokenCounts = useMemo(
    () => ({
      roles: sections.reduce((count, section) => count + section.roles.length, 0),
      groups: sections.length,
      rules: sizeGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{sizeGuides.eyebrow}</div>
          <h1 className="yw-story-title">{sizeGuides.title}</h1>
          <p className="yw-story-lead">{sizeGuides.lead}</p>
        </header>

        <section aria-label={sizeGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{sizeGuides.sizeTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.roles}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{sizeGuides.groupTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.groups}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{sizeGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{sizeGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {sizeGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{sizeGuides.sizeTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>

              <div className="yw-size-grid">
                {section.roles.map((role) => (
                  <SizeCard key={role.token} resolvedTokens={resolvedTokens} role={role} />
                ))}
              </div>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
