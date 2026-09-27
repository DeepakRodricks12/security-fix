import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import logoAsset from "@/assets/breach-guardians-company-logo.png.asset.json";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — Breach Guardians SecurityFix" },
      {
        name: "description",
        content:
          "Animated product demo: how IBM Bob 2.0 was used to detect, analyze, fix, test and re-audit security vulnerabilities.",
      },
      { property: "og:title", content: "Presentation — Breach Guardians SecurityFix" },
      {
        property: "og:description",
        content: "AI × Cybersecurity. Detect → Fix → Verify with IBM Bob 2.0.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Presentation,
});

/* ---------- animation primitives ---------- */
const STEP = 0.35; // one consistent rhythm across the deck (seconds)
const dl = (d: number): CSSProperties => ({ animationDelay: `${d * STEP}s` });

const R = ({ d = 0, children, className = "", slide = false }: { d?: number; children: ReactNode; className?: string; slide?: boolean }) => (
  <div className={`${slide ? "bg-s" : "bg-r"} ${className}`} style={dl(d)}>
    {children}
  </div>
);

function useAfter(step: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), step * STEP * 1000);
    return () => clearTimeout(t);
  }, [step]);
  return on;
}

function Typed({ text, d = 0, speed = 40, className = "", cursor = true }: { text: string; d?: number; speed?: number; className?: string; cursor?: boolean }) {
  const [n, setN] = useState(0);
  const start = useAfter(d);
  useEffect(() => {
    if (!start || n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [start, n, text.length, speed]);
  return (
    <span className={className}>
      {text.slice(0, n)}
      {cursor && <span className="caret">_</span>}
    </span>
  );
}

function Count({ to, d = 0, dur = 900, className = "" }: { to: number; d?: number; dur?: number; className?: string }) {
  const start = useAfter(d);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, dur]);
  return <span className={className}>{v}</span>;
}

/* ---------- visual primitives ---------- */
const Tag = ({ children, d = 0 }: { children: ReactNode; d?: number }) => (
  <R d={d}>
    <p className="font-mono text-xs tracking-[0.2em] text-primary sm:text-sm">{children}</p>
  </R>
);

const Pixel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h2 className={`font-pixel leading-tight text-primary glow-text ${className}`}>{children}</h2>
);

const Term = ({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden border border-primary/40 bg-card ${className}`}>
    <div className="flex items-center gap-2 border-b border-primary/30 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
      <span className="h-2 w-2 bg-primary" />
      <span className="h-2 w-2 bg-primary/50" />
      <span className="h-2 w-2 bg-primary/25" />
      <span className="ml-2">{title}</span>
    </div>
    <div className="p-4 font-mono text-xs sm:text-sm">{children}</div>
  </div>
);

const Title = ({ tag, children }: { tag?: string; children: ReactNode }) => (
  <div className="space-y-3">
    {tag && <Tag>{tag}</Tag>}
    <R d={1}>
      <Pixel className="bg-glitch text-lg sm:text-2xl lg:text-3xl">{children}</Pixel>
    </R>
  </div>
);

const Arrow = ({ d, down = false }: { d: number; down?: boolean }) => (
  <R d={d} className="font-mono text-primary/70">{down ? "↓" : "→"}</R>
);

const Chip = ({ children, d, tone = "primary", className = "" }: { children: ReactNode; d: number; tone?: "primary" | "critical" | "high" | "medium" | "low"; className?: string }) => {
  const tones = {
    primary: "border-primary/60 text-primary",
    critical: "border-critical/60 text-critical",
    high: "border-high/60 text-high",
    medium: "border-medium/60 text-medium",
    low: "border-low/60 text-low",
  };
  return (
    <R d={d} className={`inline-block border px-2.5 py-1 font-mono text-xs sm:text-sm ${tones[tone]} ${className}`}>
      {children}
    </R>
  );
};

/** Pipeline whose stages go inactive → active in sequence, with a scan line. */
function Pipeline({ steps, d = 0, check = false, glowEnd = false }: { steps: string[]; d?: number; check?: boolean; glowEnd?: boolean }) {
  return (
    <div className="relative overflow-hidden border border-primary/30 p-4">
      <div className="bg-scanbar" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((s, i) => (
          <PipeStage key={s} label={s} d={d + i * 2} last={i === steps.length - 1} check={check} glow={glowEnd && i === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}
function PipeStage({ label, d, last, check, glow }: { label: string; d: number; last: boolean; check: boolean; glow: boolean }) {
  const on = useAfter(d + 1);
  return (
    <div className="flex items-center gap-2">
      <R d={d}>
        <span
          className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-all duration-500 sm:text-sm ${
            on ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-primary)]" : "border-muted-foreground/30 text-muted-foreground"
          } ${glow && on ? "bg-pulse" : ""}`}
        >
          {label}
          {check && on && <span className="bg-r">✓</span>}
        </span>
      </R>
      {!last && <Arrow d={d + 1} />}
    </div>
  );
}

