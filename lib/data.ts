import { SerializedPlan } from "./validations";


export const staticPlans: SerializedPlan[] = [
  {
    _id: "plan_diet_123",
    name: "Diet",
    price: 30000, 
    description: "Paket sempurna untuk Anda yang ingin menjaga kalori dan mencapai berat badan ideal dengan menu sehat setiap hari.",
    image: "/images/plan-diet.jpg", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "plan_protein_456",
    name: "Protein",
    price: 40000, 
    description: "Didesain untuk mendukung program fitness Anda, dengan fokus pada asupan protein tinggi untuk pembentukan otot.",
    image: "/images/plan-protein.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "plan_royal_789",
    name: "Royal",
    price: 60000, 
    description: "Nikmati pengalaman kuliner premium dengan bahan-bahan pilihan terbaik dan menu eksklusif setiap harinya.",
    image: "/images/plan-royal.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];