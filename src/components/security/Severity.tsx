import type { Severity } from "@/data/security";

const map: Record<Severity, string> = {
  CRITICAL: "text-critical border-critical/50 bg-critical/10",
  HIGH: "text-high border-high/50 bg-high/10",
  MEDIUM: "text-medium border-medium/50 bg-medium/10",
  LOW: "text-low border-low/50 bg-low/10",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] ${map[severity]}`}
    >
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: "FIXED" | "OPEN" }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] ${
        status === "FIXED"
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-high/50 bg-high/10 text-high"
      }`}
    >
      {status === "FIXED" ? "✓ FIXED" : "OPEN"}
    </span>
  );
}
