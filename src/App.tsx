import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Designs from "./pages/Designs";
import Editor from "./pages/Editor";
import Canvas from "./pages/Canvas";
import FinalView from "./pages/FinalView";
import SavedDesigns from "./pages/SavedDesigns";
import Feedback from "./pages/Feedback";
import DesignStudio from "./pages/DesignStudio";
import GenerateOutfit from "./pages/GenerateOutfit";
import TryOn from "./pages/TryOn";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/categories/:gender" element={<Categories />} />
            <Route path="/designs/:gender/:categoryId" element={<Designs />} />
            <Route path="/editor/:designId" element={<Editor />} />
            <Route path="/canvas/:savedId" element={<Canvas />} />
            <Route path="/final/:savedId" element={<FinalView />} />
            <Route path="/saved" element={<SavedDesigns />} />
            <Route path="/saved-designs" element={<SavedDesigns />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/design-studio" element={<DesignStudio />} />
            <Route path="/generate" element={<GenerateOutfit />} />
            <Route path="/tryon" element={<TryOn />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
