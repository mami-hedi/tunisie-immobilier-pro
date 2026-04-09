import propertyApartment from "@/assets/property-apartment.jpg";
import propertyHouse from "@/assets/ter1.jpg";
import propertyCommercial from "@/assets/property-commercial.jpg";
import heroVilla from "@/assets/hero-villa.jpg";
import ter2 from "@/assets/ter2.jpg";
import ter3 from "@/assets/ter3.jpg";
import st1 from "@/assets/st1.jpg";

export interface Property {
  id: string;
  title: string;
  type: "Appartement" | "Maison" | "Terrain" | "Local commercial" | "Villa";
  transactionType: "Vente" | "Location";
  price: number;
  city: string;
  governorate: string;
  address: string;
  surface: number;
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  features: string[];
  images: string[];
  status: "Disponible" | "Vendu" | "Loué";
  createdAt: string;
  featured?: boolean;
}

export const governorates = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

export const propertyTypes = [
  "Appartement",
  "Maison",
  "Villa",
  "Terrain",
  "Local commercial",
] as const;

export const transactionTypes = ["Vente", "Location"] as const;

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Appartement luxueux avec vue mer",
    type: "Appartement",
    transactionType: "Vente",
    price: 450000,
    city: "La Marsa",
    governorate: "Tunis",
    address: "Résidence Les Jardins, Avenue Habib Bourguiba",
    surface: 180,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 2,
    description: "Magnifique appartement de standing situé dans une résidence sécurisée à La Marsa. Vue panoramique sur la mer, finitions haut de gamme, cuisine équipée, climatisation centrale. Proche de toutes commodités, écoles et transports.",
    features: ["Vue mer", "Parking", "Ascenseur", "Climatisation", "Gardien", "Piscine commune"],
    images: [propertyApartment],
    status: "Vendu",
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    title: "Villa moderne avec piscine",
    type: "Villa",
    transactionType: "Vente",
    price: 780000,
    city: "Hammamet",
    governorate: "Nabeul",
    address: "Zone touristique Yasmine Hammamet",
    surface: 450,
    rooms: 8,
    bedrooms: 5,
    bathrooms: 4,
    description: "Superbe villa contemporaine avec piscine privée et jardin paysager. Architecture moderne, matériaux nobles, domotique intégrée. Située dans un quartier résidentiel calme à quelques minutes de la plage.",
    features: ["Piscine privée", "Jardin", "Garage double", "Système alarme", "Cuisine équipée", "Suite parentale"],
    images: [heroVilla],
    status: "Vendu",
    createdAt: "2024-01-10",
    featured: true,
  },
  {
  id: "3",
  title: "Studio cosy à louer",
  type: "Studio",
  transactionType: "Location",
  price: 80,
  priceUnit: "dinars/nuit",
  city: "Hammamet",
  governorate: "Nabeul",
  address: "Centre-ville / proche plage",
  surface: 30,
  rooms: 1,
  bedrooms: 1,
  bathrooms: 1,
  description: "Studio confortable et bien équipé, idéal pour vos séjours à Hammamet. Proche de la plage et des commodités, parfait pour un séjour court ou long.| 80 TND/Nuit",
  features: ["Climatisation", "Wi-Fi", "Cuisine équipée", "Proche plage"],
  images: [st1],
  status: "Disponible",
  createdAt: "2026-01-29",
  featured: true,
},
  {
  id: "4",
  title: "Terrain constructible à Barraket Sahel, Hammamet",
  type: "Terrain",
  transactionType: "Vente",
  price: 123000,
  city: "Hammamet",
  governorate: "Nabeul",
  address: "Barraket Sahel",
  surface: 333,
  rooms: 0,
  description: "Terrain plat constructible dans un quartier résidentiel calme à Barraket Sahel, Hammamet. Titre bleu, permis de bâtir disponible. Orientation idéale, proche des commodités et de la mer.",
  features: ["Titre bleu", "Viabilisé", "Vue dégagée", "Quartier calme"],
  images: [ter3],
  status: "Disponible",
  createdAt: "2026-01-29",
},
  {
  id: "5",
  title: "Terrain constructible à Barraket Sahel, Hammamet",
  type: "Terrain",
  transactionType: "Vente",
  price: 114000,
  city: "Hammamet",
  governorate: "Nabeul",
  address: "Barraket Sahel",
  surface: 285,
  rooms: 0,
  description: "Terrain plat constructible dans un quartier résidentiel calme à Barraket Sahel, Hammamet. Titre bleu, permis de bâtir disponible. Orientation idéale, proche des commodités et de la mer.",
  features: ["Titre bleu", "Viabilisé", "Vue dégagée", "Quartier calme"],
  images: [ter2],
  status: "Disponible",
  createdAt: "2026-01-29",
},
  {
  id: "6",
  title: "Terrain constructible à Barraket Sahel, Hammamet",
  type: "Terrain",
  transactionType: "Vente",
  price: 195000,
  city: "Hammamet",
  governorate: "Nabeul",
  address: "Barraket Sahel",
  surface: 500,
  rooms: 0,
  description: "Terrain plat constructible dans un quartier résidentiel calme à Barraket Sahel, Hammamet. Titre bleu, permis de bâtir disponible. Orientation idéale, proche des commodités et de la mer.",
  features: ["Titre bleu", "Viabilisé", "Vue dégagée", "Quartier calme"],
  images: [propertyHouse],
  status: "Disponible",
  createdAt: "2026-01-29",
},
];

export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find((property) => property.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return mockProperties.filter((property) => property.featured);
};

export const getRecentProperties = (limit: number = 6): Property[] => {
  return [...mockProperties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const formatPrice = (price: number, transactionType: "Vente" | "Location"): string => {
  const formatted = new Intl.NumberFormat("fr-TN").format(price);
  return transactionType === "Location" ? `${formatted} TND` : `${formatted} TND`;
};
