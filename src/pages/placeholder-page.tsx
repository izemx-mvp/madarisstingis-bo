import { BarChart3, Settings, ShieldAlert, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export function PlaceholderPage({ type }: { type: "Maintenance"|"Incidents"|"Analytics"|"Paramètres" }) {
  const Icon = type === "Maintenance" ? Wrench : type === "Incidents" ? ShieldAlert : type === "Analytics" ? BarChart3 : Settings;
  return <AppShell title={type}><div className="grid min-h-[520px] place-items-center rounded-lg border bg-card p-8 text-center shadow-sm"><div><div className="mx-auto grid size-16 place-items-center rounded-full bg-secondary/10 text-secondary"><Icon className="size-7" /></div><h2 className="mt-5 text-xl font-bold">Module {type}</h2><p className="mx-auto mt-2 max-w-md text-muted-foreground">Cet espace est préparé pour la prochaine phase du projet. L’entrée reste accessible dans la navigation.</p></div></div></AppShell>;
}