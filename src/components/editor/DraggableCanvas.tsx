import { useState, useRef, useCallback, forwardRef } from "react";
import { PlacedElement, designElements } from "./designElements";
import { getGarmentMaskConfig } from "./garmentMasks";
import { FabricPattern } from "./fabricPatterns";
import { Trash2, RotateCw, Minus, Plus } from "lucide-react";

interface Props {
  imageSrc: string;
  imageAlt: string;
  placedElements: PlacedElement[];
  onElementsChange: (elements: PlacedElement[]) => void;
  colors: { body: string; sleeve: string; border: string };
  categoryId?: string;
  activePart?: string;
  patterns?: { body: FabricPattern | null; sleeve: FabricPattern | null; border: FabricPattern | null };
}

const DraggableCanvas = forwardRef<HTMLDivElement, Props>(
  ({ imageSrc, imageAlt, placedElements, onElementsChange, colors, categoryId = "", activePart, patterns }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const maskConfig = getGarmentMaskConfig(categoryId);

    const getPercent = useCallback((clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 50, y: 50 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      };
    }, []);

    const handlePointerDown = (e: React.PointerEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();
      setSelectedId(id);
      setDragging(id);
      const el = placedElements.find((p) => p.id === id);
      if (el && canvasRef.current) {
        const pct = getPercent(e.clientX, e.clientY);
        setDragOffset({ x: pct.x - el.x, y: pct.y - el.y });
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!dragging) return;
      const pct = getPercent(e.clientX, e.clientY);
      onElementsChange(
        placedElements.map((el) =>
          el.id === dragging ? { ...el, x: pct.x - dragOffset.x, y: pct.y - dragOffset.y } : el
        )
      );
    };

    const handlePointerUp = () => setDragging(null);

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const elementId = e.dataTransfer.getData("elementId");
      const element = designElements.find((d) => d.id === elementId);
      if (!element) return;
      const pct = getPercent(e.clientX, e.clientY);
      const newEl: PlacedElement = {
        id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        elementId: element.id,
        x: pct.x,
        y: pct.y,
        size: element.defaultSize,
        rotation: 0,
        color: colors.body,
        opacity: 0.8,
      };
      onElementsChange([...placedElements, newEl]);
      setSelectedId(newEl.id);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const updateSelected = (updates: Partial<PlacedElement>) => {
      if (!selectedId) return;
      onElementsChange(placedElements.map((el) => (el.id === selectedId ? { ...el, ...updates } : el)));
    };

    const deleteSelected = () => {
      if (!selectedId) return;
      onElementsChange(placedElements.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    };

    const selectedElement = placedElements.find((el) => el.id === selectedId);


    return (
      <div className="space-y-3">
        <div
          ref={(node) => {
            (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className="relative w-full aspect-[3/4] bg-card rounded-3xl shadow-sm border border-border overflow-hidden cursor-crosshair select-none"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={() => setSelectedId(null)}
        >
          {/* Base garment image */}
          <img src={imageSrc} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />

          {/* Subtle depth gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

          {/* Placed design elements */}
          {placedElements.map((el) => {
            const def = designElements.find((d) => d.id === el.elementId);
            if (!def) return null;
            const isSelected = el.id === selectedId;
            return (
              <div
                key={el.id}
                className={`absolute cursor-grab active:cursor-grabbing touch-none ${
                  isSelected ? "ring-2 ring-primary ring-offset-1 z-20" : "z-10"
                }`}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  width: `${el.size}px`,
                  height: `${el.size}px`,
                  transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                  color: el.color,
                  opacity: el.opacity,
                  filter: dragging === el.id ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : undefined,
                }}
                onPointerDown={(e) => handlePointerDown(e, el.id)}
                dangerouslySetInnerHTML={{ __html: def.svg }}
              />
            );
          })}
        </div>

        {/* Selected element controls */}
        {selectedElement && (
          <div className="bg-card rounded-xl border border-border p-3 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {designElements.find((d) => d.id === selectedElement.elementId)?.name}
              </span>
              <button onClick={deleteSelected} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12">Size</span>
              <button onClick={() => updateSelected({ size: Math.max(20, selectedElement.size - 5) })} className="p-1 rounded bg-muted"><Minus size={12} /></button>
              <input type="range" min={20} max={120} value={selectedElement.size} onChange={(e) => updateSelected({ size: Number(e.target.value) })} className="flex-1 h-1.5 accent-primary" />
              <button onClick={() => updateSelected({ size: Math.min(120, selectedElement.size + 5) })} className="p-1 rounded bg-muted"><Plus size={12} /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12">Rotate</span>
              <RotateCw size={12} className="text-muted-foreground" />
              <input type="range" min={0} max={360} value={selectedElement.rotation} onChange={(e) => updateSelected({ rotation: Number(e.target.value) })} className="flex-1 h-1.5 accent-primary" />
              <span className="text-xs text-muted-foreground w-8">{selectedElement.rotation}°</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12">Color</span>
              <input type="color" value={selectedElement.color} onChange={(e) => updateSelected({ color: e.target.value })} className="w-7 h-7 rounded cursor-pointer border-0" />
              <div className="flex gap-1">
                {["#D4A853", "#FFFFFF", "#FFD700", "#C0C0C0", "#8B1A4A", "#1A237E"].map((c) => (
                  <button key={c} onClick={() => updateSelected({ color: c })} className={`w-5 h-5 rounded-full border ${selectedElement.color === c ? "border-primary ring-1 ring-primary" : "border-border"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-12">Opacity</span>
              <input type="range" min={10} max={100} value={selectedElement.opacity * 100} onChange={(e) => updateSelected({ opacity: Number(e.target.value) / 100 })} className="flex-1 h-1.5 accent-primary" />
              <span className="text-xs text-muted-foreground w-8">{Math.round(selectedElement.opacity * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DraggableCanvas.displayName = "DraggableCanvas";
export default DraggableCanvas;
