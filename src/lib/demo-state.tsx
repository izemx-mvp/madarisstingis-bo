import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { incidentSeed, maintenanceSeed, notificationSeed, type IncidentRecord, type MaintenanceRecord, type NotificationItem } from "./mock-data";

type DemoState = {
  incidents: IncidentRecord[]; maintenances: MaintenanceRecord[]; notifications: NotificationItem[];
  addIncident: (item: Omit<IncidentRecord, "id">) => void;
  updateIncident: (id: string, patch: Partial<IncidentRecord>) => void;
  deleteIncident: (id: string) => void;
  addMaintenance: (item: Omit<MaintenanceRecord, "id">) => void;
  updateMaintenance: (id: string, patch: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: string) => void;
  markNotification: (id: number) => void; markAllNotifications: () => void; deleteNotification: (id: number) => void;
};

const DemoContext = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState(incidentSeed);
  const [maintenances, setMaintenances] = useState(maintenanceSeed);
  const [notifications, setNotifications] = useState(notificationSeed);
  const value = useMemo<DemoState>(() => ({
    incidents, maintenances, notifications,
    addIncident: (item) => {
      setIncidents((items) => [{ ...item, id: `INC-${String(255 + items.length).padStart(3, "0")}` }, ...items]);
      setNotifications((items) => [{ id: Date.now(), title: `Nouvel incident ${item.vehicle}`, detail: item.description, time: "À l’instant", read: false, tone: "warning" }, ...items]);
    },
    updateIncident: (id, patch) => setIncidents((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
    deleteIncident: (id) => setIncidents((items) => items.filter((item) => item.id !== id)),
    addMaintenance: (item) => {
      setMaintenances((items) => [{ ...item, id: `M-${String(121 + items.length).padStart(3, "0")}` }, ...items]);
      setNotifications((items) => [{ id: Date.now(), title: `Maintenance ${item.vehicle} enregistrée`, detail: item.type, time: "À l’instant", read: false, tone: "info" }, ...items]);
    },
    updateMaintenance: (id, patch) => setMaintenances((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item)),
    deleteMaintenance: (id) => setMaintenances((items) => items.filter((item) => item.id !== id)),
    markNotification: (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item)),
    markAllNotifications: () => setNotifications((items) => items.map((item) => ({ ...item, read: true }))),
    deleteNotification: (id) => setNotifications((items) => items.filter((item) => item.id !== id)),
  }), [incidents, maintenances, notifications]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}