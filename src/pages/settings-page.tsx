import { useState } from "react";
import { Bell, Building2, Check, Save, Settings, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SCHOOL } from "@/lib/transport-engine";
import { toast } from "sonner";

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); toast.success("Paramètres enregistrés"); window.setTimeout(() => setSaved(false), 900); };
  return <AppShell title="Paramètres" eyebrow="Configuration"><Tabs defaultValue="school">
    <TabsList className="mb-6 flex h-auto flex-wrap justify-start"><TabsTrigger value="school"><Building2 />Établissement</TabsTrigger><TabsTrigger value="transport"><Settings />Transport</TabsTrigger><TabsTrigger value="alerts"><Bell />Alertes</TabsTrigger><TabsTrigger value="users"><UsersRound />Utilisateurs</TabsTrigger></TabsList>
    <TabsContent value="school"><Panel title="Établissement" icon={Building2}><div className="grid gap-4 md:grid-cols-2"><Field id="addr" label="Adresse"><Input id="addr" defaultValue={`${SCHOOL.name} · ${SCHOOL.address}`} /></Field><Field id="loc" label="Localisation"><Input id="loc" defaultValue="35.7745°N, 5.8360°O" /></Field><Field id="in" label="Heure d’entrée"><Input id="in" type="time" defaultValue={SCHOOL.entry} /></Field><Field id="out" label="Heure de sortie"><Input id="out" type="time" defaultValue={SCHOOL.exit} /></Field></div><SaveButton saved={saved} onClick={save} /></Panel></TabsContent>
    <TabsContent value="transport"><Panel title="Transport" icon={Settings}><div className="grid gap-4 md:grid-cols-2"><Field id="margin" label="Marge d’arrivée avant les cours (minutes)"><Input id="margin" type="number" defaultValue={12} /></Field><Field id="dur" label="Durée maximale d’un circuit (minutes)"><Input id="dur" type="number" defaultValue={80} /></Field></div><div className="mt-5 space-y-3">{["Respecter strictement la capacité des véhicules", "Exclure les véhicules indisponibles ou en panne", "Exclure les chauffeurs absents, malades ou en congé", "Conserver les fratries dans le même circuit"].map((x) => <Toggle key={x} label={x} />)}</div><SaveButton saved={saved} onClick={save} /></Panel></TabsContent>
    <TabsContent value="alerts"><Panel title="Alertes" icon={Bell}><div className="grid gap-4 md:grid-cols-2"><Field id="exp" label="Délai d’alerte avant expiration (jours)"><Input id="exp" type="number" defaultValue={45} /></Field><Field id="urg" label="Seuil urgent (jours)"><Input id="urg" type="number" defaultValue={15} /></Field></div><div className="mt-5 space-y-3">{["Rappels de maintenance et vidange", "Expiration des permis chauffeurs", "Assurance, carte grise et visite technique", "Autorisations de transport scolaire"].map((x) => <Toggle key={x} label={x} />)}</div><SaveButton saved={saved} onClick={save} /></Panel></TabsContent>
    <TabsContent value="users"><Panel title="Utilisateurs" icon={UsersRound}><div className="divide-y">{[["Nadia El Amrani", "Direction"], ["Karim Tazi", "Admin"], ["Youssef Berrada", "Responsable transport"], ["Salma Alaoui", "Responsable flotte"]].map(([n, r]) => <div key={n} className="flex items-center justify-between py-3"><span className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">{n!.split(" ").map((x) => x[0]).join("").slice(0, 2)}</span><span><b className="block text-sm">{n}</b><small className="text-muted-foreground">{r}</small></span></span><Button variant="outline" size="sm" onClick={() => toast(`Droits de ${n} (simulation)`)}>Gérer les droits</Button></div>)}</div></Panel></TabsContent>
  </Tabs></AppShell>;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Bell; children: React.ReactNode }) { return <section className="rounded-lg border bg-card p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 text-lg font-bold"><Icon className="size-5 text-secondary" />{title}</h2>{children}</section>; }
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) { return <div><Label htmlFor={id} className="mb-1.5 block">{label}</Label>{children}</div>; }
function Toggle({ label }: { label: string }) { return <label className="flex items-center justify-between rounded-md border p-4 text-sm font-medium">{label}<Switch defaultChecked /></label>; }
function SaveButton({ saved, onClick }: { saved: boolean; onClick: () => void }) { return <Button className="mt-6" onClick={onClick}>{saved ? <Check /> : <Save />}{saved ? "Enregistré" : "Enregistrer"}</Button>; }
