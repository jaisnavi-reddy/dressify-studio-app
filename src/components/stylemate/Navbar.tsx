import { NavLink } from "react-router-dom";
import { LayoutDashboard, Shirt, CalendarDays, Heart, Sparkles, Download } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/wardrobe", icon: Shirt, label: "Wardrobe" },
  { to: "/mix-match", icon: Sparkles, label: "Mix & Match" },
  { to: "/planner", icon: CalendarDays, label: "Planner" },
  { to: "/saved", icon: Heart, label: "Saved" },
];

export default function Navbar() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <>
      {/* Top bar - desktop */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border items-center px-6 gap-8">
        <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          StyleMate
        </h1>
        <nav className="flex gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        {installPrompt && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Download size={14} /> Install App
          </button>
        )}
      </header>

      {/* Bottom bar - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border flex justify-around py-2 px-1 safe-area-pb">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <l.icon size={20} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
