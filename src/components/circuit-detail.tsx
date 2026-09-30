import { Bus, CheckCircle2, Clock3, School, UserRound } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ARRIVAL_MARGIN, SCHOOL, toMin, type PlanCircuit } from "@/lib/transport-engine";

export function CircuitHeader({ c }: { c: PlanCircuit }) {
  const pct = Math.round((c.stops.length / c.capacity) * 100);
  return <div className="rounded-lg border bg-card p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-bold uppercase" style={{ color: c.color }}>● {c.zone}</p><h3 className="mt-1 text-xl font-bold">Circuit {c.id}</h3></div>
      <b className="text-2xl" style={{ color: c.color }}>{pct} %</b>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
      <span><small className="block text-muted-foreground">Véhicule</small><b className="flex items-center gap-1"><Bus className="size-4" />Bus {c.vehicleId}</b></span>
      <span><small className="block text-muted-foreground">Élèves / places</small><b>{c.stops.length} / {c.capacity}</b></span>
      <span><small className="block text-muted-foreground">Premier ramassage</small><b>{c.firstPickup}</b></span>
      <span><small className="block text-muted-foreground">Arrivée école</small><b>{c.arrival}</b></span>
    </div>
    <Progress value={pct} className="mt-4 h-1.5" />
    {c.driver && <p className="mt-4 flex items-center gap-2 rounded-md bg-secondary/10 p-3 text-sm"><UserRound className="size-4 text-secondary" /><span><b>{c.driver}</b> conduira le <b>Bus {c.vehicleId}</b> sur le <b>Circuit {c.id}</b>.</span></p>}
  </div>;
}

export function StopList({ c, max }: { c: PlanCircuit; max?: number }) {
  const shown = max ? c.stops.slice(0, max) : c.stops;
  const margin = toMin(SCHOOL.entry) - toMin(c.arrival);
  return <div className="rounded-lg border bg-card">
    <div className="flex items-center justify-between border-b p-4"><h4 className="font-bold">Ordre de ramassage</h4><span className="text-xs text-muted-foreground">{c.stops.length} arrêts · ~{c.distanceKm} km</span></div>
    <ol className="max-h-[420px] divide-y overflow-auto">
      {shown.map((s) => <li key={s.student.id} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/40">
        <span className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-primary-foreground" style={{ background: c.color }}>{s.order}</span>
        <span className="min-w-0 flex-1"><b className="block truncate">{s.student.name}</b><small className="block truncate text-muted-foreground">{s.student.district} · {s.student.address}</small></span>
        <span className="flex items-center gap-1 font-semibold tabular-nums"><Clock3 className="size-3.5 text-muted-foreground" />{s.time}</span>
      </li>)}
      {max && c.stops.length > max && <li className="px-4 py-2 text-center text-xs text-muted-foreground">… {c.stops.length - max} autres élèves</li>}
      <li className="flex items-center gap-3 bg-secondary/5 px-4 py-3 text-sm"><span className="grid size-7 place-items-center rounded-full bg-foreground text-background"><School className="size-4" /></span><b className="flex-1">{SCHOOL.name}</b><b className="tabular-nums">{c.arrival}</b></li>
    </ol>
    <p className="flex items-center gap-2 border-t p-4 text-sm font-semibold text-success"><CheckCircle2 className="size-4" />Arrivée prévue {margin || ARRIVAL_MARGIN} minutes avant le début des cours ({SCHOOL.entry}).</p>
  </div>;
}
