import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Bus, Check, Clock3, MapPin, RefreshCw, School, Sparkles, UserRoundCheck, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TangerMap } from "@/components/tanger-map";
import { CircuitHeader, StopList } from "@/components/circuit-detail";
import { useDemo } from "@/lib/demo-state";
import { SCHOOL } from "@/lib/transport-engine";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const genSteps = ["Analyse de la liste des élèves", "Analyse des adresses", "Calcul des regroupements géographiques", "Analyse des véhicules disponibles", "Vérification des capacités", "Analyse de la localisation de l’école", "Vérification de l’heure d’entrée", "Calcul de l’ordre de ramassage", "Calcul des heures de passage", "Génération des circuits", "Vérification des heures d’arrivée", "Finalisation"];
const assignSteps = ["Lecture des circuits générés", "Localisation des points de départ", "Analyse des adresses des chauffeurs", "Vérification des états et disponibilités", "Contrôle des plannings", "Affectation optimale"];

export function AiPage() {
  const demo = useDemo();
  const [phase, setPhase] = useState<"idle" | "gen" | "assign" | "done">(demo.aiGenerated ? "done" : "idle");
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const busesReady = demo.vehicles.filter((v) => v.status === "Disponible" || v.status === "Affecté");
  const driversReady = demo.drivers.filter((d) => d.status === "Disponible" || d.status === "Affecté");
  const capacity = busesReady.reduce((s, v) => s + v.capacity, 0);

  useEffect(() => {
    if (phase !== "gen" && phase !== "assign") return;
    const timer = window.setInterval(() => setProgress((p) => Math.min(100, p + (phase === "gen" ? 2 : 4))), 90);
    return () => window.clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (progress < 100) return;
    if (phase === "gen") { demo.runGeneration(); setProgress(0); setPhase("assign"); }
    else if (phase === "assign") { setPhase("done"); toast.success("Organisation complète générée", { description: "Circuits, horaires et chauffeurs affectés." }); }
  }, [progress, phase, demo]);

  const start = () => { setProgress(0); setSelected(null); setPhase("gen"); };
  const steps = phase === "assign" ? assignSteps : genSteps;
  const current = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));
  const active = demo.plan.filter((c) => c.status !== "Suspendu");
  const focus = active.find((c) => c.id === selected) ?? active[0];

  return <AppShell title="Centre IA Transport" eyebrow="Agents IA – Optimisation">
    <section className="relative overflow-hidden rounded-lg bg-ai-panel p-6 text-ai-foreground shadow-ai md:p-8">
      <div className="absolute right-0 top-0 size-64 translate-x-1/3 -translate-y-1/3 rounded-full border border-ai-foreground/10" /><div className="absolute right-12 top-12 size-40 animate-pulse rounded-full border border-ai-foreground/10" />
      <div className="relative flex gap-4"><div className="grid size-14 shrink-0 place-items-center rounded-md bg-ai-foreground/10"><Bot className="size-7" /></div><div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-accent"><Sparkles className="size-3.5" />Organisation automatique</p><h2 className="font-display text-2xl font-bold md:text-3xl">L’IA organise tout le transport à partir de vos données</h2><p className="mt-2 max-w-2xl text-sm text-ai-foreground/70">Élèves + bus + école → Agent Génération Circuits → ordre de ramassage et horaires → Agent Affectation Chauffeurs → planning complet.</p></div></div>
    </section>

    <section className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-bold">Données détectées</h3><p className="text-sm text-muted-foreground">Aucune sélection manuelle : toutes les données de la plateforme sont utilisées.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[[UsersRound, `${demo.students.length} élèves transportés`, "Adresses et localisations simulées"], [Bus, `${busesReady.length} bus disponibles`, busesReady.map((v) => v.id).join(" · ")], [Bus, `Capacité totale disponible : ${capacity} places`, `Taux cible ${Math.round((demo.students.length / Math.max(1, capacity)) * 100)} %`], [UserRoundCheck, `${driversReady.length} chauffeurs disponibles`, "Absents, malades et congés exclus"], [MapPin, "Localisation établissement", `${SCHOOL.name} · ${SCHOOL.address}`], [Clock3, `Heure d’entrée : ${SCHOOL.entry}`, "Marge d’arrivée : 12 minutes"]].map(([Icon, title, detail]) => { const I = Icon as typeof Bus; return <div key={String(title)} className="flex gap-3 rounded-md border p-4"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary/10 text-secondary"><I className="size-5" /></span><span><b className="block text-sm">{String(title)}</b><small className="text-muted-foreground">{String(detail)}</small></span></div>; })}
      </div>
      {(phase === "idle" || phase === "done") && <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={start} className="shadow-lg">{phase === "done" ? <RefreshCw /> : <Sparkles />}{phase === "done" ? "Relancer l’organisation avec l’IA" : "Générer l’organisation avec l’IA"}</Button>
        <span className="text-sm text-muted-foreground">L’administrateur lance uniquement le calcul.</span>
      </div>}
    </section>

    {(phase === "gen" || phase === "assign") && <section className="mt-6 grid gap-6 rounded-lg border bg-card p-6 shadow-sm lg:grid-cols-[1fr_1.2fr]">
      <div className="text-center"><div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-secondary/10 text-secondary"><Bot className="size-9 animate-pulse" /></div><p className="text-xs font-bold uppercase text-secondary">{phase === "gen" ? "Agent 1 · Génération des circuits" : "Agent 2 · Affectation chauffeurs"}</p><h3 className="mt-2 text-xl font-bold">{steps[current]}…</h3><Progress value={progress} className="mt-6 h-2" /><p className="mt-3 text-sm font-semibold text-secondary">{progress} %</p></div>
      <ol className="space-y-2">{steps.map((s, i) => <li key={s} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all", i === current ? "bg-secondary/10 font-semibold" : i < current ? "text-muted-foreground" : "opacity-40")}><span className={cn("grid size-6 place-items-center rounded-full text-xs", i < current ? "bg-success text-success-foreground" : i === current ? "bg-secondary text-secondary-foreground" : "bg-muted")}>{i < current ? <Check className="size-3.5" /> : i + 1}</span>{s}</li>)}</ol>
    </section>}

    {phase === "done" && focus && <div className="mt-6 space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">{[[demo.students.length, "élèves organisés"], [active.length, "circuits générés"], [active.length, "bus mobilisés"], [active.filter((c) => c.driver).length, "chauffeurs affectés"], [`${Math.round((active.reduce((s, c) => s + c.stops.length, 0) / Math.max(1, active.reduce((s, c) => s + c.capacity, 0))) * 100)} %`, "capacité utilisée"], [active.map((c) => c.firstPickup).sort()[0], "premier départ"]].map(([v, l]) => <div key={String(l)} className="rounded-lg border bg-card p-4 text-center shadow-sm"><b className="block text-2xl">{v}</b><span className="text-xs text-muted-foreground">{l}</span></div>)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <TangerMap plan={demo.plan} highlight={selected} onSelect={setSelected} />
        <div className="space-y-2">{active.map((c) => <button key={c.id} onClick={() => setSelected(c.id)} className={cn("w-full rounded-lg border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5", focus.id === c.id && "ring-2 ring-secondary")}><div className="flex items-center justify-between"><b style={{ color: c.color }}>● {c.id} <span className="text-foreground">— {c.zone}</span></b><span className="text-xs font-semibold">{c.stops.length}/{c.capacity}</span></div><p className="mt-1 text-xs text-muted-foreground">Bus {c.vehicleId} · {c.driver ?? "À affecter"} · {c.firstPickup} → {c.arrival}</p></button>)}</div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2"><div className="space-y-4"><CircuitHeader c={focus} /><div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 text-sm"><b className="flex items-center gap-2"><Sparkles className="size-4 text-secondary" />Pourquoi cette proposition ?</b><p className="mt-1 text-muted-foreground">Les élèves de {focus.zone} sont regroupés par proximité géographique autour d’un même axe vers l’école ; le Bus {focus.vehicleId} ({focus.capacity} places) absorbe ce volume sans dépasser sa capacité, avec une arrivée à {focus.arrival}.</p></div></div><StopList c={focus} /></div>

      <section className="rounded-lg border bg-card shadow-sm"><div className="flex items-center gap-3 border-b p-5"><span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary"><UserRoundCheck /></span><div><h3 className="text-lg font-bold">Agent IA Affectation Chauffeurs</h3><p className="text-sm text-muted-foreground">Affectation réalisée après la génération des circuits, selon localisation, état, disponibilité et planning.</p></div></div>
        <div className="divide-y">{active.map((c) => <div key={c.id} className="grid gap-2 p-4 md:grid-cols-[180px_1fr]"><span className="text-sm"><b style={{ color: c.color }}>{c.id}</b> · Bus {c.vehicleId}</span><div><p className="text-sm"><b>{c.driver ?? "Aucun chauffeur"}</b>{c.driver && <> conduira le <b>Bus {c.vehicleId}</b> sur le <b>Circuit {c.id}</b>.</>}</p><p className="mt-1 text-xs text-muted-foreground">« {c.justification} »</p></div></div>)}</div>
      </section>
      <div className="flex flex-wrap gap-2"><Button onClick={() => { demo.setPlan(demo.plan.map((c) => c.status === "Suspendu" ? c : { ...c, status: "Validé" })); toast.success("Organisation validée", { description: "Circuits et planning mis à jour." }); }}><Check />Valider l’organisation</Button><Button variant="outline" asChild><Link to="/planning">Voir le planning</Link></Button><Button variant="outline" asChild><Link to="/circuits">Voir les circuits</Link></Button><Button variant="ghost" onClick={() => toast.success("Export généré avec succès")}>Exporter</Button><span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><School className="size-3.5" />Toutes les arrivées avant {SCHOOL.entry}</span></div>
    </div>}
  </AppShell>;
}
