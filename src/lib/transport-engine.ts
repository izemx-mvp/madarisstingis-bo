// Moteur de simulation front-end : génération des circuits, affectation chauffeurs, plan de crise, conformité.
import { driverRoster, students as baseStudents, TODAY, vehicles as baseVehicles, type DocumentRecord, type Driver, type Student, type Vehicle } from "./mock-data";

export const SCHOOL = { name: "Madariss TINGIS", address: "Route de Rabat, Tanger", x: 350, y: 262, entry: "08:30", exit: "16:30" };
export const ARRIVAL_MARGIN = 12;
export const CIRCUIT_COLORS = ["var(--primary)", "var(--secondary)", "var(--warning)", "var(--chart-3)", "var(--success)", "var(--destructive)", "var(--chart-5)", "var(--chart-1)"];

export type Stop = { student: Student; order: number; time: string };
export type PlanCircuit = {
  id: string; color: string; zone: string; vehicleId: string; capacity: number; stops: Stop[];
  firstPickup: string; arrival: string; returnDeparture: string; driverId?: number; driver?: string; justification?: string;
  status: "Généré par IA" | "Validé" | "Suspendu"; distanceKm: number;
};

export const toMin = (t: string) => { const [h = "0", m = "0"] = t.split(":"); return Number(h) * 60 + Number(m); };
export const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.round(m % 60)).padStart(2, "0")}`;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
export const fmtDate = (iso: string) => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
export const daysUntil = (iso: string) => Math.round((new Date(iso).getTime() - new Date(TODAY).getTime()) / 86400000);

/** Ordre de ramassage : départ du plus éloigné, puis plus proche voisin ; horaires calculés à rebours depuis l'arrivée. */
export function buildRoute(list: Student[], arrival = toMin(SCHOOL.entry) - ARRIVAL_MARGIN) {
  const rest = [...list];
  const ordered: Student[] = [];
  rest.sort((a, b) => dist(b, SCHOOL) - dist(a, SCHOOL));
  let cur = rest.shift();
  while (cur) {
    ordered.push(cur);
    const from: Student = cur;
    rest.sort((a, b) => dist(a, from) - dist(b, from));
    cur = rest.shift();
  }
  const times: number[] = new Array(ordered.length);
  let t = arrival; let px = 0;
  for (let i = ordered.length - 1; i >= 0; i--) {
    const s = ordered[i]!;
    const next = i === ordered.length - 1 ? SCHOOL : ordered[i + 1]!;
    const d = dist(s, next); px += d;
    t -= d / 16 + 0.55;
    times[i] = t;
  }
  const stops = ordered.map((student, i) => ({ student, order: i + 1, time: fromMin(Math.floor(times[i] ?? arrival)) }));
  return { stops, firstPickup: stops[0]?.time ?? fromMin(arrival), arrival: fromMin(arrival), distanceKm: Math.round(px * 0.045) };
}

const topZones = (list: Student[]) => {
  const counts = new Map<string, number>();
  list.forEach((s) => counts.set(s.district, (counts.get(s.district) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([z]) => z).join(" / ");
};

function makeCircuit(id: string, color: string, vehicle: Vehicle, list: Student[], prev?: PlanCircuit): PlanCircuit {
  const r = buildRoute(list);
  return { id, color, zone: topZones(list), vehicleId: vehicle.id, capacity: vehicle.capacity, stops: r.stops, firstPickup: r.firstPickup, arrival: r.arrival, returnDeparture: "16:40", distanceKm: r.distanceKm, status: prev?.status ?? "Généré par IA", driverId: prev?.driverId, driver: prev?.driver, justification: prev?.justification };
}

/** Agent Génération Circuits : balayage angulaire autour de l'école, découpage proportionnel aux capacités. */
export function generateCircuits(list: Student[], fleet: Vehicle[]): PlanCircuit[] {
  const buses = [...fleet].sort((a, b) => a.id.localeCompare(b.id));
  if (!buses.length) return [];
  const sorted = [...list].sort((a, b) => Math.atan2(a.y - SCHOOL.y, a.x - SCHOOL.x) - Math.atan2(b.y - SCHOOL.y, b.x - SCHOOL.x));
  const totalCap = buses.reduce((s, b) => s + b.capacity, 0);
  let idx = 0;
  return buses.map((bus, i) => {
    const share = i === buses.length - 1 ? sorted.length - idx : Math.min(bus.capacity, Math.round((bus.capacity / totalCap) * sorted.length));
    const chunk = sorted.slice(idx, idx + share); idx += share;
    return makeCircuit(`C-${String(i + 1).padStart(2, "0")}`, CIRCUIT_COLORS[i % CIRCUIT_COLORS.length]!, bus, chunk);
  });
}

/** Agent Affectation Chauffeurs : chauffeur disponible le plus proche du point de départ du circuit. */
export function assignDrivers(plan: PlanCircuit[], pool: Driver[]): PlanCircuit[] {
  const free = [...pool];
  return [...plan].sort((a, b) => toMin(a.firstPickup) - toMin(b.firstPickup)).map((c) => {
    if (c.status === "Suspendu") return { ...c, driverId: undefined, driver: undefined, justification: undefined };
    const start = c.stops[0]?.student ?? SCHOOL;
    free.sort((a, b) => dist(a, start) - dist(b, start));
    const d = free.shift();
    if (!d) return { ...c, driver: undefined, driverId: undefined, justification: "Aucun chauffeur disponible : affectation manuelle requise." };
    const km = (dist(d, start) * 0.045).toFixed(1);
    return { ...c, driverId: d.id, driver: d.name, justification: `${d.name} est disponible, son planning est libre sur ce créneau et il réside à ${d.district}, à environ ${km} km du premier arrêt (${start && "district" in start ? start.district : "départ"}).` };
  }).sort((a, b) => a.id.localeCompare(b.id));
}

export const availableVehicles = (status: Record<string, string>) => baseVehicles.filter((v) => (status[v.id] ?? v.baseStatus) === "Disponible");
export const availableDrivers = (status: Record<number, string>) => driverRoster.filter((d) => (status[d.id] ?? d.baseStatus) === "Disponible");

export function computePlan(list: Student[], vStatus: Record<string, string> = {}, dStatus: Record<number, string> = {}) {
  return assignDrivers(generateCircuits(list, availableVehicles(vStatus)), availableDrivers(dStatus));
}

export const initialPlan = computePlan(baseStudents.filter((s) => !s.recent));
/** Résumé statique pour les graphiques. */
export const circuits = initialPlan.map((c) => ({ id: c.id, name: c.zone, zone: c.zone, students: c.stops.length, capacity: c.capacity, vehicle: c.vehicleId, driver: c.driver ?? "—", time: c.firstPickup, status: c.status }));

const centroid = (c: PlanCircuit) => {
  const n = c.stops.length || 1;
  return { x: c.stops.reduce((s, x) => s + x.student.x, 0) / n, y: c.stops.reduce((s, x) => s + x.student.y, 0) / n };
};
const nearestStop = (c: PlanCircuit, p: { x: number; y: number }) => Math.min(...c.stops.map((s) => dist(s.student, p)), Infinity);

/** Agent Gestion de Crise : redistribution géographique des élèves d'un circuit impacté. */
export function crisisPlan(plan: PlanCircuit[], vehicleId: string) {
  const failed = plan.find((c) => c.vehicleId === vehicleId && c.status !== "Suspendu");
  if (!failed) return null;
  const receivers = plan.filter((c) => c.id !== failed.id && c.status !== "Suspendu");
  const load = new Map(receivers.map((c) => [c.id, c.stops.length]));
  const added = new Map<string, Student[]>(receivers.map((c) => [c.id, []]));
  const unplaced: Student[] = [];
  const impacted = failed.stops.map((s) => s.student);
  for (const s of impacted) {
    const target = receivers.filter((c) => (load.get(c.id) ?? 0) < c.capacity).sort((a, b) => nearestStop(a, s) - nearestStop(b, s))[0];
    if (!target) { unplaced.push(s); continue; }
    load.set(target.id, (load.get(target.id) ?? 0) + 1);
    added.get(target.id)!.push(s);
  }
  const vehicleOf = (id: string) => baseVehicles.find((v) => v.id === id)!;
  const newPlan = plan.map((c) => {
    if (c.id === failed.id) return { ...c, status: "Suspendu" as const, stops: [], driver: undefined, driverId: undefined, justification: undefined };
    const extra = added.get(c.id) ?? [];
    if (!extra.length) return c;
    return makeCircuit(c.id, c.color, vehicleOf(c.vehicleId), [...c.stops.map((s) => s.student), ...extra], c);
  });
  const moves = receivers.map((c) => {
    const n = newPlan.find((x) => x.id === c.id)!;
    return { id: c.id, vehicleId: c.vehicleId, added: added.get(c.id)?.length ?? 0, before: c.stops.length, after: n.stops.length, capacity: c.capacity, firstPickup: n.firstPickup, arrival: n.arrival };
  }).filter((m) => m.added > 0);
  return { failed, impacted: impacted.length, moves, unplaced, newPlan };
}

/** Analyse IA d'un nouvel élève : circuit le plus proche disposant de places. */
export function recommendCircuit(plan: PlanCircuit[], student: Student, skip = 0) {
  const candidates = plan.filter((c) => c.status !== "Suspendu" && c.stops.length < c.capacity).sort((a, b) => nearestStop(a, student) - nearestStop(b, student));
  const c = candidates[skip % Math.max(1, candidates.length)];
  if (!c) return null;
  const vehicle = baseVehicles.find((v) => v.id === c.vehicleId)!;
  const updated = makeCircuit(c.id, c.color, vehicle, [...c.stops.map((s) => s.student), student], c);
  const stop = updated.stops.find((s) => s.student.id === student.id)!;
  return { circuit: c, updated, order: stop.order, time: stop.time, after: updated.stops.length, capacity: c.capacity, km: (nearestStop(c, student) * 0.045).toFixed(1), total: candidates.length };
}

export { centroid };

export type ComplianceLevel = "Conforme" | "À renouveler" | "Urgent";
export const complianceLevel = (iso: string, threshold = 30): ComplianceLevel => { const d = daysUntil(iso); return d < 0 || d <= 15 ? "Urgent" : d <= threshold ? "À renouveler" : "Conforme"; };
export type ComplianceAlert = { id: string; level: ComplianceLevel; target: string; kind: "Chauffeur" | "Véhicule"; message: string; days: number };

/** Agent Alertes & Conformité. */
export function complianceAlerts(docs: DocumentRecord[], drivers: Driver[], threshold = 45): ComplianceAlert[] {
  const out: ComplianceAlert[] = [];
  const phrase = (d: number) => d < 0 ? `a expiré depuis ${-d} jours` : `expire dans ${d} jours`;
  drivers.forEach((d) => { const days = daysUntil(d.licenseExpires); if (days <= threshold) out.push({ id: `P-${d.id}`, kind: "Chauffeur", target: d.name, days, level: complianceLevel(d.licenseExpires), message: `Permis ${d.name} ${phrase(days)}.` }); });
  docs.forEach((doc) => { const days = daysUntil(doc.expires); if (days <= threshold) out.push({ id: doc.id, kind: "Véhicule", target: doc.owner, days, level: complianceLevel(doc.expires), message: doc.type === "Visite technique" && days >= 0 ? `Visite technique ${doc.owner} arrive à échéance (${fmtDate(doc.expires)}).` : `${doc.type} ${doc.owner} ${phrase(days)}.` }); });
  baseVehicles.forEach((v) => { const days = daysUntil(v.nextDue); if (days <= 15) out.push({ id: `V-${v.id}`, kind: "Véhicule", target: v.id, days, level: "À renouveler", message: `Vidange ${v.id} prévue prochainement (${fmtDate(v.nextDue)}).` }); });
  return out.sort((a, b) => a.days - b.days);
}
