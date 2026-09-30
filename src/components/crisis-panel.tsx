import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bot, Check, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemo } from "@/lib/demo-state";
import { crisisPlan, SCHOOL, toMin } from "@/lib/transport-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const steps = ["Identification des élèves concernés", "Analyse de leurs adresses", "Analyse des autres circuits", "Analyse des bus disponibles", "Analyse des capacités restantes", "Redistribution géographique des élèves", "Recalcul des horaires", "Vérification de l’arrivée avant l’heure d’entrée"];

export function CrisisPanel() {
  const demo = useDemo();
  const broken = demo.vehicles.find((v) => v.status === "Panne" && demo.plan.some((c) => c.vehicleId === v.id && c.status !== "Suspendu"));
  const [vehicle, setVehicle] = useState(broken?.id ?? "B-03");
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [progress, setProgress] = useState(0);
  useEffect(() => { if (broken) setVehicle(broken.id); }, [broken]);
  useEffect(() => { if (phase !== "run") return; const t = window.setInterval(() => setProgress((p) => Math.min(100, p + 3)), 80); return () => window.clearInterval(t); }, [phase]);
  useEffect(() => { if (phase === "run" && progress >= 100) setPhase("done"); }, [phase, progress]);
  const isBroken = demo.vehicles.find((v) => v.id === vehicle)?.status === "Panne";
  const circuit = demo.plan.find((c) => c.vehicleId === vehicle && c.status !== "Suspendu");
  const proposal = useMemo(() => crisisPlan(demo.plan, vehicle), [demo.plan, vehicle]);
  const current = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));
  const latest = proposal ? Math.max(...proposal.moves.map((m) => toMin(m.arrival))) : 0;

  return <section className="mb-6 overflow-hidden rounded-lg border border-destructive/25 bg-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-danger-soft/60 p-5">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-md bg-destructive text-destructive-foreground"><ShieldAlert /></span><div><h2 className="text-lg font-bold">Agent IA Gestion de Crise</h2><p className="text-sm text-muted-foreground">Redistribue automatiquement les élèves d’un bus en panne vers les autres circuits.</p></div></div>
      <Select value={vehicle} onValueChange={(v) => { setVehicle(v); setPhase("idle"); }}><SelectTrigger className="w-48 bg-card"><SelectValue /></SelectTrigger><SelectContent>{demo.plan.filter((c) => c.status !== "Suspendu").map((c) => <SelectItem key={c.id} value={c.vehicleId}>Bus {c.vehicleId} · {c.id}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="p-5">
      {!circuit ? <p className="text-sm text-muted-foreground">Aucun circuit actif pour ce véhicule : plan de crise déjà appliqué.</p> : phase === "idle" ? <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm">{isBroken ? <p className="flex items-center gap-2 font-semibold text-destructive"><AlertTriangle className="size-4" />Bus {vehicle} en panne · Circuit {circuit.id} concerné · {circuit.stops.length} élèves impactés</p> : <p>Simulez une panne : le Bus {vehicle} dessert le circuit {circuit.id} ({circuit.stops.length} élèves).</p>}</div>
        <div className="flex gap-2">{!isBroken && <Button variant="outline" onClick={() => { demo.breakdown(vehicle); toast.error(`Bus ${vehicle} en panne`, { description: `${circuit.stops.length} élèves impactés` }); }}><AlertTriangle />Passer {vehicle} en panne</Button>}<Button disabled={!isBroken} onClick={() => { setProgress(0); setPhase("run"); }}><Sparkles />Générer un plan de crise avec l’IA</Button></div>
      </div> : phase === "run" ? <div className="grid gap-6 md:grid-cols-[1fr_1.3fr]"><div className="text-center"><Bot className="mx-auto size-10 animate-pulse text-destructive" /><h3 className="mt-3 font-bold">{steps[current]}…</h3><Progress value={progress} className="mt-4 h-2" /><p className="mt-2 text-sm font-semibold">{progress} %</p></div><ol className="space-y-1.5">{steps.map((s, i) => <li key={s} className={cn("flex items-center gap-2 text-sm", i > current && "opacity-40", i === current && "font-semibold")}><span className={cn("grid size-5 place-items-center rounded-full text-[10px]", i < current ? "bg-success text-success-foreground" : "bg-muted")}>{i < current ? <Check className="size-3" /> : i + 1}</span>{s}</li>)}</ol></div>
      : proposal && <div className="space-y-4 animate-fade-in">
        <p className="text-sm"><b>Proposition :</b> {proposal.impacted} élèves du circuit {proposal.failed.id} redistribués sur {proposal.moves.length} circuits voisins.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{proposal.moves.map((m) => <div key={m.id} className="rounded-md border p-4"><div className="flex justify-between"><b>Circuit {m.id}</b><b className="text-secondary">+{m.added} élèves</b></div><p className="mt-1 text-xs text-muted-foreground">Bus {m.vehicleId} · départ {m.firstPickup}</p><Progress value={(m.after / m.capacity) * 100} className="mt-3 h-1.5" /><p className="mt-2 text-sm">{m.id} : <b>{m.after} / {m.capacity}</b> <span className="text-xs text-muted-foreground">(avant {m.before})</span></p></div>)}</div>
        {proposal.unplaced.length > 0 && <p className="text-sm text-destructive">{proposal.unplaced.length} élèves sans place : un véhicule de remplacement est nécessaire.</p>}
        <p className="flex items-center gap-2 text-sm font-semibold text-success"><Check className="size-4" />Toutes les arrivées restent prévues avant {SCHOOL.entry} (au plus tard {Math.floor(latest / 60)}:{String(latest % 60).padStart(2, "0")}).</p>
        <div className="flex gap-2"><Button onClick={() => { demo.applyCrisis(proposal.newPlan, vehicle); setPhase("idle"); toast.success("Plan de crise appliqué", { description: "Circuits, planning et tableau de bord mis à jour." }); }}><Check />Appliquer le plan de crise</Button><Button variant="outline" onClick={() => setPhase("idle")}>Annuler</Button></div>
      </div>}
    </div>
  </section>;
}
