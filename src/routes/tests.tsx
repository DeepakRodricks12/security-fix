import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/security/Shell";
import { Metric, PageHeader, Panel } from "@/components/security/Panel";
import { testSuite } from "@/data/security";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "Regression Tests — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Generated security regression tests with pass results proving each remediation holds.",
      },
      { property: "og:title", content: "Regression Tests — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "24 of 24 security tests passing, 6 newly generated for this remediation run.",
      },
    ],
  }),
  component: Tests,
});

function Tests() {
  return (
    <Shell>
      <PageHeader
        eyebrow="Tests"
        title="Regression tests"
        description="Tests generated alongside each remediation so a fix can be proven, not just claimed."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Suite total" value="24 passing" />
        <Metric label="Generated this run" value="6 new" />
        <Metric label="Failures" value="0" />
      </div>

      <Panel title="Test results">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="label-xs py-2 pr-4">Test</th>
                <th className="label-xs py-2 pr-4">Finding</th>
                <th className="label-xs py-2 pr-4">Duration</th>
                <th className="label-xs py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {testSuite.map((t) => (
                <tr key={t.name} className="border-b border-border/50">
                  <td className="py-2.5 pr-4 font-mono text-xs text-foreground/85">{t.name}</td>
                  <td className="py-2.5 pr-4">
                    <Link
                      to="/findings/$id"
                      params={{ id: t.finding }}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {t.finding}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{t.ms} ms</td>
                  <td className="py-2.5 font-mono text-[10px] tracking-[0.18em] text-primary">
                    ✓ {t.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}