const Logo = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
  <img
    src={logoAsset.url}
    alt="Breach Guardians logo"
    className={size === "lg" ? "bg-logo-in mx-auto h-40 w-auto object-contain sm:h-56 lg:h-64" : "h-10 w-auto object-contain opacity-90 sm:h-12"}
  />
);

const CODE_RAIN = Array.from({ length: 40 }, (_, i) =>
  ["$ bob scan --read-only", "SELECT * FROM users WHERE id = ?", "session['user_id']", "assert resp.status_code == 403", "git diff 580a0da..1c9e7bd", "[ OK ] audit.pass"][i % 6],
);
const CodeRain = ({ slow = false }: { slow?: boolean }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]">
    <div className="bg-code-rain font-mono text-xs leading-6 text-primary" style={slow ? { animationDuration: "120s" } : undefined}>
      {[...CODE_RAIN, ...CODE_RAIN].map((l, i) => (
        <p key={i} style={{ paddingLeft: `${(i * 37) % 70}%` }}>{l}</p>
      ))}
    </div>
  </div>
);

/* ---------- slides ---------- */
function TitleCard({ final = false }: { final?: boolean }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 text-center">
      <CodeRain slow={final} />
      <Logo size="lg" />
      <R d={3}>
        <Pixel className="text-2xl sm:text-4xl lg:text-5xl">BREACH GUARDIANS</Pixel>
      </R>
      <Typed text="SECURITYFIX" d={4} speed={90} className="font-pixel text-lg text-primary glow-text sm:text-2xl" />
      <R d={8}>
        <p className="font-mono text-sm tracking-[0.3em] text-muted-foreground sm:text-base">AI × CYBERSECURITY</p>
      </R>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-pixel text-xs text-primary sm:text-base">
        <R d={9}>DETECT</R><Arrow d={10} /><R d={11}>FIX</R><Arrow d={12} /><R d={13} className="bg-pulse px-2 py-1">VERIFY</R>
      </div>
      <R d={14}>
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
          {final ? "IBM BOB 2.0 · SECURITY REMEDIATION WORKFLOW" : "[ IBM BOB 2.0 ]"}
        </p>
      </R>
    </div>
  );
}

function Gap() {
  const verified = useAfter(12);
  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <Title tag="[ SECURITY GAP DETECTED ]">FINDING A VULNERABILITY IS ONLY THE BEGINNING.</Title>
      <R d={2}>
        <p className="max-w-2xl border-l-2 border-primary pl-4 font-mono text-sm text-primary sm:text-base">
          Detection without remediation and verification is incomplete.
        </p>
      </R>
      <Pipeline d={3} steps={["DETECT", "UNDERSTAND", "REMEDIATE", "TEST", "VERIFY"]} glowEnd />
      <div className="h-8">
        {verified && (
          <p className="bg-r font-mono text-sm text-primary">
            <span className="bg-pulse mr-2 inline-block border border-primary px-2">✓</span>LIFECYCLE COMPLETE — FIX VERIFIED
          </p>
        )}
      </div>
    </div>
  );
}

