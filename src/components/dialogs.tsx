import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Check, FileSpreadsheet, Loader2, RefreshCw, Sparkles, UploadCloud } from "lucide-react";
import { useDemo } from "@/lib/demo-state";
import { districts, toGeo, type Student } from "@/lib/mock-data";
import { recommendCircuit } from "@/lib/transport-engine";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function StudentDialog({ trigger }: { trigger: React.ReactNode }) {
  const demo = useDemo();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ first: "", last: "", classroom: "", address: "", district: "Mesnana", level: "Primaire" });
  const [phase, setPhase] = useState<"form" | "scan" | "result">("form");
  const [student, setStudent] = useState<Student | null>(null);
  const [skip, setSkip] = useState(0);
  const reco = student ? recommendCircuit(demo.plan, student, skip) : null;
  const scan = () => { setPhase("scan"); window.setTimeout(() => setPhase("result"), 1800); };
  const create = () => {
    if (!form.first || !form.last) { toast.error("Prénom et nom requis"); return; }
    const s = demo.addStudent({ name: `${form.first} ${form.last}`, level: form.level, classroom: form.classroom || "CE2 A", address: `${form.address || "12, Rue Al Amal"}, ${form.district}`, district: form.district, recent: true });
    setStudent(s); setSkip(0); toast.success("Élève ajouté avec succès"); scan();
  };
  const reset = (v: boolean) => { setOpen(v); if (!v) { setPhase("form"); setStudent(null); setForm({ ...form, first: "", last: "", address: "" }); } };
  return <Dialog open={open} onOpenChange={reset}><DialogTrigger asChild>{trigger}</DialogTrigger><DialogContent className="max-w-2xl">
    {phase === "form" && <><DialogHeader><DialogTitle>Ajouter un élève</DialogTitle><DialogDescription>Après l’ajout, l’IA analyse automatiquement son adresse et recommande un circuit.</DialogDescription></DialogHeader><div className="grid gap-4 py-2 sm:grid-cols-2">
      {([["first", "Prénom"], ["last", "Nom"], ["classroom", "Classe"], ["address", "Adresse"]] as const).map(([k, l]) => <div key={k}><Label htmlFor={`st-${k}`}>{l}</Label><Input id={`st-${k}`} className="mt-1.5" placeholder={l} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>)}
      <div><Label>Niveau</Label><Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}><SelectTrigger className="mt-1.5 w-full"><SelectValue /></SelectTrigger><SelectContent>{["Maternelle", "Primaire", "Collège", "Lycée"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
      <div><Label>Quartier</Label><Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}><SelectTrigger className="mt-1.5 w-full"><SelectValue /></SelectTrigger><SelectContent>{districts.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
    </div><DialogFooter><Button variant="outline" onClick={() => reset(false)}>Annuler</Button><Button onClick={create}>Créer l’élève</Button></DialogFooter></>}
    {phase === "scan" && <div className="py-10 text-center"><div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-secondary/10 text-secondary"><Bot className="size-8 animate-pulse" /></div><h3 className="text-lg font-bold">Analyse IA du nouvel élève</h3><p className="mt-2 text-sm text-muted-foreground">Adresse · localisation · circuits existants · capacités restantes · horaires…</p><Loader2 className="mx-auto mt-5 size-6 animate-spin text-secondary" /></div>}
    {phase === "result" && student && <><DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="size-5 text-secondary" />Analyse IA du nouvel élève</DialogTitle><DialogDescription>{student.name} · {student.district} · {toGeo(student.x, student.y)}</DialogDescription></DialogHeader>
      {reco ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[["Circuit recommandé", reco.circuit.id], ["Bus", reco.circuit.vehicleId], ["Ordre de ramassage", String(reco.order)], ["Heure", reco.time], ["Capacité après ajout", `${reco.after} / ${reco.capacity}`], ["Distance au circuit", `${reco.km} km`]].map(([l, v]) => <div key={l} className="rounded-md border p-3"><small className="block text-muted-foreground">{l}</small><b className="text-lg">{v}</b></div>)}<p className="col-span-full rounded-md bg-secondary/5 p-3 text-sm text-muted-foreground">Le circuit {reco.circuit.id} passe à proximité de l’adresse et dispose encore de places ; l’arrivée à l’école reste prévue à {reco.updated.arrival}.</p></div> : <p className="text-sm">Aucun circuit ne dispose de places restantes.</p>}
      <DialogFooter className="gap-2"><Button variant="outline" onClick={() => { setSkip((s) => s + 1); scan(); }}><RefreshCw />Recalculer</Button><Button variant="outline" asChild><Link to="/circuits" onClick={() => reset(false)}>Voir le circuit</Link></Button><Button disabled={!reco} onClick={() => { if (reco) { demo.acceptStudent(reco.updated); toast.success(`${student.name} affecté au circuit ${reco.circuit.id}`); reset(false); } }}><Check />Accepter</Button></DialogFooter></>}
  </DialogContent></Dialog>;
}

export function ImportDialog() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep(1); }}><DialogTrigger asChild><Button variant="outline"><UploadCloud />Importer un fichier</Button></DialogTrigger><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Importer des élèves</DialogTitle><DialogDescription>Étape {step} sur 3 · Excel ou CSV</DialogDescription></DialogHeader>{step === 1 && <div className="grid place-items-center rounded-lg border-2 border-dashed border-secondary/40 bg-secondary/5 px-6 py-12 text-center"><FileSpreadsheet className="mb-3 size-10 text-secondary" /><p className="font-semibold">Déposez votre fichier ici</p><p className="mt-1 text-sm text-muted-foreground">ou cliquez pour parcourir vos fichiers</p></div>}{step === 2 && <div className="space-y-3">{["Prénom → Prénom", "Nom → Nom", "Classe → Classe", "Adresse → Adresse", "Quartier → Quartier"].map(x => <div key={x} className="flex items-center justify-between rounded-md border p-3 text-sm"><span>{x.split(" → ")[0]}</span><span className="font-semibold text-secondary">{x.split(" → ")[1]}</span></div>)}</div>}{step === 3 && <div className="grid grid-cols-3 gap-3 py-6 text-center"><div className="rounded-md bg-muted p-4"><b className="block text-2xl">128</b><span className="text-xs">détectés</span></div><div className="rounded-md bg-success-soft p-4 text-success"><b className="block text-2xl">123</b><span className="text-xs">valides</span></div><div className="rounded-md bg-warning-soft p-4 text-warning-foreground"><b className="block text-2xl">5</b><span className="text-xs">à vérifier</span></div></div>}<DialogFooter><Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Retour</Button><Button onClick={() => step < 3 ? setStep((s) => s + 1) : (setOpen(false), toast.success("123 élèves importés"))}>{step === 3 ? "Terminer" : "Continuer"}</Button></DialogFooter></DialogContent></Dialog>;
}