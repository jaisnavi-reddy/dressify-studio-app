import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/stylemate/Dashboard";
import Wardrobe from "./pages/stylemate/Wardrobe";
import MixMatch from "./pages/stylemate/MixMatch";
import Planner from "./pages/stylemate/Planner";
import SavedLooks from "./pages/stylemate/SavedLooks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/mix-match" element={<MixMatch />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/saved" element={<SavedLooks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
