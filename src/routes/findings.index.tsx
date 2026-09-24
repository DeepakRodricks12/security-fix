import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/security/Shell";
import { PageHeader, Panel } from "@/components/security/Panel";
import { SeverityBadge, StatusBadge } from "@/components/security/Severity";
import { findings, type Severity } from "@/data/security";

export const Route = createFileRoute("/findings/")({
  head: () => ({
    meta: [
      { title: "Security Findings — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Five remediated vulnerabilities with severity, affected file, code path and verified fixes.",
      },
      { property: "og:title", content: "Security Findings — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "SQL injection, hardcoded secrets, broken authorization and more — all fixed.",
      },
    ],
  }),
  component: FindingsPage,
});

const filters = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

function FindingsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const visible = findings.filter((f) => filter === "ALL" || f.severity === (filter as Severity));

  return (
    <Shell>
      <PageHeader
        eyebrow="Findings"
        title="Security findings"
        description="Every finding identified in breach-guardians-demo, with the remediation and regression test that proves it."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-colors ${
              filter === f
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((f) => (
          <Panel key={f.id} title={f.id}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-base text-foreground">{f.title}</h3>
              <SeverityBadge severity={f.severity} />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              {f.file}:{f.line}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{f.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={f.status} />
              <Link
                to="/findings/$id"
                params={{ id: f.id }}
                className="border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-primary hover:bg-primary/10"
              >
                VIEW DETAILS
              </Link>
              <Link
                to="/findings/$id"
                params={{ id: f.id }}
                hash="fix"
                className="border border-primary/50 bg-primary/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-primary hover:bg-primary/20"
              >
                VIEW FIX
              </Link>
            </div>
          </Panel>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="panel px-4 py-6 font-mono text-xs text-muted-foreground">
          &gt; NO FINDINGS AT THIS SEVERITY<span className="caret">_</span>
        </p>
      )}
    </Shell>
  );
}
