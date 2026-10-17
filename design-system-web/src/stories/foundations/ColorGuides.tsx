import { useEffect, useMemo, useState, type CSSProperties } from "react";

import { storybookCopy } from "../_shared/copy";
import { tokenCatalog } from "../_shared/tokenData";

type ResolvedTokenMap = Record<string, string>;

type ColorGuideRole = {
  label: string;
  token: string;
  onToken?: string;
  guidance: string;
  avoid: string;
};

type ColorGuideSection = {
  title: string;
  summary: string;
  roles: ColorGuideRole[];
};

type PaletteToken = {
  label: string;
  token: string;
};

type PaletteGroup = {
  title: string;
  summary: string;
  tokens: PaletteToken[];
};

const colorGuides = storybookCopy.colorGuides;
const tokenByName = new Map(tokenCatalog.map((token) => [token.name, token]));

const sections = colorGuides.sections as ColorGuideSection[];
const palettes = colorGuides.palettes as PaletteGroup[];

const allGuideTokenNames = Array.from(
  new Set([
    ...sections.flatMap((section) =>
      section.roles.flatMap((role) => [role.token, role.onToken].filter(Boolean)),
    ),
    ...palettes.flatMap((palette) => palette.tokens.map((token) => token.token)),
  ]),
) as string[];

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
  return tokenByName.get(tokenName)?.value ?? colorGuides.unknownValue;
}

function ColorTokenMeta({
  label,
  token,
  resolvedTokens,
}: {
  label: string;
  token: string;
  resolvedTokens: ResolvedTokenMap;
}) {
  return (
    <dl className="yw-color-token-meta">
      <div>
        <dt>{label}</dt>
        <dd>
          <code>{token}</code>
        </dd>
      </div>
      <div>
        <dt>{colorGuides.valueLabel}</dt>
        <dd>
          <code>{getAuthoredValue(token)}</code>
        </dd>
      </div>
      <div>
        <dt>{colorGuides.resolvedLabel}</dt>
        <dd>
          <code>{resolvedTokens[token]}</code>
        </dd>
      </div>
    </dl>
  );
}

function ColorRoleCard({
  role,
  resolvedTokens,
}: {
  role: ColorGuideRole;
  resolvedTokens: ResolvedTokenMap;
}) {
  const swatchStyle = {
    "--yw-color-guide-swatch": `var(${role.token})`,
  } as CSSProperties;

  return (
    <article className="yw-color-card">
      <div aria-label={role.label} className="yw-color-card__swatch" style={swatchStyle} />

      <div className="yw-color-card__body">
        <div className="yw-color-card__content">
          <h3 className="yw-color-card__title">{role.label}</h3>

          <ColorTokenMeta
            label={colorGuides.tokenLabel}
            resolvedTokens={resolvedTokens}
            token={role.token}
          />

          {role.onToken ? (
            <ColorTokenMeta
              label={colorGuides.foregroundLabel}
              resolvedTokens={resolvedTokens}
              token={role.onToken}
            />
          ) : (
            <p className="yw-color-card__note">{colorGuides.noForeground}</p>
          )}
        </div>

        <div className="yw-color-guidance">
          <div>
            <span>{colorGuides.guidanceLabel}</span>
            <p>{role.guidance}</p>
          </div>
          <div>
            <span>{colorGuides.avoidLabel}</span>
            <p>{role.avoid}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function PaletteSwatch({
  color,
  resolvedTokens,
}: {
  color: PaletteToken;
  resolvedTokens: ResolvedTokenMap;
}) {
  const swatchStyle = {
    "--yw-color-guide-swatch": `var(${color.token})`,
  } as CSSProperties;

  return (
    <li className="yw-palette-swatch">
      <span aria-label={color.label} className="yw-palette-swatch__chip" style={swatchStyle} />
      <span className="yw-palette-swatch__label">{color.label}</span>
      <code>{color.token}</code>
      <code>{resolvedTokens[color.token]}</code>
    </li>
  );
}

export function ColorGuides() {
  const resolvedTokens = useResolvedTokens(allGuideTokenNames);
  const tokenCounts = useMemo(
    () => ({
      semantic: sections.reduce((count, section) => count + section.roles.length, 0),
      reference: palettes.reduce((count, palette) => count + palette.tokens.length, 0),
      rules: colorGuides.rules.length,
    }),
    [],
  );

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{colorGuides.eyebrow}</div>
          <h1 className="yw-story-title">{colorGuides.title}</h1>
          <p className="yw-story-lead">{colorGuides.lead}</p>
        </header>

        <section aria-label={colorGuides.rulesTitle} className="yw-meta-grid">
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{colorGuides.semanticTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.semantic}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{colorGuides.referenceTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.reference}</strong>
          </div>
          <div className="yw-meta-card">
            <span className="yw-meta-card__label">{colorGuides.rulesTitle}</span>
            <strong className="yw-meta-card__value">{tokenCounts.rules}</strong>
          </div>
        </section>

        <section className="yw-panel">
          <h2 className="yw-panel__heading">{colorGuides.rulesTitle}</h2>
          <ul className="yw-governance-list">
            {colorGuides.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{colorGuides.semanticTitle}</h2>
          </header>

          {sections.map((section) => (
            <section className="yw-panel" key={section.title}>
              <div>
                <h3 className="yw-panel__heading">{section.title}</h3>
                <p className="yw-panel__body">{section.summary}</p>
              </div>
              <div className="yw-color-grid">
                {section.roles.map((role) => (
                  <ColorRoleCard key={role.token} resolvedTokens={resolvedTokens} role={role} />
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="yw-token-section">
          <header>
            <h2 className="yw-token-section__title">{colorGuides.referenceTitle}</h2>
          </header>

          {palettes.map((palette) => (
            <section className="yw-panel" key={palette.title}>
              <div>
                <h3 className="yw-panel__heading">{palette.title}</h3>
                <p className="yw-panel__body">{palette.summary}</p>
              </div>
              <ul className="yw-palette-grid">
                {palette.tokens.map((color) => (
                  <PaletteSwatch
                    color={color}
                    key={color.token}
                    resolvedTokens={resolvedTokens}
                  />
                ))}
              </ul>
            </section>
          ))}
        </section>
      </div>
    </main>
  );
}
