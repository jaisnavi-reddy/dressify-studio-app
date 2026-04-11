import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { designs } from "@/data/designs";
import { Download, Ruler, Layers, ArrowLeft } from "lucide-react";

export default function FinalView() {
  const { savedId } = useParams<{ savedId: string }>();
  const navigate = useNavigate();
  const { savedDesigns } = useApp();
  const saved = savedDesigns.find((d) => d.id === savedId);
  const printRef = useRef<HTMLDivElement>(null);

  if (!saved || !saved.measurements || !saved.fabricInfo) {
    return (
      <MainLayout>
        <div className="p-12">
          Design not ready. <button onClick={() => navigate("/saved")} className="text-primary underline">View saved</button>
        </div>
      </MainLayout>
    );
  }

  const design = designs.find((d) => d.id === saved.designId);

  const handleDownload = () => {
    const content = `
DRESSIFY - Custom Design Report
================================
Design: ${saved.name}
Pattern: ${saved.pattern}
Colors: Body ${saved.colors.body}, Sleeve ${saved.colors.sleeve}, Border ${saved.colors.border}

MEASUREMENTS
============
Chest: ${saved.measurements.chest} cm
Waist: ${saved.measurements.waist} cm
Hips: ${saved.measurements.hips} cm
Shoulder: ${saved.measurements.shoulder} cm
Arm Length: ${saved.measurements.armLength} cm
Height: ${saved.measurements.height} cm
Inseam: ${saved.measurements.inseam} cm

FABRIC REQUIREMENTS
===================
Fabric Type: ${saved.fabricInfo.fabricType}
Total Fabric: ${saved.fabricInfo.totalMeters} meters

Breakdown:
${saved.fabricInfo.breakdown.map((b) => `  ${b.part}: ${b.meters} meters`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dressify-${saved.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="p-8 lg:p-12 max-w-5xl">
        <button onClick={() => navigate("/saved")} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Saved
        </button>

        <div ref={printRef}>
          <h1 className="font-display text-3xl font-bold mb-8 animate-fade-in">Your Final Design</h1>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Design Preview — real image */}
            <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
              <div className="relative w-full aspect-[3/4]">
                <img
                  src={design?.image || ""}
                  alt={saved.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundColor: saved.colors.body }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-display text-xl font-semibold">{saved.name}</h3>
                <p className="text-sm text-muted-foreground capitalize mt-1">{saved.pattern} pattern</p>
                <div className="flex justify-center gap-3 mt-3">
                  {Object.entries(saved.colors).map(([part, color]) => (
                    <div key={part} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full border-2 border-border shadow-sm" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-muted-foreground capitalize">{part}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-gold/10 rounded-2xl p-6 border border-gold/30">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-gold" /> Fabric Requirements
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fabric Type</span>
                    <span className="font-semibold">{saved.fabricInfo.fabricType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Fabric</span>
                    <span className="font-bold text-lg text-primary">{saved.fabricInfo.totalMeters} meters</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  {saved.fabricInfo.breakdown.map((b) => (
                    <div key={b.part} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{b.part}</span>
                      <span className="font-medium">{b.meters} m</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Ruler size={18} /> Your Measurements
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(saved.measurements).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{val} cm</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleDownload}
            className="h-14 px-12 text-lg font-semibold burgundy-gradient border-none text-primary-foreground rounded-full"
          >
            <Download className="mr-2" size={20} /> Download Design Report
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
