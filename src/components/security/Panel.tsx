import type { ReactNode } from "react";

export function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <h2 className="label-xs text-primary/90">{title}</h2>
          {aside}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label-xs">{eyebrow}</p>
        <h1 className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CodeBlock({
  label,
  code,
  tone = "neutral",
}: {
  label?: string;
  code: string;
  tone?: "neutral" | "before" | "after";
}) {
  const toneClass =
    tone === "before"
      ? "border-critical/40 text-critical/90"
      : tone === "after"
        ? "border-primary/40 text-primary"
        : "border-border text-foreground/85";
  return (
    <div>
      {label && <p className="label-xs mb-1.5">{label}</p>}
      <pre
        className={`overflow-x-auto border bg-black/70 p-3 font-mono text-xs leading-relaxed ${toneClass}`}
      >
        {code}
      </pre>
    </div>
  );
}

export function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="panel px-4 py-3">
      <p className="label-xs">{label}</p>
      <p className={`mt-1.5 font-mono text-xl ${accent ?? "text-primary glow-text"}`}>
        {value}
      </p>
    </div>
  );
}
