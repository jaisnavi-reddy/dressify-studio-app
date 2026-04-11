// Category-specific garment region masks using clip-path polygons
// Each mask defines the exact region for body, sleeve, and border areas
// tailored to the garment type to avoid coloring skin/hair/background

export interface GarmentRegion {
  name: string;
  clipPath: string;
  blendMode: string;
  opacity: number;
}

export interface GarmentMaskConfig {
  parts: { id: string; label: string }[];
  regions: Record<string, GarmentRegion[]>;
}

// Saree: drapes across body, pallu over shoulder, border at bottom edge
const sareeConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Saree Body" },
    { id: "sleeve", label: "Blouse / Pallu" },
    { id: "border", label: "Saree Border" },
  ],
  regions: {
    body: [
      {
        name: "saree-drape",
        clipPath: "polygon(20% 35%, 45% 28%, 55% 28%, 80% 35%, 82% 88%, 18% 88%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      // Blouse area (upper torso)
      {
        name: "blouse",
        clipPath: "polygon(28% 14%, 72% 14%, 75% 32%, 55% 30%, 45% 30%, 25% 32%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      // Pallu drape over left shoulder
      {
        name: "pallu",
        clipPath: "polygon(5% 12%, 28% 14%, 25% 55%, 8% 50%)",
        blendMode: "multiply",
        opacity: 0.3,
      },
    ],
    border: [
      // Bottom border strip
      {
        name: "bottom-border",
        clipPath: "polygon(16% 84%, 84% 84%, 85% 92%, 15% 92%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
      // Side border accent
      {
        name: "side-border",
        clipPath: "polygon(18% 35%, 22% 35%, 24% 88%, 18% 88%)",
        blendMode: "overlay",
        opacity: 0.4,
      },
    ],
  },
};

// Blouse: fitted upper-body garment
const blouseConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Blouse Body" },
    { id: "sleeve", label: "Sleeves" },
    { id: "border", label: "Neckline / Border" },
  ],
  regions: {
    body: [
      {
        name: "torso",
        clipPath: "polygon(30% 18%, 70% 18%, 72% 65%, 28% 65%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-sleeve",
        clipPath: "polygon(5% 16%, 30% 18%, 28% 45%, 8% 40%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-sleeve",
        clipPath: "polygon(70% 18%, 95% 16%, 92% 40%, 72% 45%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "neckline",
        clipPath: "polygon(35% 14%, 65% 14%, 68% 20%, 32% 20%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
      {
        name: "bottom-hem",
        clipPath: "polygon(26% 62%, 74% 62%, 75% 68%, 25% 68%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
    ],
  },
};

// Kurthi: mid-length tunic
const kurthiConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Kurthi Body" },
    { id: "sleeve", label: "Sleeves" },
    { id: "border", label: "Neckline / Hem" },
  ],
  regions: {
    body: [
      {
        name: "torso",
        clipPath: "polygon(25% 15%, 75% 15%, 78% 75%, 22% 75%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-sleeve",
        clipPath: "polygon(3% 14%, 25% 15%, 22% 48%, 5% 42%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-sleeve",
        clipPath: "polygon(75% 15%, 97% 14%, 95% 42%, 78% 48%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "neckline",
        clipPath: "polygon(38% 12%, 62% 12%, 65% 18%, 35% 18%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
      {
        name: "bottom-hem",
        clipPath: "polygon(20% 72%, 80% 72%, 82% 78%, 18% 78%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
    ],
  },
};

// Lehenga: flared skirt from waist down
const lehengaConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Lehenga Skirt" },
    { id: "sleeve", label: "Choli / Top" },
    { id: "border", label: "Skirt Border" },
  ],
  regions: {
    body: [
      {
        name: "skirt",
        clipPath: "polygon(15% 40%, 85% 40%, 90% 92%, 10% 92%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "choli",
        clipPath: "polygon(28% 12%, 72% 12%, 75% 38%, 25% 38%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "skirt-border",
        clipPath: "polygon(8% 86%, 92% 86%, 94% 95%, 6% 95%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
    ],
  },
};

// Sharara: wide-leg pants with fitted top
const shararaConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Sharara Top" },
    { id: "sleeve", label: "Sharara Pants" },
    { id: "border", label: "Border / Hem" },
  ],
  regions: {
    body: [
      {
        name: "top",
        clipPath: "polygon(25% 12%, 75% 12%, 78% 45%, 22% 45%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "pants",
        clipPath: "polygon(18% 45%, 82% 45%, 88% 92%, 12% 92%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "hem",
        clipPath: "polygon(10% 88%, 90% 88%, 92% 95%, 8% 95%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
    ],
  },
};

// Shirt (men): collar, body, sleeves
const shirtConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Shirt Body" },
    { id: "sleeve", label: "Sleeves" },
    { id: "border", label: "Collar / Cuffs" },
  ],
  regions: {
    body: [
      {
        name: "torso",
        clipPath: "polygon(28% 18%, 72% 18%, 74% 72%, 26% 72%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-sleeve",
        clipPath: "polygon(3% 16%, 28% 18%, 26% 52%, 6% 48%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-sleeve",
        clipPath: "polygon(72% 18%, 97% 16%, 94% 48%, 74% 52%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "collar",
        clipPath: "polygon(35% 12%, 65% 12%, 68% 19%, 32% 19%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
      {
        name: "cuffs",
        clipPath: "polygon(2% 46%, 8% 44%, 8% 52%, 2% 52%)",
        blendMode: "overlay",
        opacity: 0.4,
      },
    ],
  },
};

