import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { designs, categories } from "@/data/designs";

export default function Designs() {
  const { gender, categoryId } = useParams<{ gender: string; categoryId: string }>();
  const navigate = useNavigate();
  const filtered = designs.filter((d) => d.categoryId === categoryId);
  const category = categories.find((c) => c.id === categoryId);

  return (
    <MainLayout>
      <div className="p-6 lg:p-10">
        <button
          onClick={() => navigate(`/categories/${gender}`)}
          className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
        >
          ← Back to categories
        </button>
        <h1 className="font-display text-4xl font-bold mb-2 animate-fade-in">
          {category?.name || "Designs"}
        </h1>
        <p className="text-muted-foreground mb-8">{filtered.length} designs available</p>

        <div className="grid grid-cols-3 gap-4">
          {filtered.map((design, i) => (
            <button
              key={design.id}
              onClick={() => navigate(`/editor/${design.id}`)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] animate-fade-in"
              style={{ animationDelay: `${Math.min(i, 20) * 0.03}s` }}
            >
              <img
                src={design.image}
                alt={design.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <h3 className="font-medium text-sm text-white mb-0.5">{design.name}</h3>
                <p className="text-xs text-white/70 capitalize">{design.pattern} · {design.fabric}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
