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

// Definisikan tipe data untuk setiap item menu
export interface MenuItem {
  id: string; // ID unik untuk URL, contoh: "grilled-chicken-salad"
  name: string;
  image: string;
  ingredients: string[];
  origin: string;
  allergens?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Array yang berisi semua data menu
export const menuData: MenuItem[] = [
  {
    id: "grilled-chicken-salad",
    name: "Grilled Chicken Salad",
    image: "/grilled-chicken-salad.jpg",
    ingredients: [
      "Grilled Chicken Breast",
      "Romaine Lettuce",
      "Cherry Tomatoes",
      "Boiled Egg",
      "Olive Oil",
      "Lemon Dressing",
    ],
    origin:
      "A timeless classic that combines fresh greens with high-quality protein. Perfect for a light yet satisfying lunch that's packed with nutrients to keep you energized.",
    allergens: "Contains egg. Dressing may contain dairy. Gluten-free.",
    nutrition: {
      calories: 480,
      protein: 35,
      carbs: 10,
      fat: 32,
    },
  },
  {
    id: "salmon-teriyaki-bowl",
    name: "Salmon Teriyaki Bowl",
    image: "/salmon-teriyaki-bowl.jpg",
    ingredients: [
      "Salmon Fillet",
      "Brown Rice",
      "Broccoli",
      "Avocado",
      "Cucumber",
      "Teriyaki Sauce",
      "Sesame Seeds",
    ],
    origin:
      "A delicious and balanced Japanese-inspired meal. The combination of Omega-3-rich salmon, wholesome brown rice, and fresh vegetables makes it a perfect choice for a nutritious dinner.",
    allergens: "Contains fish (salmon), soy, and sesame.",
    nutrition: {
      calories: 620,
      protein: 30,
      carbs: 65,
      fat: 28,
    },
  },
  {
    id: "vegan-buddha-bowl",
    name: "Vegan Buddha Bowl",
    image: "/buddhavegan.jpg",
    ingredients: [
      "Quinoa",
      "Chickpeas",
      "Avocado",
      "Kale",
      "Beetroot",
      "Tahini Sauce",
    ],
    origin:
      "Inspired by Asian-Middle Eastern fusion. This bowl supports digestive health, energy, and balanced plant-based nutrition.",
    allergens: "Contains sesame. Gluten-free. Vegan.",
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 12,
    },
  },
  // --- DATA BARU DITAMBAHKAN DI BAWAH INI ---
  {
    id: "hearty-goulash",
    name: "Hearty Goulash",
    image: "/goulash.jpg",
    ingredients: [
        "Beef Chuck",
        "Onions",
        "Paprika",
        "Carrots",
        "Bell Peppers",
        "Beef Broth"
    ],
    origin:
      "A rich Hungarian stew of beef, onions, and paprika, perfect for a hearty and comforting meal, especially on a cold day.",
    allergens: "Generally free of common allergens. May contain gluten if flour is used for thickening.",
    nutrition: {
      calories: 550,
      protein: 40,
      carbs: 25,
      fat: 30,
    },
  },
  {
    id: "fruit-yogurt-parfait",
    name: "Fruit Yogurt Parfait",
    image: "/fruityogurt.jpg",
    ingredients: [
        "Greek Yogurt",
        "Granola",
        "Strawberries",
        "Blueberries",
        "Blackberries",
        "Honey",
        "Fresh Mint"
    ],
    origin:
      "A refreshing and healthy layered dessert or breakfast. Combining creamy yogurt, crunchy granola, and fresh berries for a perfect balance of textures and flavors.",
    allergens: "Contains dairy (yogurt). Granola may contain nuts and gluten.",
    nutrition: {
      calories: 380,
      protein: 15,
      carbs: 50,
      fat: 12,
    },
  },
];