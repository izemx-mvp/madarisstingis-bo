import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Bus, FileText, Grid2X2, List, Plus, Sparkles, Wrench } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DataTable, statusCell } from "@/components/data-table";
import { ImportDialog, StudentDialog } from "@/components/dialogs";
import { StatusBadge } from "@/components/status-badge";
import { DocImport } from "@/components/doc-import";
import { TangerMap } from "@/components/tanger-map";
import { CircuitHeader, StopList } from "@/components/circuit-detail";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDemo, type DriverView, type VehicleView } from "@/lib/demo-state";
import { toGeo } from "@/lib/mock-data";
import { complianceLevel, daysUntil, fmtDate, SCHOOL, type PlanCircuit } from "@/lib/transport-engine";
import { toast } from "sonner";

export function StudentsPage() {
  const { students, plan } = useDemo();
  const rows = useMemo(() => {
    const idx = new Map<number, { circuit: string; order: number; time: string; bus: string }>();
    plan.forEach((c) => c.stops.forEach((s) => idx.set(s.student.id, { circuit: c.id, order: s.order, time: s.time, bus: c.vehicleId })));
    return students.map((s) => { const a = idx.get(s.id); return { ...s, location: toGeo(s.x, s.y), circuit: a?.circuit ?? "À affecter", order: a ? String(a.order) : "—", time: a?.time ?? "—", bus: a?.bus ?? "—" }; });
  }, [students, plan]);
  return <AppShell title="Élèves"><PageIntro text={`${students.length} élèves dans la liste globale. L’IA les répartit automatiquement dans les circuits.`}><ImportDialog /><StudentDialog trigger={<Button><Plus />Ajouter un élève</Button>} /></PageIntro>
    <DataTable data={rows} placeholder="Nom, matricule, quartier, circuit…" columns={[{ key: "matricule", label: "Matricule" }, { key: "name", label: "Nom complet" }, { key: "classroom", label: "Classe" }, { key: "address", label: "Adresse" }, { key: "district", label: "Quartier" }, { key: "location", label: "Localisation" }, { key: "circuit", label: "Circuit", render: (r) => r.circuit === "À affecter" ? <StatusBadge>À affecter</StatusBadge> : <b>{r.circuit}</b> }, { key: "order", label: "Ordre" }, { key: "time", label: "Prise en charge" }, { key: "bus", label: "Bus" }]} /></AppShell>;
}

export function VehiclesPage() {
  const { vehicles, vehicleDocs } = useDemo();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [open, setOpen] = useState<string | null>(null);
  const nextDeadline = (v: VehicleView) => { const d = [...vehicleDocs.filter((x) => x.owner === v.id).map((x) => ({ label: x.type, date: x.expires })), { label: "Vidange", date: v.nextDue }].sort((a, b) => a.date.localeCompare(b.date))[0]; return d ? `${d.label} · ${fmtDate(d.date)}` : "—"; };
  const rows = vehicles.map((v) => ({ ...v, label: `Bus ${v.id} · ${v.brand} ${v.model}`, availability: v.status === "Disponible" || v.status === "Affecté" ? "Disponible" : "Indisponible", deadline: nextDeadline(v) }));
  return <AppShell title="Véhicules"><PageIntro text="Disponibilité, affectations chauffeur et échéances administratives des 7 véhicules."><div className="flex rounded-md border p-1"><Button aria-label="Vue cartes" variant={view === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setView("grid")}><Grid2X2 /></Button><Button aria-label="Vue tableau" variant={view === "table" ? "secondary" : "ghost"} size="icon" onClick={() => setView("table")}><List /></Button></div><Button onClick={() => toast.success("Nouveau véhicule prêt à être renseigné")}><Plus />Ajouter</Button></PageIntro>
    {view === "grid" ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((v) => <article key={v.id} className="rounded-lg border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="flex justify-between"><div className="grid size-11 place-items-center rounded-md bg-secondary/10 text-secondary"><Bus /></div><StatusBadge>{v.status}</StatusBadge></div><h2 className="mt-5 text-xl font-bold">Bus {v.id}</h2><p className="text-sm text-muted-foreground">{v.brand} {v.model} · {v.capacity} places</p><div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-sm"><span><small className="block text-muted-foreground">Chauffeur affecté</small><b>{v.driver}</b></span><span><small className="block text-muted-foreground">Circuit</small>{v.circuit}</span><span className="col-span-2"><small className="block text-muted-foreground">Prochaine échéance</small>{v.deadline}</span></div><Button variant="outline" className="mt-5 w-full" onClick={() => setOpen(v.id)}>Voir la fiche</Button></article>)}</div>
      : <DataTable data={rows} onView={(r) => setOpen(r.id)} columns={[{ key: "label", label: "Véhicule" }, { key: "capacity", label: "Capacité" }, { key: "availability", label: "Disponibilité", render: statusCell("availability") }, { key: "status", label: "Statut", render: statusCell("status") }, { key: "circuit", label: "Circuit" }, { key: "driver", label: "Chauffeur affecté" }, { key: "deadline", label: "Prochaine échéance" }]} />}
    <VehicleSheet id={open} onClose={() => setOpen(null)} />
  </AppShell>;
}

function VehicleSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const demo = useDemo(); const navigate = useNavigate();
  const v = demo.vehicles.find((x) => x.id === id);
  const c = demo.plan.find((x) => x.vehicleId === id && x.status !== "Suspendu");
  const docs = demo.vehicleDocs.filter((d) => d.owner === id);
  const maint = demo.maintenances.filter((m) => m.vehicle === id);
  const inc = demo.incidents.filter((m) => m.vehicle === id);
  return <Sheet open={!!v} onOpenChange={(o) => !o && onClose()}><SheetContent className="w-full overflow-y-auto sm:max-w-2xl">{v && <>
    <SheetHeader><SheetTitle className="flex items-center gap-3">Bus {v.id} <StatusBadge>{v.status}</StatusBadge></SheetTitle><SheetDescription>{v.brand} {v.model} · {v.plate}</SheetDescription></SheetHeader>
    <div className="mt-4 flex flex-wrap gap-2 px-4">
      <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={v.status === "Panne"}><AlertTriangle />Déclarer une panne</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Passer le bus {v.id} en panne ?</AlertDialogTitle><AlertDialogDescription>{c ? `${c.stops.length} élèves du circuit ${c.id} seront impactés. L’Agent Gestion de Crise proposera une redistribution.` : "Ce véhicule n’est affecté à aucun circuit."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => { demo.breakdown(v.id); toast.error(`Bus ${v.id} en panne`, { description: "Plan de crise disponible dans Incidents." }); onClose(); navigate({ to: "/incidents" }); }}>Confirmer la panne</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <Button variant="outline" size="sm" onClick={() => { demo.setVehicleStatus(v.id, "Maintenance"); toast.success(`Bus ${v.id} passé en maintenance`); }}><Wrench />Passer en maintenance</Button>
      {v.status !== "Disponible" && v.status !== "Affecté" && <Button variant="ghost" size="sm" onClick={() => { demo.setVehicleStatus(v.id, "Disponible"); toast.success(`Bus ${v.id} de nouveau disponible`); }}>Remettre disponible</Button>}
    </div>
    <Tabs defaultValue="info" className="mt-4 px-4 pb-6"><TabsList className="flex h-auto flex-wrap justify-start"><TabsTrigger value="info">Informations</TabsTrigger><TabsTrigger value="docs">Documents</TabsTrigger><TabsTrigger value="maint">Maintenance</TabsTrigger><TabsTrigger value="inc">Incidents</TabsTrigger><TabsTrigger value="plan">Planning</TabsTrigger><TabsTrigger value="aff">Affectations</TabsTrigger></TabsList>
      <TabsContent value="info"><InfoGrid items={[["Référence interne", v.id], ["Immatriculation", v.plate], ["Marque", v.brand], ["Modèle", v.model], ["Année", String(v.year)], ["Capacité", `${v.capacity} places`], ["Statut", v.status], ["Chauffeur actuel", v.driver], ["Circuit actuel", v.circuit]]} /></TabsContent>
      <TabsContent value="docs" className="space-y-4"><DocTable docs={docs} /><DocImport kind="vehicle" owner={v.id} /></TabsContent>
      <TabsContent value="maint" className="space-y-3"><div className="grid gap-2 sm:grid-cols-3">{[["Vidange", fmtDate(v.nextDue)], ["Révision", maint.find((m) => m.type === "Révision")?.plannedDate ?? "15/12/2026"], ["Pneus", maint.find((m) => m.type === "Pneumatiques")?.plannedDate ?? "20/01/2027"], ["Freinage", maint.find((m) => m.type === "Freinage")?.plannedDate ?? "10/02/2027"], ["Batterie", maint.find((m) => m.type === "Batterie")?.plannedDate ?? "05/03/2027"], ["Réparations", `${maint.filter((m) => m.type === "Autre").length} en cours`]].map(([l, d]) => <div key={l} className="rounded-md border p-3 text-sm"><small className="block text-muted-foreground">{l}</small><b>{d}</b></div>)}</div><h4 className="pt-2 text-sm font-bold">Interventions</h4>{maint.length ? maint.map((m) => <Row key={m.id} title={`${m.id} · ${m.type}`} detail={`${m.plannedDate} · ${m.provider} · ${m.cost} MAD`} status={m.status} />) : <Empty text="Aucune intervention enregistrée." />}</TabsContent>
      <TabsContent value="inc" className="space-y-2">{inc.length ? inc.map((i) => <Row key={i.id} title={`${i.id} · ${i.type}`} detail={`${i.date} · ${i.description}`} status={i.status} />) : <Empty text="Aucun incident pour ce véhicule." />}</TabsContent>
      <TabsContent value="plan" className="space-y-2">{c ? <><Row title={`Aller · Circuit ${c.id}`} detail={`Départ ${c.firstPickup} · Arrivée ${SCHOOL.name} ${c.arrival}`} status="Planifié" /><Row title={`Retour · Circuit ${c.id}`} detail={`Départ école ${c.returnDeparture} · ${c.stops.length} élèves`} status="Planifié" /></> : <Empty text="Aucun circuit planifié pour ce véhicule." />}</TabsContent>
      <TabsContent value="aff" className="space-y-2">{c ? <Row title={`Circuit ${c.id} · ${c.zone}`} detail={`Chauffeur ${c.driver ?? "à affecter"} · ${c.stops.length}/${c.capacity} élèves`} status={c.status} /> : <Empty text="Véhicule non affecté." />}<Row title="Année 2025/2026" detail="Circuit Ziaten / Mesnana · affectation clôturée" status="Terminée" /></TabsContent>
    </Tabs></>}</SheetContent></Sheet>;
}

