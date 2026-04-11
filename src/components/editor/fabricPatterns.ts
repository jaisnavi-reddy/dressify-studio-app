// Realistic seamless fabric patterns as SVG data URIs
export interface FabricPattern {
  id: string;
  name: string;
  category: "traditional" | "modern" | "texture";
  svg: string; // Full SVG for preview thumbnail
  patternSvg: string; // Repeatable SVG pattern as data URI
  defaultScale: number; // px per repeat tile
}

function toDataUri(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// ── Traditional Patterns ────────────────────────────────────
const banarasi: FabricPattern = {
  id: "banarasi",
  name: "Banarasi Brocade",
  category: "traditional",
  svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="currentColor" opacity="0.1"/><path d="M30 5 L35 15 L30 25 L25 15Z" fill="currentColor" opacity="0.5"/><path d="M15 20 L20 30 L15 40 L10 30Z" fill="currentColor" opacity="0.4"/><path d="M45 20 L50 30 L45 40 L40 30Z" fill="currentColor" opacity="0.4"/><circle cx="30" cy="15" r="2" fill="currentColor" opacity="0.6"/><path d="M5 40 Q15 35 30 40 Q45 45 55 40" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/><path d="M5 50 Q15 45 30 50 Q45 55 55 50" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.25"/></svg>`,
  patternSvg: toDataUri(`<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30 5 L35 15 L30 25 L25 15Z" fill="rgba(0,0,0,0.15)"/><path d="M15 20 L20 30 L15 40 L10 30Z" fill="rgba(0,0,0,0.12)"/><path d="M45 20 L50 30 L45 40 L40 30Z" fill="rgba(0,0,0,0.12)"/><circle cx="30" cy="15" r="2" fill="rgba(0,0,0,0.18)"/><path d="M5 45 Q15 40 30 45 Q45 50 55 45" stroke="rgba(0,0,0,0.1)" stroke-width="1" fill="none"/><path d="M0 55 Q15 50 30 55 Q45 60 60 55" stroke="rgba(0,0,0,0.08)" stroke-width="0.8" fill="none"/></svg>`),
  defaultScale: 60,
};

const paisley: FabricPattern = {
  id: "paisley-pattern",
  name: "Paisley Motif",
  category: "traditional",
  svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="currentColor" opacity="0.08"/><path d="M35 10c-12 0-20 12-20 24s8 16 18 16c3 0 6-1 8-3-3-5-6-12-6-20 0-7 2-13 5-16-1-0.5-3-1-5-1z" fill="currentColor" opacity="0.35"/><circle cx="25" cy="32" r="4" fill="currentColor" opacity="0.2"/><path d="M33 18c0 8 3 16 7 20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/></svg>`,
  patternSvg: toDataUri(`<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M35 10c-12 0-20 12-20 24s8 16 18 16c3 0 6-1 8-3-3-5-6-12-6-20 0-7 2-13 5-16-1-0.5-3-1-5-1z" fill="rgba(0,0,0,0.12)"/><circle cx="25" cy="32" r="4" fill="rgba(0,0,0,0.08)"/><path d="M33 18c0 8 3 16 7 20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/></svg>`),
  defaultScale: 60,
};

const floralButa: FabricPattern = {
  id: "floral-buta",
  name: "Floral Buta",
  category: "traditional",
  svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="currentColor" opacity="0.06"/><ellipse cx="25" cy="20" rx="6" ry="10" fill="currentColor" opacity="0.3"/><ellipse cx="25" cy="20" rx="6" ry="10" fill="currentColor" opacity="0.25" transform="rotate(60 25 25)"/><ellipse cx="25" cy="20" rx="6" ry="10" fill="currentColor" opacity="0.25" transform="rotate(120 25 25)"/><circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.4"/><path d="M25 35v10" stroke="currentColor" stroke-width="1.5" opacity="0.2"/><circle cx="22" cy="40" r="2" fill="currentColor" opacity="0.15"/><circle cx="28" cy="42" r="1.5" fill="currentColor" opacity="0.15"/></svg>`,
  patternSvg: toDataUri(`<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="20" rx="6" ry="10" fill="rgba(0,0,0,0.1)"/><ellipse cx="25" cy="20" rx="6" ry="10" fill="rgba(0,0,0,0.08)" transform="rotate(60 25 25)"/><ellipse cx="25" cy="20" rx="6" ry="10" fill="rgba(0,0,0,0.08)" transform="rotate(120 25 25)"/><circle cx="25" cy="25" r="3" fill="rgba(0,0,0,0.14)"/><path d="M25 35v10" stroke="rgba(0,0,0,0.08)" stroke-width="1.5"/></svg>`),
  defaultScale: 50,
};

const templeBorder: FabricPattern = {
  id: "temple-border-pattern",
  name: "Temple Border",
  category: "traditional",
  svg: `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="60" fill="currentColor" opacity="0.06"/><path d="M20 5L30 20H10L20 5z" fill="currentColor" opacity="0.35"/><rect x="12" y="20" width="16" height="20" fill="currentColor" opacity="0.25"/><rect x="15" y="28" width="10" height="12" fill="currentColor" opacity="0.15"/><rect x="8" y="40" width="24" height="4" fill="currentColor" opacity="0.3"/><rect x="5" y="44" width="30" height="3" fill="currentColor" opacity="0.2"/><rect x="2" y="47" width="36" height="3" fill="currentColor" opacity="0.15"/></svg>`,
  patternSvg: toDataUri(`<svg width="40" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M20 5L30 20H10L20 5z" fill="rgba(0,0,0,0.12)"/><rect x="12" y="20" width="16" height="20" fill="rgba(0,0,0,0.08)"/><rect x="15" y="28" width="10" height="12" fill="rgba(0,0,0,0.05)"/><rect x="8" y="40" width="24" height="4" fill="rgba(0,0,0,0.1)"/><rect x="5" y="44" width="30" height="3" fill="rgba(0,0,0,0.07)"/></svg>`),
  defaultScale: 40,
};

const kanjivaramZari: FabricPattern = {
  id: "kanjivaram-zari",
  name: "Kanjivaram Zari",
  category: "traditional",
  svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="currentColor" opacity="0.05"/><path d="M0 10 Q12 5 25 10 Q38 15 50 10" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M0 20 Q12 15 25 20 Q38 25 50 20" stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/><path d="M0 30 Q12 25 25 30 Q38 35 50 30" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M0 40 Q12 35 25 40 Q38 45 50 40" stroke="currentColor" stroke-width="1" fill="none" opacity="0.25"/><circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.2"/><circle cx="38" cy="10" r="2" fill="currentColor" opacity="0.2"/><circle cx="25" cy="25" r="2.5" fill="currentColor" opacity="0.25"/><circle cx="12" cy="40" r="2" fill="currentColor" opacity="0.2"/><circle cx="38" cy="40" r="2" fill="currentColor" opacity="0.2"/></svg>`,
  patternSvg: toDataUri(`<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><path d="M0 10 Q12 5 25 10 Q38 15 50 10" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" fill="none"/><path d="M0 20 Q12 15 25 20 Q38 25 50 20" stroke="rgba(0,0,0,0.08)" stroke-width="1" fill="none"/><path d="M0 30 Q12 25 25 30 Q38 35 50 30" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" fill="none"/><path d="M0 40 Q12 35 25 40 Q38 45 50 40" stroke="rgba(0,0,0,0.08)" stroke-width="1" fill="none"/><circle cx="25" cy="25" r="2.5" fill="rgba(0,0,0,0.1)"/></svg>`),
  defaultScale: 50,
};

const kalamkari: FabricPattern = {
  id: "kalamkari",
  name: "Kalamkari",
  category: "traditional",
  svg: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="currentColor" opacity="0.05"/><path d="M30 5 C20 10 15 20 15 30 C15 42 22 50 30 55 C38 50 45 42 45 30 C45 20 40 10 30 5z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><path d="M30 12 C24 16 20 22 20 30 C20 38 24 44 30 48 C36 44 40 38 40 30 C40 22 36 16 30 12z" fill="currentColor" opacity="0.12"/><circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.25"/><path d="M26 20 Q30 15 34 20" stroke="currentColor" stroke-width="1" fill="none" opacity="0.2"/><path d="M26 40 Q30 45 34 40" stroke="currentColor" stroke-width="1" fill="none" opacity="0.2"/></svg>`,
  patternSvg: toDataUri(`<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M30 5 C20 10 15 20 15 30 C15 42 22 50 30 55 C38 50 45 42 45 30 C45 20 40 10 30 5z" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/><path d="M30 12 C24 16 20 22 20 30 C20 38 24 44 30 48 C36 44 40 38 40 30 C40 22 36 16 30 12z" fill="rgba(0,0,0,0.06)"/><circle cx="30" cy="30" r="4" fill="rgba(0,0,0,0.1)"/></svg>`),
  defaultScale: 60,
};

// ── Modern Patterns ────────────────────────────────────────

const minimalFloral: FabricPattern = {
  id: "minimal-floral",
  name: "Minimal Florals",
  category: "modern",
  svg: `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="currentColor" opacity="0.04"/><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.25"/><circle cx="12" cy="13" r="2" fill="currentColor" opacity="0.15"/><circle cx="18" cy="13" r="2" fill="currentColor" opacity="0.15"/><circle cx="15" cy="18" r="2" fill="currentColor" opacity="0.15"/><circle cx="40" cy="38" r="3" fill="currentColor" opacity="0.25"/><circle cx="37" cy="36" r="2" fill="currentColor" opacity="0.15"/><circle cx="43" cy="36" r="2" fill="currentColor" opacity="0.15"/><circle cx="40" cy="41" r="2" fill="currentColor" opacity="0.15"/><path d="M15 20v8" stroke="currentColor" stroke-width="0.8" opacity="0.12"/><path d="M40 44v6" stroke="currentColor" stroke-width="0.8" opacity="0.12"/></svg>`,
  patternSvg: toDataUri(`<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="3" fill="rgba(0,0,0,0.1)"/><circle cx="12" cy="13" r="2" fill="rgba(0,0,0,0.06)"/><circle cx="18" cy="13" r="2" fill="rgba(0,0,0,0.06)"/><circle cx="15" cy="18" r="2" fill="rgba(0,0,0,0.06)"/><circle cx="40" cy="38" r="3" fill="rgba(0,0,0,0.1)"/><circle cx="37" cy="36" r="2" fill="rgba(0,0,0,0.06)"/><circle cx="43" cy="36" r="2" fill="rgba(0,0,0,0.06)"/></svg>`),
  defaultScale: 50,
};

const geometricPrint: FabricPattern = {
  id: "geometric-print",
  name: "Geometric Print",
  category: "modern",
  svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="currentColor" opacity="0.04"/><rect x="5" y="5" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><rect x="23" y="23" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><polygon points="29,5 35,17 23,17" fill="currentColor" opacity="0.2"/><polygon points="11,23 17,35 5,35" fill="currentColor" opacity="0.2"/></svg>`,
  patternSvg: toDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="12" height="12" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/><rect x="23" y="23" width="12" height="12" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.5"/><polygon points="29,5 35,17 23,17" fill="rgba(0,0,0,0.07)"/><polygon points="11,23 17,35 5,35" fill="rgba(0,0,0,0.07)"/></svg>`),
  defaultScale: 40,
};

