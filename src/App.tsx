
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Locations from "./pages/Locations";
import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import StaffPanel from "./pages/StaffPanel";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/staff-panel" element={<StaffPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