export function DriversPage() {
  const { drivers } = useDemo();
  const [open, setOpen] = useState<number | null>(null);
  const rows = drivers.map((d) => ({ ...d, expiry: fmtDate(d.licenseExpires) }));
  return <AppShell title="Chauffeurs"><PageIntro text="États, permis et affectations. L’Agent IA affecte les chauffeurs après la génération des circuits."><Button onClick={() => toast.success("Nouveau chauffeur prêt à être renseigné")}><Plus />Ajouter un chauffeur</Button></PageIntro>
    <DataTable data={rows} onView={(r) => setOpen(r.id)} placeholder="Nom, zone, permis…" columns={[{ key: "name", label: "Nom" }, { key: "phone", label: "Téléphone" }, { key: "address", label: "Adresse" }, { key: "district", label: "Zone" }, { key: "status", label: "Statut", render: statusCell("status") }, { key: "vehicle", label: "Véhicule" }, { key: "circuit", label: "Circuit" }, { key: "license", label: "N° permis" }, { key: "category", label: "Catégorie" }, { key: "expiry", label: "Expiration permis", render: (r) => <span className="flex items-center gap-2">{r.expiry}{complianceLevel(r.licenseExpires) !== "Conforme" && <StatusBadge>{complianceLevel(r.licenseExpires)}</StatusBadge>}</span> }]} />
    <DriverSheet id={open} onClose={() => setOpen(null)} /></AppShell>;
}

