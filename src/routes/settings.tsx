import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/security/Shell";
import { PageHeader, Panel } from "@/components/security/Panel";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Breach Guardians SecurityFix" },
      {
        name: "description",
        content: "Scan policy, severity gates and agent preferences for the SecurityFix workspace.",
      },
      { property: "og:title", content: "Settings — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "Configure scan policy, severity gates and agent behavior.",
      },
    ],
  }),
  component: Settings,
});

const toggles = [
  { key: "auto", label: "Auto-scan on push", detail: "Run analysis on every push to main" },
  { key: "tests", label: "Generate regression tests", detail: "Write a test for each remediation" },
  { key: "block", label: "Block merge on CRITICAL", detail: "Fail CI when a critical finding is open" },
  { key: "deps", label: "Dependency advisories", detail: "Track published CVEs for pinned versions" },
];

function Settings() {
  const [on, setOn] = useState<Record<string, boolean>>({
    auto: true,
    tests: true,
    block: true,
    deps: false,
  });

  return (
    <Shell>
      <PageHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Prototype controls. Nothing here is persisted yet."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Scan policy">
          <ul className="space-y-3">
            {toggles.map((t) => (
              <li key={t.key} className="flex items-center justify-between gap-4 border-b border-border/50 pb-3">
                <div>
                  <p className="font-mono text-sm text-foreground">{t.label}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{t.detail}</p>
                </div>
                <button
                  onClick={() => setOn((p) => ({ ...p, [t.key]: !p[t.key] }))}
                  className={`shrink-0 border px-3 py-1 font-mono text-[10px] tracking-[0.18em] transition-colors ${
                    on[t.key]
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {on[t.key] ? "ON" : "OFF"}
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Severity gate">
          <p className="text-sm leading-relaxed text-foreground/80">
            Minimum severity that blocks a release.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s, i) => (
              <span
                key={s}
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] ${
                  i === 0
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="mt-5 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground">
            AGENT RUNTIME: IBM BOB 2.0 (NOT CONNECTED IN THIS PROTOTYPE)
          </p>
        </Panel>
      </div>
    </Shell>
  );
}
