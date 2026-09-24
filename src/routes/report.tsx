import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/security/Shell";
import { Metric, PageHeader, Panel } from "@/components/security/Panel";
import { SeverityBadge, StatusBadge } from "@/components/security/Severity";
import {
  findings,
  productivity,
  repository,
  severityCounts,
  testSuite,
  type Severity,
} from "@/data/security";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Security Report — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Executive security report for breach-guardians-demo: findings, remediation, tests and verification results.",
      },
      { property: "og:title", content: "Security Report — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "5 findings remediated, 6 regression tests generated, 0 unresolved issues.",
      },
    ],
  }),
  component: Report,
});

function Report() {
  const [exported, setExported] = useState(false);

  return (
    <Shell>
      <PageHeader
        eyebrow="Security Report"
        title="Security remediation report"
        description="Demo report covering the full find → fix → prove cycle for this repository."
        action={
          <button
            onClick={() => setExported(true)}
            className="glow border border-primary bg-primary/10 px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] text-primary hover:bg-primary/20"
          >
            {exported ? "REPORT QUEUED ✓" : "EXPORT SECURITY REPORT"}
          </button>
        }
      />

      <div className="space-y-4">
        <Panel title="Executive summary">
          <p className="text-sm leading-relaxed text-foreground/85">
            A full security pass over <span className="font-mono text-primary">{repository.name}</span>{" "}
            identified 5 findings, including 2 critical issues with direct data-exposure impact.
            All 5 were remediated, each fix paired with a generated regression test, and the
            suite verified green. The repository currently has 0 unresolved findings.
          </p>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Repository overview">
            <dl className="space-y-2 font-mono text-xs">
              {[
                ["Repository", repository.name],
                ["Branch", repository.branch],
                ["Commit", repository.commit],
                ["Primary language", repository.language],
                ["Files analyzed", String(repository.files)],
                ["Last scan", repository.lastScan],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border/50 pb-1.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Severity breakdown">
            <ul className="space-y-2 font-mono text-xs">
              {(Object.keys(severityCounts) as Severity[]).map((s) => (
                <li key={s} className="flex items-center justify-between border-b border-border/50 pb-1.5">
                  <SeverityBadge severity={s} />
                  <span>
                    {severityCounts[s]} identified · {severityCounts[s]} resolved
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Findings & remediation">
          <div className="space-y-4">
            {findings.map((f) => (
              <article key={f.id} className="border-l-2 border-primary/40 pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {f.id} — {f.title}
                  </span>
                  <SeverityBadge severity={f.severity} />
                  <StatusBadge status={f.status} />
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {f.file}:{f.line}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  <span className="label-xs mr-2">Remediation</span>
                  {f.remediation}
                </p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Tests generated & verification">
          <ul className="space-y-1.5 font-mono text-xs">
            {testSuite.map((t) => (
              <li key={t.name} className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="flex-1 text-foreground/85">{t.name}</span>
                <span className="text-muted-foreground">{t.finding}</span>
                <span className="text-primary">{t.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-xs text-primary">
            &gt; 24 / 24 SECURITY TESTS PASSED — ALL FIXES VERIFIED
          </p>
        </Panel>

        <div>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="label-xs text-primary/90">Developer productivity impact</h2>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
              DEMO MEASUREMENTS — NOT PRODUCTION BENCHMARKS
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {productivity.map((m) => (
              <Metric key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
