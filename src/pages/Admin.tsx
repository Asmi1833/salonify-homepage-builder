
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import AdminProducts from '@/components/AdminProducts';
import AdminLocations from '@/components/AdminLocations';
import { Lock } from 'lucide-react';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "salon123";

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('salonAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('salonAdminAuth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('salonAdminAuth');
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SalonNavbar />
        <main className="flex-grow flex items-center justify-center py-12">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-secondary/20 mx-auto">
                <Lock className="h-8 w-8 text-salon" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold">Admin Panel</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access the admin dashboard
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Invalid username or password. Please try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-salon hover:bg-salon-dark text-white"
              >
                Sign in
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">Manage your products and salon locations</p>
              </div>
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="mt-4 md:mt-0"
              >
                Logout
              </Button>
            </div>
            
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="locations">Salon Locations</TabsTrigger>
              </TabsList>
              <TabsContent value="products">
                <AdminProducts />
              </TabsContent>
              <TabsContent value="locations">
                <AdminLocations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
