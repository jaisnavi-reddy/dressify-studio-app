// SVG design elements for drag-and-drop onto garments
export interface DesignElement {
  id: string;
  name: string;
  category: "flowers" | "geometric" | "traditional" | "borders";
  svg: string;
  defaultSize: number;
}

export interface PlacedElement {
  id: string;
  elementId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  rotation: number;
  color: string;
  opacity: number;
}

export const designElements: DesignElement[] = [
  // Flowers
  {
    id: "rose",
    name: "Rose",
    category: "flowers",
    svg: `<svg viewBox="0 0 100 100"><path d="M50 15c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15z" fill="currentColor" opacity="0.9"/><path d="M35 35c-5 5-8 12-8 18 0 15 10 25 23 30 13-5 23-15 23-30 0-6-3-13-8-18-3 8-10 13-15 13s-12-5-15-13z" fill="currentColor" opacity="0.7"/><path d="M50 85c-3 0-5-1-5-3v-12c0-2 2-3 5-3s5 1 5 3v12c0 2-2 3-5 3z" fill="currentColor" opacity="0.5"/><circle cx="50" cy="30" r="5" fill="currentColor" opacity="0.4"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "lotus",
    name: "Lotus",
    category: "flowers",
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.8"/><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.6" transform="rotate(30 50 50)"/><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.6" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.6" transform="rotate(90 50 50)"/><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.6" transform="rotate(120 50 50)"/><ellipse cx="50" cy="50" rx="12" ry="25" fill="currentColor" opacity="0.6" transform="rotate(150 50 50)"/><circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9"/></svg>`,
    defaultSize: 45,
  },
  {
    id: "daisy",
    name: "Daisy",
    category: "flowers",
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(45 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(90 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(135 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(180 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(225 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(270 50 50)"/><ellipse cx="50" cy="25" rx="8" ry="15" fill="currentColor" opacity="0.7" transform="rotate(315 50 50)"/><circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.9"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "tulip",
    name: "Tulip",
    category: "flowers",
    svg: `<svg viewBox="0 0 100 100"><path d="M50 15c-15 0-25 15-25 30 0 10 10 20 25 25 15-5 25-15 25-25 0-15-10-30-25-30z" fill="currentColor" opacity="0.8"/><path d="M50 70v20" stroke="currentColor" stroke-width="3" fill="none" opacity="0.6"/><path d="M40 80c5-5 10-8 10-10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5"/></svg>`,
    defaultSize: 35,
  },
  // Geometric
  {
    id: "circle-ring",
    name: "Circle Ring",
    category: "geometric",
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="6" opacity="0.8"/><circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="3" opacity="0.5"/><circle cx="50" cy="50" r="16" fill="currentColor" opacity="0.3"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "star",
    name: "Star",
    category: "geometric",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="currentColor" opacity="0.8"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "diamond",
    name: "Diamond",
    category: "geometric",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="currentColor" opacity="0.7"/><polygon points="50,20 80,50 50,80 20,50" fill="currentColor" opacity="0.4"/></svg>`,
    defaultSize: 35,
  },
  {
    id: "hexagon",
    name: "Hexagon",
    category: "geometric",
    svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="currentColor" opacity="0.7"/><polygon points="50,20 75,35 75,65 50,80 25,65 25,35" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9"/></svg>`,
    defaultSize: 40,
  },
  // Traditional
  {
    id: "paisley",
    name: "Paisley",
    category: "traditional",
    svg: `<svg viewBox="0 0 100 100"><path d="M60 15c-20 0-35 20-35 40s15 30 30 30c5 0 10-2 15-5-5-8-10-20-10-35 0-12 3-22 8-28-2-1-5-2-8-2z" fill="currentColor" opacity="0.8"/><circle cx="45" cy="55" r="8" fill="currentColor" opacity="0.4"/><path d="M55 30c0 15 5 28 12 35" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "mandala",
    name: "Mandala",
    category: "traditional",
    svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/><circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/><circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.9"/><line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" stroke-width="1" opacity="0.4"/><line x1="8" y1="50" x2="92" y2="50" stroke="currentColor" stroke-width="1" opacity="0.4"/><line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="1" opacity="0.4"/><line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="1" opacity="0.4"/><circle cx="50" cy="8" r="4" fill="currentColor" opacity="0.6"/><circle cx="50" cy="92" r="4" fill="currentColor" opacity="0.6"/><circle cx="8" cy="50" r="4" fill="currentColor" opacity="0.6"/><circle cx="92" cy="50" r="4" fill="currentColor" opacity="0.6"/></svg>`,
    defaultSize: 50,
  },
  {
    id: "peacock",
    name: "Peacock Feather",
    category: "traditional",
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="40" rx="20" ry="30" fill="currentColor" opacity="0.6"/><ellipse cx="50" cy="35" rx="12" ry="18" fill="currentColor" opacity="0.4"/><circle cx="50" cy="30" r="8" fill="currentColor" opacity="0.8"/><circle cx="50" cy="30" r="4" fill="currentColor" opacity="0.3"/><path d="M50 70v25" stroke="currentColor" stroke-width="2" opacity="0.7"/></svg>`,
    defaultSize: 40,
  },
  {
    id: "temple-border",
    name: "Temple Motif",
    category: "traditional",
    svg: `<svg viewBox="0 0 100 100"><path d="M50 10L70 30H30L50 10z" fill="currentColor" opacity="0.8"/><rect x="35" y="30" width="30" height="40" fill="currentColor" opacity="0.6"/><rect x="42" y="50" width="16" height="20" fill="currentColor" opacity="0.3"/><rect x="25" y="70" width="50" height="8" fill="currentColor" opacity="0.7"/><rect x="20" y="78" width="60" height="5" fill="currentColor" opacity="0.5"/><rect x="15" y="83" width="70" height="5" fill="currentColor" opacity="0.4"/></svg>`,
    defaultSize: 35,
  },
  // Borders
  {
    id: "vine",
    name: "Vine",
    category: "borders",
    svg: `<svg viewBox="0 0 100 100"><path d="M10 50 Q25 30 40 50 Q55 70 70 50 Q85 30 95 50" fill="none" stroke="currentColor" stroke-width="3" opacity="0.7"/><circle cx="25" cy="38" r="5" fill="currentColor" opacity="0.6"/><circle cx="55" cy="62" r="5" fill="currentColor" opacity="0.6"/><circle cx="85" cy="38" r="5" fill="currentColor" opacity="0.6"/></svg>`,
    defaultSize: 60,
  },
  {
    id: "zigzag-border",
    name: "Zigzag",
    category: "borders",
    svg: `<svg viewBox="0 0 100 100"><polyline points="5,40 20,60 35,40 50,60 65,40 80,60 95,40" fill="none" stroke="currentColor" stroke-width="4" opacity="0.7"/><polyline points="5,50 20,70 35,50 50,70 65,50 80,70 95,50" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/></svg>`,
    defaultSize: 60,
  },
];
