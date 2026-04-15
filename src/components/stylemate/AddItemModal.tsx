import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ClothingItem,
  ClothingCategory,
  CLOTHING_TYPES,
  COLOR_OPTIONS,
  Occasion,
  Weather,
} from "@/types/wardrobe";
import { Camera, Upload } from "lucide-react";

const occasions: Occasion[] = ["casual", "party", "office", "wedding"];
const weathers: Weather[] = ["hot", "cold", "rainy", "mild"];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (item: ClothingItem) => void;
}

export default function AddItemModal({ open, onClose, onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("top");
  const [type, setType] = useState("");
  const [colorName, setColorName] = useState("Black");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(["casual"]);
  const [selectedWeather, setSelectedWeather] = useState<Weather[]>(["mild"]);

  const colorHex = COLOR_OPTIONS.find((c) => c.name === colorName)?.hex || "#1a1a1a";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleOccasion = (o: Occasion) =>
    setSelectedOccasions((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
    );

  const toggleWeather = (w: Weather) =>
    setSelectedWeather((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );

  const handleSubmit = () => {
    if (!name.trim() || !type || !imageUrl) return;
    onAdd({
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      color: colorHex,
      colorName,
      type,
      imageUrl,
      occasions: selectedOccasions,
      weather: selectedWeather,
      createdAt: Date.now(),
    });
    // Reset
    setName("");
    setCategory("top");
    setType("");
    setColorName("Black");
    setImageUrl("");
    setSelectedOccasions(["casual"]);
    setSelectedWeather(["mild"]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Add Clothing Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-full aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={32} className="text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Tap to upload photo</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Blue Denim Jacket" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v as ClothingCategory); setType(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CLOTHING_TYPES) as ClothingCategory[]).map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {CLOTHING_TYPES[category].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color */}
          <div>
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorName(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    colorName === c.name ? "border-foreground scale-110 ring-2 ring-primary" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <Label>Occasions</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {occasions.map((o) => (
                <button
                  key={o}
                  onClick={() => toggleOccasion(o)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    selectedOccasions.includes(o)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Weather */}
          <div>
            <Label>Weather</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {weathers.map((w) => (
                <button
                  key={w}
                  onClick={() => toggleWeather(w)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    selectedWeather.includes(w)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name || !type || !imageUrl} className="bg-primary text-primary-foreground">
            <Upload size={16} className="mr-1.5" /> Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
