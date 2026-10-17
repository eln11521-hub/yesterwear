import {
  componentCatalogEntries,
  componentCategoryOrder,
  type ComponentCatalogEntry,
} from "../../storybook/componentCatalog";
import { storybookCopy } from "../_shared/copy";

type CatalogGroup = {
  category: string;
  entries: readonly ComponentCatalogEntry[];
};

const catalogGroups = componentCategoryOrder
  .map((category) => ({
    category,
    entries: componentCatalogEntries.filter((entry) => entry.category === category),
  }))
  .filter((group) => group.entries.length > 0) satisfies CatalogGroup[];

function CatalogTags({ values }: { values: readonly string[] }) {
  return (
    <span className="yw-component-catalog__tag-list">
      {values.map((value) => (
        <span className="yw-component-catalog__tag" key={value}>
          {value}
        </span>
      ))}
    </span>
  );
}

function CatalogStats() {
  const copy = storybookCopy.componentCatalog;

  return (
    <section className="yw-panel">
      <h2 className="yw-panel__heading">{copy.statsTitle}</h2>
      <div className="yw-meta-grid">
        <div className="yw-meta-card">
          <span className="yw-meta-card__label">{copy.categoriesLabel}</span>
          <span className="yw-meta-card__value">{catalogGroups.length}</span>
        </div>
        <div className="yw-meta-card">
          <span className="yw-meta-card__label">{copy.componentsLabel}</span>
          <span className="yw-meta-card__value">{componentCatalogEntries.length}</span>
        </div>
        <div className="yw-meta-card">
          <span className="yw-meta-card__label">{copy.metadataLabel}</span>
          <span className="yw-meta-card__value">{copy.metadataValue}</span>
        </div>
      </div>
    </section>
  );
}

function CatalogGroupTable({ group }: { group: CatalogGroup }) {
  const copy = storybookCopy.componentCatalog;

  return (
    <section className="yw-panel">
      <h2 className="yw-panel__heading">{group.category}</h2>
      <div className="yw-token-table-wrap">
        <table className="yw-token-table yw-component-catalog__table">
          <thead>
            <tr>
              <th>{copy.tableHeaders.component}</th>
              <th>{copy.tableHeaders.role}</th>
              <th>{copy.tableHeaders.useWhen}</th>
              <th>{copy.tableHeaders.dependencies}</th>
              <th>{copy.tableHeaders.keywords}</th>
            </tr>
          </thead>
          <tbody>
            {group.entries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <strong className="yw-component-catalog__name">{entry.name}</strong>
                  <span className="yw-component-catalog__path">{entry.storyTitle}</span>
                  <span className="yw-component-catalog__purpose">{entry.purpose}</span>
                </td>
                <td>{entry.compositionRole}</td>
                <td>{entry.useWhen.join(" ")}</td>
                <td>
                  {entry.dependencies?.length ? (
                    <CatalogTags values={entry.dependencies} />
                  ) : (
                    <span className="yw-component-catalog__empty">
                      {copy.emptyDependencies}
                    </span>
                  )}
                </td>
                <td>
                  <CatalogTags values={entry.keywords} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ComponentCatalog() {
  const copy = storybookCopy.componentCatalog;

  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{copy.eyebrow}</div>
          <h1 className="yw-story-title">{copy.title}</h1>
          <p className="yw-story-lead">{copy.lead}</p>
        </header>

        <CatalogStats />

        {catalogGroups.map((group) => (
          <CatalogGroupTable group={group} key={group.category} />
        ))}
      </div>
    </main>
  );
}
