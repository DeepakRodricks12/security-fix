import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/findings", label: "Findings" },
  { to: "/agent-tasks", label: "Agent Tasks" },
  { to: "/tests", label: "Tests" },
  { to: "/report", label: "Security Report" },
  { to: "/repository", label: "Repository" },
  { to: "/settings", label: "Settings" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="scanlines sticky top-0 z-20 border-b border-border bg-black/90 backdrop-blur lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" className="block">
            <span className="block font-pixel text-[11px] leading-[1.6] text-primary glow-text">
              BREACH
              <br />
              GUARDIANS
            </span>
            <span className="mt-1.5 block font-mono text-[10px] tracking-[0.34em] text-muted-foreground">
              SECURITYFIX
            </span>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="border border-border px-2 py-1 font-mono text-[10px] tracking-widest text-primary lg:hidden"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>

        <nav className={`${open ? "block" : "hidden"} px-3 pb-4 lg:block`}>
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className:
                  "border-l-2 border-primary bg-primary/10 text-primary glow-text",
              }}
              inactiveProps={{
                className:
                  "border-l-2 border-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground",
              }}
              className="block px-3 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden px-5 pb-6 lg:block">
          <p className="border-t border-border pt-4 font-mono text-[10px] leading-relaxed tracking-[0.16em] text-primary/70">
            FIND IT.
            <br />
            FIX IT.
            <br />
            PROVE IT.
            <span className="caret">_</span>
          </p>
        </div>
      </aside>

      <main className="px-5 py-8 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
        <footer className="mx-auto mt-12 max-w-6xl border-t border-border pt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground">
          DEMO PROTOTYPE — ALL FINDINGS, TESTS AND METRICS ARE MOCK DATA. NO
          ANALYSIS IS PERFORMED BY THIS INTERFACE; IBM BOB 2.0 SUPPLIES THE
          ACTUAL SECURITY WORKFLOW.
        </footer>
      </main>
    </div>
  );
}
