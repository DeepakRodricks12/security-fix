import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "IBM Bob 2.0 Hackathon pitch: how IBM Bob was used to discover, analyze, fix, test and re-audit security vulnerabilities.",
      },
      { property: "og:title", content: "Presentation — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "Discover → Analyze → Fix → Test → Re-audit with IBM Bob. Find it. Fix it. Prove it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Presentation,
});

const Tag = ({ children }: { children: ReactNode }) => (
  <p className="font-mono text-xs tracking-[0.2em] text-primary sm:text-sm">{children}</p>
);

const Term = ({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) => (
  <div className={`border border-primary/40 bg-card ${className}`}>
    <div className="flex items-center gap-2 border-b border-primary/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
      <span className="h-2 w-2 bg-primary" />
      <span className="h-2 w-2 bg-primary/50" />
      <span className="h-2 w-2 bg-primary/25" />
      <span className="ml-2">{title}</span>
    </div>
    <div className="p-4 font-mono text-sm">{children}</div>
  </div>
);

const Pixel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-pixel leading-tight text-primary glow-text ${className}`}>{children}</h2>
);

const Flow = ({ steps, vertical = false }: { steps: string[]; vertical?: boolean }) => (
  <div className={`flex ${vertical ? "flex-col items-start" : "flex-wrap items-center justify-center"} gap-2 font-mono text-xs sm:text-sm`}>
    {steps.map((s, i) => (
      <span key={s} className="flex items-center gap-2">
        <span className="border border-primary/50 px-2 py-1 text-primary">{s}</span>
        {i < steps.length - 1 && <span className="text-primary/60">{vertical ? "↓" : "→"}</span>}
      </span>
    ))}
  </div>
);

const LOOP = "DISCOVER → ANALYZE → FIX → TEST → RE-AUDIT";

function Typed({ lines }: { lines: string[] }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= lines.length) return;
    const t = setTimeout(() => setN(n + 1), 550);
    return () => clearTimeout(t);
  }, [n, lines.length]);
  return (
    <div className="space-y-1 font-mono text-sm text-primary/90">
      {lines.slice(0, n).map((l) => (
        <p key={l}>{l}</p>
      ))}
      <span className="inline-block h-4 w-2 animate-pulse bg-primary align-middle" />
    </div>
  );
}

const slides: { key: string; render: () => ReactNode }[] = [
  {
    key: "title",
    render: () => (
      <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
        <Typed lines={["> INITIALIZING SECURITYFIX...", "> IBM BOB 2.0 SECURITY WORKFLOW ONLINE"]} />
        <div className="space-y-4">
          <Pixel className="text-3xl sm:text-5xl lg:text-6xl">BREACH GUARDIANS</Pixel>
          <Pixel className="text-xl sm:text-3xl">SECURITYFIX</Pixel>
        </div>
        <p className="font-mono text-sm tracking-widest text-muted-foreground sm:text-base">
          AI-ASSISTED SECURITY REMEDIATION WITH IBM BOB
        </p>
        <p className="font-pixel text-sm text-primary sm:text-lg">FIND IT. FIX IT. PROVE IT.</p>
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">[ IBM BOB 2.0 HACKATHON ]</p>
      </div>
    ),
  },
  {
    key: "problem",
    render: () => (
      <div className="grid h-full items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Tag>[ SECURITY GAP DETECTED ]</Tag>
          <Pixel className="text-xl sm:text-3xl lg:text-4xl">FINDING A VULNERABILITY IS ONLY THE BEGINNING.</Pixel>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Teams need more than discovery: understand the root cause, implement the right fix, generate
            regression tests, and verify the remediation actually worked.
          </p>
          <p className="border-l-2 border-primary pl-4 font-mono text-primary">
            Detection without verification is incomplete.
          </p>
        </div>
        <Term title="pipeline.sh">
          <Flow vertical steps={["DETECT", "UNDERSTAND", "REMEDIATE", "TEST", "VERIFY"]} />
        </Term>
      </div>
    ),
  },
  {
    key: "workflow",
    render: () => {
      const steps = ["REPOSITORY", "RECONNAISSANCE", "SECURITY ANALYSIS", "VULNERABILITY IDENTIFICATION", "CODE-PATH ANALYSIS", "REMEDIATION", "REGRESSION TESTS", "RE-AUDIT"];
      return (
        <div className="flex h-full flex-col justify-center gap-8">
          <Tag>[ SECURITYFIX // WORKFLOW ]</Tag>
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <Flow vertical steps={steps.slice(0, 4)} />
            <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center border-2 border-primary text-center shadow-[var(--glow-strong)] sm:h-48 sm:w-48">
              <span className="font-mono text-[10px] text-muted-foreground">[ CORE ]</span>
              <Pixel className="mt-2 text-base sm:text-xl">IBM BOB 2.0</Pixel>
            </div>
            <Flow vertical steps={steps.slice(4)} />
          </div>
          <p className="text-center font-pixel text-xs text-primary sm:text-sm">{LOOP}</p>
          <p className="text-center text-muted-foreground">
            SecurityFix uses IBM Bob as an AI-assisted security-development partner across the remediation lifecycle.
          </p>
        </div>
      );
    },
  },
  {
    key: "findings",
    render: () => {
      const f = [
        ["SQL INJECTION", "CWE-89"],
        ["BROKEN ACCESS CONTROL", "CWE-862"],
        ["INSECURE CONFIGURATION EXPOSURE", ""],
        ["SPOOFABLE IDENTITY HEADER", ""],
      ];
      return (
        <div className="flex h-full flex-col justify-center gap-6">
          <Tag>[ BOB SECURITY SCAN ]</Tag>
          <Pixel className="text-2xl sm:text-4xl">4 SECURITY FINDINGS</Pixel>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {f.map(([name, cwe], i) => (
              <div key={name} className="border border-critical/60 bg-card p-4">
                <p className="font-mono text-[10px] text-critical">FINDING 0{i + 1}</p>
                <p className="mt-3 font-mono text-sm font-semibold text-foreground">{name}</p>
                {cwe && <p className="mt-2 font-mono text-xs text-primary">{cwe}</p>}
              </div>
            ))}
          </div>
          <Term title="attack-path">
            <p className="text-primary">USER INPUT → APPLICATION → <span className="text-critical">VULNERABLE CODE</span></p>
          </Term>
          <p className="font-mono text-xs tracking-widest text-muted-foreground">[ READ-ONLY SECURITY AUDIT ]</p>
        </div>
      );
    },
  },
  {
    key: "fixes",
    render: () => (
      <div className="flex h-full flex-col justify-center gap-6">
        <Tag>[ REMEDIATION ]</Tag>
        <div className="grid gap-4 md:grid-cols-2">
          <Term title="BEFORE // 580a0da" className="border-critical/60">
            <ul className="space-y-2 text-critical">
              {["SQL STRING INTERPOLATION", "X-DEMO-USER", "UNRESTRICTED USER ACCESS", "CONFIGURATION EXPOSURE"].map((x) => (
                <li key={x}>- {x}</li>
              ))}
            </ul>
          </Term>
          <Term title="AFTER // 1c9e7bd">
            <ul className="space-y-2 text-primary">
              {["PARAMETERIZED SQL QUERIES", "FLASK SIGNED-SESSION IDENTITY", "OWNERSHIP-BASED AUTHORIZATION", "CONFIGURATION REMOVED FROM API", "SPOOFABLE IDENTITY MECHANISM ELIMINATED"].map((x) => (
                <li key={x}>+ {x}</li>
              ))}
            </ul>
          </Term>
        </div>
        <p className="font-mono text-sm text-primary">SCOPE: security-demo/ ONLY</p>
        <p className="text-muted-foreground">Targeted remediation without unnecessary changes to the application.</p>
      </div>
    ),
  },
  {
    key: "tests",
    render: () => (
      <div className="grid h-full items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="text-center lg:text-left">
          <Pixel className="text-6xl sm:text-8xl">25 / 25</Pixel>
          <p className="mt-6 font-pixel text-lg text-primary sm:text-2xl">TESTS PASSING</p>
          <p className="mt-6 text-muted-foreground">Attack scenarios + legitimate application behavior</p>
        </div>
        <div className="space-y-4">
          <Term title="terminal">
            <p className="text-muted-foreground">&gt; pytest tests/test_security.py -v</p>
            <p className="mt-2 text-primary">25 passed</p>
          </Term>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {["SQL INJECTION", "AUTHORIZATION", "IDENTITY", "CONFIGURATION", "SESSION", "FUNCTIONALITY"].map((c) => (
              <span key={c} className="border border-primary/40 px-2 py-1.5 text-primary">[ PASS ] {c}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "reaudit",
    render: () => (
      <div className="flex h-full flex-col justify-center gap-6">
        <Tag>[ POST-REMEDIATION SCAN ]</Tag>
        <Typed lines={["> RUNNING IBM BOB SECURITY AUDIT...", "> AUDIT STATUS: PASS"]} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-2 border-primary p-6 shadow-[var(--glow-primary)]">
            <Pixel className="text-3xl sm:text-5xl">4 / 4</Pixel>
            <p className="mt-3 font-mono text-sm text-primary">FINDINGS RESOLVED</p>
          </div>
          <div className="border-2 border-primary p-6 shadow-[var(--glow-primary)]">
            <Pixel className="text-3xl sm:text-5xl">0</Pixel>
            <p className="mt-3 font-mono text-sm text-primary">NEW CONFIRMED VULNERABILITIES</p>
          </div>
        </div>
        <Term title="bob-audit.log">
          <pre className="whitespace-pre-wrap text-xs text-primary sm:text-sm">{`SQL INJECTION ............... [ RESOLVED ]
BROKEN ACCESS CONTROL ....... [ RESOLVED ]
CONFIGURATION EXPOSURE ...... [ RESOLVED ]
IDENTITY SPOOFING ........... [ RESOLVED ]`}</pre>
        </Term>
        <p className="font-mono text-xs tracking-widest text-muted-foreground">[ READ-ONLY POST-REMEDIATION AUDIT ]</p>
      </div>
    ),
  },
  {
    key: "evidence",
    render: () => (
      <div className="grid h-full items-center gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <Tag>[ EVIDENCE // VERIFIED ]</Tag>
          <Term title="git log --oneline">
            <div className="space-y-2">
              {[
                ["580a0da", "VULNERABLE BASELINE", "text-critical"],
                ["1c9e7bd", "REMEDIATION", "text-primary"],
                ["25 / 25", "TESTS PASSING", "text-primary"],
                ["IBM BOB", "POST-REMEDIATION AUDIT: PASS", "text-primary"],
              ].map(([a, b, c], i, arr) => (
                <div key={a}>
                  <p><span className={c}>{a}</span> <span className="text-foreground">{b}</span></p>
                  {i < arr.length - 1 && <p className="text-primary/50">↓</p>}
                </div>
              ))}
            </div>
          </Term>
        </div>
        <div className="space-y-6 text-center">
          <p className="font-pixel text-xs leading-loose text-primary sm:text-sm">{LOOP}</p>
          <Pixel className="text-2xl sm:text-4xl">BREACH GUARDIANS</Pixel>
          <p className="font-mono text-primary">FIND IT. FIX IT. PROVE IT.</p>
          <p className="text-xs text-muted-foreground">
            IBM Bob was used in the real security-development workflow on a local, intentionally vulnerable Flask demo.
            This dashboard is the SecurityFix prototype interface.
          </p>
        </div>
      </div>
    ),
  },
];

function Presentation() {
  const [i, setI] = useState(0);
  const total = slides.length;
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(total - 1, n))), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setI((v) => Math.min(total - 1, v + 1)); }
      else if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(total - 1);
      else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const last = i === total - 1;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0.87_0.26_143/3%)_3px)]" />
      <header className="relative z-10 flex items-center justify-between border-b border-primary/30 px-4 py-2 font-mono text-xs">
        <Link to="/" className="text-primary hover:underline">← BACK TO SECURITYFIX</Link>
        <span className="hidden text-muted-foreground sm:inline">[ SYSTEM ] BREACH GUARDIANS // IBM BOB 2.0 HACKATHON</span>
        <span className="text-primary">{pad(i + 1)} / {pad(total)}</span>
      </header>
      <div className="relative z-10 h-0.5 bg-primary/10">
        <div className="h-full bg-primary shadow-[var(--glow-primary)] transition-all duration-300" style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <main className="relative z-10 flex-1 overflow-hidden px-6 py-6 sm:px-12 lg:px-20">
        <div key={slides[i].key} className="mx-auto h-full max-w-6xl animate-in fade-in slide-in-from-right-4 duration-300">
          {slides[i].render()}
        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-between gap-3 border-t border-primary/30 px-4 py-2 font-mono text-xs">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="border border-primary/50 px-3 py-1 text-primary disabled:opacity-30">‹ PREV</button>
        {last ? (
          <div className="flex gap-2">
            <button onClick={() => go(0)} className="border border-primary px-3 py-1 text-primary hover:bg-primary hover:text-primary-foreground">RESTART PRESENTATION</button>
            <Link to="/" className="border border-primary px-3 py-1 text-primary hover:bg-primary hover:text-primary-foreground">BACK TO DASHBOARD</Link>
          </div>
        ) : (
          <span className="hidden text-muted-foreground md:inline">← → SPACE · HOME/END · F FULLSCREEN</span>
        )}
        <button onClick={() => go(i + 1)} disabled={last} className="border border-primary/50 px-3 py-1 text-primary disabled:opacity-30">NEXT ›</button>
      </footer>
    </div>
  );
}