function DriverSheet({ id, onClose }: { id: number | null; onClose: () => void }) {
  const demo = useDemo();
  const d: DriverView | undefined = demo.drivers.find((x) => x.id === id);
  const c = demo.plan.find((x) => x.driverId === id && x.status !== "Suspendu");
  return <Sheet open={!!d} onOpenChange={(o) => !o && onClose()}><SheetContent className="w-full overflow-y-auto sm:max-w-2xl">{d && <>
    <SheetHeader><SheetTitle className="flex items-center gap-3">{d.name} <StatusBadge>{d.status}</StatusBadge></SheetTitle><SheetDescription>{d.district} · {d.phone}</SheetDescription></SheetHeader>
    <Tabs defaultValue="info" className="mt-4 px-4 pb-6"><TabsList className="flex h-auto flex-wrap justify-start"><TabsTrigger value="info">Informations</TabsTrigger><TabsTrigger value="permis">Permis</TabsTrigger><TabsTrigger value="docs">Documents</TabsTrigger><TabsTrigger value="aff">Affectations</TabsTrigger><TabsTrigger value="hist">Historique</TabsTrigger></TabsList>
      <TabsContent value="info" className="space-y-4"><InfoGrid items={[["Nom", d.lastName], ["Prénom", d.firstName], ["Téléphone", d.phone], ["Adresse", d.address], ["Localisation simulée", toGeo(d.x, d.y)], ["État actuel", d.status]]} /><div className="flex items-center gap-3"><span className="text-sm font-medium">Changer l’état</span><Select value={demo.driverStatus[d.id] ?? d.baseStatus} onValueChange={(s) => { demo.setDriverStatus(d.id, s); toast.success(`${d.name} : ${s}`, { description: "Relancez l’Agent Affectation pour réaffecter si nécessaire." }); }}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{["Disponible", "Absent", "Malade", "Congé", "Indisponible"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div></TabsContent>
      <TabsContent value="permis"><InfoGrid items={[["Numéro", d.license], ["Catégorie", d.category], ["Date de délivrance", fmtDate(d.licenseIssued)], ["Expiration", `${fmtDate(d.licenseExpires)} (${daysUntil(d.licenseExpires) < 0 ? "expiré" : `J-${daysUntil(d.licenseExpires)}`})`], ["Fichier", `permis-${d.lastName.toLowerCase()}.pdf`], ["Conformité", complianceLevel(d.licenseExpires)]]} /></TabsContent>
      <TabsContent value="docs" className="space-y-4"><DocTable docs={demo.driverDocs.filter((x) => x.owner === d.name)} /><DocImport kind="driver" owner={d.name} /></TabsContent>
      <TabsContent value="aff" className="space-y-2">{c ? <><Row title={`Bus ${c.vehicleId} · Circuit ${c.id}`} detail={c.justification ?? ""} status={c.status} /><Row title="Planning" detail={`Aller ${c.firstPickup} → ${c.arrival} · Retour ${c.returnDeparture}`} status="Planifié" /></> : <Empty text="Aucune affectation actuelle." />}</TabsContent>
      <TabsContent value="hist" className="space-y-2">{[["29/09/2026", `Affecté ${c ? `au circuit ${c.id}` : "— réserve"}`, "Agent IA"], ["22/09/2026", "Disponible", "Responsable transport"], ["08/09/2026", "Rentrée scolaire · planning validé", "Direction"], ["30/06/2026", "Congé annuel", "Administration"]].map(([date, what, who]) => <Row key={date} title={what ?? ""} detail={`${date} · ${who}`} status="" />)}</TabsContent>
    </Tabs></>}</SheetContent></Sheet>;
}

export function CircuitsPage() {
  const { plan } = useDemo();
  const [open, setOpen] = useState<string | null>(null);
  const rows = plan.map((c) => ({ id: c.id, zone: c.zone || "—", vehicle: `Bus ${c.vehicleId}`, driver: c.driver ?? "—", students: c.stops.length, capacity: c.capacity, first: c.status === "Suspendu" ? "—" : c.firstPickup, arrival: c.status === "Suspendu" ? "—" : c.arrival, status: c.status }));
  return <AppShell title="Circuits scolaires"><PageIntro text={`${plan.filter((c) => c.status !== "Suspendu").length} circuits actifs générés par l’IA, arrivée avant ${SCHOOL.entry}.`}><Button variant="outline" asChild><Link to="/agent-ia"><Sparkles />Régénérer avec l’IA</Link></Button></PageIntro>
    <DataTable data={rows} onView={(r) => setOpen(r.id)} placeholder="Circuit, zone, chauffeur…" columns={[{ key: "id", label: "Circuit" }, { key: "zone", label: "Zone" }, { key: "vehicle", label: "Véhicule" }, { key: "driver", label: "Chauffeur" }, { key: "students", label: "Élèves" }, { key: "capacity", label: "Capacité" }, { key: "first", label: "Premier ramassage" }, { key: "arrival", label: "Arrivée école" }, { key: "status", label: "Statut", render: statusCell("status") }]} />
    <CircuitSheet circuit={plan.find((c) => c.id === open)} plan={plan} onClose={() => setOpen(null)} /></AppShell>;
}

function CircuitSheet({ circuit, plan, onClose }: { circuit?: PlanCircuit | undefined; plan: PlanCircuit[]; onClose: () => void }) {
  return <Sheet open={!!circuit} onOpenChange={(o) => !o && onClose()}><SheetContent className="w-full overflow-y-auto sm:max-w-3xl">{circuit && <><SheetHeader><SheetTitle>Circuit {circuit.id}</SheetTitle><SheetDescription>{circuit.zone} · {circuit.status}</SheetDescription></SheetHeader><div className="space-y-4 px-4 pb-6">{circuit.status === "Suspendu" ? <Empty text="Circuit suspendu : élèves redistribués par le plan de crise." /> : <><CircuitHeader c={circuit} /><TangerMap plan={plan} highlight={circuit.id} className="min-h-[360px]" /><StopList c={circuit} /></>}</div></>}</SheetContent></Sheet>;
}

function DocTable({ docs }: { docs: { id: string; type: string; number: string; issued: string; expires: string; file: string }[] }) {
  if (!docs.length) return <Empty text="Aucun document importé pour le moment." />;
  return <div className="overflow-x-auto rounded-md border"><table className="w-full min-w-[560px] text-sm"><thead className="bg-table-header text-left text-xs uppercase text-muted-foreground"><tr>{["Type", "Numéro", "Émission", "Expiration", "Fichier", "Statut"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead><tbody>{docs.map((d) => <tr key={d.id} className="border-t"><td className="px-3 py-2 font-medium">{d.type}</td><td className="px-3 py-2">{d.number}</td><td className="px-3 py-2">{fmtDate(d.issued)}</td><td className="px-3 py-2">{fmtDate(d.expires)}</td><td className="px-3 py-2"><button className="flex items-center gap-1 text-secondary hover:underline" onClick={() => toast(`Aperçu de ${d.file}`, { description: "Document simulé." })}><FileText className="size-3.5" />{d.file}</button></td><td className="px-3 py-2"><StatusBadge>{complianceLevel(d.expires)}</StatusBadge></td></tr>)}</tbody></table></div>;
}
function InfoGrid({ items }: { items: [string, string][] }) { return <div className="grid gap-3 sm:grid-cols-2">{items.map(([l, v]) => <div key={l} className="rounded-md border p-3"><small className="block text-muted-foreground">{l}</small><b className="text-sm">{v}</b></div>)}</div>; }
function Row({ title, detail, status }: { title: string; detail: string; status: string }) { return <div className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"><span className="min-w-0"><b className="block">{title}</b><small className="text-muted-foreground">{detail}</small></span>{status && <StatusBadge>{status}</StatusBadge>}</div>; }
function Empty({ text }: { text: string }) { return <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">{text}</p>; }
function PageIntro({ text, children }: { text: string; children: React.ReactNode }) { return <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center"><p className="text-muted-foreground">{text}</p><div className="flex flex-wrap gap-2">{children}</div></div>; }
