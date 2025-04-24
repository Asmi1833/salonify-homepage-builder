import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import SalonifyLogo from '@/components/SalonifyLogo';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { 
  UserRole, 
  isSessionExpired, 
  loginUser, 
  userExists, 
  isValidEmail, 
  isValidPassword 
} from '@/utils/auth';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast as sonnerToast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [demoRole, setDemoRole] = useState<UserRole>('client');
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  useEffect(() => {
    if (isSessionExpired()) {
      localStorage.removeItem('salonifyUser');
      if (!redirectMessage) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
      }
    }
  }, [redirectMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Use the utility functions for validation
    const validEmail = isValidEmail(email);
    const validPassword = isValidPassword(password);

    setTimeout(() => {
      if (validEmail && validPassword) {
        // Check if user account exists - in demo mode we'll always allow access with specific roles
        const userAccountExists = demoMode || userExists(email);
        
        if (userAccountExists) {
          let role: UserRole = 'client';
          
          if (demoMode) {
            // Demo mode uses the selected role
            role = demoRole;
          } else {
            // Try to detect role from email
            if (email.includes('admin')) {
              role = 'admin';
            } else if (email.includes('staff')) {
              role = 'staff';
            } else if (email.includes('manager')) {
              role = 'manager';
            }
          }
          
          // Create user object
          const user = {
            id: `user-${Date.now()}`,
            email,
            name: email.split('@')[0].replace(/[.]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            profileImage: '',
            role,
            createdAt: new Date().toISOString()
          };
          
          loginUser(user);
          
          sonnerToast.success("Login successful", {
            description: `Welcome back! You are logged in as ${role}.`,
            duration: 3000
          });
          
          // Redirect based on role or previous location
          if (role === 'admin') {
            navigate('/admin');
          } else if (role === 'staff') {
            navigate('/staff-panel');
          } else if (role === 'manager') {
            navigate('/manager');
          } else if (redirectFrom) {
            navigate(redirectFrom);
          } else {
            navigate('/');
          }
        } else {
          // Account doesn't exist
          sonnerToast.error("Account not found", {
            description: "No account exists with this email. You need to sign up first.",
            duration: 5000
          });
          
          // Show a prompt to redirect to sign up page with a slight delay
          setTimeout(() => {
            sonnerToast.warning("Create an account", {
              description: "Would you like to create a new account with this email?",
              action: {
                label: "Sign up",
                onClick: () => navigate('/signup', { state: { email } })
              },
              duration: 10000,
            });
          }, 1000);
        }
      } else {
        // Show appropriate validation errors
        if (!validEmail) {
          sonnerToast.error("Invalid email", {
            description: "Please enter a valid email address",
            duration: 3000
          });
        } else if (!validPassword) {
          sonnerToast.error("Invalid password", {
            description: "Password must be at least 6 characters long",
            duration: 3000
          });
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <SalonifyLogo className="mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          {redirectMessage && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication required</AlertTitle>
              <AlertDescription>{redirectMessage}</AlertDescription>
            </Alert>
          )}
          
          {demoMode && (
            <div className="bg-slate-50 p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Demo Mode</p>
              <p className="text-xs text-muted-foreground mb-3">
                Select your role to login with demo credentials:
              </p>
              <Select 
                value={demoRole} 
                onValueChange={(value: UserRole) => setDemoRole(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="staff">Staff/Beautician</SelectItem>
                  <SelectItem value="manager">Salon Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="link"
                className="text-xs p-0 h-auto mt-2"
                onClick={() => setDemoMode(false)}
              >
                Switch to regular login
              </Button>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!demoMode && (
                  <p className="text-xs text-muted-foreground mt-1">
                    For demo: use admin@example.com, staff@example.com, manager@example.com, or user@example.com
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-salon hover:text-salon-dark">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!demoMode && (
                  <p className="text-xs text-muted-foreground mt-1">
                    For demo: use any password with at least 6 characters
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-salon hover:bg-salon-dark text-white"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Don't have an account?</span>{' '}
              <Link to="/signup" className="text-salon hover:text-salon-dark font-medium">
                Sign up
              </Link>
            </div>
            
            {!demoMode && (
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setDemoMode(true)}
                type="button"
              >
                Switch to Demo Mode
              </Button>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
