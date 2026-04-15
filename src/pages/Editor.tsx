import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { designs, availableColors } from "@/data/designs";
import { useApp } from "@/contexts/AppContext";
import { Save, Palette, Layers, Download, Sparkles, Shirt, Loader2 } from "lucide-react";
import DraggableCanvas from "@/components/editor/DraggableCanvas";
import PatternPanel from "@/components/editor/PatternPanel";
import { PlacedElement } from "@/components/editor/designElements";
import { getGarmentMaskConfig } from "@/components/editor/garmentMasks";
import { FabricPattern, getColorSuggestions } from "@/components/editor/fabricPatterns";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { generateRandomOutfit, generateAIDescription } from "@/data/outfitDataset";

type Part = "body" | "sleeve" | "border";

export default function Editor() {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  const { saveDesign } = useApp();
  const { toast } = useToast();
  const design = designs.find((d) => d.id === designId);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [colors, setColors] = useState(design?.colors || { body: "#8B1A4A", sleeve: "#A0285C", border: "#D4A853" });
  const [patterns, setPatterns] = useState<{ body: FabricPattern | null; sleeve: FabricPattern | null; border: FabricPattern | null }>({
    body: null, sleeve: null, border: null,
  });
  const [activePart, setActivePart] = useState<Part>("body");
  const [isEditing, setIsEditing] = useState(false);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);
  const [activeTab, setActiveTab] = useState<"colors" | "patterns">("colors");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ imageUrl: string; title: string; description: string; aiTip: string } | null>(null);

  if (!design) return <MainLayout><div className="p-12">Design not found</div></MainLayout>;

  const maskConfig = getGarmentMaskConfig(design.categoryId);
  const suggestions = getColorSuggestions(colors.body);

  const handleColorChange = (color: string) => {
    setColors((prev) => ({ ...prev, [activePart]: color }));
  };

  const handlePatternSelect = (pattern: FabricPattern | null) => {
    setPatterns((prev) => ({ ...prev, [activePart]: pattern }));
  };

  const applySuggestion = (type: "borders" | "sleeves", index: number) => {
    const color = type === "borders" ? suggestions.borders[index] : suggestions.sleeves[index];
    const part: Part = type === "borders" ? "border" : "sleeve";
    setColors((prev) => ({ ...prev, [part]: color }));
    toast({ title: "Color applied", description: `${part} color updated to ${color}` });
  };

  const handleSave = () => {
    const saved = {
      id: `saved-${Date.now()}`,
      designId: design.id,
      name: design.name,
      colors: { ...colors },
      pattern: patterns.body?.name || "custom",
      measurements: null,
      fabricInfo: null,
    };
    saveDesign(saved);
    toast({ title: "Design saved!", description: "Your customized design has been saved." });
    navigate(`/canvas/${saved.id}`);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `${design.name.replace(/\s+/g, "-").toLowerCase()}-design.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Downloaded!", description: "Your design has been saved as PNG." });
    } catch {
      toast({ title: "Download failed", description: "Could not export the design.", variant: "destructive" });
    }
  };

  /* ── AI Generate via Edge Function ── */
  const handleAIGenerate = async () => {
    if (!canvasRef.current) return;
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      // Capture current canvas with all color/pattern customizations
      const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2, backgroundColor: "#ffffff" });
      const sketchDataUrl = canvas.toDataURL("image/png");

      // Build descriptive color info
      const colorDescription = `Body: ${colors.body}, Sleeve: ${colors.sleeve}, Border: ${colors.border}`;
      const patternNames = Object.entries(patterns)
        .filter(([, p]) => p !== null)
        .map(([region, p]) => `${region}: ${p!.name}`)
        .join(", ");

      const { data, error } = await supabase.functions.invoke("generate-outfit", {
        body: {
          sketchDataUrl,
          outfitType: design.categoryId,
          gender: design.gender,
          fabric: design.fabric,
          colors: colorDescription,
          patterns: patternNames || "none",
          selectedRegion: activePart,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setGeneratedResult({
        imageUrl: data.imageUrl,
        title: `${design.name} – AI Generated`,
        description: data.description || `Custom ${design.categoryId} with your selected colors and patterns.`,
        aiTip: `Colors applied: ${colorDescription}. Region focus: ${activePart}.`,
      });
      toast({ title: "✨ Outfit Generated!", description: "Your customized outfit is ready!" });
    } catch (err: any) {
      console.error("AI generate error:", err);
      toast({ title: "Generation failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: "colors" as const, icon: Palette, label: "Colors" },
    { id: "patterns" as const, icon: Layers, label: "Patterns" },
  ];

  return (
    <MainLayout>
      <div className="p-4 lg:p-8 max-w-7xl">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-primary mb-3 inline-block">
          ← Back
        </button>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold">{design.name}</h1>
            <p className="text-muted-foreground capitalize text-sm">{design.fabric} · {design.categoryId}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="burgundy-gradient border-none text-primary-foreground">
                <Palette className="mr-2" size={18} /> Edit Design
              </Button>
            ) : (
              <>
                <Button onClick={handleAIGenerate} disabled={isGenerating} className="bg-gradient-to-r from-violet-600 to-purple-600 border-none text-white">
                  {isGenerating ? <Loader2 className="mr-2 animate-spin" size={18} /> : <Sparkles className="mr-2" size={18} />}
                  {isGenerating ? "Generating..." : "Generate Image"}
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-1.5" size={16} /> Download PNG
                </Button>
                <Button onClick={handleSave} className="gold-gradient border-none text-secondary-foreground">
                  <Save className="mr-2" size={18} /> Save Design
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Preview */}
          <div className="space-y-4">
            <DraggableCanvas
              ref={canvasRef}
              imageSrc={design.image}
              imageAlt={design.name}
              placedElements={placedElements}
              onElementsChange={setPlacedElements}
              colors={colors}
              categoryId={design.categoryId}
              activePart={isEditing ? activePart : undefined}
              patterns={patterns}
            />

            {/* Generated Result */}
            {(isGenerating || generatedResult) && (
              <div className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" /> AI Generated Result
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-muted flex items-center justify-center min-h-[300px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-3 py-12">
                      <Loader2 size={36} className="animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Generating your customized outfit...</p>
                      <p className="text-xs text-muted-foreground">Analyzing colors & patterns</p>
                    </div>
                  ) : generatedResult ? (
                    <div className="w-full">
                      <img
                        src={generatedResult.imageUrl}
                        alt={generatedResult.title}
                        className="w-full max-h-[500px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <button
                        onClick={() => setGeneratedResult(null)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-destructive"
                      >✕</button>
                    </div>
                  ) : null}
                </div>
                {generatedResult && (
                  <div className="mt-3 space-y-2">
                    <h4 className="font-display font-semibold">{generatedResult.title}</h4>
                    <p className="text-sm text-muted-foreground">{generatedResult.description}</p>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{generatedResult.aiTip}</p>
                    </div>
                    <Button onClick={handleAIGenerate} disabled={isGenerating} size="sm" className="burgundy-gradient border-none text-primary-foreground rounded-full gap-1.5 w-full mt-2">
                      <Sparkles size={14} /> Re-Generate
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-5 animate-fade-in overflow-y-auto max-h-[80vh]">
              {/* Tab switcher */}
              <div className="flex gap-1 bg-muted rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <tab.icon size={14} /> {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "patterns" && (
                <PatternPanel
                  activePart={maskConfig.parts.find((p) => p.id === activePart)?.label || activePart}
                  onPatternSelect={handlePatternSelect}
                  selectedPatternId={patterns[activePart]?.id}
                />
              )}

              {activeTab === "colors" && (
                <div className="space-y-5">
                  {/* Region Selector */}
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                      <Layers size={18} /> Select Region
                    </h3>
                    <div className="flex flex-col gap-2">
                      {maskConfig.parts.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => setActivePart(part.id as Part)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activePart === part.id
                              ? "burgundy-gradient text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full border-2 border-background shadow-sm shrink-0" style={{ backgroundColor: colors[part.id as Part] }} />
                          <span>{part.label}</span>
                          {activePart === part.id && <span className="ml-auto text-xs opacity-75">Active</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1 flex items-center gap-2">
                      <Palette size={18} /> Choose Color
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Applying to: <span className="font-semibold text-foreground">{maskConfig.parts.find((p) => p.id === activePart)?.label}</span>
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                            colors[activePart] === color ? "border-foreground scale-110 ring-2 ring-primary" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <label className="text-sm text-muted-foreground">Custom:</label>
                      <input type="color" value={colors[activePart]} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                      <span className="text-xs text-muted-foreground font-mono">{colors[activePart]}</span>
                    </div>
                  </div>

                  {/* AI Color Suggestions */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <button onClick={() => setShowSuggestions(!showSuggestions)} className="flex items-center gap-2 text-sm font-semibold w-full">
                      <Sparkles size={16} className="text-accent" /> Smart Color Suggestions
                      <span className="ml-auto text-xs text-muted-foreground">{showSuggestions ? "▲" : "▼"}</span>
                    </button>
                    {showSuggestions && (
                      <div className="mt-3 space-y-3 animate-fade-in">
                        <p className="text-xs text-muted-foreground">Based on your body color, try these combinations:</p>
                        <div>
                          <p className="text-xs font-medium mb-1.5">Suggested Border Colors</p>
                          <div className="flex gap-2">
                            {suggestions.borders.map((c, i) => (
                              <button key={i} onClick={() => applySuggestion("borders", i)} className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 hover:border-primary transition-all" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium mb-1.5">Suggested Sleeve Colors</p>
                          <div className="flex gap-2">
                            {suggestions.sleeves.map((c, i) => (
                              <button key={i} onClick={() => applySuggestion("sleeves", i)} className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 hover:border-primary transition-all" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Matching outfit tip */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Shirt size={16} className="text-accent" /> Matching Outfit Tip
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {design.gender === "women"
                        ? design.categoryId === "sarees"
                          ? "Try a contrasting blouse color with a gold or silver border for an elegant look."
                          : design.categoryId === "lehenga"
                          ? "Pair with a matching choli in a lighter shade and a contrasting dupatta."
                          : "Complement with matching bottom-wear in a neutral or analogous shade."
                        : design.categoryId === "shirts"
                        ? "Pair with dark trousers or chinos for a polished look."
                        : design.categoryId === "dhoti"
                        ? "Pair with a matching kurta in a complementary shade."
                        : "Match with coordinating pants in a darker or neutral shade."}
                    </p>
                  </div>

                  {/* Live color summary */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold mb-2">Current Colors</h4>
                    <div className="space-y-2">
                      {maskConfig.parts.map((part) => (
                        <div key={part.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{part.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: colors[part.id as Part] }} />
                            <span className="font-mono text-xs">{colors[part.id as Part]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-display text-lg font-semibold mb-4">Design Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium capitalize">{design.categoryId}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fabric</span><span className="font-medium">{design.fabric}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Colors</span>
                    <div className="flex gap-1">
                      {Object.values(colors).map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Click "Edit Design" to customize colors, apply fabric patterns, and generate AI images.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