function Workflow() {
  const left = ["REPOSITORY", "RECONNAISSANCE", "SECURITY ANALYSIS", "VULNERABILITY IDENTIFICATION"];
  const right = ["CODE-PATH ANALYSIS", "REMEDIATION", "REGRESSION TESTS", "RE-AUDIT"];
  const Col = ({ items, d }: { items: string[]; d: number }) => (
    <div className="flex flex-col items-start gap-1">
      {items.map((s, i) => (
        <div key={s} className="flex flex-col items-start gap-1">
          <Chip d={d + i * 1.5}>{s}</Chip>
          {i < items.length - 1 && <Arrow d={d + i * 1.5 + 0.8} down />}
        </div>
      ))}
    </div>
  );
  return (
    <div className="relative flex h-full flex-col justify-center gap-6">
      <CodeRain />
      <Tag>[ SECURITYFIX // WORKFLOW ]</Tag>
      <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <Col items={left} d={1} />
        <div className="relative flex items-center gap-3">
          <svg className="hidden h-2 w-16 lg:block" viewBox="0 0 64 8"><line x1="0" y1="4" x2="64" y2="4" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 4" style={{ animation: "bg-dash 0.6s linear infinite" }} /></svg>
          <R d={7}>
            <div className="bg-pulse flex h-40 w-40 flex-col items-center justify-center border-2 border-primary text-center sm:h-44 sm:w-44">
              <span className="font-mono text-[10px] text-muted-foreground">[ ENGINE ]</span>
              <Pixel className="mt-2 text-base sm:text-lg">IBM BOB 2.0</Pixel>
            </div>
          </R>
          <svg className="hidden h-2 w-16 lg:block" viewBox="0 0 64 8"><line x1="0" y1="4" x2="64" y2="4" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 4" style={{ animation: "bg-dash 0.6s linear infinite" }} /></svg>
        </div>
        <Col items={right} d={9} />
      </div>
      <Pipeline d={15} steps={["DISCOVER", "ANALYZE", "FIX", "TEST", "RE-AUDIT"]} />
    </div>
  );
}

function Audit() {
  const f: [string, string, string, "critical" | "high" | "medium" | "low"][] = [
    ["F-001", "SQL INJECTION", "CRITICAL · CWE-89", "critical"],
    ["F-002", "BROKEN ACCESS CONTROL", "HIGH · CWE-862", "high"],
    ["F-003", "CONFIGURATION EXPOSURE", "MEDIUM · SYNTHETIC DEMO VALUE", "medium"],
    ["F-004", "SPOOFABLE IDENTITY HEADER", "LOW / LATENT", "low"],
  ];
  const border = { critical: "border-critical/60", high: "border-high/60", medium: "border-medium/60", low: "border-low/60" };
  const text = { critical: "text-critical", high: "text-high", medium: "text-medium", low: "text-low" };
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <Title tag="[ BOB SECURITY SCAN // READ-ONLY ]">INITIAL SECURITY AUDIT</Title>
      <R d={2} className="relative h-1 overflow-hidden bg-primary/10"><div className="bg-scanbar" /></R>
      <div className="grid gap-3 sm:grid-cols-2">
        {f.map(([id, name, meta, tone], i) => (
          <R key={id} d={3 + i * 2} slide>
            <div className={`border ${border[tone]} bg-card p-4 transition-colors`}>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 ${tone === "critical" ? "bg-critical" : tone === "high" ? "bg-high" : tone === "medium" ? "bg-medium" : "bg-low"} bg-pulse`} />
                <p className={`font-mono text-[11px] ${text[tone]}`}>{id}</p>
              </div>
              <p className="mt-2 font-mono text-sm font-semibold text-foreground">{name}</p>
              <p className={`mt-1 font-mono text-xs ${text[tone]}`}>{meta}</p>
            </div>
          </R>
        ))}
      </div>
      <R d={12}>
        <p className="font-mono text-xs text-muted-foreground">
          &gt; F-002 and F-004 are distinct findings, remediated together. F-003's key-like value was synthetic / fake — not a real credential.
        </p>
      </R>
    </div>
  );
}

function SqlI() {
  const fixed = useAfter(12);
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <Title tag="[ FINDING 01 ]">F-001 // SQL INJECTION</Title>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-2 font-mono text-xs sm:text-sm">
          <R d={2}><p className="label-xs">ENTRY POINT</p><p className="text-primary">GET /search?q=</p></R>
          <R d={3}><p className="label-xs mt-2">CODE PATH</p></R>
          <Chip d={4}>app.py: search()</Chip>
          <Arrow d={5} down />
          <Chip d={6}>database.py: search_users(query)</Chip>
          <Arrow d={7} down />
          <Chip d={8} tone="critical">RAW SQL CONSTRUCTION</Chip>
        </div>
        <div className="space-y-3">
          <Term title={fixed ? "database.py // AFTER" : "database.py // BEFORE"} className={fixed ? "" : "border-critical/60"}>
            {!fixed ? (
              <pre key="b" className="bg-r whitespace-pre-wrap text-critical" style={dl(9)}>{`sql = f"SELECT * FROM users
       WHERE name LIKE '%{query}%'"
cur.execute(sql)`}</pre>
            ) : (
              <pre key="a" className="bg-r whitespace-pre-wrap text-primary">{`sql = "SELECT * FROM users
       WHERE name LIKE ?"
cur.execute(sql, (f"%{query}%",))`}</pre>
            )}
          </Term>
          <div className="grid gap-2 font-mono text-xs sm:grid-cols-3">
            <R d={10} className="border border-critical/50 p-2 text-critical">ROOT CAUSE<br />USER INPUT → RAW SQL STRING</R>
            <R d={11} className="border border-high/50 p-2 text-high">IMPACT<br />ATTACKER-CONTROLLED SQL</R>
            <R d={12} className="border border-primary/60 p-2 text-primary">REMEDIATION<br />PARAMETERIZED SQL QUERIES</R>
          </div>
          {fixed && <p className="bg-r bg-pulse inline-block border border-primary px-3 py-1 font-pixel text-xs text-primary" style={dl(2)}>✓ FIXED</p>}
        </div>
      </div>
    </div>
  );
}

function AuthZ() {
  const split = useAfter(9);
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <Title tag="[ FINDINGS 02 + 04 ]">AUTHENTICATION + AUTHORIZATION</Title>
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
        <Chip d={2} tone="high">X-Demo-User: 2</Chip><Arrow d={3} />
        <Chip d={4} tone="low">IDENTITY ACCEPTED</Chip><Arrow d={5} />
        <Chip d={6} tone="high">can_view_user() → True</Chip><Arrow d={7} />
        <Chip d={8} tone="critical">ACCESS GRANTED TO ANY USER</Chip>
      </div>
      <div className={`grid gap-4 transition-all duration-700 md:grid-cols-2 ${split ? "md:gap-12" : ""}`}>
        <R d={9} slide>
          <Term title="F-004 // AUTHENTICATION / IDENTITY" className="border-low/60">
            <p className="text-low">SPOOFABLE IDENTITY HEADER</p>
            <p className="mt-2 text-foreground/80">Identity derived from <span className="text-high">X-Demo-User</span> — any client can claim any user.</p>
            <p className="mt-2 text-muted-foreground">Latent / contributing weakness.</p>
          </Term>
        </R>
        <R d={10} slide>
          <Term title="F-002 // AUTHORIZATION / OWNERSHIP" className="border-high/60">
            <p className="text-high">BROKEN ACCESS CONTROL</p>
            <p className="mt-2 text-foreground/80"><span className="text-high">can_view_user()</span> always returns <span className="text-critical">True</span>.</p>
            <p className="mt-2 text-muted-foreground">Confirmed vulnerability · CWE-862.</p>
          </Term>
        </R>
      </div>
      <R d={12}>
        <p className="font-mono text-sm text-primary">&gt; Same user-data access path. Distinct findings — not duplicates. Fixed together →</p>
      </R>
    </div>
  );
}

function Session() {
  const codes: [string, string][] = [["401", "UNAUTHENTICATED"], ["403", "UNAUTHORIZED USER"], ["200", "AUTHORIZED OWNER"]];
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <Title tag="[ REMEDIATION // F-002 + F-004 ]">FROM SPOOFABLE IDENTITY → SIGNED SESSION</Title>
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <R d={2}>
          <Term title="BEFORE" className="border-critical/60">
            <span className="bg-strike bg-r inline-block text-high" style={dl(4)}>X-Demo-User</span>
            <p className="mt-2 text-critical">→ attacker-controlled identity</p>
          </Term>
        </R>
        <R d={5}>
          <Term title="AFTER">
            <div className="flex flex-col items-start gap-1">
              <Chip d={6}>/login</Chip><Arrow d={7} down />
              <Chip d={8}>session["user_id"]  // Flask signed session</Chip><Arrow d={9} down />
              <Chip d={10}>get_current_user()</Chip><Arrow d={11} down />
              <Chip d={12} className="bg-pulse">OWNERSHIP CHECK</Chip>
            </div>
          </Term>
        </R>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {codes.map(([c, l], i) => (
          <R key={c} d={13 + i} className={`border p-3 text-center font-mono ${c === "200" ? "border-primary text-primary" : "border-high/60 text-high"}`}>
            <p className="font-pixel text-base sm:text-xl">{c}</p>
            <p className="mt-1 text-[10px] sm:text-xs">{l}</p>
          </R>
        ))}
      </div>
      <R d={16}>
        <p className="font-mono text-[11px] text-muted-foreground">
          NOTE: Local demo — /login accepts a valid user_id without password verification. Production requires proper credential verification (OAuth/OIDC, SSO, etc.).
        </p>
      </R>
    </div>
  );
}

function Config() {
  const exposed = useAfter(4);
  const removed = useAfter(9);
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <Title tag="[ FINDING 03 ]">F-003 // CONFIGURATION EXPOSURE</Title>
      <div className="grid gap-5 md:grid-cols-2">
        <R d={2}>
          <Term title="GET /config" className={removed ? "" : exposed ? "border-critical/60" : ""}>
            <pre className="whitespace-pre-wrap">
{`{
  "app": "security-demo",
  "debug": false`}
{!removed && exposed && (
  <span className="bg-r block bg-critical/10 text-critical">{`  "api_key": "demo-FAKE-0000-sentinel"   ← EXPOSED`}</span>
)}
{removed && <span className="bg-r block text-primary">{`  // secret-like value removed from response`}</span>}
{`}`}
            </pre>
          </Term>
        </R>
        <div className="space-y-3">
          <Chip d={5} tone="medium">DEMO VALUE IS SYNTHETIC / FAKE</Chip>
          <R d={6}><p className="font-mono text-sm text-foreground">Not a real credential compromise — an <span className="text-medium">INSECURE ARCHITECTURAL PATTERN</span>.</p></R>
          <ul className="space-y-1.5 font-mono text-xs text-primary sm:text-sm">
            <R d={10}><li>+ Secret-like value removed from API response</li></R>
            <R d={11}><li>+ Internal demo sentinel kept non-exported</li></R>
            <R d={12}><li>+ No real credential introduced</li></R>
          </ul>
        </div>
      </div>
      {removed && <p className="bg-r bg-pulse self-start border border-primary px-3 py-1 font-pixel text-xs text-primary" style={dl(4)}>EXPOSURE REMOVED</p>}
    </div>
  );
}

function Diff() {
  const after = useAfter(7);
  const minus = ["SQL string interpolation", "X-Demo-User", "Unrestricted user access", "Configuration exposure"];
  const plus = ["Parameterized SQL queries", "Flask signed-session identity", "Ownership-based authorization", "Configuration removed from API", "Spoofable identity mechanism eliminated"];
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <R d={0}>
        <Pixel className="text-2xl sm:text-4xl">
          <span className={after ? "text-muted-foreground line-through transition-colors" : "text-critical"}>580a0da</span>
          <span className="mx-3">→</span>
          {after ? <span className="bg-r">1c9e7bd</span> : <span className="text-muted-foreground">·······</span>}
        </Pixel>
      </R>
      <Term title="git diff 580a0da..1c9e7bd -- security-demo/">
        <div className="space-y-1">
          {minus.map((m, i) => (
            <R key={m} d={1 + i}><p className="bg-critical/10 px-2 text-critical">- {m}</p></R>
          ))}
          {plus.map((p, i) => (
            <R key={p} d={7 + i}><p className="bg-primary/10 px-2 text-primary">+ {p}</p></R>
          ))}
        </div>
      </Term>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <R d={12}><p className="font-mono text-sm text-primary">SCOPE: security-demo/ ONLY</p></R>
        <R d={13}><p className="bg-pulse border-2 border-primary px-4 py-2 font-pixel text-sm text-primary sm:text-lg">REMEDIATED</p></R>
      </div>
    </div>
  );
}

function Tests() {
  const tests: [string, number][] = [["SQL Injection", 6], ["Access Control", 4], ["Configuration Exposure", 3], ["Spoofable Header", 3], ["Login / Session", 4], ["Legitimate Functionality", 5]];
  const done = useAfter(16);
  return (
    <div className="grid h-full items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <Title tag="[ REGRESSION TESTING ]">TEST BEFORE YOU TRUST THE FIX</Title>
        <R d={2}>
          <Term title="terminal">
            <p className="text-muted-foreground">$ <Typed text="pytest tests/test_security.py -v" d={3} speed={35} cursor={false} className="text-foreground" /></p>
            <div className="mt-2 h-36 space-y-0.5 overflow-hidden text-[11px] sm:text-xs">
              {tests.map(([n, c], i) => (
                <R key={n} d={7 + i * 1.3}><p className="text-primary">test_{n.toLowerCase().replace(/[^a-z]+/g, "_")} ×{c} <span className="text-muted-foreground">......</span> PASSED</p></R>
              ))}
            </div>
            {done && <p className="bg-r mt-2 text-primary">25 passed · 0 failures · 0 errors · 0 warnings <span className="caret">_</span></p>}
          </Term>
        </R>
      </div>
      <div className="text-center">
        <Pixel className="text-6xl sm:text-8xl"><Count to={25} d={7} dur={3000} /></Pixel>
        <p className="mt-4 font-pixel text-lg text-primary sm:text-2xl">PASSED</p>
        <div className="mt-6 grid grid-cols-2 gap-2 text-left font-mono text-[11px] sm:text-xs">
          {tests.map(([n, c], i) => (
            <R key={n} d={7 + i * 1.3} className="border border-primary/40 px-2 py-1.5 text-primary">✓ {c} {n}</R>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReAudit() {
  const items = ["SQL INJECTION", "BROKEN ACCESS CONTROL", "CONFIGURATION EXPOSURE", "SPOOFABLE IDENTITY HEADER"];
  const Row = ({ name, i }: { name: string; i: number }) => {
    const ok = useAfter(4 + i * 2 + 1);
    return (
      <R d={4 + i * 2}>
        <p className="flex justify-between gap-4">
          <span>{`F-00${i + 1} ${name}`}</span>
          <span className={`transition-colors duration-500 ${ok ? "text-primary" : "text-critical"}`}>[ {ok ? "RESOLVED" : "FOUND"} ]</span>
        </p>
      </R>
    );
  };
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <Title tag="[ READ-ONLY POST-REMEDIATION AUDIT ]">RE-AUDIT // VERIFY THE FIX</Title>
      <R d={2}>
        <Term title="bob-audit.log">
          <div className="bg-scanbar" />
          <p className="text-muted-foreground">&gt; <Typed text="bob audit --read-only security-demo/" d={2} speed={30} cursor={false} /></p>
          <div className="mt-3 space-y-1 text-xs sm:text-sm">
            {items.map((n, i) => <Row key={n} name={n} i={i} />)}
          </div>
        </Term>
      </R>
      <div className="grid gap-4 md:grid-cols-2">
        <R d={12} className="border-2 border-primary p-5">
          <Pixel className="text-3xl sm:text-5xl"><Count to={4} d={12} /> / 4</Pixel>
          <p className="mt-3 font-mono text-sm text-primary">FINDINGS RESOLVED</p>
        </R>
        <R d={14} className="bg-pulse border-2 border-primary p-5">
          <Pixel className="text-3xl sm:text-5xl">0</Pixel>
          <p className="mt-3 font-mono text-sm text-primary">NEW CONFIRMED VULNERABILITIES</p>
        </R>
      </div>
      <R d={16}><p className="font-mono text-xs text-muted-foreground">0 new confirmed vulnerabilities identified in the post-remediation re-audit.</p></R>
    </div>
  );
}

function Lifecycle() {
  return (
    <div className="flex h-full flex-col justify-center gap-8">
      <Title tag="[ STATUS: VERIFIED ]">SECURITYFIX // VERIFIED LIFECYCLE</Title>
      <Pipeline d={2} steps={["DETECT", "ANALYZE", "REMEDIATE", "TEST", "RE-AUDIT"]} check glowEnd />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [<><Count to={4} d={13} /> / 4</>, "FINDINGS RESOLVED"],
          [<><Count to={25} d={14} dur={1400} /> / 25</>, "TESTS PASSED"],
          [<>0</>, "NEW CONFIRMED VULNERABILITIES"],
        ].map(([v, l], i) => (
          <R key={i} d={13 + i} className="border-2 border-primary p-5 text-center shadow-[var(--glow-primary)]">
            <Pixel className="text-2xl sm:text-4xl">{v}</Pixel>
            <p className="mt-3 font-mono text-xs text-primary sm:text-sm">{l as string}</p>
          </R>
        ))}
      </div>
    </div>
  );
}

const slides: { key: string; render: () => ReactNode; hero?: boolean }[] = [
  { key: "title", render: () => <TitleCard />, hero: true },
  { key: "gap", render: () => <Gap /> },
  { key: "workflow", render: () => <Workflow /> },
  { key: "audit", render: () => <Audit /> },
  { key: "sqli", render: () => <SqlI /> },
  { key: "authz", render: () => <AuthZ /> },
  { key: "session", render: () => <Session /> },
  { key: "config", render: () => <Config /> },
  { key: "diff", render: () => <Diff /> },
  { key: "tests", render: () => <Tests /> },
  { key: "reaudit", render: () => <ReAudit /> },
  { key: "lifecycle", render: () => <Lifecycle /> },
  { key: "end", render: () => <TitleCard final />, hero: true },
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
  const slide = slides[i]!;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,oklch(0.87_0.26_143/3%)_3px)]" />
      <header className="relative z-10 flex items-center justify-between border-b border-primary/30 px-4 py-2 font-mono text-xs">
        <Link to="/" className="text-primary hover:underline">← BACK TO SECURITYFIX</Link>
        <span className="hidden text-muted-foreground sm:inline">[ SYSTEM ] BREACH GUARDIANS // IBM BOB 2.0</span>
        <span className="text-primary">{pad(i + 1)} / {pad(total)}</span>
      </header>
      <div className="relative z-10 h-0.5 bg-primary/10">
        <div className="h-full bg-primary shadow-[var(--glow-primary)] transition-all duration-500" style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-12 lg:px-20">
        {!slide.hero && (
          <div className="bg-logo-in absolute right-4 top-3 z-20 sm:right-6">
            <Logo />
          </div>
        )}
        <div key={slide.key} className="mx-auto h-full max-w-6xl animate-in fade-in slide-in-from-right-4 duration-500">
          {slide.render()}
        </div>
      </main>

      <footer className="relative z-10 flex items-center justify-between gap-3 border-t border-primary/30 px-4 py-2 font-mono text-xs">
        <button onClick={() => go(i - 1)} disabled={i === 0} className="border border-primary/50 px-3 py-1 text-primary disabled:opacity-30">‹ PREV</button>
        {last ? (
          <div className="flex gap-2">
            <button onClick={() => go(0)} className="border border-primary px-3 py-1 text-primary hover:bg-primary hover:text-primary-foreground">RESTART</button>
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
