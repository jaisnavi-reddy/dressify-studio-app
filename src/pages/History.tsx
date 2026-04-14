import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Download, Trash2, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Outfit } from "@/data/outfitDataset";

const HISTORY_KEY = "dressify-outfit-history";

function loadHistory(): Outfit[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function History() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<Outfit[]>([]);
  const [selectedItem, setSelectedItem] = useState<Outfit | null>(null);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setItems([]);
    setSelectedItem(null);
    toast({ title: "History cleared" });
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleDownload = (outfit: Outfit) => {
    const link = document.createElement("a");
    link.href = outfit.imageUrl;
    link.download = `${outfit.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    link.target = "_blank";
    link.click();
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold animate-fade-in flex items-center gap-3">
              <Clock size={32} className="text-primary" /> Generation History
            </h1>
            <p className="text-muted-foreground mt-1">
              {items.length} outfit{items.length !== 1 ? "s" : ""} generated
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/generate")} className="burgundy-gradient border-none text-primary-foreground rounded-full gap-2">
              <Sparkles size={16} /> Generate New
            </Button>
            {items.length > 0 && (
              <Button onClick={clearHistory} variant="outline" className="rounded-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 size={16} /> Clear All
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <span className="text-6xl mb-4 block">🕐</span>
            <h3 className="font-display text-xl font-semibold mb-2">No history yet</h3>
            <p className="text-muted-foreground mb-6">Generate your first outfit to see it here!</p>
            <Button onClick={() => navigate("/generate")} className="burgundy-gradient border-none text-primary-foreground rounded-full gap-2">
              <Sparkles size={16} /> Generate Outfit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all animate-fade-in group"
              >
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={outfit.imageUrl}
                    alt={outfit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedItem(outfit)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-background/90 text-foreground text-xs font-medium hover:bg-background transition"
                    >
                      <Eye size={12} /> View
                    </button>
                    <button
                      onClick={() => handleDownload(outfit)}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-background/90 text-foreground text-xs font-medium hover:bg-background transition"
                    >
                      <Download size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(outfit.id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-destructive/80 text-destructive-foreground text-xs hover:bg-destructive transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-display font-semibold text-sm truncate">{outfit.title}</h4>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground capitalize">{outfit.occasion}</span>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground capitalize">{outfit.fabric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedItem(null)}>
            <div className="bg-card rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[3/4]">
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background"
                >✕</button>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold mb-1">{selectedItem.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedItem.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedItem.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded-md text-xs capitalize">#{tag}</span>
                  ))}
                </div>
                <Button onClick={() => handleDownload(selectedItem)} className="w-full burgundy-gradient border-none text-primary-foreground rounded-full gap-2">
                  <Download size={16} /> Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
