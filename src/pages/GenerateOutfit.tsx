import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Download, Loader2, RotateCcw, Heart, Clock,
} from "lucide-react";
import {
  generateRandomOutfit,
  generateAIDescription,
  occasions,
  colors as colorOptions,
  fabrics as fabricOptions,
  type Outfit,
} from "@/data/outfitDataset";

const HISTORY_KEY = "dressify-outfit-history";

function loadHistory(): Outfit[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(items: Outfit[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
}

export default function GenerateOutfit() {
  const { toast } = useToast();

  const [gender, setGender] = useState<"women" | "men">("women");
  const [occasion, setOccasion] = useState("");
  const [color, setColor] = useState("");
  const [fabric, setFabric] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Outfit | null>(null);
  const [aiDescription, setAiDescription] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [imgError, setImgError] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setResult(null);
    setAiDescription("");
    setImgError(false);

    // Fake 2-second loading
    setTimeout(() => {
      const outfit = generateRandomOutfit({ gender, occasion, color, fabric });
      const desc = generateAIDescription(outfit);
      setResult(outfit);
      setAiDescription(desc);
      setIsGenerating(false);

      // Save to history
      const hist = loadHistory();
      hist.unshift(outfit);
      saveHistory(hist);

      toast({ title: "✨ Outfit Generated!", description: "Your AI-powered outfit is ready." });
    }, 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `${result.title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
    link.target = "_blank";
    link.click();
    toast({ title: "Download started!" });
  };

  const toggleFavorite = () => {
    if (!result) return;
    setFavorites((prev) =>
      prev.includes(result.id) ? prev.filter((f) => f !== result.id) : [...prev, result.id]
    );
  };

  const selectClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`;

  return (
    <MainLayout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2 animate-fade-in">
            AI Outfit Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your preferences and generate unlimited outfits instantly
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 space-y-5 animate-fade-in">
          {/* Gender */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Gender</label>
            <div className="flex gap-2">
              {(["women", "men"] as const).map((g) => (
                <button key={g} onClick={() => setGender(g)} className={selectClass(gender === g)}>
                  {g === "women" ? "👩 Women" : "👨 Men"}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Occasion</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setOccasion("")} className={selectClass(!occasion)}>All</button>
              {occasions.map((o) => (
                <button key={o} onClick={() => setOccasion(o)} className={selectClass(occasion === o)}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Color Preference</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setColor("")} className={selectClass(!color)}>Any</button>
              {colorOptions.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={selectClass(color === c)}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Fabric</label>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFabric("")} className={selectClass(!fabric)}>Any</button>
              {fabricOptions.map((f) => (
                <button key={f} onClick={() => setFabric(f)} className={selectClass(fabric === f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-14 text-lg font-bold burgundy-gradient border-none text-primary-foreground rounded-full mt-2"
          >
            {isGenerating ? (
              <><Loader2 size={22} className="mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={22} className="mr-2" /> Generate Outfit</>
            )}
          </Button>
        </div>

        {/* Result */}
        {isGenerating && (
          <div className="flex flex-col items-center py-16 animate-fade-in">
            <div className="relative">
              <Loader2 size={56} className="animate-spin text-primary" />
              <Sparkles size={20} className="absolute -top-1 -right-1 text-accent animate-pulse" />
            </div>
            <p className="mt-4 text-muted-foreground font-medium">AI is curating your perfect outfit...</p>
            <p className="text-sm text-muted-foreground mt-1">Analyzing style preferences & trends</p>
          </div>
        )}

        {result && !isGenerating && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-[3/4] bg-muted">
                {!imgError ? (
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="text-center">
                      <span className="text-6xl">👗</span>
                      <p className="text-sm text-muted-foreground mt-2">{result.title}</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition"
                  >
                    <Heart
                      size={18}
                      className={favorites.includes(result.id) ? "fill-destructive text-destructive" : "text-foreground"}
                    />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold capitalize">
                      {result.occasion}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold capitalize">
                      {result.fabric}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-2">{result.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{result.description}</p>

                  {/* AI Description */}
                  <div className="bg-muted/50 rounded-xl p-4 mb-4">
                    <p className="text-sm leading-relaxed">{aiDescription}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground capitalize">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button onClick={handleGenerate} variant="outline" className="flex-1 rounded-full gap-2">
                    <RotateCcw size={16} /> New Outfit
                  </Button>
                  <Button onClick={handleDownload} className="flex-1 burgundy-gradient border-none text-primary-foreground rounded-full gap-2">
                    <Download size={16} /> Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
