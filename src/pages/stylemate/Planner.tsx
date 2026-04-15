import { useState, useMemo } from "react";
import Navbar from "@/components/stylemate/Navbar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClothingItem, Outfit, PlannedOutfit } from "@/types/wardrobe";
import { ChevronLeft, ChevronRight, Plus, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Planner() {
  const [items] = useLocalStorage<ClothingItem[]>("sm-wardrobe", []);
  const [savedOutfits] = useLocalStorage<Outfit[]>("sm-saved-outfits", []);
  const [planned, setPlanned] = useLocalStorage<PlannedOutfit[]>("sm-planned", []);
  const { toast } = useToast();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [assigningOutfit, setAssigningOutfit] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const plannedMap = useMemo(() => {
    const m: Record<string, string> = {};
    planned.forEach((p) => (m[p.date] = p.outfitId));
    return m;
  }, [planned]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const assignOutfit = (outfitId: string) => {
    if (!selectedDate) return;
    setPlanned((prev) => {
      const filtered = prev.filter((p) => p.date !== selectedDate);
      return [...filtered, { date: selectedDate, outfitId }];
    });
    setAssigningOutfit(false);
    toast({ title: "Outfit planned! 📅" });
  };

  const removeOutfit = (date: string) => {
    setPlanned((prev) => prev.filter((p) => p.date !== date));
  };

  const getOutfitPreview = (outfitId: string) => {
    const outfit = savedOutfits.find((o) => o.id === outfitId);
    if (!outfit) return null;
    const top = items.find((i) => i.id === outfit.topId);
    const bottom = items.find((i) => i.id === outfit.bottomId);
    return { outfit, top, bottom };
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-20 pb-24 md:pb-8 px-4 max-w-3xl mx-auto">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Outfit Planner</h1>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-display text-lg font-semibold">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasOutfit = !!plannedMap[dateStr];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const preview = hasOutfit ? getOutfitPreview(plannedMap[dateStr]) : null;

            return (
              <button
                key={day}
                onClick={() => { setSelectedDate(dateStr); setAssigningOutfit(false); }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : isToday
                    ? "bg-primary/10 text-primary font-bold"
                    : hasOutfit
                    ? "bg-accent/10 text-accent-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {day}
                {hasOutfit && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected date detail */}
        {selectedDate && (
          <div className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {plannedMap[selectedDate] ? (
              <div>
                {(() => {
                  const preview = getOutfitPreview(plannedMap[selectedDate]);
                  if (!preview) return <p className="text-sm text-muted-foreground">Outfit not found in saved looks</p>;
                  return (
                    <div className="flex gap-2">
                      {[preview.top, preview.bottom].filter(Boolean).map((item) => (
                        <div key={item!.id} className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img src={item!.imageUrl} alt={item!.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{preview.outfit.name}</p>
                        <button
                          onClick={() => removeOutfit(selectedDate)}
                          className="text-xs text-destructive mt-1 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div>
                {!assigningOutfit ? (
                  <button
                    onClick={() => setAssigningOutfit(true)}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Assign an outfit
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Pick a saved look:</p>
                    {savedOutfits.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No saved outfits yet. Save some from Mix & Match!</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {savedOutfits.map((outfit) => {
                          const top = items.find((i) => i.id === outfit.topId);
                          const bottom = items.find((i) => i.id === outfit.bottomId);
                          return (
                            <button
                              key={outfit.id}
                              onClick={() => assignOutfit(outfit.id)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                            >
                              <div className="flex -space-x-2">
                                {[top, bottom].filter(Boolean).map((item) => (
                                  <div key={item!.id} className="w-10 h-10 rounded-lg overflow-hidden bg-muted border-2 border-background">
                                    <img src={item!.imageUrl} alt="" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                              <span className="text-sm flex-1 truncate">{outfit.name}</span>
                              <Check size={16} className="text-muted-foreground" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
