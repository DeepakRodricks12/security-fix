import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/security/Shell";
import { Panel, Metric } from "@/components/security/Panel";
import { SeverityBadge, StatusBadge } from "@/components/security/Severity";
import {
  agentTasks,
  findings,
  productivity,
  repository,
  severityCounts,
  terminalLog,
  type Severity,
} from "@/data/security";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Security Overview — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Severity summary, remediated findings and agent activity for breach-guardians-demo.",
      },
      { property: "og:title", content: "Security Overview — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "Find it. Fix it. Prove it. 5 findings identified, 0 unresolved.",
      },
    ],
  }),
  component: Overview,
});

const sevColor: Record<Severity, string> = {
  CRITICAL: "text-critical",
  HIGH: "text-high",
  MEDIUM: "text-medium",
  LOW: "text-low",
};

function Overview() {
  const [running, setRunning] = useState(false);

  return (
    <Shell>
      <div className="mb-8">
        <p className="label-xs">Breach Guardians SecurityFix</p>
        <h1 className="mt-2 font-pixel text-base leading-relaxed text-primary glow-text sm:text-xl">
          FIND IT. FIX IT. PROVE IT.
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Repository" className="lg:col-span-2">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="label-xs">Repository</dt>
              <dd className="mt-1 font-mono text-sm text-primary">{repository.name}</dd>
            </div>
            <div>
              <dt className="label-xs">Branch</dt>
              <dd className="mt-1 font-mono text-sm">{repository.branch}</dd>
            </div>
            <div>
              <dt className="label-xs">Status</dt>
              <dd className="mt-1 font-mono text-sm text-primary">{repository.status}</dd>
            </div>
          </dl>
          <button
            onClick={() => {
              setRunning(true);
              setTimeout(() => setRunning(false), 2200);
            }}
            className="glow mt-5 w-full border border-primary bg-primary/10 px-5 py-3 font-mono text-xs tracking-[0.2em] text-primary transition-colors hover:bg-primary/20 sm:w-auto"
          >
            {running ? "ANALYZING…" : "RUN SECURITY ANALYSIS"}
          </button>
          {running && (
            <p className="mt-3 font-mono text-[11px] tracking-widest text-muted-foreground">
              &gt; REPLAYING DEMO ANALYSIS<span className="caret">_</span>
            </p>
          )}
        </Panel>

        <Panel title="Security summary">
          <ul className="space-y-2">
            {(Object.keys(severityCounts) as Severity[]).map((s) => (
              <li key={s} className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className={`font-mono text-[11px] tracking-[0.18em] ${sevColor[s]}`}>{s}</span>
                <span className={`font-mono text-lg ${sevColor[s]}`}>{severityCounts[s]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border border-critical/40 bg-critical/5 px-3 py-2">
              <p className="label-xs">Before</p>
              <p className="mt-1 font-mono text-sm text-critical">5 findings</p>
            </div>
            <div className="border border-primary/40 bg-primary/5 px-3 py-2">
              <p className="label-xs">After</p>
              <p className="mt-1 font-mono text-sm text-primary">0 unresolved</p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Security findings"
          className="lg:col-span-2"
          aside={
            <Link to="/findings" className="font-mono text-[10px] tracking-[0.18em] text-primary">
              VIEW ALL →
            </Link>
          }
        >
          <ul className="divide-y divide-border/60">
            {findings.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center gap-3 py-3">
                <SeverityBadge severity={f.severity} />
                <div className="min-w-[180px] flex-1">
                  <p className="font-mono text-sm text-foreground">{f.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {f.file}:{f.line}
                  </p>
                </div>
                <StatusBadge status={f.status} />
                <Link
                  to="/findings/$id"
                  params={{ id: f.id }}
                  className="border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-primary hover:bg-primary/10"
                >
                  VIEW DETAILS
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Bob 2.0 Security Agents">
          <ul className="space-y-1.5">
            {agentTasks.map((t) => (
              <li key={t.name} className="flex items-baseline gap-2 font-mono text-[11px]">
                <span className="text-primary">✓</span>
                <span className="flex-1 text-foreground/85">{t.name}</span>
                <span className="text-muted-foreground">{t.detail}</span>
              </li>
            ))}
          </ul>
          <div className="scanlines mt-4 border border-border bg-black/80 p-3">
            {terminalLog.map((l) => (
              <p key={l} className="font-mono text-[11px] leading-relaxed text-primary/85">
                {l}
              </p>
            ))}
            <p className="font-mono text-[11px] text-primary">
              &gt; <span className="caret">_</span>
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="label-xs text-primary/90">Developer productivity</h2>
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
    </Shell>
  );
}
