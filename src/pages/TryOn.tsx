import { useState, useRef, useCallback } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Shirt, Download, RotateCcw, Move, ZoomIn, ZoomOut } from "lucide-react";

const outfitOverlays = [
  { id: "saree", label: "Saree", emoji: "🥻", color: "#8B1A4A" },
  { id: "lehenga", label: "Lehenga", emoji: "👗", color: "#D4A853" },
  { id: "dress", label: "Dress", emoji: "👗", color: "#E91E63" },
  { id: "kurta-m", label: "Kurta", emoji: "🥼", color: "#1A3A5C" },
  { id: "shirt", label: "Shirt", emoji: "👔", color: "#2196F3" },
  { id: "suit", label: "Suit", emoji: "🤵", color: "#212121" },
  { id: "blouse", label: "Blouse", emoji: "👚", color: "#9C27B0" },
  { id: "jacket", label: "Jacket", emoji: "🧥", color: "#795548" },
];

export default function TryOn() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayY, setOverlayY] = useState(0.3);
  const [overlayOpacity, setOverlayOpacity] = useState(0.7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUserImage(reader.result as string);
      toast({ title: "Photo uploaded!", description: "Now select an outfit to try on." });
    };
    reader.readAsDataURL(file);
  };

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userImage) return;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 600;
      // Draw user image
      const scale = Math.min(400 / img.width, 600 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, 400, 600);
      ctx.drawImage(img, (400 - w) / 2, (600 - h) / 2, w, h);

      // Overlay outfit shape
      if (selectedOutfit) {
        const outfit = outfitOverlays.find((o) => o.id === selectedOutfit);
        if (outfit) {
          ctx.save();
          ctx.globalAlpha = overlayOpacity;

          const ow = 220 * overlayScale;
          const oh = 300 * overlayScale;
          const ox = (400 - ow) / 2;
          const oy = 600 * overlayY;

          // Gradient fill for outfit
          const grad = ctx.createLinearGradient(ox, oy, ox + ow, oy + oh);
          grad.addColorStop(0, outfit.color + "CC");
          grad.addColorStop(1, outfit.color + "88");
          ctx.fillStyle = grad;

          // Draw outfit shape
          ctx.beginPath();
          if (["saree", "lehenga", "dress"].includes(outfit.id)) {
            // Flowing dress shape
            ctx.moveTo(ox + ow * 0.3, oy);
            ctx.quadraticCurveTo(ox + ow * 0.1, oy + oh * 0.3, ox, oy + oh);
            ctx.lineTo(ox + ow, oy + oh);
            ctx.quadraticCurveTo(ox + ow * 0.9, oy + oh * 0.3, ox + ow * 0.7, oy);
            ctx.closePath();
          } else if (["shirt", "kurta-m", "blouse"].includes(outfit.id)) {
            // Top shape
            ctx.moveTo(ox + ow * 0.25, oy);
            ctx.lineTo(ox + ow * 0.1, oy + oh * 0.15);
            ctx.lineTo(ox, oy + oh * 0.2);
            ctx.lineTo(ox + ow * 0.15, oy + oh * 0.25);
            ctx.lineTo(ox + ow * 0.12, oy + oh);
            ctx.lineTo(ox + ow * 0.88, oy + oh);
            ctx.lineTo(ox + ow * 0.85, oy + oh * 0.25);
            ctx.lineTo(ox + ow, oy + oh * 0.2);
            ctx.lineTo(ox + ow * 0.9, oy + oh * 0.15);
            ctx.lineTo(ox + ow * 0.75, oy);
            ctx.closePath();
          } else {
            // Jacket/suit shape
            ctx.roundRect(ox, oy, ow, oh, 12);
          }
          ctx.fill();

          // Add pattern overlay
          ctx.globalAlpha = 0.15;
          for (let py = oy; py < oy + oh; py += 12) {
            ctx.beginPath();
            ctx.moveTo(ox, py);
            ctx.lineTo(ox + ow, py);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          ctx.restore();
        }
      }
    };
    img.src = userImage;
  }, [userImage, selectedOutfit, overlayScale, overlayY, overlayOpacity]);

  // Redraw when params change
  useState(() => { drawPreview(); });
  // Use effect for redraw
  import("react").then(() => {});

  const handleDownload = () => {
    drawPreview();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "dressify-tryon.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Downloaded!" });
    }, 300);
  };

  // Trigger redraw on state changes
  const redraw = () => setTimeout(drawPreview, 50);

  return (
    <MainLayout>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2 animate-fade-in">
            Virtual Try-On
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your photo and see outfits on you — no AI needed!
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px_1fr] gap-6">
          {/* Left — Upload & Outfit Selection */}
          <div className="space-y-5">
            {/* Upload */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Upload size={18} /> Upload Your Photo
              </h3>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full h-12 rounded-xl gap-2"
              >
                📷 {userImage ? "Change Photo" : "Choose Photo"}
              </Button>
              {userImage && (
                <div className="mt-3 rounded-xl overflow-hidden border border-border">
                  <img src={userImage} alt="Your photo" className="w-full h-40 object-cover" />
                </div>
              )}
            </div>

            {/* Outfit Selection */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <Shirt size={18} /> Select Outfit
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {outfitOverlays.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => { setSelectedOutfit(o.id); redraw(); }}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedOutfit === o.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="text-lg">{o.emoji}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center — Preview Canvas */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preview</h3>
            <div className="relative bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              {userImage ? (
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{ width: 400, height: 600 }}
                />
              ) : (
                <div className="w-[400px] h-[600px] flex flex-col items-center justify-center bg-muted/50">
                  <span className="text-6xl mb-4">📸</span>
                  <p className="text-muted-foreground text-center px-8">
                    Upload a photo to see<br />the virtual try-on preview
                  </p>
                </div>
              )}
            </div>
            {userImage && (
              <div className="flex gap-3 mt-4">
                <Button onClick={() => { drawPreview(); }} variant="outline" size="sm" className="rounded-full gap-1">
                  <RotateCcw size={14} /> Refresh
                </Button>
                <Button onClick={handleDownload} size="sm" className="burgundy-gradient border-none text-primary-foreground rounded-full gap-1">
                  <Download size={14} /> Download
                </Button>
              </div>
            )}
          </div>

          {/* Right — Adjustments */}
          <div className="space-y-5">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Move size={18} /> Adjust Overlay
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1"><ZoomIn size={14} /> Size</span>
                    <span className="font-mono text-xs">{(overlayScale * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range" min={0.5} max={2} step={0.05} value={overlayScale}
                    onChange={(e) => { setOverlayScale(+e.target.value); redraw(); }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground flex items-center justify-between mb-1">
                    <span>Position</span>
                    <span className="font-mono text-xs">{(overlayY * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range" min={0} max={0.6} step={0.02} value={overlayY}
                    onChange={(e) => { setOverlayY(+e.target.value); redraw(); }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground flex items-center justify-between mb-1">
                    <span>Opacity</span>
                    <span className="font-mono text-xs">{(overlayOpacity * 100).toFixed(0)}%</span>
                  </label>
                  <input
                    type="range" min={0.2} max={1} step={0.05} value={overlayOpacity}
                    onChange={(e) => { setOverlayOpacity(+e.target.value); redraw(); }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {selectedOutfit && (
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> Adjust the size and position sliders to align the outfit overlay with your body in the photo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
