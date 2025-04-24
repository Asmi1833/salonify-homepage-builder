
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAuthenticated, hasRole } from "./utils/auth";

// Import pages
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

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles }: { 
  children: JSX.Element, 
  requiredRoles?: UserRole[] 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        setIsAllowed(false);
        setIsLoading(false);
        return;
      }

      // If specific roles are required, check them
      if (requiredRoles) {
        const roleCheck = await hasRole(requiredRoles);
        setIsAllowed(roleCheck);
      } else {
        setIsAllowed(true);
      }

      setIsLoading(false);
    };

    checkAccess();
  }, [requiredRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isLoading && !isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const queryClient = new QueryClient();

const App = () => {
  return (
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
            <Route path="/locations" element={<Locations />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager" 
              element={
                <ProtectedRoute requiredRoles={['manager']}>
                  <ManagerPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff-panel" 
              element={
                <ProtectedRoute requiredRoles={['staff']}>
                  <StaffPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
