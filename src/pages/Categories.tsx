import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { categories } from "@/data/designs";

export default function Categories() {
  const { gender } = useParams<{ gender: string }>();
  const navigate = useNavigate();
  const filtered = categories.filter((c) => c.gender === gender);
  const title = gender === "women" ? "Women's Collection" : "Men's Collection";

  return (
    <MainLayout>
      <div className="p-6 lg:p-10 w-full">
        <h1 className="font-display text-4xl font-bold mb-2 animate-fade-in">{title}</h1>
        <p className="text-muted-foreground mb-8">Choose a category to explore designs</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {filtered.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/designs/${gender}/${cat.id}`)}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in text-left flex flex-col h-full"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-full h-64 overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-center">
                <h3 className="font-display text-xl font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.designCount} designs</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
