import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AnnonceForm from '@/pages/admin/AnnonceForm';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ── Pages publiques ── */}
          <Route path="/" element={<Index />} />
          <Route path="/biens" element={<Properties />} />
          <Route path="/bien/:id" element={<PropertyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />

          {/* ── Espace Admin ── */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          // Dans les Routes, après /admin/dashboard :
<Route path="/admin/annonces/new" element={
  <PrivateRoute><AnnonceForm /></PrivateRoute>
} />
<Route path="/admin/annonces/:id/edit" element={
  <PrivateRoute><AnnonceForm /></PrivateRoute>
} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;