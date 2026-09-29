import { cn } from "@/lib/utils";

export function StatusBadge({ children }: { children: React.ReactNode }) {
  const value = String(children);
  const tone = value.includes("Disponible") || value === "Affecté" || value === "Planifié" || value === "Planifiée" || value === "Terminée" || value === "Résolu"
    ? "bg-success-soft text-success"
    : value.includes("Maintenance") || value.includes("IA") || value.includes("attente") || value === "En cours" || value === "En traitement" || value === "Moyenne" || value === "Reportée"
      ? "bg-warning-soft text-warning-foreground"
      : value.includes("Incident") || value.includes("Absent") || value.includes("Indisponible") || value === "Urgente" || value === "Élevée" || value === "Nouveau"
        ? "bg-danger-soft text-destructive"
        : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>{children}</span>;
}