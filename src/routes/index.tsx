import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Bus, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/madariss-tingis-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Connexion — Transport Madariss TINGIS" },
    { name: "description", content: "Accédez à la démonstration de gestion du transport scolaire Madariss TINGIS." },
    { property: "og:title", content: "Connexion — Transport Madariss TINGIS" },
    { property: "og:description", content: "Plateforme de gestion du transport scolaire et de la flotte." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const navigate = useNavigate({ from: "/" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); window.setTimeout(() => navigate({ to: "/dashboard" }), 700); };
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.15fr_.85fr]">
      <section className="relative hidden overflow-hidden bg-ai-panel p-12 text-ai-foreground lg:flex lg:flex-col lg:justify-between xl:p-20">
        <div className="absolute -right-24 top-16 size-96 rounded-full border border-ai-foreground/10" /><div className="absolute -right-8 top-40 size-64 rounded-full border border-ai-foreground/10" />
        <img src={logo.url} alt="Madariss TINGIS" className="relative h-16 w-64 rounded-md bg-card object-contain px-4" />
        <div className="relative max-w-2xl"><p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase text-accent"><ShieldCheck className="size-4" />Plateforme interne sécurisée</p><h1 className="font-display text-5xl font-bold leading-tight xl:text-6xl">Chaque trajet compte.<br/><span className="text-accent">Chaque élève aussi.</span></h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-ai-foreground/70">Une vision claire et humaine du transport scolaire, de la flotte aux circuits quotidiens.</p></div>
        <div className="relative flex gap-10 border-t border-ai-foreground/15 pt-7"><span><b className="block text-2xl">426</b><small className="text-ai-foreground/60">élèves transportés</small></span><span><b className="block text-2xl">10</b><small className="text-ai-foreground/60">circuits actifs</small></span><span><b className="block text-2xl">14</b><small className="text-ai-foreground/60">véhicules</small></span></div>
      </section>
      <section className="flex items-center justify-center p-6 md:p-12"><div className="w-full max-w-md"><img src={logo.url} alt="Madariss TINGIS" className="mb-10 h-16 w-64 object-contain object-left lg:hidden" /><div className="mb-8"><span className="mb-4 grid size-12 place-items-center rounded-md bg-primary/10 text-primary"><Bus /></span><h2 className="font-display text-3xl font-bold">Gestion intelligente du transport scolaire</h2><p className="mt-3 text-muted-foreground">Centralisez votre flotte, vos circuits et vos opérations de transport.</p></div><form onSubmit={login} className="space-y-5"><div><Label htmlFor="email">Adresse email</Label><Input id="email" type="email" defaultValue="direction@madarisstingis.ma" className="mt-2 h-11" /></div><div><div className="flex justify-between"><Label htmlFor="password">Mot de passe</Label><span className="text-xs text-secondary">Accès démonstration</span></div><div className="relative mt-2"><Input id="password" type={show ? "text" : "password"} defaultValue="demo2026" className="h-11 pr-10" /><Button type="button" variant="ghost" size="icon" onClick={()=>setShow(!show)} className="absolute right-1 top-1" aria-label="Afficher le mot de passe">{show ? <EyeOff/> : <Eye/>}</Button></div></div><Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? "Connexion…" : <>Se connecter <ArrowRight /></>}</Button></form><div className="mt-6 rounded-md border bg-muted/50 p-4 text-sm"><b>Identifiants de démonstration</b><p className="mt-1 text-muted-foreground">direction@madarisstingis.ma · demo2026</p></div><p className="mt-8 text-center text-xs text-muted-foreground">Madariss TINGIS · Administration scolaire · Tanger</p></div></section>
    </div>
  );
}
