import { useState } from "react";
import Navbar from "@/components/stylemate/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClothingItem, ClothingCategory } from "@/types/wardrobe";
import AddItemModal from "@/components/stylemate/AddItemModal";
import { Plus, Shirt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories: (ClothingCategory | "all")[] = ["all", "top", "bottom", "shoes", "accessory", "outerwear"];

export default function Wardrobe() {
  const [items, setItems] = useLocalStorage<ClothingItem[]>("sm-wardrobe", []);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<ClothingCategory | "all">("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  const handleAdd = (item: ClothingItem) => setItems((prev) => [...prev, item]);

  const handleDelete = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-20 pb-24 md:pb-8 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Wardrobe</h1>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="rounded-full bg-primary text-primary-foreground gap-1.5">
            <Plus size={16} /> Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Shirt size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">
              {items.length === 0 ? "No items yet" : "No items in this category"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {items.length === 0 ? "Upload your first clothing item" : "Try a different filter"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="aspect-square bg-muted relative">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.occasions.slice(0, 2).map((o) => (
                      <span key={o} className="px-2 py-0.5 rounded-full bg-muted text-[10px] capitalize">{o}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddItemModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      </main>
    </div>
  );
}
