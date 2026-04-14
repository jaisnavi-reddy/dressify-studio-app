import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Paintbrush, Sparkles, Camera, Save, Shirt } from "lucide-react";
import heroMan from "@/assets/hero-man.jpg";
import heroWoman from "@/assets/hero-woman.jpg";
import heroLehenga from "@/assets/hero-lehenga.jpg";

const slides = [
  { image: heroMan, title: "Men's Collection", subtitle: "Kurtas, Shirts & More", gender: "men" as const },
  { image: heroWoman, title: "Women's Collection", subtitle: "Sarees, Lehenga & More", gender: "women" as const },
  { image: heroLehenga, title: "Bridal Collection", subtitle: "Customize Your Dream Outfit", gender: "women" as const },
];

const features = [
  { icon: Sparkles, title: "AI Generator", desc: "Generate unlimited outfits instantly — no API needed" },
  { icon: Camera, title: "Virtual Try-On", desc: "Upload your photo & overlay outfits on yourself" },
  { icon: Paintbrush, title: "Design Studio", desc: "Sketch outfits with brush, pen & shape tools" },
  { icon: Save, title: "Save & History", desc: "Track all generated outfits with local history" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <MainLayout>
      <div className="flex flex-col">
        {/* Hero Carousel */}
        <div className="relative h-[70vh] min-h-[400px] overflow-hidden">
          {slides.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
              <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              <div className="hero-overlay absolute inset-0" />
            </div>
          ))}
          <div className="absolute inset-0 flex items-center z-10 px-12">
            <div className="max-w-lg animate-fade-in" key={current}>
              <h2 className="font-display text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">{slide.title}</h2>
              <p className="text-primary-foreground/80 text-xl mb-8">{slide.subtitle}</p>
              <Button onClick={() => navigate(`/categories/${slide.gender}`)} className="h-14 px-10 text-lg font-semibold gold-gradient border-none text-secondary-foreground hover:opacity-90 rounded-full">
                Explore Now
              </Button>
            </div>
          </div>
          <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-primary-foreground hover:bg-background/40 transition">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-primary-foreground hover:bg-background/40 transition">
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-gold" : "w-2 bg-primary-foreground/40"}`} />
            ))}
          </div>
        </div>

        {/* Collections */}
        <section className="px-8 py-12">
          <h2 className="font-display text-3xl font-bold mb-6 text-foreground">Shop by Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { img: heroWoman, label: "Women's Collection", path: "/categories/women" },
              { img: heroMan, label: "Men's Collection", path: "/categories/men" },
            ].map((col) => (
              <button key={col.path} onClick={() => navigate(col.path)} className="relative h-64 rounded-2xl overflow-hidden group">
                <img src={col.img} alt={col.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
                <span className="absolute bottom-6 left-6 font-display text-2xl font-bold text-primary-foreground">{col.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Design Your Own Outfit */}
        <section className="px-8 py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider mb-3">
              <Sparkles size={16} /> New Feature
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Design Your Own Outfit
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Unleash your creativity with our fashion design studio. Sketch, color, add patterns, and bring your dream outfit to life.
            </p>
            <Button
              onClick={() => navigate("/design-studio")}
              className="h-16 px-12 text-xl font-bold burgundy-gradient border-none text-primary-foreground hover:opacity-90 rounded-full shadow-lg"
            >
              <Paintbrush className="mr-3" size={24} /> Start Designing
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-xl p-5 text-center border border-border hover:shadow-md transition-shadow">
                <f.icon className="mx-auto mb-3 text-accent" size={28} />
                <h4 className="font-display font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="px-8 py-12">
          <h2 className="font-display text-3xl font-bold mb-6 text-foreground text-center">Quick Actions</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => navigate("/generate")} className="burgundy-gradient border-none text-primary-foreground rounded-full gap-2 h-12 px-8">
              <Sparkles size={16} /> Generate Outfit
            </Button>
            <Button onClick={() => navigate("/tryon")} variant="outline" className="rounded-full gap-2 h-12 px-8">
              <Camera size={16} /> Virtual Try-On
            </Button>
            <Button onClick={() => navigate("/history")} variant="outline" className="rounded-full gap-2 h-12 px-8">
              <Save size={16} /> View History
            </Button>
            <Button variant="outline" onClick={() => navigate("/feedback")} className="rounded-full gap-2 h-12 px-8">
              <Shirt size={16} /> Feedback
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
