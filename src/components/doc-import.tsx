import { useRef, useState } from "react";
import { FileUp, Loader2, ScanText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-state";
import { toast } from "sonner";

export function DocImport({ kind, owner }: { kind: "vehicle" | "driver"; owner: string }) {
  const { addDocument } = useDemo();
  const [phase, setPhase] = useState<"idle" | "scan" | "review">("idle");
  const [file, setFile] = useState("");
  const [form, setForm] = useState({ type: "", number: "", issued: "", expires: "" });
  const input = useRef<HTMLInputElement>(null);
  const handle = (name: string) => {
    if (!/\.(pdf|jpe?g|png)$/i.test(name)) { toast.error("Format non pris en charge", { description: "Formats acceptés : PDF, JPG, PNG." }); return; }
    setFile(name); setPhase("scan");
    window.setTimeout(() => { setForm(kind === "vehicle" ? { type: "Assurance", number: "ASS-45896", issued: "2026-01-12", expires: "2027-01-12" } : { type: "Permis de conduire", number: "P-908273", issued: "2021-03-15", expires: "2031-03-15" }); setPhase("review"); }, 1800);
  };
  if (phase === "scan") return <div className="grid place-items-center rounded-lg border-2 border-dashed border-secondary/40 bg-secondary/5 p-8 text-center"><Loader2 className="mb-2 size-8 animate-spin text-secondary" /><b>Analyse du document en cours…</b><p className="text-xs text-muted-foreground">{file} · lecture simulée</p></div>;
  if (phase === "review") return <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4"><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary"><ScanText className="size-4" />Informations pré-remplies automatiquement · {file}</p><div className="grid gap-3 sm:grid-cols-2">{([["type", "Type document"], ["number", "Numéro"], ["issued", "Date émission"], ["expires", "Expiration"]] as const).map(([k, l]) => <div key={k}><Label htmlFor={`doc-${k}`}>{l}</Label><Input id={`doc-${k}`} className="mt-1" type={k === "issued" || k === "expires" ? "date" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>)}</div><div className="mt-4 flex gap-2"><Button onClick={() => { addDocument(kind, { owner, file, ...form }); toast.success("Document enregistré"); setPhase("idle"); }}>Valider les informations</Button><Button variant="ghost" onClick={() => setPhase("idle")}>Annuler</Button></div></div>;
  return <div role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && input.current?.click()} onClick={() => input.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handle(f.name); }} className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-secondary/40 bg-secondary/5 p-6 text-center transition-colors hover:bg-secondary/10">
    <FileUp className="mb-2 size-7 text-secondary" /><b>Importer un document</b><p className="text-xs text-muted-foreground">Glissez un fichier PDF, JPG ou PNG ou cliquez pour parcourir</p>
    <button type="button" className="mt-2 text-xs font-semibold text-secondary underline" onClick={(e) => { e.stopPropagation(); handle(kind === "vehicle" ? `assurance-${owner}.pdf` : `permis-${owner.replaceAll(" ", "-")}.jpg`); }}>Utiliser un exemple</button>
    <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f.name); e.target.value = ""; }} />
  </div>;
}
