export type ClothingCategory = "top" | "bottom" | "shoes" | "accessory" | "outerwear";
export type Occasion = "casual" | "party" | "office" | "wedding";
export type Weather = "hot" | "cold" | "rainy" | "mild";

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorName: string;
  type: string; // e.g. "T-Shirt", "Jeans", "Sneakers"
  imageUrl: string; // data URL from upload
  occasions: Occasion[];
  weather: Weather[];
  createdAt: number;
}

export interface Outfit {
  id: string;
  name: string;
  topId: string | null;
  bottomId: string | null;
  shoesId: string | null;
  accessoryId?: string | null;
  outerwearId?: string | null;
  createdAt: number;
}

export interface PlannedOutfit {
  date: string; // YYYY-MM-DD
  outfitId: string;
}

export const CLOTHING_TYPES: Record<ClothingCategory, string[]> = {
  top: ["T-Shirt", "Shirt", "Blouse", "Sweater", "Tank Top", "Hoodie", "Polo", "Crop Top", "Kurta"],
  bottom: ["Jeans", "Trousers", "Shorts", "Skirt", "Leggings", "Chinos", "Palazzo", "Dhoti"],
  shoes: ["Sneakers", "Boots", "Heels", "Sandals", "Loafers", "Flats", "Slides"],
  accessory: ["Watch", "Necklace", "Bracelet", "Belt", "Hat", "Scarf", "Bag", "Sunglasses"],
  outerwear: ["Jacket", "Blazer", "Coat", "Cardigan", "Vest", "Shawl"],
};

export const COLOR_OPTIONS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Red", hex: "#dc2626" },
  { name: "Burgundy", hex: "#7f1d1d" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#16a34a" },
  { name: "Olive", hex: "#65712b" },
  { name: "Brown", hex: "#78350f" },
  { name: "Beige", hex: "#d4b896" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Teal", hex: "#0d9488" },
];

// Color harmony matching
const colorGroups: Record<string, string[]> = {
  neutral: ["Black", "White", "Grey", "Beige", "Brown"],
  warm: ["Red", "Burgundy", "Orange", "Yellow", "Pink", "Brown", "Beige"],
  cool: ["Blue", "Navy", "Green", "Teal", "Purple", "Olive"],
};

export function colorsMatch(a: string, b: string): boolean {
  // Neutrals go with everything
  if (colorGroups.neutral.includes(a) || colorGroups.neutral.includes(b)) return true;
  // Same color family
  if (a === b) return true;
  // Warm+warm or cool+cool
  const aWarm = colorGroups.warm.includes(a);
  const bWarm = colorGroups.warm.includes(b);
  const aCool = colorGroups.cool.includes(a);
  const bCool = colorGroups.cool.includes(b);
  return (aWarm && bWarm) || (aCool && bCool);
}

export function getSmartOutfits(
  items: ClothingItem[],
  occasion: Occasion | "all",
  weather: Weather | "all"
): { top: ClothingItem; bottom: ClothingItem; shoes: ClothingItem }[] {
  let tops = items.filter((i) => i.category === "top");
  let bottoms = items.filter((i) => i.category === "bottom");
  let shoes = items.filter((i) => i.category === "shoes");

  if (occasion !== "all") {
    tops = tops.filter((i) => i.occasions.includes(occasion));
    bottoms = bottoms.filter((i) => i.occasions.includes(occasion));
    shoes = shoes.filter((i) => i.occasions.includes(occasion));
  }
  if (weather !== "all") {
    tops = tops.filter((i) => i.weather.includes(weather));
    bottoms = bottoms.filter((i) => i.weather.includes(weather));
    shoes = shoes.filter((i) => i.weather.includes(weather));
  }

  const outfits: { top: ClothingItem; bottom: ClothingItem; shoes: ClothingItem }[] = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      if (!colorsMatch(top.colorName, bottom.colorName)) continue;
      for (const shoe of shoes) {
        if (!colorsMatch(bottom.colorName, shoe.colorName)) continue;
        outfits.push({ top, bottom, shoes: shoe });
        if (outfits.length >= 20) return outfits;
      }
    }
  }
  return outfits;
}
