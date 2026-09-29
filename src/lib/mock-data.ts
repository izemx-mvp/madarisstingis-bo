export type Student = {
  id: number;
  matricule: string;
  name: string;
  level: string;
  classroom: string;
  address: string;
  district: string;
  circuit: string;
  pickup: string;
  status: "Affecté" | "À affecter";
};

const firstNames = ["Aya", "Adam", "Yasmine", "Omar", "Lina", "Youssef", "Salma", "Mehdi", "Inès", "Amine", "Meryem", "Ilyas", "Sara", "Anas", "Nour", "Zakaria"];
const lastNames = ["Benjelloun", "El Amrani", "Alaoui", "Bennani", "Idrissi", "Berrada", "Lahlou", "Tazi", "Chraïbi", "Fassi", "Amrani", "Skalli"];
export const districts = ["Ziaten", "Route de Rabat", "Mesnana", "Iberia", "Centre-ville", "Malabata", "Boubana", "Achakar", "Branes", "Moujahidine", "Val Fleuri"];
const levels = ["Maternelle", "Primaire", "Collège", "Lycée"];
const streets = ["Rue Al Amal", "Avenue Moulay Rachid", "Rue Ibn Battouta", "Boulevard Pasteur", "Route de Tétouan", "Rue Al Andalous"];

export const students: Student[] = Array.from({ length: 108 }, (_, i) => {
  const district = districts[i % districts.length] ?? "Centre-ville";
  const level = levels[i % levels.length] ?? "Primaire";
  return {
    id: i + 1,
    matricule: `MT-${String(2601 + i).padStart(4, "0")}`,
    name: `${firstNames[i % firstNames.length] ?? "Aya"} ${lastNames[(i * 3) % lastNames.length] ?? "Bennani"}`,
    level,
    classroom: `${["A", "B", "C"][i % 3]}${(i % 6) + 1}`,
    address: `${12 + ((i * 7) % 88)}, ${streets[i % streets.length] ?? "Rue Al Amal"}`,
    district,
    circuit: i % 22 === 0 ? "—" : `C-${String((i % 10) + 1).padStart(2, "0")}`,
    pickup: `Arrêt ${district} ${String.fromCharCode(65 + (i % 4))}`,
    status: i % 22 === 0 ? "À affecter" : "Affecté",
  };
});

export const vehicles = Array.from({ length: 14 }, (_, i) => ({
  id: `B-${String(i + 1).padStart(2, "0")}`,
  plate: `${12000 + i * 137}-A-${40 + (i % 9)}`,
  brand: ["Toyota", "Mercedes", "Isuzu", "Ford"][i % 4],
  model: ["Coaster", "Sprinter", "Turquoise", "Transit"][i % 4],
  capacity: [30, 45, 35, 28][i % 4],
  year: 2019 + (i % 6),
  status: i === 2 || i === 8 ? "Maintenance" : i === 6 ? "Indisponible" : i < 12 ? "Affecté" : "Disponible",
  circuit: i === 10 ? "C-03" : i === 11 ? "C-09" : i < 10 && i !== 2 && i !== 8 ? `C-${String(i + 1).padStart(2, "0")}` : "Non affecté",
  maintenance: `${4 + i} oct. 2026`,
}));

const driverNames = ["Ahmed Benali", "Karim El Idrissi", "Mohamed Tazi", "Yassine Lahlou", "Rachid Bennani", "Samir Berrada", "Nabil Alaoui", "Hamza Chraïbi", "Othmane Fassi", "Adil Skalli", "Soufiane Amrani", "Khalid El Fassi", "Reda Benjelloun", "Mourad Idrissi", "Abdelilah Tazi"];
export const drivers = driverNames.map((name, i) => ({
  id: i + 1,
  name,
  phone: `+212 6 ${String(12 + i).padStart(2, "0")} ${34 + i} ${56 + i} ${70 + i}`,
  status: i === 12 ? "Absent" : i === 13 ? "Congé" : i < 10 ? "Affecté" : "Disponible",
  vehicle: i < 10 ? `B-${String(i + 1).padStart(2, "0")}` : "—",
  circuit: i < 10 ? `C-${String(i + 1).padStart(2, "0")}` : "—",
  hours: "06:45 – 17:30",
}));

export const circuits = districts.slice(0, 10).map((district, i) => ({
  id: `C-${String(i + 1).padStart(2, "0")}`,
  name: `${district} / ${districts[(i + 1) % districts.length]}`,
  zone: district,
  students: [42, 38, 29, 31, 44, 27, 36, 24, 40, 35][i],
  capacity: [45, 45, 35, 35, 45, 30, 45, 30, 45, 35][i],
  vehicle: i === 2 ? "B-11" : i === 8 ? "B-12" : `B-${String(i + 1).padStart(2, "0")}`,
  driver: driverNames[i] ?? "Ahmed Benali",
  time: `0${6 + (i % 2)}:${i % 2 ? "15" : "30"}`,
  status: i === 8 ? "Généré par IA" : "Planifié",
}));

