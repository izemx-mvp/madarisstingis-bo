// Données de base simulées (aucune donnée réelle). L'organisation des circuits est calculée par transport-engine.ts.
export const TODAY = "2026-09-30";

export const districts = ["Ziaten", "Route de Rabat", "Mesnana", "Iberia", "Centre-ville", "Malabata", "Boubana", "Achakar", "Branes", "Moujahidine", "Val Fleuri"];
export const districtCenters: Record<string, [number, number]> = {
  Ziaten: [120, 385], "Route de Rabat": [300, 410], Mesnana: [185, 300], Iberia: [365, 185], "Centre-ville": [440, 160],
  Malabata: [610, 150], Boubana: [130, 205], Achakar: [60, 135], Branes: [250, 225], Moujahidine: [480, 305], "Val Fleuri": [405, 340],
};
const rand = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
export function pointInDistrict(district: string, seed: number): [number, number] {
  const [cx, cy] = districtCenters[district] ?? [350, 300];
  return [Math.round(cx + (rand(seed) - 0.5) * 70), Math.round(cy + (rand(seed + 99) - 0.5) * 55)];
}
export const toGeo = (x: number, y: number) => `${(35.805 - y * 0.00012).toFixed(4)}°N, ${(5.885 - x * 0.00014).toFixed(4)}°O`;

export type Student = { id: number; matricule: string; name: string; level: string; classroom: string; address: string; district: string; x: number; y: number; recent?: boolean };

const firstNames = ["Aya", "Adam", "Yasmine", "Omar", "Lina", "Youssef", "Salma", "Mehdi", "Inès", "Amine", "Meryem", "Ilyas", "Sara", "Anas", "Nour", "Zakaria", "Hiba", "Rayan", "Kenza", "Hamza", "Malak", "Ayoub", "Rim", "Othmane"];
const lastNames = ["Benjelloun", "El Amrani", "Alaoui", "Bennani", "Idrissi", "Berrada", "Lahlou", "Tazi", "Chraïbi", "Fassi", "Amrani", "Skalli", "Ouazzani", "Kettani", "Sefrioui", "Bouzidi", "Tahiri"];
const levels = ["Maternelle", "Primaire", "Collège", "Lycée"];
const classesByLevel: Record<string, string[]> = { Maternelle: ["PS", "MS", "GS"], Primaire: ["CP", "CE1", "CE2", "CM1", "CM2", "6e P"], Collège: ["1re AC", "2e AC", "3e AC"], Lycée: ["TC", "1re Bac", "2e Bac"] };
const streets = ["Rue Al Amal", "Avenue Moulay Rachid", "Rue Ibn Battouta", "Boulevard Pasteur", "Route de Tétouan", "Rue Al Andalous", "Avenue Mohammed VI", "Rue Ibn Khaldoun", "Rue de Fès"];

export const students: Student[] = Array.from({ length: 426 }, (_, i) => {
  const district = districts[i % districts.length] ?? "Centre-ville";
  const level = levels[(i * 7) % levels.length] ?? "Primaire";
  const cls = classesByLevel[level] ?? ["CP"];
  const [x, y] = pointInDistrict(district, i + 1);
  return {
    id: i + 1, matricule: `MT-${String(2601 + i)}`,
    name: `${firstNames[(i * 5) % firstNames.length]} ${lastNames[(i * 3 + Math.floor(i / 17)) % lastNames.length]}`,
    level, classroom: `${cls[i % cls.length]} ${["A", "B", "C"][i % 3]}`,
    address: `${3 + ((i * 7) % 96)}, ${streets[(i * 5) % streets.length]}, ${district}`, district, x, y, recent: i >= 421,
  };
});

export type VehicleBaseStatus = "Disponible" | "Maintenance" | "Indisponible" | "Incident" | "Panne";
export type Vehicle = { id: string; plate: string; brand: string; model: string; capacity: number; year: number; baseStatus: VehicleBaseStatus; nextDue: string };
const fleet: [string, string, number, VehicleBaseStatus][] = [
  ["Mercedes", "Tourismo", 72, "Disponible"], ["Irisbus", "Crossway", 76, "Disponible"], ["Mercedes", "Intouro", 74, "Disponible"], ["Iveco", "Evadys", 78, "Disponible"],
  ["Mercedes", "Intouro", 72, "Disponible"], ["Isuzu", "Visigo", 74, "Disponible"], ["Irisbus", "Crossway", 74, "Disponible"], ["Toyota", "Coaster", 30, "Maintenance"],
  ["Isuzu", "Novo", 35, "Maintenance"], ["Mercedes", "Sprinter", 22, "Indisponible"], ["Ford", "Transit", 18, "Incident"], ["Isuzu", "Turquoise", 45, "Maintenance"],
  ["Toyota", "Coaster", 30, "Indisponible"], ["Mercedes", "Sprinter", 22, "Indisponible"],
];
export const vehicles: Vehicle[] = fleet.map(([brand, model, capacity, baseStatus], i) => ({
  id: `B-${String(i + 1).padStart(2, "0")}`, plate: `${24810 + i * 137}-A-40`, brand, model, capacity, year: 2019 + (i % 6), baseStatus,
  nextDue: i === 1 ? "2026-10-06" : `2026-11-${String(10 + i).padStart(2, "0")}`,
}));