const stripes: FabricPattern = {
  id: "pinstripe",
  name: "Pinstripe",
  category: "modern",
  svg: `<svg viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="40" fill="currentColor" opacity="0.04"/><line x1="5" y1="0" x2="5" y2="40" stroke="currentColor" stroke-width="1" opacity="0.2"/><line x1="15" y1="0" x2="15" y2="40" stroke="currentColor" stroke-width="0.5" opacity="0.12"/></svg>`,
  patternSvg: toDataUri(`<svg width="20" height="40" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="0" x2="5" y2="40" stroke="rgba(0,0,0,0.08)" stroke-width="1"/><line x1="15" y1="0" x2="15" y2="40" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/></svg>`),
  defaultScale: 20,
};

const checks: FabricPattern = {
  id: "checks-pattern",
  name: "Checks",
  category: "modern",
  svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="currentColor" opacity="0.04"/><rect x="0" y="0" width="20" height="20" fill="currentColor" opacity="0.12"/><rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.12"/></svg>`,
  patternSvg: toDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" fill="rgba(0,0,0,0.06)"/><rect x="20" y="20" width="20" height="20" fill="rgba(0,0,0,0.06)"/></svg>`),
  defaultScale: 40,
};

// ── Texture Patterns ────────────────────────────────────────

