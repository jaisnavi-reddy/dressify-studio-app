// Predefined outfit dataset for "fake AI" generation — NO API needed

export interface Outfit {
  id: string;
  title: string;
  description: string;
  category: string;
  gender: "men" | "women";
  occasion: string;
  color: string;
  fabric: string;
  imageUrl: string;
  tags: string[];
}

const womenImages = [
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1502716119720-b23a1e3b3112?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
];

const menImages = [
  "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
];

const occasions = ["casual", "party", "wedding", "office"];
const colors = ["red", "blue", "green", "black", "white", "gold", "pink", "purple", "maroon", "navy"];
const fabrics = ["cotton", "silk", "denim", "chiffon", "linen", "velvet", "satin", "georgette"];

const adjectives = ["Elegant", "Stunning", "Classic", "Modern", "Luxurious", "Chic", "Sophisticated", "Radiant", "Graceful", "Bold"];
const womenItems = ["Saree", "Lehenga", "Anarkali", "Kurti", "Gown", "Salwar Suit", "Sharara", "Palazzo Set", "Dress", "Blouse & Skirt"];
const menItems = ["Kurta", "Sherwani", "Blazer Set", "Shirt & Trousers", "Nehru Jacket", "Dhoti Set", "Indo-Western", "Suit", "Casual Set", "Pathani"];

const descriptionTemplates = {
  casual: [
    "Perfect for a relaxed day out with effortless style and comfort.",
    "A breezy, laid-back ensemble ideal for everyday elegance.",
    "Comfortable yet fashionable — great for brunch or shopping trips.",
  ],
  party: [
    "Turn heads at every party with this dazzling ensemble.",
    "Sparkle and shine with this show-stopping party outfit.",
    "Dance the night away in this glamorous party-ready look.",
  ],
  wedding: [
    "A breathtaking creation perfect for the most special day.",
    "Regal and majestic — designed for unforgettable celebrations.",
    "Exquisite craftsmanship with intricate details for wedding ceremonies.",
  ],
  office: [
    "Professional yet stylish — command respect in the boardroom.",
    "Polished and refined for the modern professional.",
    "Smart workwear that transitions seamlessly from desk to dinner.",
  ],
};

function generateDescription(gender: string, item: string, occasion: string, fabric: string, color: string): string {
  const base = descriptionTemplates[occasion as keyof typeof descriptionTemplates]?.[
    Math.floor(Math.random() * 3)
  ] || "A stunning outfit for every occasion.";
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${color} ${fabric} ${item.toLowerCase()} — ${base}`;
}

// Generate a large dataset
export const outfitDataset: Outfit[] = [];

let idCounter = 1;
for (const gender of ["women", "men"] as const) {
  const items = gender === "women" ? womenItems : menItems;
  const images = gender === "women" ? womenImages : menImages;
  
  for (const occasion of occasions) {
    for (const fabric of fabrics) {
      for (let i = 0; i < 3; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const item = items[Math.floor(Math.random() * items.length)];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        
        outfitDataset.push({
          id: `outfit-${idCounter++}`,
          title: `${adj} ${item}`,
          description: generateDescription(gender, item, occasion, fabric, color),
          category: item,
          gender,
          occasion,
          color,
          fabric,
          imageUrl: images[Math.floor(Math.random() * images.length)],
          tags: [gender, occasion, fabric, color],
        });
      }
    }
  }
}

// Generate a random outfit based on filters
let lastIndex = -1;
export function generateRandomOutfit(filters: {
  gender?: string;
  occasion?: string;
  color?: string;
  fabric?: string;
}): Outfit {
  let pool = outfitDataset.filter((o) => {
    if (filters.gender && o.gender !== filters.gender) return false;
    if (filters.occasion && o.occasion !== filters.occasion) return false;
    if (filters.color && o.color !== filters.color) return false;
    if (filters.fabric && o.fabric !== filters.fabric) return false;
    return true;
  });

  if (pool.length === 0) pool = outfitDataset;

  // Ensure we don't get the same outfit twice in a row
  let idx = Math.floor(Math.random() * pool.length);
  if (pool.length > 1) {
    while (idx === lastIndex) {
      idx = Math.floor(Math.random() * pool.length);
    }
  }
  lastIndex = idx;

  // Randomize the description slightly each time
  const outfit = { ...pool[idx] };
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  outfit.description = generateDescription(
    outfit.gender,
    outfit.category,
    outfit.occasion,
    outfit.fabric,
    outfit.color
  );
  outfit.title = `${adj} ${outfit.category}`;
  outfit.id = `generated-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  
  return outfit;
}

// Fake AI description generator
export function generateAIDescription(outfit: Outfit): string {
  const intros = [
    "🤖 AI Analysis:",
    "✨ Style Intelligence:",
    "🎨 Fashion AI says:",
    "💫 Smart Styling:",
  ];
  const tips = [
    `This ${outfit.fabric} ${outfit.category.toLowerCase()} in ${outfit.color} is ideal for ${outfit.occasion} occasions.`,
    `Pair with ${outfit.color === "gold" ? "silver" : "gold"} accessories for a complete look.`,
    `The ${outfit.fabric} fabric ensures comfort and elegance throughout the day.`,
    `Perfect for ${outfit.occasion === "wedding" ? "ceremonies and receptions" : outfit.occasion === "party" ? "evening celebrations" : outfit.occasion === "office" ? "professional settings" : "everyday outings"}.`,
    `Pro tip: Add a statement ${outfit.gender === "women" ? "clutch and earrings" : "watch and pocket square"} to elevate the look.`,
  ];
  
  return `${intros[Math.floor(Math.random() * intros.length)]} ${tips[Math.floor(Math.random() * tips.length)]}`;
}

export { occasions, colors, fabrics };
