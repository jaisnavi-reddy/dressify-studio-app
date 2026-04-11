import { useState } from "react";
import { fabricPatterns, patternCategories, FabricPattern } from "./fabricPatterns";
import { Sparkles, Landmark, Grid3X3 } from "lucide-react";

const categoryIcons = {
  traditional: Landmark,
  modern: Grid3X3,
  texture: Sparkles,
};

interface Props {
  activePart: string;
  onPatternSelect: (pattern: FabricPattern | null) => void;
  selectedPatternId?: string | null;
}

export default function PatternPanel({ activePart, onPatternSelect, selectedPatternId }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("traditional");

  const filtered = fabricPatterns.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold">Fabric Patterns</h3>
      <p className="text-xs text-muted-foreground">
        Select a pattern for <span className="font-semibold text-foreground">{activePart}</span>
      </p>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {patternCategories.map((cat) => {
          const Icon = categoryIcons[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? "burgundy-gradient text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon size={13} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* No pattern option */}
      <button
        onClick={() => onPatternSelect(null)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
          !selectedPatternId
            ? "border-primary bg-primary/5 text-foreground"
            : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
          None
        </div>
        <span>No Pattern (Solid Color)</span>
      </button>

      {/* Pattern grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((pattern) => (
          <button
            key={pattern.id}
            onClick={() => onPatternSelect(pattern)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
              selectedPatternId === pattern.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            <div
              className="w-full aspect-square rounded-lg bg-card overflow-hidden flex items-center justify-center text-primary"
              dangerouslySetInnerHTML={{ __html: pattern.svg }}
            />
            <span className="text-muted-foreground">{pattern.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
