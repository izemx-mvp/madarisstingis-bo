import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3, Bell, Bot, Bus, CalendarDays, ChevronLeft, ChevronRight,
  CircleUserRound, Gauge, GraduationCap, Menu, Search, Settings, ShieldAlert,
  Sparkles, UsersRound, Wrench, Route as RouteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/assets/madariss-tingis-logo.png.asset.json";
import { cn } from "@/lib/utils";

const nav = [
  ["/dashboard", "Tableau de bord", Gauge], ["/agent-ia", "Agent IA – Optimisation", Bot],
  ["/circuits", "Circuits scolaires", RouteIcon], ["/eleves", "Élèves", GraduationCap],
  ["/vehicules", "Véhicules", Bus], ["/chauffeurs", "Chauffeurs", UsersRound],
  ["/planning", "Planning", CalendarDays], ["/maintenance", "Maintenance", Wrench],
  ["/incidents", "Incidents", ShieldAlert], ["/analytics", "Analytics", BarChart3],
  ["/parametres", "Paramètres", Settings],
] as const;

export function AppShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-background lg:flex">
        <aside className={cn("sticky top-0 z-30 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex lg:flex-col", collapsed ? "w-[76px]" : "w-[272px]")}> 
          <div className="flex h-20 items-center border-b border-sidebar-border px-4">
            <img src={logo.url} alt="Madariss TINGIS" className={cn("h-11 object-contain object-left", collapsed ? "w-10 object-cover" : "w-48")} />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {nav.map(([to, label, Icon]) => {
              const active = path === to;
              const item = <Link to={to} className={cn("group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground", collapsed && "justify-center px-0")}><Icon className="size-[18px] shrink-0" />{!collapsed && <span>{label}</span>}{label.includes("IA") && !collapsed && <Sparkles className="ml-auto size-3.5 text-accent" />}</Link>;
              return collapsed ? <Tooltip key={to}><TooltipTrigger asChild>{item}</TooltipTrigger><TooltipContent side="right">{label}</TooltipContent></Tooltip> : <div key={to}>{item}</div>;
            })}
          </nav>
          <div className="border-t border-sidebar-border p-3">
            <Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={() => setCollapsed((v) => !v)} className="w-full justify-center text-sidebar-foreground/60" aria-label="Réduire le menu">
              {collapsed ? <ChevronRight /> : <><ChevronLeft /><span>Réduire le menu</span></>}
            </Button>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b bg-background/95 px-5 backdrop-blur md:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu"><Menu /></Button>
            <div className="hidden min-w-48 sm:block"><p className="text-xs font-semibold uppercase text-primary">Madariss TINGIS</p><p className="text-xs text-muted-foreground">Année scolaire 2026/2027</p></div>
            <div className="relative mx-auto hidden w-full max-w-md md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-10 rounded-full bg-muted pl-10 shadow-none" placeholder="Rechercher un élève, un circuit, un bus…" /></div>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications"><Bell /><span className="absolute right-1 top-1 size-2 rounded-full bg-primary" /></Button>
            <div className="flex items-center gap-3 border-l pl-4"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">Nadia El Amrani</p><p className="text-xs text-muted-foreground">Responsable transport</p></div><CircleUserRound className="size-9 text-secondary" /></div>
          </header>
          <main className="mx-auto max-w-[1600px] px-5 py-7 md:px-8">
            <div className="mb-7"><p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Accueil <span className="px-1">/</span> {eyebrow || title}</p><h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h1></div>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}