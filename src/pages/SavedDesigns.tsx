import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Download, Eye, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DbDesign {
  id: string;
  title: string;
  design_data: any;
  created_at: string;
}

export default function SavedDesigns() {
  const { isLoggedIn, user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<DbDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }
    loadDesigns();
  }, [isLoggedIn, user]);

  const loadDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_designs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDesigns(data || []);
    } catch (err) {
      console.error("Failed to load designs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("saved_designs").delete().eq("id", id);
      if (error) throw error;
      setDesigns(prev => prev.filter(d => d.id !== id));
      toast({ title: "Design deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDownload = (design: DbDesign) => {
    const imageUrl = design.design_data?.generatedImageUrl || design.design_data?.sketchDataUrl;
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.download = `${design.title}.png`;
    link.href = imageUrl;
    link.click();
    toast({ title: "Downloaded!" });
  };

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="p-8 text-center py-20">
          <p className="text-5xl mb-4">🔒</p>
          <h3 className="font-display text-xl font-semibold mb-2">Please log in</h3>
          <p className="text-muted-foreground mb-6">You need to be logged in to view saved designs.</p>
          <button onClick={() => navigate("/auth")} className="text-primary font-semibold hover:underline">Log In →</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8 lg:p-12">
        <h1 className="font-display text-4xl font-bold mb-2 animate-fade-in">Saved Designs</h1>
        <p className="text-muted-foreground mb-10">Your customized outfits</p>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading your designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✨</p>
            <h3 className="font-display text-xl font-semibold mb-2">No saved designs yet</h3>
            <p className="text-muted-foreground mb-6">Start designing in the Design Studio!</p>
            <button onClick={() => navigate("/design-studio")} className="text-primary font-semibold hover:underline">
              Open Design Studio →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => {
              const imageUrl = design.design_data?.generatedImageUrl || design.design_data?.sketchDataUrl;
              return (
                <div
                  key={design.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full aspect-[3/4] bg-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={design.title}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold mb-1">{design.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize mb-1">
                      {design.design_data?.fabric || "Custom"} • {design.design_data?.gender || ""}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {new Date(design.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(design)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