export const schedule = circuits.slice(0, 6).map((c, i) => ({
  ...c,
  start: ["06:45", "07:00", "07:10", "12:10", "15:45", "16:15"][i],
  end: ["08:00", "08:10", "08:20", "13:05", "16:55", "17:25"][i],
  conflict: i === 4,
}));

export type MaintenanceRecord = {
  id: string; vehicle: string; type: string; plannedDate: string; interventionDate: string;
  provider: string; cost: number; status: "Planifiée" | "En cours" | "Terminée" | "Reportée";
  priority: "Faible" | "Moyenne" | "Haute" | "Urgente"; description: string; notes: string;
};

const maintenanceTypes = ["Vidange", "Freinage", "Pneumatiques", "Révision", "Contrôle technique", "Batterie", "Climatisation", "Autre"];
export const maintenanceSeed: MaintenanceRecord[] = Array.from({ length: 20 }, (_, i) => ({
  id: `M-${String(101 + i).padStart(3, "0")}`,
  vehicle: `B-${String((i % 14) + 1).padStart(2, "0")}`,
  type: maintenanceTypes[i % maintenanceTypes.length] ?? "Révision",
  plannedDate: `${String(2 + (i % 26)).padStart(2, "0")}/10/2026`,
  interventionDate: i < 7 ? `${String(1 + (i % 20)).padStart(2, "0")}/09/2026` : "—",
  provider: ["Atlas Auto", "Tanger Pneus", "Garage Al Boughaz", "Auto Service Nord"][i % 4] ?? "Atlas Auto",
  cost: 650 + (i % 7) * 430,
  status: (["Planifiée", "En cours", "Terminée", "Reportée"] as const)[i % 4] ?? "Planifiée",
  priority: (["Moyenne", "Haute", "Faible", "Urgente"] as const)[i % 4] ?? "Moyenne",
  description: `Intervention préventive sur le bus B-${String((i % 14) + 1).padStart(2, "0")} selon le planning de flotte.`,
  notes: "Contrôle complet et compte rendu du prestataire requis.",
}));

export type IncidentRecord = {
  id: string; date: string; vehicle: string; driver: string; circuit: string; type: string;
  severity: "Faible" | "Moyenne" | "Élevée"; description: string;
  status: "Nouveau" | "En traitement" | "Résolu" | "Clos"; comment: string;
};

const incidentTypes = ["Panne mécanique", "Crevaison", "Accident mineur", "Retard important", "Véhicule indisponible", "Problème de porte", "Autre"];
export const incidentSeed: IncidentRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: `INC-${String(240 + i).padStart(3, "0")}`,
  date: `${String(8 + (i % 20)).padStart(2, "0")}/09/2026 · 0${7 + (i % 2)}:${String(12 + i * 3).slice(-2)}`,
  vehicle: `B-${String((i % 14) + 1).padStart(2, "0")}`,
  driver: driverNames[i % driverNames.length] ?? "Ahmed Benali",
  circuit: `C-${String((i % 10) + 1).padStart(2, "0")}`,
  type: incidentTypes[i % incidentTypes.length] ?? "Autre",
  severity: (["Faible", "Moyenne", "Élevée"] as const)[i % 3] ?? "Faible",
  description: ["Voyant moteur signalé au départ", "Retard lié à la circulation", "Porte arrière à contrôler", "Pneumatique remplacé avant tournée"][i % 4] ?? "Signalement transport",
  status: i < 3 ? "En traitement" : i < 9 ? "Résolu" : "Clos",
  comment: "Le responsable flotte a été informé et le suivi est enregistré.",
}));

export type NotificationItem = { id: number; title: string; detail: string; time: string; read: boolean; tone: "info" | "warning" | "success" };
export const notificationSeed: NotificationItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: ["Maintenance prévue demain", "Circuit C-03 généré avec succès", "Bus B-07 indisponible", "Nouvel incident B-11", "6 élèves sans circuit", "Simulation IA terminée"][i % 6] ?? "Mise à jour transport",
  detail: ["Une intervention nécessite votre validation.", "La proposition est prête à être consultée.", "Un véhicule de remplacement est recommandé."][i % 3] ?? "Information disponible.",
  time: i < 2 ? "Il y a 10 min" : i < 6 ? "Aujourd’hui" : "Cette semaine",
  read: i > 5,
  tone: i % 3 === 0 ? "warning" : i % 3 === 1 ? "success" : "info",
}));

export const activitySeed = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  user: ["Nadia El Amrani", "Youssef Berrada", "Salma Alaoui", "Karim Tazi"][i % 4] ?? "Administration",
  date: `${String(29 - (i % 8)).padStart(2, "0")}/09/2026`,
  time: `${String(8 + (i % 9)).padStart(2, "0")}:${String(10 + i * 2).slice(-2)}`,
  action: ["Élève ajouté", "Circuit généré par IA", "Bus marqué en maintenance", "Incident créé", "Maintenance clôturée", "Affectation chauffeur modifiée"][i % 6] ?? "Mise à jour",
  entity: ["Élève MT-2642", "Circuit C-06", "Bus B-03", "Incident INC-240", "Maintenance M-108", "Chauffeur Ahmed Benali"][i % 6] ?? "Transport",
}));