// Pants/Jeans: full leg coverage
const pantsConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Main Fabric" },
    { id: "sleeve", label: "Waistband" },
    { id: "border", label: "Hem / Cuffs" },
  ],
  regions: {
    body: [
      {
        name: "legs",
        clipPath: "polygon(22% 38%, 78% 38%, 82% 92%, 18% 92%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "waistband",
        clipPath: "polygon(20% 35%, 80% 35%, 80% 42%, 20% 42%)",
        blendMode: "multiply",
        opacity: 0.4,
      },
    ],
    border: [
      {
        name: "hem",
        clipPath: "polygon(16% 90%, 84% 90%, 85% 96%, 15% 96%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
    ],
  },
};

// Western top / Crop top: shorter torso coverage
const westernTopConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Top Body" },
    { id: "sleeve", label: "Sleeves / Straps" },
    { id: "border", label: "Neckline / Hem" },
  ],
  regions: {
    body: [
      {
        name: "torso",
        clipPath: "polygon(28% 16%, 72% 16%, 74% 55%, 26% 55%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-strap",
        clipPath: "polygon(8% 14%, 28% 16%, 26% 38%, 10% 34%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-strap",
        clipPath: "polygon(72% 16%, 92% 14%, 90% 34%, 74% 38%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "neckline",
        clipPath: "polygon(32% 13%, 68% 13%, 70% 18%, 30% 18%)",
        blendMode: "overlay",
        opacity: 0.45,
      },
    ],
  },
};

// Dhoti: draped lower garment
const dhotiConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Dhoti Fabric" },
    { id: "sleeve", label: "Kurta / Top" },
    { id: "border", label: "Dhoti Border" },
  ],
  regions: {
    body: [
      {
        name: "dhoti-drape",
        clipPath: "polygon(15% 42%, 85% 42%, 88% 92%, 12% 92%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "kurta-top",
        clipPath: "polygon(22% 12%, 78% 12%, 80% 40%, 20% 40%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "dhoti-border",
        clipPath: "polygon(10% 88%, 90% 88%, 92% 95%, 8% 95%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
    ],
  },
};

// Long Kurthi (men): full-length tunic
const longKurthiConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Kurthi Body" },
    { id: "sleeve", label: "Sleeves" },
    { id: "border", label: "Neckline / Hem" },
  ],
  regions: {
    body: [
      {
        name: "torso",
        clipPath: "polygon(24% 16%, 76% 16%, 80% 88%, 20% 88%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-sleeve",
        clipPath: "polygon(3% 14%, 24% 16%, 20% 50%, 5% 45%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-sleeve",
        clipPath: "polygon(76% 16%, 97% 14%, 95% 45%, 80% 50%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "neckline",
        clipPath: "polygon(38% 13%, 62% 13%, 64% 19%, 36% 19%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
      {
        name: "bottom-hem",
        clipPath: "polygon(18% 85%, 82% 85%, 84% 92%, 16% 92%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
    ],
  },
};

// Map category IDs to their mask configs
const categoryMaskMap: Record<string, GarmentMaskConfig> = {
  sarees: sareeConfig,
  blouses: blouseConfig,
  kurthi: kurthiConfig,
  lehenga: lehengaConfig,
  sharara: shararaConfig,
  "western-tops": westernTopConfig,
  "crop-tops": westernTopConfig,
  "w-jeans": pantsConfig,
  "w-pants": pantsConfig,
  "m-pants": pantsConfig,
  "m-jeans": pantsConfig,
  "short-kurthi": kurthiConfig,
  "long-kurthi": longKurthiConfig,
  shirts: shirtConfig,
  dhoti: dhotiConfig,
};

// Default fallback config
const defaultConfig: GarmentMaskConfig = {
  parts: [
    { id: "body", label: "Body" },
    { id: "sleeve", label: "Sleeve" },
    { id: "border", label: "Border" },
  ],
  regions: {
    body: [
      {
        name: "body",
        clipPath: "polygon(25% 15%, 75% 15%, 78% 85%, 22% 85%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    sleeve: [
      {
        name: "left-sleeve",
        clipPath: "polygon(3% 12%, 25% 15%, 22% 50%, 5% 45%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
      {
        name: "right-sleeve",
        clipPath: "polygon(75% 15%, 97% 12%, 95% 45%, 78% 50%)",
        blendMode: "multiply",
        opacity: 0.35,
      },
    ],
    border: [
      {
        name: "border",
        clipPath: "polygon(15% 82%, 85% 82%, 88% 100%, 12% 100%)",
        blendMode: "overlay",
        opacity: 0.5,
      },
    ],
  },
};

export function getGarmentMaskConfig(categoryId: string): GarmentMaskConfig {
  return categoryMaskMap[categoryId] || defaultConfig;
}
