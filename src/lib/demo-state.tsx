import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { driverRoster, incidentSeed, maintenanceSeed, notificationSeed, pointInDistrict, students as studentSeed, vehicleDocumentSeed, vehicles as vehicleSeed, type DocumentRecord, type IncidentRecord, type MaintenanceRecord, type NotificationItem, type Student } from "./mock-data";
import { complianceAlerts, computePlan, initialPlan, type PlanCircuit } from "./transport-engine";

export type VehicleView = (typeof vehicleSeed)[number] & { status: string; circuit: string; driver: string };
export type DriverView = (typeof driverRoster)[number] & { status: string; vehicle: string; circuit: string };

type DemoState = {
  incidents: IncidentRecord[]; maintenances: MaintenanceRecord[]; notifications: NotificationItem[];
  students: Student[]; plan: PlanCircuit[]; aiGenerated: boolean; vehicles: VehicleView[]; drivers: DriverView[];
  vehicleDocs: DocumentRecord[]; driverDocs: DocumentRecord[]; alerts: ReturnType<typeof complianceAlerts>;
  vehicleStatus: Record<string, string>; driverStatus: Record<number, string>;
  runGeneration: () => void; setPlan: (plan: PlanCircuit[]) => void;
  addStudent: (s: Omit<Student, "id" | "matricule" | "x" | "y">) => Student;
  acceptStudent: (updated: PlanCircuit) => void;
  breakdown: (vehicleId: string) => void; applyCrisis: (plan: PlanCircuit[], vehicleId: string) => void;
  setVehicleStatus: (id: string, status: string) => void; setDriverStatus: (id: number, status: string) => void;
  addDocument: (kind: "vehicle" | "driver", doc: Omit<DocumentRecord, "id">) => void;
  addIncident: (item: Omit<IncidentRecord, "id">) => void;
  updateIncident: (id: string, patch: Partial<IncidentRecord>) => void;
  deleteIncident: (id: string) => void;
  addMaintenance: (item: Omit<MaintenanceRecord, "id">) => void;
  updateMaintenance: (id: string, patch: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: string) => void;
  notify: (title: string, detail: string, tone?: NotificationItem["tone"]) => void;
  markNotification: (id: number) => void; markAllNotifications: () => void; deleteNotification: (id: number) => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState(incidentSeed);
  const [maintenances, setMaintenances] = useState(maintenanceSeed);
  const [notifications, setNotifications] = useState(notificationSeed);
  const [students, setStudents] = useState(studentSeed);
  const [plan, setPlan] = useState(initialPlan);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [vehicleStatus, setVStatus] = useState<Record<string, string>>({});
  const [driverStatus, setDStatus] = useState<Record<number, string>>({});
  const [vehicleDocs, setVehicleDocs] = useState(vehicleDocumentSeed);
  const [driverDocs, setDriverDocs] = useState<DocumentRecord[]>([]);

  const value = useMemo<DemoState>(() => {
    const notify = (title: string, detail: string, tone: NotificationItem["tone"] = "info") => setNotifications((items) => [{ id: Date.now() + Math.random(), title, detail, time: "À l’instant", read: false, tone }, ...items]);
    const vehicles: VehicleView[] = vehicleSeed.map((v) => {
      const c = plan.find((x) => x.vehicleId === v.id && x.status !== "Suspendu");
      const base = vehicleStatus[v.id] ?? v.baseStatus;
      return { ...v, status: base === "Disponible" && c ? "Affecté" : base, circuit: c?.id ?? "—", driver: c?.driver ?? "—" };
    });
    const drivers: DriverView[] = driverRoster.map((d) => {
      const c = plan.find((x) => x.driverId === d.id && x.status !== "Suspendu");
      const base = driverStatus[d.id] ?? d.baseStatus;
      return { ...d, status: base === "Disponible" && c ? "Affecté" : base, vehicle: c?.vehicleId ?? "—", circuit: c?.id ?? "—" };
    });
    const addIncident: DemoState["addIncident"] = (item) => {
      setIncidents((items) => [{ ...item, id: `INC-${String(255 + items.length).padStart(3, "0")}` }, ...items]);
      notify(`Nouvel incident ${item.vehicle}`, item.description, "warning");
    };
    return {
      incidents, maintenances, notifications, students, plan, aiGenerated, vehicles, drivers, vehicleDocs, driverDocs, vehicleStatus, driverStatus,
      alerts: complianceAlerts(vehicleDocs, driverRoster),
      notify,
      runGeneration: () => { setPlan(computePlan(students, vehicleStatus, driverStatus)); setAiGenerated(true); notify("Organisation générée par l’IA", "Circuits, horaires et chauffeurs proposés automatiquement.", "success"); },
      setPlan,
      addStudent: (s) => {
        const id = Math.max(...students.map((x) => x.id)) + 1;
        const [x, y] = pointInDistrict(s.district, id * 3);
        const student: Student = { ...s, id, matricule: `MT-${2600 + id}`, x, y, recent: true };
        setStudents((items) => [student, ...items]);
        return student;
      },
      acceptStudent: (updated) => { setPlan((p) => p.map((c) => c.id === updated.id ? updated : c)); notify(`Élève affecté au circuit ${updated.id}`, "Recommandation IA acceptée.", "success"); },
      breakdown: (vehicleId) => {
        setVStatus((m) => ({ ...m, [vehicleId]: "Panne" }));
        const c = plan.find((x) => x.vehicleId === vehicleId);
        addIncident({ date: "30/09/2026 · 07:18", vehicle: vehicleId, driver: c?.driver ?? "—", circuit: c?.id ?? "—", type: "Panne mécanique", severity: "Élevée", description: `Bus ${vehicleId} en panne${c ? ` · ${c.stops.length} élèves impactés` : ""}`, status: "Nouveau", comment: "Agent Gestion de Crise sollicité." });
      },
      applyCrisis: (next, vehicleId) => {
        setPlan(next);
        setIncidents((items) => items.map((i) => i.vehicle === vehicleId && i.status === "Nouveau" ? { ...i, status: "En traitement", comment: "Plan de crise IA appliqué : élèves redistribués." } : i));
        notify("Plan de crise appliqué", `Élèves du bus ${vehicleId} redistribués sur les autres circuits.`, "success");
      },
      setVehicleStatus: (id, status) => setVStatus((m) => ({ ...m, [id]: status })),
      setDriverStatus: (id, status) => setDStatus((m) => ({ ...m, [id]: status })),
      addDocument: (kind, doc) => { const d = { ...doc, id: `DOC-${Date.now()}` }; if (kind === "vehicle") setVehicleDocs((x) => [d, ...x]); else setDriverDocs((x) => [d, ...x]); notify(`Document ajouté · ${doc.owner}`, `${doc.type} ${doc.number}`, "success"); },
      addIncident,
      updateIncident: (id, patch) => setIncidents((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
      deleteIncident: (id) => setIncidents((items) => items.filter((item) => item.id !== id)),
      addMaintenance: (item) => {
        setMaintenances((items) => [{ ...item, id: `M-${String(121 + items.length).padStart(3, "0")}` }, ...items]);
        notify(`Maintenance ${item.vehicle} enregistrée`, item.type);
      },
      updateMaintenance: (id, patch) => setMaintenances((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
      deleteMaintenance: (id) => setMaintenances((items) => items.filter((item) => item.id !== id)),
      markNotification: (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
      markAllNotifications: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))),
      deleteNotification: (id) => setNotifications((items) => items.filter((item) => item.id !== id)),
    };
  }, [incidents, maintenances, notifications, students, plan, aiGenerated, vehicleStatus, driverStatus, vehicleDocs, driverDocs]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
