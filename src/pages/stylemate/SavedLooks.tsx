import Navbar from "@/components/stylemate/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClothingItem, Outfit } from "@/types/wardrobe";
import OutfitCard from "@/components/stylemate/OutfitCard";
import { Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SavedLooks() {
  const [items] = useLocalStorage<ClothingItem[]>("sm-wardrobe", []);
  const [savedOutfits, setSavedOutfits] = useLocalStorage<Outfit[]>("sm-saved-outfits", []);
  const { toast } = useToast();

  const handleRemove = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
    toast({ title: "Look removed" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-20 pb-24 md:pb-8 px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Saved Looks</h1>
        <p className="text-sm text-muted-foreground mb-6">{savedOutfits.length} saved outfits</p>

        {savedOutfits.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">No saved looks yet</h3>
            <p className="text-sm text-muted-foreground">Save outfits from the Mix & Match page</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOutfits.map((outfit, i) => {
              const top = items.find((it) => it.id === outfit.topId);
              const bottom = items.find((it) => it.id === outfit.bottomId);
              const shoes = items.find((it) => it.id === outfit.shoesId);

              if (!top || !bottom || !shoes) {
                return (
                  <div key={outfit.id} className="bg-card rounded-2xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">Some items were removed from wardrobe</p>
                    <button
                      onClick={() => handleRemove(outfit.id)}
                      className="text-xs text-destructive mt-2 flex items-center gap-1 hover:underline"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                );
              }

              return (
                <div key={outfit.id} className="relative">
                  <OutfitCard top={top} bottom={bottom} shoes={shoes} index={i} />
                  <button
                    onClick={() => handleRemove(outfit.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
