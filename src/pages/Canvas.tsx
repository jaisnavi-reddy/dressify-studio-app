import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { calculateFabric, designs, Measurements } from "@/data/designs";
import { Ruler, ArrowRight } from "lucide-react";

const fields: { key: keyof Measurements; label: string; unit: string }[] = [
  { key: "chest", label: "Chest", unit: "cm" },
  { key: "waist", label: "Waist", unit: "cm" },
  { key: "hips", label: "Hips", unit: "cm" },
  { key: "shoulder", label: "Shoulder Width", unit: "cm" },
  { key: "armLength", label: "Arm Length", unit: "cm" },
  { key: "height", label: "Height", unit: "cm" },
  { key: "inseam", label: "Inseam", unit: "cm" },
];

export default function Canvas() {
  const { savedId } = useParams<{ savedId: string }>();
  const navigate = useNavigate();
  const { savedDesigns, updateDesignMeasurements } = useApp();
  const saved = savedDesigns.find((d) => d.id === savedId);

  const [measurements, setMeasurements] = useState<Measurements>({
    chest: 0, waist: 0, hips: 0, shoulder: 0, armLength: 0, height: 0, inseam: 0,
  });

  if (!saved) return <MainLayout><div className="p-12">Saved design not found. <button onClick={() => navigate("/home")} className="text-primary underline">Go home</button></div></MainLayout>;

  const design = designs.find((d) => d.id === saved.designId);

  const handleChange = (key: keyof Measurements, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fabricInfo = calculateFabric(measurements, design?.categoryId || "");
    updateDesignMeasurements(saved.id, measurements, fabricInfo);
    navigate(`/final/${saved.id}`);
  };

  return (
    <MainLayout>
      <div className="p-8 lg:p-12 max-w-5xl">
        <h1 className="font-display text-3xl font-bold mb-2 animate-fade-in">Your Canvas</h1>
        <p className="text-muted-foreground mb-10">Review your design and enter measurements</p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Preview — real image */}
          <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
            <h3 className="font-display text-lg font-semibold p-6 pb-0 text-center">{saved.name}</h3>
            <div className="relative w-full aspect-[3/4] mt-4">
              <img
                src={design?.image || ""}
                alt={saved.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundColor: saved.colors.body }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground capitalize">Pattern: {saved.pattern}</p>
              <div className="flex justify-center gap-2 mt-2">
                {Object.entries(saved.colors).map(([part, color]) => (
                  <div key={part} className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                    <span className="text-xs text-muted-foreground capitalize">{part}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Measurements Form */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Ruler size={20} /> Enter Your Measurements
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium mb-1 block">{f.label}</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      value={measurements[f.key] || ""}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      className="pr-12"
                      required
                      min={1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {f.unit}
                    </span>
                  </div>
                </div>
              ))}
              <Button type="submit" className="w-full h-12 text-base font-semibold gold-gradient border-none text-secondary-foreground mt-6">
                Calculate Fabric <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