const cottonTexture: FabricPattern = {
  id: "cotton-texture",
  name: "Cotton Weave",
  category: "texture",
  svg: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><rect width="30" height="30" fill="currentColor" opacity="0.04"/><line x1="0" y1="5" x2="30" y2="5" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><line x1="0" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="0.5" opacity="0.08"/><line x1="0" y1="15" x2="30" y2="15" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><line x1="0" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="0.5" opacity="0.08"/><line x1="0" y1="25" x2="30" y2="25" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><line x1="5" y1="0" x2="5" y2="30" stroke="currentColor" stroke-width="0.3" opacity="0.06"/><line x1="15" y1="0" x2="15" y2="30" stroke="currentColor" stroke-width="0.3" opacity="0.06"/><line x1="25" y1="0" x2="25" y2="30" stroke="currentColor" stroke-width="0.3" opacity="0.06"/></svg>`,
  patternSvg: toDataUri(`<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="5" x2="30" y2="5" stroke="rgba(0,0,0,0.04)" stroke-width="0.5"/><line x1="0" y1="10" x2="30" y2="10" stroke="rgba(0,0,0,0.03)" stroke-width="0.5"/><line x1="0" y1="15" x2="30" y2="15" stroke="rgba(0,0,0,0.04)" stroke-width="0.5"/><line x1="0" y1="20" x2="30" y2="20" stroke="rgba(0,0,0,0.03)" stroke-width="0.5"/><line x1="0" y1="25" x2="30" y2="25" stroke="rgba(0,0,0,0.04)" stroke-width="0.5"/><line x1="5" y1="0" x2="5" y2="30" stroke="rgba(0,0,0,0.02)" stroke-width="0.3"/><line x1="15" y1="0" x2="15" y2="30" stroke="rgba(0,0,0,0.02)" stroke-width="0.3"/><line x1="25" y1="0" x2="25" y2="30" stroke="rgba(0,0,0,0.02)" stroke-width="0.3"/></svg>`),
  defaultScale: 30,
};

const silkTexture: FabricPattern = {
  id: "silk-texture",
  name: "Silk Sheen",
  category: "texture",
  svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="currentColor" opacity="0.03"/><path d="M0 8 Q10 5 20 8 Q30 11 40 8" stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.08"/><path d="M0 16 Q10 13 20 16 Q30 19 40 16" stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.06"/><path d="M0 24 Q10 21 20 24 Q30 27 40 24" stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.08"/><path d="M0 32 Q10 29 20 32 Q30 35 40 32" stroke="currentColor" stroke-width="0.6" fill="none" opacity="0.06"/></svg>`,
  patternSvg: toDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0 8 Q10 5 20 8 Q30 11 40 8" stroke="rgba(255,255,255,0.08)" stroke-width="0.6" fill="none"/><path d="M0 16 Q10 13 20 16 Q30 19 40 16" stroke="rgba(255,255,255,0.05)" stroke-width="0.6" fill="none"/><path d="M0 24 Q10 21 20 24 Q30 27 40 24" stroke="rgba(255,255,255,0.08)" stroke-width="0.6" fill="none"/><path d="M0 32 Q10 29 20 32 Q30 35 40 32" stroke="rgba(255,255,255,0.05)" stroke-width="0.6" fill="none"/></svg>`),
  defaultScale: 40,
};

