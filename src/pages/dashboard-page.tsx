import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bus, BusFront, Clock3, FileWarning, GraduationCap, Route, ShieldAlert, Sparkles, UserRoundX, UsersRound, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-state";
import { SCHOOL } from "@/lib/transport-engine";

export function DashboardPage() {
  const { incidents, maintenances, vehicles, drivers, students, plan, alerts } = useDemo();
  const active = plan.filter((c) => c.status !== "Suspendu");
  const busOk = vehicles.filter((v) => v.status === "Disponible" || v.status === "Affecté");
  const busKo = vehicles.length - busOk.length;
  const drvOk = drivers.filter((d) => d.status === "Disponible" || d.status === "Affecté").length;
  const drvAbs = drivers.filter((d) => d.status === "Absent" || d.status === "Malade").length;
  const openInc = incidents.filter((x) => x.status === "Nouveau" || x.status === "En traitement");
  const activeMaint = maintenances.filter((x) => x.status === "Planifiée" || x.status === "En cours").length;
  const assigned = new Set(plan.flatMap((c) => c.stops.map((s) => s.student.id)));
  const recentUnassigned = students.filter((s) => s.recent && !assigned.has(s.id)).length;
  const broken = vehicles.filter((v) => v.status === "Panne");
  const permits = alerts.filter((a) => a.kind === "Chauffeur").length;
  const visits = alerts.filter((a) => a.message.startsWith("Visite technique")).length;
  const kpis = [
    ["Élèves transportés", students.length, `${recentUnassigned} récemment ajoutés`, GraduationCap],
    ["Circuits générés", active.length, `Arrivée avant ${SCHOOL.entry}`, Route],
    ["Bus disponibles", busOk.length, `${busOk.reduce((s, v) => s + v.capacity, 0)} places`, Bus],
    ["Bus indisponibles", busKo, broken.length ? `${broken.map((b) => b.id).join(", ")} en panne` : "Maintenance / immobilisés", BusFront],
    ["Chauffeurs disponibles", drvOk, `sur ${drivers.length}`, UsersRound],
    ["Chauffeurs absents / malades", drvAbs, "Exclus de l’affectation IA", UserRoundX],
    ["Incidents ouverts", openInc.length, "Suivi en temps réel", ShieldAlert],
    ["Maintenances actives", activeMaint, "Planifiées ou en cours", Wrench],
    ["Documents à renouveler", alerts.length, `${alerts.filter((a) => a.level === "Urgent").length} urgents`, FileWarning],
  ] as const;
  const ops = [
    ...broken.map((b) => ({ tone: "bg-destructive", text: `Bus ${b.id} en panne`, to: "/incidents" as const })),
    ...(recentUnassigned ? [{ tone: "bg-warning", text: `${recentUnassigned} élèves récemment ajoutés sans circuit`, to: "/eleves" as const }] : []),
    ...(permits ? [{ tone: "bg-warning", text: `${permits} permis expirent bientôt ou sont expirés`, to: "/chauffeurs" as const }] : []),
    ...(visits ? [{ tone: "bg-warning", text: `${visits} visite technique arrive à échéance`, to: "/vehicules" as const }] : []),
    ...openInc.slice(0, 2).map((i) => ({ tone: "bg-destructive", text: `${i.vehicle} · ${i.description}`, to: "/incidents" as const })),
  ];
  const pct = (n: number) => `${(n / vehicles.length) * 100}%`;
  const maintCount = vehicles.filter((v) => v.status === "Maintenance").length;
  return <AppShell title="Bonjour Nadia," eyebrow="Tableau de bord">
    <section className="-mt-3 mb-6 overflow-hidden rounded-lg bg-ai-panel p-6 text-ai-foreground shadow-ai"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase text-accent">Mercredi 30 septembre 2026</p><h2 className="mt-2 max-w-2xl text-2xl font-bold">Bonjour, voici l’état de votre transport scolaire aujourd’hui.</h2><p className="mt-2 text-sm text-ai-foreground/65">{students.length} élèves importés · {busOk.length} bus et {drvOk} chauffeurs disponibles · entrée à {SCHOOL.entry}.</p><Button asChild variant="secondary" className="mt-4"><Link to="/agent-ia"><Sparkles />Ouvrir le Centre IA</Link></Button></div><div className="grid grid-cols-3 gap-5 text-center"><span><b className="block text-xl">{active.length}</b><small className="text-ai-foreground/60">circuits</small></span><span><b className="block text-xl">{busOk.length}</b><small className="text-ai-foreground/60">bus prêts</small></span><span><b className="block text-xl">{ops.length}</b><small className="text-ai-foreground/60">alertes</small></span></div></div></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{kpis.map(([label, value, note, Icon]) => <article key={label} className="group relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="absolute right-0 top-0 h-1 w-16 bg-primary transition-all group-hover:w-full" /><div className="flex justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div><div className="grid size-11 place-items-center rounded-full bg-secondary/10 text-secondary"><Icon /></div></div><p className="mt-4 text-xs font-semibold text-muted-foreground">{note}</p></article>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
      <section className="overflow-hidden rounded-lg border bg-card shadow-sm"><div className="flex items-center justify-between border-b p-5"><div><h2 className="text-lg font-bold">Transport aujourd’hui</h2><p className="text-sm text-muted-foreground">Circuits du matin · arrivée {SCHOOL.name}</p></div><Button variant="outline" size="sm" asChild><Link to="/planning">Planning</Link></Button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="bg-table-header text-left text-xs uppercase text-muted-foreground"><tr>{["Circuit", "Élèves", "Bus", "Chauffeur", "Départ", "Arrivée", "Statut"].map((x) => <th key={x} className="px-5 py-3">{x}</th>)}</tr></thead><tbody>{plan.map((c) => <tr key={c.id} className="border-t hover:bg-muted/40"><td className="px-5 py-3"><b style={{ color: c.color }}>{c.id}</b><span className="block text-xs text-muted-foreground">{c.zone || "—"}</span></td><td className="px-5">{c.stops.length}/{c.capacity}</td><td className="px-5 font-medium">{c.vehicleId}</td><td className="px-5">{c.driver ?? "—"}</td><td className="px-5">{c.status === "Suspendu" ? "—" : c.firstPickup}</td><td className="px-5">{c.status === "Suspendu" ? "—" : c.arrival}</td><td className="px-5"><StatusBadge>{c.status}</StatusBadge></td></tr>)}</tbody></table></div></section>
      <div className="space-y-6">
        <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><AlertTriangle className="size-5 text-primary" />Alertes opérationnelles</h2><div className="mt-3 divide-y">{ops.length ? ops.map((o, i) => <Link key={i} to={o.to} className="flex items-center gap-3 py-3 text-sm hover:text-secondary"><span className={`size-2 shrink-0 rounded-full ${o.tone}`} />{o.text}</Link>) : <p className="py-3 text-sm text-muted-foreground">Aucune alerte opérationnelle.</p>}</div></section>
        <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-bold"><FileWarning className="size-5 text-secondary" />Agent Alertes & Conformité</h2><div className="mt-3 space-y-2">{alerts.slice(0, 5).map((a) => <div key={a.id} className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2"><span className={`size-2 shrink-0 rounded-full ${a.level === "Urgent" ? "bg-destructive" : "bg-warning"}`} />{a.message}</span><StatusBadge>{a.level}</StatusBadge></div>)}</div><p className="mt-3 text-xs text-muted-foreground">🟢 Conforme · 🟠 À renouveler bientôt · 🔴 Urgent / expiré</p></section>
        <section className="rounded-lg border bg-card p-5 shadow-sm"><h2 className="text-lg font-bold">Disponibilité flotte</h2><div className="mt-4 flex items-center gap-6"><div className="relative grid size-32 place-items-center rounded-full" style={{ background: `conic-gradient(var(--secondary) 0 ${pct(busOk.length)}, var(--warning) ${pct(busOk.length)} ${pct(busOk.length + maintCount)}, var(--destructive) ${pct(busOk.length + maintCount)})` }}><div className="grid size-20 place-items-center rounded-full bg-card text-center"><div><b className="block text-xl">{vehicles.length}</b><span className="text-xs text-muted-foreground">véhicules</span></div></div></div><div className="space-y-2 text-sm"><p><i className="mr-2 inline-block size-2 rounded-full bg-secondary" />{busOk.length} disponibles</p><p><i className="mr-2 inline-block size-2 rounded-full bg-warning" />{maintCount} maintenance</p><p><i className="mr-2 inline-block size-2 rounded-full bg-destructive" />{busKo - maintCount} indisponibles / panne</p></div></div></section>
      </div>
    </div>
    <section className="mt-6 rounded-lg border bg-card p-5 shadow-sm"><div className="mb-5 flex items-center gap-2"><Clock3 className="size-5 text-secondary" /><h2 className="text-lg font-bold">Planning du jour</h2></div><div className="grid gap-3 md:grid-cols-4">{[[active.map((c) => c.firstPickup).sort()[0] ?? "07:00", "Premiers ramassages", `${active.length} circuits`], [active[0]?.arrival ?? "08:18", `Arrivée ${SCHOOL.name}`, `Entrée ${SCHOOL.entry}`], ["10:00", "Maintenance flotte", `${maintCount} véhicules`], ["16:40", "Circuits retour", `Sortie ${SCHOOL.exit}`]].map(([t, l, d]) => <div key={l} className="border-l-2 border-secondary pl-4"><b className="text-secondary">{t}</b><p className="mt-1 font-semibold">{l}</p><p className="text-xs text-muted-foreground">{d}</p></div>)}</div></section>
  </AppShell>;
}
