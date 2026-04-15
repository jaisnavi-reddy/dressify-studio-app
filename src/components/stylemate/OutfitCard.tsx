import { ClothingItem } from "@/types/wardrobe";
import { Heart, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface Props {
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  onSave?: () => void;
  saved?: boolean;
  index?: number;
}

export default function OutfitCard({ top, bottom, shoes, onSave, saved, index = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `outfit-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div ref={ref} className="grid grid-cols-3 gap-1 p-3 bg-gradient-to-br from-muted/30 to-muted/60">
        {[top, bottom, shoes].map((item) => (
          <div key={item.id} className="aspect-square rounded-xl overflow-hidden bg-background">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{top.type} + {bottom.type}</p>
          <p className="text-xs text-muted-foreground">{shoes.type}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleDownload}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download size={14} />
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                saved ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-primary"
              }`}
            >
              <Heart size={14} fill={saved ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
