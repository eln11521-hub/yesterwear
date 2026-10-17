import { storybookCopy } from "../_shared/copy";

function GovernancePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="yw-panel">
      <h2 className="yw-panel__heading">{title}</h2>
      <ul className="yw-governance-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function GovernanceOverview() {
  return (
    <main className="yw-story-shell">
      <div className="yw-story-stack">
        <header className="yw-story-header">
          <div className="yw-story-eyebrow">{storybookCopy.governance.eyebrow}</div>
          <h1 className="yw-story-title">{storybookCopy.governance.title}</h1>
          <p className="yw-story-lead">{storybookCopy.governance.lead}</p>
        </header>

        <GovernancePanel
          items={storybookCopy.governance.findings}
          title={storybookCopy.governance.findingsTitle}
        />
        <GovernancePanel
          items={storybookCopy.governance.workflow}
          title={storybookCopy.governance.workflowTitle}
        />
        <GovernancePanel
          items={storybookCopy.governance.folders}
          title={storybookCopy.governance.architectureTitle}
        />
      </div>
    </main>
  );
}