export type DocumentRecord = { id: string; owner: string; type: string; number: string; issued: string; expires: string; file: string };
const vehicleDocTypes = ["Carte grise", "Assurance", "Visite technique", "Autorisation de transport scolaire"];
export const vehicleDocumentSeed: DocumentRecord[] = vehicles.flatMap((v, i) => vehicleDocTypes.map((type, t) => {
  const special: Record<string, string> = { "B-04|Assurance": "2026-10-15", "B-06|Visite technique": "2026-10-20", "B-10|Assurance": "2026-09-20", "B-01|Autorisation de transport scolaire": "2026-11-12" };
  const expires = special[`${v.id}|${type}`] ?? (type === "Carte grise" ? "2031-01-01" : `2027-0${1 + ((i + t) % 8)}-1${t}`);
  return { id: `${v.id}-D${t + 1}`, owner: v.id, type, number: `${["CG", "ASS", "VT", "AUT"][t]}-${45200 + i * 31 + t * 7}`, issued: `2026-0${1 + ((i + t) % 8)}-1${t}`, expires, file: `${type.toLowerCase().replaceAll(" ", "-")}-${v.id}.pdf` };
}));

export type DriverBaseStatus = "Disponible" | "Absent" | "Malade" | "Congé" | "Indisponible";
export type Driver = { id: number; firstName: string; lastName: string; name: string; phone: string; address: string; district: string; x: number; y: number; baseStatus: DriverBaseStatus; license: string; category: string; licenseIssued: string; licenseExpires: string };
const roster: [string, string, string, DriverBaseStatus][] = [
  ["Ahmed", "Benali", "Ziaten", "Disponible"], ["Karim", "El Idrissi", "Malabata", "Disponible"], ["Mohamed", "Tazi", "Mesnana", "Disponible"], ["Yassine", "Lahlou", "Iberia", "Disponible"],
  ["Rachid", "Bennani", "Moujahidine", "Disponible"], ["Samir", "Berrada", "Achakar", "Disponible"], ["Nabil", "Alaoui", "Route de Rabat", "Disponible"], ["Hamza", "Chraïbi", "Val Fleuri", "Disponible"],
  ["Othmane", "Fassi", "Boubana", "Absent"], ["Adil", "Skalli", "Centre-ville", "Malade"], ["Soufiane", "Amrani", "Branes", "Congé"], ["Khalid", "El Fassi", "Ziaten", "Absent"],
  ["Reda", "Benjelloun", "Malabata", "Malade"], ["Mourad", "Idrissi", "Iberia", "Congé"], ["Abdelilah", "Tazi", "Mesnana", "Indisponible"],
];
export const driverRoster: Driver[] = roster.map(([firstName, lastName, district, baseStatus], i) => {
  const [x, y] = pointInDistrict(district, 700 + i);
  const expires = i === 0 ? "2026-10-30" : i === 4 ? "2026-11-14" : i === 9 ? "2026-09-25" : `202${8 + (i % 3)}-0${1 + (i % 9)}-15`;
  return { id: i + 1, firstName, lastName, name: `${firstName} ${lastName}`, phone: `+212 6 ${61 + i} ${24 + i} ${38 + i} ${50 + i}`, address: `${10 + i * 4}, ${streets[i % streets.length]}, ${district}`, district, x, y, baseStatus, license: `P-${908100 + i * 173}`, category: i % 4 === 3 ? "D1" : "D", licenseIssued: `20${10 + (i % 10)}-03-1${i % 9}`, licenseExpires: expires };
});

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
  driver: driverRoster[i % driverRoster.length]?.name ?? "Ahmed Benali",
  circuit: `C-${String((i % 7) + 1).padStart(2, "0")}`,
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