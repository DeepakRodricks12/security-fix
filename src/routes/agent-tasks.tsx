import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/security/Shell";
import { PageHeader, Panel } from "@/components/security/Panel";
import { agentTasks, terminalLog } from "@/data/security";

export const Route = createFileRoute("/agent-tasks")({
  head: () => ({
    meta: [
      { title: "Agent Tasks — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Bob 2.0 security agent task execution: reconnaissance, analysis, remediation, test generation and verification.",
      },
      { property: "og:title", content: "Agent Tasks — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "Simulated agent pipeline from repository reconnaissance to verified fixes.",
      },
    ],
  }),
  component: AgentTasks,
});

function AgentTasks() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Agent Tasks"
        title="BOB 2.0 SECURITY AGENTS"
        description="Simulated execution trace of the security agent pipeline for this demo repository."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Task execution">
          <ol className="space-y-3">
            {agentTasks.map((t, i) => (
              <li key={t.name} className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-primary">✓</span>
                <span className="flex-1">
                  <span className="block font-mono text-sm text-foreground">{t.name}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                    {t.detail}
                  </span>
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-primary">DONE</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Agent console">
          <div className="scanlines border border-border bg-black/80 p-4">
            {terminalLog.map((l) => (
              <p key={l} className="font-mono text-xs leading-relaxed text-primary/90">
                {l}
              </p>
            ))}
            <p className="font-mono text-xs text-primary">
              &gt; <span className="caret">_</span>
            </p>
          </div>
          <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground">
            OUTPUT IS A SCRIPTED DEMO TRACE. LIVE ANALYSIS WILL BE EXECUTED BY IBM BOB 2.0
            AGAINST THE REPOSITORY.
          </p>
        </Panel>
      </div>
    </Shell>
  );
}
