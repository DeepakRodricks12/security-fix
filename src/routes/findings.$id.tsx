import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/security/Shell";
import { CodeBlock, PageHeader, Panel } from "@/components/security/Panel";
import { SeverityBadge, StatusBadge } from "@/components/security/Severity";
import { findings } from "@/data/security";

export const Route = createFileRoute("/findings/$id")({
  loader: ({ params }) => {
    const finding = findings.find((f) => f.id === params.id);
    if (!finding) throw notFound();
    return { finding };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Finding not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { finding } = loaderData;
    const description = `${finding.severity} · ${finding.file}:${finding.line} — ${finding.description}`;
    return {
      meta: [
        { title: `${finding.title} — Breach Guardians SecurityFix` },
        { name: "description", content: description },
        { property: "og:title", content: `${finding.title} — ${finding.severity}` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: FindingDetail,
});

function FindingDetail() {
  const { finding } = Route.useLoaderData();

  return (
    <Shell>
      <Link
        to="/findings"
        className="mb-4 inline-block font-mono text-[10px] tracking-[0.18em] text-muted-foreground hover:text-primary"
      >
        ← ALL FINDINGS
      </Link>
      <PageHeader
        eyebrow={`${finding.id} · ${finding.file}:${finding.line}`}
        title={finding.title}
        action={
          <div className="flex gap-2">
            <SeverityBadge severity={finding.severity} />
            <StatusBadge status={finding.status} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Vulnerability description">
            <p className="text-sm leading-relaxed text-foreground/85">{finding.description}</p>
          </Panel>

          <Panel title="Security impact">
            <p className="text-sm leading-relaxed text-foreground/85">{finding.impact}</p>
          </Panel>

          <Panel title="Recommended remediation">
            <p className="text-sm leading-relaxed text-foreground/85">{finding.remediation}</p>
          </Panel>

          <Panel title="Fix" className="scroll-mt-6">
            <div id="fix" className="grid gap-4 md:grid-cols-2">
              <CodeBlock label="Before" code={finding.before} tone="before" />
              <CodeBlock label="After" code={finding.after} tone="after" />
            </div>
          </Panel>

          <Panel title="Regression test">
            <p className="mb-2 font-mono text-[11px] text-muted-foreground">
              {finding.test.name}
            </p>
            <CodeBlock code={finding.test.code} />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Affected file">
            <p className="font-mono text-sm text-primary">{finding.file}</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Line {finding.line}
            </p>
          </Panel>

          <Panel title="Affected code path">
            <p className="font-mono text-[11px] leading-relaxed text-foreground/80">
              {finding.codePath}
            </p>
          </Panel>

          <Panel title="Verification result">
            <ul className="space-y-2">
              {finding.verification.map((v) => (
                <li key={v} className="flex items-center gap-2 font-mono text-xs text-primary">
                  <span>✓</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}
