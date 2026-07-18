import { type ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-border">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl md:text-[2.25rem] font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function AdminField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="mt-1 block text-[11px] text-destructive">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-[11px] text-muted-foreground/80">{hint}</span>
      )}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl bg-background border border-input px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition placeholder:text-muted-foreground/50";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-white">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-blue/10 grid place-items-center mb-4">
        <div className="h-6 w-6 rounded-lg bg-gradient-blue opacity-60" />
      </div>
      <div className="font-display text-xl font-semibold">{title}</div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-border bg-white shadow-card-soft ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-border" />
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}