const linenWeave: FabricPattern = {
  id: "linen-weave",
  name: "Linen Weave",
  category: "texture",
  svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="currentColor" opacity="0.04"/><rect x="0" y="0" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="12" y="0" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="6" y="6" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="18" y="6" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="0" y="12" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="12" y="12" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="6" y="18" width="6" height="3" fill="currentColor" opacity="0.08"/><rect x="18" y="18" width="6" height="3" fill="currentColor" opacity="0.08"/></svg>`,
  patternSvg: toDataUri(`<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="12" y="0" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="6" y="6" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="18" y="6" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="0" y="12" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="12" y="12" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="6" y="18" width="6" height="3" fill="rgba(0,0,0,0.04)"/><rect x="18" y="18" width="6" height="3" fill="rgba(0,0,0,0.04)"/></svg>`),
  defaultScale: 24,
};

const polkaDots: FabricPattern = {
  id: "polka-dots",
  name: "Polka Dots",
  category: "modern",
  svg: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="currentColor" opacity="0.04"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.2"/><circle cx="30" cy="10" r="3" fill="currentColor" opacity="0.2"/><circle cx="20" cy="25" r="3" fill="currentColor" opacity="0.2"/></svg>`,
  patternSvg: toDataUri(`<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="3" fill="rgba(0,0,0,0.08)"/><circle cx="30" cy="10" r="3" fill="rgba(0,0,0,0.08)"/><circle cx="20" cy="25" r="3" fill="rgba(0,0,0,0.08)"/></svg>`),
  defaultScale: 40,
};

