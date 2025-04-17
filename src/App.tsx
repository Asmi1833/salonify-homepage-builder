
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasRole, isSessionExpired, UserRole } from "./utils/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Locations from "./pages/Locations";
import LocationBooking from "./pages/LocationBooking";
import Recommendations from "./pages/Recommendations";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import StaffPanel from "./pages/StaffPanel";
import ManagerPanel from "./pages/ManagerPanel";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // Check for expired session
  if (isSessionExpired()) {
    toast({
      title: "Session expired",
      description: "Your session has expired. Please login again.",
      variant: "destructive"
    });
    return <Navigate to="/login" replace />;
  }
  
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Role-based route component
const RoleRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: UserRole[] }) => {
  // Check for expired session
  if (isSessionExpired()) {
    toast({
      title: "Session expired",
      description: "Your session has expired. Please login again.",
      variant: "destructive"
    });
    return <Navigate to="/login" replace />;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const hasAllowedRole = hasRole(allowedRoles);
  
  if (!hasAllowedRole) {
    toast({
      title: "Access denied",
      description: `You need ${allowedRoles.join(' or ')} privileges to access this area.`,
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin route component
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  return (
    <RoleRoute allowedRoles={['admin']}>
      {children}
    </RoleRoute>
  );
};

// Staff route component
const StaffRoute = ({ children }: { children: JSX.Element }) => {
  return (
    <RoleRoute allowedRoles={['staff']}>
      {children}
    </RoleRoute>
  );
};

// Manager route component
const ManagerRoute = ({ children }: { children: JSX.Element }) => {
  return (
    <RoleRoute allowedRoles={['manager']}>
      {children}
    </RoleRoute>
  );
};

// Session checker component to check for expired sessions
const SessionChecker = () => {
  useEffect(() => {
    if (isSessionExpired() && isAuthenticated()) {
      // Clean up expired session
      localStorage.removeItem('salonifyUser');
    }
  }, []);
  
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionChecker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/book/:locationId" element={<LocationBooking />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="/manager" element={
            <ManagerRoute>
              <ManagerPanel />
            </ManagerRoute>
          } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          } />
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
