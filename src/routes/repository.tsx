import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/security/Shell";
import { PageHeader, Panel } from "@/components/security/Panel";
import { SeverityBadge } from "@/components/security/Severity";
import { findings, repository } from "@/data/security";

export const Route = createFileRoute("/repository")({
  head: () => ({
    meta: [
      { title: "Repository — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Repository metadata and the affected files touched by this security remediation run.",
      },
      { property: "og:title", content: "Repository — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "breach-guardians-demo @ main — 128 files analyzed, 5 files remediated.",
      },
    ],
  }),
  component: Repository,
});

function Repository() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Repository"
        title={repository.name}
        description="Connected demo repository. Live repositories will be attached through IBM Bob 2.0."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Metadata">
          <dl className="space-y-2 font-mono text-xs">
            {[
              ["Branch", repository.branch],
              ["Commit", repository.commit],
              ["Primary language", repository.language],
              ["Files analyzed", String(repository.files)],
              ["Last scan", repository.lastScan],
              ["Status", repository.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/50 pb-1.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Affected files">
          <ul className="space-y-2">
            {findings.map((f) => (
              <li key={f.id} className="flex items-center gap-3 border-b border-border/50 pb-2">
                <SeverityBadge severity={f.severity} />
                <Link
                  to="/findings/$id"
                  params={{ id: f.id }}
                  className="flex-1 font-mono text-xs text-primary hover:underline"
                >
                  {f.file}
                </Link>
                <span className="font-mono text-[11px] text-muted-foreground">L{f.line}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}
