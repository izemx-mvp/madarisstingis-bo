import { cn } from "@/lib/utils";

export function StatusBadge({ children }: { children: React.ReactNode }) {
  const value = String(children);
  const tone = value.includes("Disponible") || value === "Affecté" || value === "Planifié"
    ? "bg-success-soft text-success"
    : value.includes("Maintenance") || value.includes("IA") || value.includes("attente")
      ? "bg-warning-soft text-warning-foreground"
      : value.includes("Incident") || value.includes("Absent") || value.includes("Indisponible")
        ? "bg-danger-soft text-destructive"
        : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>{children}</span>;
}