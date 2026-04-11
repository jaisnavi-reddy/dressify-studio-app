import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SavedDesign, Measurements, FabricInfo } from "@/data/designs";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

interface AppState {
  isLoggedIn: boolean;
  userName: string;
  user: SupaUser | null;
  savedDesigns: SavedDesign[];
  logout: () => void;
  saveDesign: (design: SavedDesign) => void;
  updateDesignMeasurements: (id: string, measurements: Measurements, fabricInfo: FabricInfo) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<SupaUser | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.name || session.user.email || "");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserName("");
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        setUserName(session.user.user_metadata?.name || session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName("");
    setUser(null);
  };

  const saveDesign = (design: SavedDesign) => {
    setSavedDesigns((prev) => {
      const exists = prev.findIndex((d) => d.id === design.id);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = design;
        return updated;
      }
      return [...prev, design];
    });
  };

  const updateDesignMeasurements = (id: string, measurements: Measurements, fabricInfo: FabricInfo) => {
    setSavedDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, measurements, fabricInfo } : d))
    );
  };

  return (
    <AppContext.Provider value={{ isLoggedIn, userName, user, savedDesigns, logout, saveDesign, updateDesignMeasurements }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