export const fabricPatterns: FabricPattern[] = [
  banarasi,
  paisley,
  floralButa,
  templeBorder,
  kanjivaramZari,
  kalamkari,
  minimalFloral,
  geometricPrint,
  stripes,
  checks,
  polkaDots,
  cottonTexture,
  silkTexture,
  linenWeave,
];

export const patternCategories = [
  { id: "traditional", label: "Traditional" },
  { id: "modern", label: "Modern" },
  { id: "texture", label: "Textures" },
] as const;

// Color harmony suggestions
export function getColorSuggestions(bodyColor: string): {
  borders: string[];
  sleeves: string[];
  patterns: string[];
} {
  // Convert hex to HSL for complementary calculations
  const r = parseInt(bodyColor.slice(1, 3), 16) / 255;
  const g = parseInt(bodyColor.slice(3, 5), 16) / 255;
  const b = parseInt(bodyColor.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rr = 0, gg = 0, bb = 0;
    if (h < 60) { rr = c; gg = x; }
    else if (h < 120) { rr = x; gg = c; }
    else if (h < 180) { gg = c; bb = x; }
    else if (h < 240) { gg = x; bb = c; }
    else if (h < 300) { rr = x; bb = c; }
    else { rr = c; bb = x; }
    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  };

  return {
    borders: [
      hslToHex(h + 30, Math.min(s * 1.2, 1), Math.min(l + 0.15, 0.85)), // analogous lighter
      hslToHex(h, s * 0.6, Math.min(l + 0.3, 0.9)), // same hue, lighter
      "#D4A853", // gold
      "#C0C0C0", // silver
    ],
    sleeves: [
      hslToHex(h, s * 0.8, Math.min(l + 0.1, 0.8)), // slightly lighter
      hslToHex(h - 15, s, l), // analogous
      hslToHex(h, s * 0.5, Math.min(l + 0.25, 0.85)), // desaturated
    ],
    patterns: [
      hslToHex(h + 180, s * 0.7, l), // complementary
      hslToHex(h + 120, s * 0.5, Math.min(l + 0.1, 0.8)), // triadic
      hslToHex(h - 30, s * 0.9, l), // analogous
    ],
  };
}
