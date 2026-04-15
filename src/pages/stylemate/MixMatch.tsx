import { useState, useMemo } from "react";
import Navbar from "@/components/stylemate/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClothingItem, Outfit, Occasion, Weather, getSmartOutfits } from "@/types/wardrobe";
import OutfitCard from "@/components/stylemate/OutfitCard";
import { Sparkles, Shirt, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const occasions: (Occasion | "all")[] = ["all", "casual", "party", "office", "wedding"];
const weathers: (Weather | "all")[] = ["all", "hot", "cold", "rainy", "mild"];

export default function MixMatch() {
  const [items] = useLocalStorage<ClothingItem[]>("sm-wardrobe", []);
  const [savedOutfits, setSavedOutfits] = useLocalStorage<Outfit[]>("sm-saved-outfits", []);
  const [occasion, setOccasion] = useState<Occasion | "all">("all");
  const [weather, setWeather] = useState<Weather | "all">("all");
  const [mode, setMode] = useState<"smart" | "manual">("smart");
  const [manualTop, setManualTop] = useState<string | null>(null);
  const [manualBottom, setManualBottom] = useState<string | null>(null);
  const [manualShoes, setManualShoes] = useState<string | null>(null);
  const { toast } = useToast();

  const smartOutfits = useMemo(
    () => getSmartOutfits(items, occasion, weather),
    [items, occasion, weather]
  );

  const savedIds = new Set(savedOutfits.map((o) => `${o.topId}-${o.bottomId}-${o.shoesId}`));

  const saveOutfit = (top: ClothingItem, bottom: ClothingItem, shoes: ClothingItem) => {
    const key = `${top.id}-${bottom.id}-${shoes.id}`;
    if (savedIds.has(key)) {
      setSavedOutfits((prev) => prev.filter((o) => `${o.topId}-${o.bottomId}-${o.shoesId}` !== key));
      toast({ title: "Removed from saved looks" });
    } else {
      setSavedOutfits((prev) => [
        ...prev,
        { id: `outfit-${Date.now()}`, name: `${top.type} + ${bottom.type}`, topId: top.id, bottomId: bottom.id, shoesId: shoes.id, createdAt: Date.now() },
      ]);
      toast({ title: "Saved to your looks! ❤️" });
    }
  };

  const tops = items.filter((i) => i.category === "top");
  const bottoms = items.filter((i) => i.category === "bottom");
  const shoes = items.filter((i) => i.category === "shoes");

  const manualTopItem = items.find((i) => i.id === manualTop);
  const manualBottomItem = items.find((i) => i.id === manualBottom);
  const manualShoesItem = items.find((i) => i.id === manualShoes);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-20 pb-24 md:pb-8 px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Mix & Match</h1>
        <p className="text-sm text-muted-foreground mb-6">Smart suggestions or manual picks</p>

        {/* Mode toggle */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 max-w-xs">
          {(["smart", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                mode === m ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "smart" ? <Sparkles size={14} /> : <SlidersHorizontal size={14} />}
              {m}
            </button>
          ))}
        </div>

        {mode === "smart" ? (
          <>
            {/* Filters */}
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Occasion</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {occasions.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                        occasion === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Weather</p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {weathers.map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeather(w)}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                        weather === w ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {items.length < 3 ? (
              <div className="text-center py-16">
                <Shirt size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">Need more items</h3>
                <p className="text-sm text-muted-foreground">Add at least 1 top, 1 bottom, and 1 pair of shoes to get suggestions</p>
              </div>
            ) : smartOutfits.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-semibold mb-2">No matching outfits</h3>
                <p className="text-sm text-muted-foreground">Try changing the occasion or weather filter</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartOutfits.map((o, i) => (
                  <OutfitCard
                    key={`${o.top.id}-${o.bottom.id}-${o.shoes.id}`}
                    top={o.top}
                    bottom={o.bottom}
                    shoes={o.shoes}
                    index={i}
                    saved={savedIds.has(`${o.top.id}-${o.bottom.id}-${o.shoes.id}`)}
                    onSave={() => saveOutfit(o.top, o.bottom, o.shoes)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Manual mode */
          <div className="space-y-6">
            {/* Selectors */}
            {[
              { label: "Top", list: tops, selected: manualTop, set: setManualTop },
              { label: "Bottom", list: bottoms, selected: manualBottom, set: setManualBottom },
              { label: "Shoes", list: shoes, selected: manualShoes, set: setManualShoes },
            ].map((section) => (
              <div key={section.label}>
                <h3 className="font-display text-lg font-semibold mb-3">{section.label}</h3>
                {section.list.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No {section.label.toLowerCase()} items in wardrobe</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {section.list.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => section.set(section.selected === item.id ? null : item.id)}
                        className={`shrink-0 w-24 rounded-xl border-2 overflow-hidden transition-all ${
                          section.selected === item.id ? "border-primary shadow-lg scale-105" : "border-border"
                        }`}
                      >
                        <div className="aspect-square bg-muted">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs p-1.5 truncate text-center">{item.type}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Preview */}
            {manualTopItem && manualBottomItem && manualShoesItem && (
              <div className="animate-fade-in">
                <h3 className="font-display text-lg font-semibold mb-3">Your Combination</h3>
                <OutfitCard
                  top={manualTopItem}
                  bottom={manualBottomItem}
                  shoes={manualShoesItem}
                  saved={savedIds.has(`${manualTop}-${manualBottom}-${manualShoes}`)}
                  onSave={() => saveOutfit(manualTopItem, manualBottomItem, manualShoesItem)}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
