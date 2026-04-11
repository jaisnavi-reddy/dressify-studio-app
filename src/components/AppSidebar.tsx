import { Search, User, MessageSquare, Save, LogOut, Home, Paintbrush } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, logout, savedDesigns } = useApp();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (q.includes("women") || q.includes("woman")) navigate("/categories/women");
    else if (q.includes("men") || q.includes("man")) navigate("/categories/men");
    else if (q) navigate(`/categories/women`);
  };

  const isActive = (path: string) => location.pathname === path;

  const navBtn = (path: string, label: string, Icon: any) => (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(path)
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-[220px] min-h-screen bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <h1
          className="font-display text-xl font-bold text-sidebar-primary cursor-pointer"
          onClick={() => navigate("/home")}
        >
          ✦ Dressify
        </h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <form onSubmit={handleSearch} className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-foreground/40" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-sidebar-accent/50 rounded-lg text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 border-none outline-none focus:ring-1 focus:ring-sidebar-ring"
          />
        </form>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navBtn("/home", "Home", Home)}
        {navBtn("/design-studio", "Design Studio", Paintbrush)}
        {navBtn("/categories/women", "Women", () => <span className="text-base">👩</span>)}
        {navBtn("/categories/men", "Men", () => <span className="text-base">👨</span>)}
        {navBtn("/saved", "Saved Designs", Save)}
        {savedDesigns.length > 0 && (
          <span className="ml-9 text-xs text-sidebar-primary">{savedDesigns.length} saved</span>
        )}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-sm font-medium truncate">{userName || "User"}</span>
        </div>
        {navBtn("/feedback", "Feedback", MessageSquare)}
        <button
          onClick={async () => { await logout(); navigate("/"); }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-destructive transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
