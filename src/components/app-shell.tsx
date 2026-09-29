import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3, Bell, Bot, Bus, CalendarDays, ChevronLeft, ChevronRight,
  CircleUserRound, Gauge, GraduationCap, Menu, Search, Settings, ShieldAlert, Trash2,
  Sparkles, UsersRound, Wrench, Route as RouteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { circuits, drivers, students, vehicles } from "@/lib/mock-data";
import { useDemo } from "@/lib/demo-state";

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
  const [query, setQuery] = useState("");
  const { incidents, maintenances, notifications, markNotification, markAllNotifications, deleteNotification } = useDemo();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...students.map(x=>({title:x.name,detail:`Élève · ${x.matricule} · ${x.circuit}`,to:"/eleves" as const,search:JSON.stringify(x)})),
      ...vehicles.map(x=>({title:`Véhicule ${x.id}`,detail:`${x.brand} ${x.model} · ${x.status}`,to:"/vehicules" as const,search:JSON.stringify(x)})),
      ...drivers.map(x=>({title:x.name,detail:`Chauffeur · ${x.vehicle}`,to:"/chauffeurs" as const,search:JSON.stringify(x)})),
      ...circuits.map(x=>({title:`Circuit ${x.id}`,detail:x.name,to:"/circuits" as const,search:JSON.stringify(x)})),
      ...maintenances.map(x=>({title:`Maintenance ${x.id}`,detail:`${x.vehicle} · ${x.type}`,to:"/maintenance" as const,search:JSON.stringify(x)})),
      ...incidents.map(x=>({title:`Incident ${x.id}`,detail:`${x.vehicle} · ${x.type}`,to:"/incidents" as const,search:JSON.stringify(x)})),
    ].filter(x=>x.search.toLowerCase().includes(q)).slice(0,7);
  },[query,incidents,maintenances]);
  const unread=notifications.filter(x=>!x.read).length;
  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-background lg:flex">
        <aside className={cn("sticky top-0 z-30 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex lg:flex-col", collapsed ? "w-[76px]" : "w-[272px]")}> 
          <div className="flex h-20 items-center border-b border-sidebar-border px-4">
            <img src="/madariss-tingis-logo.png" alt="Madariss TINGIS" className={cn("h-11 object-contain object-left", collapsed ? "w-10 object-cover" : "w-48")} />
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
            <Sheet><SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu"><Menu /></Button></SheetTrigger><SheetContent side="left" className="w-[290px] bg-sidebar p-4 text-sidebar-foreground"><SheetHeader><SheetTitle className="text-sidebar-foreground">Navigation</SheetTitle></SheetHeader><nav className="mt-6 space-y-1">{nav.map(([to,label,Icon])=><Link key={to} to={to} className="flex h-11 items-center gap-3 rounded-md px-3 text-sm hover:bg-sidebar-accent"><Icon className="size-4"/>{label}</Link>)}</nav></SheetContent></Sheet>
            <div className="hidden min-w-48 sm:block"><p className="text-xs font-semibold uppercase text-primary">Madariss TINGIS</p><p className="text-xs text-muted-foreground">Année scolaire 2026/2027</p></div>
            <div className="relative mx-auto hidden w-full max-w-md md:block"><Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={e=>setQuery(e.target.value)} className="h-10 rounded-full bg-muted pl-10 shadow-none" placeholder="Rechercher un élève, un circuit, un bus…" />{query.length>=2&&<div className="absolute top-12 z-40 w-full overflow-hidden rounded-lg border bg-popover shadow-xl">{results.length?results.map((x,i)=><Link key={`${x.title}-${i}`} to={x.to} onClick={()=>setQuery("")} className="block border-b px-4 py-3 text-sm last:border-0 hover:bg-muted"><b>{x.title}</b><span className="mt-0.5 block text-xs text-muted-foreground">{x.detail}</span></Link>):<p className="p-5 text-center text-sm text-muted-foreground">Aucun résultat</p>}</div>}</div>
            <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications"><Bell />{unread>0&&<span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unread}</span>}</Button></PopoverTrigger><PopoverContent align="end" className="w-[390px] p-0"><div className="flex items-center justify-between border-b p-4"><div><b>Notifications</b><p className="text-xs text-muted-foreground">{unread} non lue(s)</p></div><Button variant="ghost" size="sm" onClick={markAllNotifications}>Tout marquer comme lu</Button></div><div className="max-h-[430px] overflow-y-auto">{notifications.slice(0,12).map(n=><div key={n.id} className={cn("flex gap-3 border-b p-4",!n.read&&"bg-secondary/5")}><button aria-label="Marquer comme lu" onClick={()=>markNotification(n.id)} className={cn("mt-1 size-2.5 shrink-0 rounded-full",n.read?"bg-muted":"bg-primary")}/><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{n.title}</p><p className="mt-1 text-xs text-muted-foreground">{n.detail} · {n.time}</p></div><Button variant="ghost" size="icon" onClick={()=>deleteNotification(n.id)} aria-label="Supprimer"><Trash2 className="size-4"/></Button></div>)}</div></PopoverContent></Popover>
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