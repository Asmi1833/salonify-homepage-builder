
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
import { toast } from '@/components/ui/use-toast';
import { UserPlus, Lock } from 'lucide-react';

// We'll store admin credentials in localStorage
const ADMIN_STORAGE_KEY = 'salonAdminUsers';

const Admin: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('salonAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    // Validate inputs
    if (!fullName || !username || !password || !confirmPassword) {
      setSignupError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }

    // Get existing admins or initialize empty array
    const existingAdmins = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || '[]');
    
    // Check if username already exists
    if (existingAdmins.some((admin: any) => admin.username === username)) {
      setSignupError('Username already exists');
      return;
    }

    // Add new admin
    const newAdmin = {
      fullName,
      username,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify([...existingAdmins, newAdmin]));
    
    // Set as authenticated
    localStorage.setItem('salonAdminAuth', 'true');
    localStorage.setItem('currentAdminUser', username);
    
    setIsAuthenticated(true);
    
    // Show success message
    toast({
      title: "Admin account created",
      description: "You've successfully created an admin account and logged in.",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('salonAdminAuth');
    localStorage.removeItem('currentAdminUser');
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
                <UserPlus className="h-8 w-8 text-salon" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold">Create Admin Account</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign up to access the admin dashboard
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              {signupError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {signupError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-salon hover:bg-salon-dark text-white"
              >
                Create Account & Login
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
