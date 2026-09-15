import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import LocationDetail from "./pages/LocationDetail";
import Contact from "./pages/Contact";
import Locations from "./pages/Locations";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { ScrollProgress } from "./components/motion/ScrollProgress";

const queryClient = new QueryClient();
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
// VITE_ROUTER=hash lets the site run from a single file (previews) without a server.
const Router = import.meta.env.VITE_ROUTER === "hash" ? HashRouter : BrowserRouter;

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/models" element={<Locations />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/model/:id" element={<LocationDetail />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router basename={Router === BrowserRouter ? basename : undefined}>
        <ScrollToTop />
        <ScrollProgress />
        <AnimatedRoutes />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
