import { designElements, DesignElement } from "./designElements";
import { Flower2, Circle, Landmark, Minus } from "lucide-react";
import { useState } from "react";

const categoryIcons = {
  flowers: Flower2,
  geometric: Circle,
  traditional: Landmark,
  borders: Minus,
};

const categoryLabels = {
  flowers: "Flowers",
  geometric: "Geometric",
  traditional: "Traditional",
  borders: "Borders",
};

export default function ElementPanel() {
  const [activeCategory, setActiveCategory] = useState<string>("flowers");
  const categories = ["flowers", "geometric", "traditional", "borders"] as const;

  const handleDragStart = (e: React.DragEvent, element: DesignElement) => {
    e.dataTransfer.setData("elementId", element.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const filtered = designElements.filter((el) => el.category === activeCategory);

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold">Design Elements</h3>
      <p className="text-xs text-muted-foreground">Drag & drop elements onto the garment</p>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "burgundy-gradient text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon size={13} />
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Elements grid */}
      <div className="grid grid-cols-3 gap-2">
        {filtered.map((el) => (
          <div
            key={el.id}
            draggable
            onDragStart={(e) => handleDragStart(e, el)}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-border bg-muted/30 cursor-grab active:cursor-grabbing hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div
              className="w-10 h-10 text-foreground group-hover:text-primary transition-colors"
              dangerouslySetInnerHTML={{ __html: el.svg }}
            />
            <span className="text-[10px] text-muted-foreground font-medium">{el.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
