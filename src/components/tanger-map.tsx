import { useState } from "react";
import { Minus, Plus, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { districtCenters } from "@/lib/mock-data";
import { SCHOOL, type PlanCircuit } from "@/lib/transport-engine";
import { cn } from "@/lib/utils";

export function TangerMap({ plan, highlight, onSelect, className }: { plan: PlanCircuit[]; highlight?: string | null; onSelect?: (id: string | null) => void; className?: string }) {
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<string | null>(null);
  const active = plan.filter((c) => c.status !== "Suspendu");
  const w = 700 / zoom, h = 480 / zoom;
  const focus = active.find((c) => c.id === highlight);
  const cx = focus ? focus.stops.reduce((s, x) => s + x.student.x, 0) / (focus.stops.length || 1) : SCHOOL.x;
  const cy = focus ? focus.stops.reduce((s, x) => s + x.student.y, 0) / (focus.stops.length || 1) : SCHOOL.y;
  const vx = Math.min(Math.max(cx - w / 2, 0), 700 - w), vy = Math.min(Math.max(cy - h / 2, 0), 480 - h);
  return <div className={cn("relative min-h-[440px] overflow-hidden rounded-lg border bg-map", className)}>
    <div className="absolute left-4 top-4 z-10 max-w-[70%] rounded-md bg-card/95 p-3 shadow">
      <p className="text-xs font-bold uppercase">Carte simulée · Tanger</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {active.map((c) => <button key={c.id} onClick={() => onSelect?.(highlight === c.id ? null : c.id)} className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold transition-all", highlight && highlight !== c.id && "opacity-40")} style={{ borderColor: c.color, color: c.color }}>● {c.id}</button>)}
        {highlight && <button onClick={() => onSelect?.(null)} className="rounded-full bg-muted px-2 py-0.5 text-xs">Tout afficher</button>}
      </div>
    </div>
    <svg viewBox={`${vx} ${vy} ${w} ${h}`} className="absolute inset-0 size-full transition-all duration-500" role="img" aria-label="Carte des circuits">
      <path d="M0 95 C110 110 170 60 260 85 S460 100 700 40 V0 H0Z" fill="var(--map-water)" />
      <g stroke="var(--map-road)" strokeWidth="9" fill="none" opacity=".9"><path d="M-20 420 Q180 260 380 310 T730 190" /><path d="M100 500 Q180 290 330 200 T640 80" /><path d="M40 230 Q230 190 420 240 T700 350" /></g>
      {Object.entries(districtCenters).map(([name, [x, y]]) => <text key={name} x={x} y={y - 34} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--muted-foreground)" opacity=".75">{name}</text>)}
      {active.map((c) => {
        const dim = (highlight && highlight !== c.id) || (!highlight && hover && hover !== c.id);
        const pts = [...c.stops.map((s) => `${s.student.x},${s.student.y}`), `${SCHOOL.x},${SCHOOL.y}`].join(" ");
        const start = c.stops[0]?.student;
        return <g key={c.id} opacity={dim ? 0.1 : 1} className="cursor-pointer transition-opacity" onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} onClick={() => onSelect?.(c.id)}>
          <polyline points={pts} fill="none" stroke={c.color} strokeWidth={highlight === c.id ? 3 : 2} strokeLinejoin="round" opacity=".85" />
          {c.stops.map((s) => <circle key={s.student.id} cx={s.student.x} cy={s.student.y} r={highlight === c.id ? 4 : 2.6} fill={c.color} stroke="var(--card)" strokeWidth="1"><title>{`${s.order}. ${s.student.name} · ${s.time}`}</title></circle>)}
          {highlight === c.id && c.stops.map((s) => s.order % 5 === 1 && <text key={`t${s.order}`} x={s.student.x + 5} y={s.student.y - 5} fontSize="8" fontWeight="700" fill="var(--foreground)">{s.order}</text>)}
          {start && <g><circle cx={start.x} cy={start.y} r="8" fill="var(--card)" stroke={c.color} strokeWidth="3" /><text x={start.x} y={start.y + 3} textAnchor="middle" fontSize="8" fontWeight="800" fill={c.color}>D</text></g>}
        </g>;
      })}
      <g><circle cx={SCHOOL.x} cy={SCHOOL.y} r="14" fill="var(--foreground)" stroke="var(--card)" strokeWidth="4" /><text x={SCHOOL.x} y={SCHOOL.y + 30} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--foreground)">Madariss TINGIS</text></g>
    </svg>
    <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-md bg-card/95 px-3 py-2 text-xs shadow"><span className="flex items-center gap-1"><School className="size-3.5" />École · destination</span><span><b>D</b> Départ</span><span>● Élève</span></div>
    <div className="absolute bottom-4 right-4 flex flex-col gap-1"><Button variant="outline" size="icon" aria-label="Zoom avant" onClick={() => setZoom((z) => Math.min(2.5, z + 0.5))}><Plus /></Button><Button variant="outline" size="icon" aria-label="Zoom arrière" onClick={() => setZoom((z) => Math.max(1, z - 0.5))}><Minus /></Button></div>
  </div>;
}
