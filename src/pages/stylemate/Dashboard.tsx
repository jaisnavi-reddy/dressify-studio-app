import Navbar from "@/components/stylemate/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClothingItem, Outfit } from "@/types/wardrobe";
import { Shirt, CalendarDays, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [items] = useLocalStorage<ClothingItem[]>("sm-wardrobe", []);
  const [savedOutfits] = useLocalStorage<Outfit[]>("sm-saved-outfits", []);

  const stats = [
    { icon: Shirt, label: "Wardrobe Items", value: items.length, color: "text-primary", to: "/wardrobe" },
    { icon: Sparkles, label: "Possible Combos", value: Math.max(0, Math.floor(items.length * 1.5)), color: "text-accent", to: "/mix-match" },
    { icon: Heart, label: "Saved Looks", value: savedOutfits.length, color: "text-destructive", to: "/saved" },
    { icon: CalendarDays, label: "Planned Days", value: 0, color: "text-primary", to: "/planner" },
  ];

  const recentItems = items.slice(-4).reverse();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-20 pb-24 md:pb-8 px-4 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">StyleMate</span>
          </h1>
          <p className="text-muted-foreground">Your smart wardrobe assistant & outfit planner</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className="bg-card rounded-2xl border border-border p-4 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <s.icon size={24} className={s.color} />
              <p className="text-2xl font-bold mt-2">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/wardrobe"
            className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 hover:shadow-lg transition-all group"
          >
            <Shirt size={28} className="text-primary mb-3" />
            <h3 className="font-display text-lg font-semibold">Build Your Wardrobe</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload your clothes to get personalized outfit suggestions</p>
          </Link>
          <Link
            to="/mix-match"
            className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 p-6 hover:shadow-lg transition-all group"
          >
            <Sparkles size={28} className="text-accent mb-3" />
            <h3 className="font-display text-lg font-semibold">Mix & Match</h3>
            <p className="text-sm text-muted-foreground mt-1">Manually combine pieces or get smart suggestions</p>
          </Link>
        </div>

        {/* Recent items */}
        {recentItems.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Recently Added</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentItems.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-16">
            <Shirt size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">Your wardrobe is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Start by adding your clothing items</p>
            <Link
              to="/wardrobe"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Shirt size={16} /> Go to Wardrobe
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
