import propertyApartment from "@/assets/property-apartment.jpg";
import propertyHouse from "@/assets/property-house.jpg";
import propertyCommercial from "@/assets/property-commercial.jpg";
import heroVilla from "@/assets/hero-villa.jpg";

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
    status: "Disponible",
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    title: "Villa moderne avec piscine",
    type: "Villa",
    transactionType: "Vente",
    price: 1200000,
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
    status: "Disponible",
    createdAt: "2024-01-10",
    featured: true,
  },
  {
    id: "3",
    title: "Maison traditionnelle rénovée",
    type: "Maison",
    transactionType: "Vente",
    price: 380000,
    city: "Sidi Bou Saïd",
    governorate: "Tunis",
    address: "Rue des Jasmins",
    surface: 220,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 2,
    description: "Charmante maison tunisienne alliant charme traditionnel et confort moderne. Patio central, terrasse avec vue sur le golfe de Tunis. Rénovation complète avec respect du cachet authentique.",
    features: ["Patio", "Terrasse panoramique", "Cheminée", "Carrelage artisanal", "Boiseries traditionnelles"],
    images: [propertyHouse],
    status: "Disponible",
    createdAt: "2024-01-08",
    featured: true,
  },
  {
    id: "4",
    title: "Local commercial centre-ville",
    type: "Local commercial",
    transactionType: "Location",
    price: 3500,
    city: "Sousse",
    governorate: "Sousse",
    address: "Avenue Habib Bourguiba, Centre-ville",
    surface: 120,
    rooms: 2,
    description: "Emplacement premium en plein cœur commercial de Sousse. Grande vitrine, excellent flux piéton. Idéal pour boutique, showroom ou agence. Disponible immédiatement.",
    features: ["Vitrine", "Climatisation", "Stockage", "WC", "Emplacement n°1"],
    images: [propertyCommercial],
    status: "Disponible",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    title: "Appartement S+2 neuf",
    type: "Appartement",
    transactionType: "Location",
    price: 1200,
    city: "Les Berges du Lac",
    governorate: "Tunis",
    address: "Résidence Le Lac, Rue du Lac Malaren",
    surface: 95,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    description: "Appartement neuf jamais habité dans le quartier prisé des Berges du Lac. Standing, sécurité 24h/24, parking en sous-sol. Proche ambassades et centres d'affaires.",
    features: ["Neuf", "Parking sous-sol", "Interphone", "Balcon", "Placard intégrés"],
    images: [propertyApartment],
    status: "Disponible",
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    title: "Terrain constructible zone résidentielle",
    type: "Terrain",
    transactionType: "Vente",
    price: 280000,
    city: "Gammarth",
    governorate: "Tunis",
    address: "Gammarth Supérieur",
    surface: 600,
    rooms: 0,
    description: "Terrain plat constructible dans quartier résidentiel haut standing. Titre bleu, permis de bâtir disponible. Orientation idéale, proche mer et golf.",
    features: ["Titre bleu", "Viabilisé", "Vue dégagée", "Quartier calme"],
    images: [propertyHouse],
    status: "Disponible",
    createdAt: "2024-01-18",
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
  return transactionType === "Location" ? `${formatted} TND/mois` : `${formatted} TND`;
};
