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
  status: i === 2 || i === 8 ? "Maintenance" : i === 6 ? "Indisponible" : i < 10 ? "Affecté" : "Disponible",
  circuit: i < 10 ? `C-${String(i + 1).padStart(2, "0")}` : "Non affecté",
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
  vehicle: `B-${String(i + 1).padStart(2, "0")}`,
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