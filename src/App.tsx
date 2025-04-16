
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
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

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Admin route component
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem('salonifyUser') || '{}');
  const isAdmin = user?.role === 'admin';
  
  return isAuthenticated() && isAdmin ? 
    children : 
    <Navigate to="/" replace />;
};

// Staff route component
const StaffRoute = ({ children }: { children: JSX.Element }) => {
  const isStaff = !!localStorage.getItem('salonifyStaff');
  
  return isAuthenticated() && isStaff ? 
    children : 
    <Navigate to="/" replace />;
};

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
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="/locations" element={<Locations />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/staff-panel" element={
            <StaffRoute>
              <StaffPanel />
            </StaffRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
