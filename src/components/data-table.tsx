import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronLeft, ChevronRight, Download, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "./status-badge";
import { toast } from "sonner";

export type TableColumn<T> = { key: keyof T; label: string; render?: (row: T) => React.ReactNode };

export function DataTable<T extends { id: string | number }>({ data, columns, placeholder = "Rechercher…", onView }: { data: T[]; columns: TableColumn<T>[]; placeholder?: string; onView?: (row: T) => void }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const filtered = useMemo(() => data.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [data, query]);
  const sorted = useMemo(() => sortKey ? [...filtered].sort((a,b) => String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), "fr", { numeric: true }) * (sortDirection === "asc" ? 1 : -1)) : filtered, [filtered, sortKey, sortDirection]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / size));
  const shown = sorted.slice((page - 1) * size, page * size);
  const toggleAll = () => setSelected(selected.length === shown.length ? [] : shown.map((r) => r.id));
  return <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
      <div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={placeholder} className="pl-9" /></div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{selected.length>0&&<><Button variant="outline" size="sm" onClick={()=>toast.success("Export généré avec succès")}><Download/>Exporter</Button><Button variant="outline" size="sm" onClick={()=>toast.success("Statut mis à jour")}>Changer statut</Button><Button variant="destructive" size="sm" onClick={()=>{setSelected([]);toast.success("Suppression simulée")}}><Trash2/>Supprimer</Button></>}<span>{selected.length ? `${selected.length} sélectionné(s)` : `${filtered.length} résultats`}</span><Select value={String(size)} onValueChange={(v) => { setSize(Number(v)); setPage(1); }}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select></div>
    </div>
    <div className="max-h-[580px] overflow-auto"><table className="w-full min-w-[950px] text-left text-sm"><thead className="sticky top-0 z-10 bg-table-header text-xs uppercase text-muted-foreground"><tr><th className="w-12 px-4 py-3"><Checkbox checked={shown.length > 0 && selected.length === shown.length} onCheckedChange={toggleAll} /></th>{columns.map((c) => <th key={String(c.key)} className="whitespace-nowrap px-4 py-3 font-semibold"><button className="inline-flex items-center gap-1.5" onClick={()=>{if(sortKey===c.key)setSortDirection(d=>d==="asc"?"desc":"asc");else{setSortKey(c.key);setSortDirection("asc")}}}>{c.label}<ArrowDownUp className="size-3"/></button></th>)}<th className="w-12 px-4 py-3" /></tr></thead><tbody>{shown.map((row) => <tr key={row.id} onClick={() => onView?.(row)} className={`border-t transition-colors hover:bg-muted/50 ${onView ? "cursor-pointer" : ""}`}><td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.includes(row.id)} onCheckedChange={() => setSelected((s) => s.includes(row.id) ? s.filter((id) => id !== row.id) : [...s, row.id])} /></td>{columns.map((c) => <td key={String(c.key)} className="max-w-64 truncate px-4 py-3">{c.render ? c.render(row) : String(row[c.key] ?? "—")}</td>)}<td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="Actions"><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => onView ? onView(row) : toast("Fiche ouverte")}>Consulter</DropdownMenuItem><DropdownMenuItem onClick={() => toast.success("Modification simulée")}>Modifier</DropdownMenuItem><DropdownMenuItem onClick={() => toast.success("Élément dupliqué")}>Dupliquer</DropdownMenuItem><DropdownMenuItem onClick={() => toast.error("Suppression simulée")}>Supprimer</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td></tr>)}</tbody></table></div>
    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground"><span>Page {page} sur {totalPages}</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)} aria-label="Page précédente"><ChevronLeft /></Button><Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Page suivante"><ChevronRight /></Button></div></div>
  </div>;
}

export const statusCell = <T,>(key: keyof T) => (row: T) => <StatusBadge>{String(row[key])}</StatusBadge>;