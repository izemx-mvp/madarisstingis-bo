import { useMemo, useState } from "react";
import { Bus, CalendarDays, Filter, RotateCcw, School, ShieldAlert, UserRoundX, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StopList } from "@/components/circuit-detail";
import { useDemo } from "@/lib/demo-state";
import { SCHOOL, toMin, type PlanCircuit } from "@/lib/transport-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Ev = { time: string; kind: "circuit" | "arrivee" | "retour" | "maintenance" | "incident" | "absence"; title: string; detail: string; bus?: string; driver?: string; circuit?: string; color?: string; ref?: PlanCircuit };
const kindMeta = { circuit: ["Départ", Bus, "border-secondary bg-secondary/10"], arrivee: ["Arrivée", School, "border-success bg-success-soft"], retour: ["Retour", RotateCcw, "border-primary bg-primary/10"], maintenance: ["Maintenance", Wrench, "border-warning bg-warning-soft"], incident: ["Incident", ShieldAlert, "border-destructive bg-danger-soft"], absence: ["Absence", UserRoundX, "border-muted-foreground bg-muted"] } as const;
const days = ["Lundi 28", "Mardi 29", "Mercredi 30", "Jeudi 1", "Vendredi 2"];

export function PlanningPage() {
  const demo = useDemo();
  const [view, setView] = useState("day");
  const [bus, setBus] = useState("all"); const [driver, setDriver] = useState("all"); const [circuit, setCircuit] = useState("all"); const [kind, setKind] = useState("all");
  const [open, setOpen] = useState<PlanCircuit | null>(null);
  const events = useMemo<Ev[]>(() => {
    const out: Ev[] = [];
    demo.plan.filter((c) => c.status !== "Suspendu").forEach((c) => {
      out.push({ time: c.firstPickup, kind: "circuit", title: `Départ Circuit ${c.id}`, detail: `Bus ${c.vehicleId} · ${c.driver ?? "chauffeur à affecter"} · ${c.stops.length} élèves`, bus: c.vehicleId, driver: c.driver, circuit: c.id, color: c.color, ref: c });
      out.push({ time: c.arrival, kind: "arrivee", title: `Arrivée ${SCHOOL.name}`, detail: `Circuit ${c.id} · entrée ${SCHOOL.entry}`, bus: c.vehicleId, driver: c.driver, circuit: c.id, color: c.color, ref: c });
      out.push({ time: c.returnDeparture, kind: "retour", title: `Circuit retour ${c.id}`, detail: `Bus ${c.vehicleId} · sortie ${SCHOOL.exit}`, bus: c.vehicleId, driver: c.driver, circuit: c.id, color: c.color, ref: c });
    });
    demo.vehicles.filter((v) => v.status === "Maintenance").forEach((v, i) => out.push({ time: `${10 + i}:00`, kind: "maintenance", title: `Maintenance ${v.id}`, detail: demo.maintenances.find((m) => m.vehicle === v.id)?.type ?? "Intervention atelier", bus: v.id }));
    demo.incidents.filter((i) => i.status === "Nouveau" || i.status === "En traitement").forEach((i) => out.push({ time: i.date.split("· ")[1] ?? "07:30", kind: "incident", title: `Incident ${i.vehicle}`, detail: `${i.type} · ${i.status}`, bus: i.vehicle, circuit: i.circuit, driver: i.driver }));
    demo.drivers.filter((d) => ["Absent", "Malade", "Congé", "Indisponible"].includes(d.status)).forEach((d) => out.push({ time: "06:00", kind: "absence", title: `${d.name} · ${d.status}`, detail: "Journée complète · exclu des affectations", driver: d.name }));
    return out.sort((a, b) => toMin(a.time) - toMin(b.time));
  }, [demo.plan, demo.vehicles, demo.maintenances, demo.incidents, demo.drivers]);
  const shown = events.filter((e) => (bus === "all" || e.bus === bus) && (driver === "all" || e.driver === driver) && (circuit === "all" || e.circuit === circuit) && (kind === "all" || e.kind === kind));
  const activeFilters = [bus, driver, circuit, kind].filter((x) => x !== "all").length;
  const reset = () => { setBus("all"); setDriver("all"); setCircuit("all"); setKind("all"); };

  return <AppShell title="Planning"><div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center"><p className="text-muted-foreground">Toute l’organisation : circuits, véhicules, chauffeurs, arrivées, maintenances, incidents et absences.</p><Button onClick={() => toast.success("Nouvel événement créé")}><CalendarDays />Créer un événement</Button></div>
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 shadow-sm"><Filter className="size-4 text-muted-foreground" />
      <FilterSelect value={bus} onChange={setBus} label="Tous les bus" options={demo.vehicles.map((v) => [v.id, `Bus ${v.id}`])} />
      <FilterSelect value={driver} onChange={setDriver} label="Tous les chauffeurs" options={demo.drivers.map((d) => [d.name, d.name])} />
      <FilterSelect value={circuit} onChange={setCircuit} label="Tous les circuits" options={demo.plan.map((c) => [c.id, c.id])} />
      <FilterSelect value={kind} onChange={setKind} label="Tous les types" options={Object.entries(kindMeta).map(([k, m]) => [k, m[0]])} />
      {activeFilters > 0 && <Button variant="ghost" size="sm" onClick={reset}>Réinitialiser ({activeFilters})</Button>}
    </div>
    <div className="rounded-lg border bg-card shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}><ToggleGroupItem value="day">Jour</ToggleGroupItem><ToggleGroupItem value="week">Semaine</ToggleGroupItem><ToggleGroupItem value="month">Mois</ToggleGroupItem></ToggleGroup><b className="text-sm">{view === "day" ? "Mercredi 30 septembre 2026" : view === "week" ? "28 septembre – 2 octobre 2026" : "Octobre 2026"}</b><div className="flex flex-wrap gap-3 text-xs text-muted-foreground">{Object.entries(kindMeta).map(([k, [l]]) => <span key={k}>● {l}</span>)}</div></div>
      {view === "day" && <div className="p-4">{shown.length ? <ol className="relative space-y-2 border-l-2 border-muted pl-5">{shown.map((e, i) => { const [label, Icon, cls] = kindMeta[e.kind]; return <li key={i} className="relative"><span className="absolute -left-[27px] top-3 size-3 rounded-full border-2 border-card" style={{ background: e.color ?? "var(--muted-foreground)" }} /><button draggable onDragEnd={() => toast("Événement déplacé (simulation)")} onClick={() => e.ref ? setOpen(e.ref) : toast(e.title, { description: e.detail })} className={cn("flex w-full items-center gap-4 rounded-md border-l-4 p-3 text-left text-sm shadow-sm transition-all hover:-translate-y-0.5", cls)}><b className="w-12 tabular-nums">{e.time}</b><Icon className="size-4 shrink-0" /><span className="min-w-0 flex-1"><b className="block">{e.title}</b><small className="text-muted-foreground">{e.detail}</small></span><span className="hidden text-xs font-semibold uppercase text-muted-foreground sm:block">{label}</span></button></li>; })}</ol> : <p className="py-10 text-center text-sm text-muted-foreground">Aucun événement pour ces filtres.</p>}</div>}
      {view === "week" && <div className="overflow-x-auto p-4"><div className="grid min-w-[900px] grid-cols-[120px_repeat(5,1fr)] border-l border-t text-xs"><div className="border-b border-r bg-table-header p-2" />{days.map((d) => <div key={d} className="border-b border-r bg-table-header p-2 text-center font-semibold">{d}</div>)}{demo.vehicles.filter((v) => bus === "all" || v.id === bus).map((v) => { const c = demo.plan.find((x) => x.vehicleId === v.id); return [<div key={v.id} className="border-b border-r p-2 font-semibold">Bus {v.id}<small className="block font-normal text-muted-foreground">{v.driver}</small></div>, ...days.map((d, di) => <div key={v.id + d} className="border-b border-r p-1">{v.status === "Maintenance" ? <span className="block rounded bg-warning-soft p-1">Maintenance</span> : v.status === "Panne" && di >= 2 ? <span className="block rounded bg-danger-soft p-1 text-destructive">Panne</span> : c && c.status !== "Suspendu" ? <button onClick={() => setOpen(c)} className="block w-full rounded p-1 text-left" style={{ background: `color-mix(in oklab, ${c.color} 15%, transparent)` }}><b>{c.id}</b> {c.firstPickup}→{c.arrival}<br />Retour {c.returnDeparture}</button> : ["Indisponible", "Incident", "Panne"].includes(v.status) ? <span className="block rounded bg-muted p-1 text-muted-foreground">{v.status}</span> : null}</div>)]; })}</div></div>}
      {view === "month" && <div className="grid grid-cols-7 gap-px bg-border p-px text-xs">{["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => <div key={d} className="bg-table-header p-2 text-center font-semibold">{d}</div>)}{[null, null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)].map((d, i) => { const iso = d ? `2026-10-${String(d).padStart(2, "0")}` : ""; const maint = d ? demo.maintenances.filter((m) => m.plannedDate === `${String(d).padStart(2, "0")}/10/2026`).length : 0; const docs = d ? demo.vehicleDocs.filter((x) => x.expires === iso).length + demo.drivers.filter((x) => x.licenseExpires === iso).length : 0; const weekend = i % 7 >= 5; return <div key={i} className={cn("min-h-20 bg-card p-1.5", weekend && "bg-muted/40")}>{d && <><b>{d}</b>{!weekend && <span className="mt-1 block rounded bg-secondary/10 px-1">{demo.plan.filter((c) => c.status !== "Suspendu").length} circuits</span>}{maint > 0 && <span className="mt-1 block rounded bg-warning-soft px-1">{maint} maintenance</span>}{docs > 0 && <span className="mt-1 block rounded bg-danger-soft px-1 text-destructive">{docs} échéance</span>}</>}</div>; })}</div>}
    </div>
    <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}><DialogContent className="max-w-2xl">{open && <><DialogHeader><DialogTitle>Circuit {open.id} · Bus {open.vehicleId}</DialogTitle><DialogDescription>{open.driver ?? "Chauffeur à affecter"} · {open.stops.length} élèves · {open.firstPickup} → {open.arrival}</DialogDescription></DialogHeader><StopList c={open} /></>}</DialogContent></Dialog>
  </AppShell>;
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[][] }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger className="w-44" aria-label={label}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{label}</SelectItem>{options.map(([v, l]) => <SelectItem key={v} value={v!}>{l}</SelectItem>)}</SelectContent></Select>;
}
