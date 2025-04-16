
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
import { loginUser, isSessionExpired } from '@/utils/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if redirected with a message
  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  useEffect(() => {
    // Check if session expired and show message
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

    // Check for valid credentials
    // For demo purposes, validate against a demo account or check format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = password.length >= 6;

    setTimeout(() => {
      if (isValidEmail && isValidPassword) {
        // Determine role based on email pattern (for demo purposes)
        let role = 'user';
        if (email.includes('admin')) {
          role = 'admin';
        } else if (email.includes('staff')) {
          role = 'staff';
        }
        
        // Create user object
        const user = {
          email,
          name: email.split('@')[0], // Simple name from email
          profileImage: '',
          role
        };
        
        // Login user with expiration
        loginUser(user);
        
        // Show success message with role information
        toast({
          title: "Login successful",
          description: `Welcome back! You are logged in as ${role}.`,
        });
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'staff') {
          navigate('/staff-panel');
        } else if (redirectFrom) {
          navigate(redirectFrom);
        } else {
          navigate('/');
        }
      } else {
        // Check if this email exists (for demo, assume not valid credentials)
        toast({
          title: "Account not found",
          description: "No account found with this email or password is incorrect. Please sign up first or try again.",
          variant: "destructive"
        });
        
        // Suggest signup if email format is valid but login failed
        if (isValidEmail) {
          setTimeout(() => {
            toast({
              title: "Create an account",
              description: "Would you like to create a new account with this email?",
              action: (
                <Button 
                  className="bg-salon hover:bg-salon-dark"
                  onClick={() => navigate('/signup', { state: { email } })}
                >
                  Sign up
                </Button>
              )
            });
          }, 500);
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
                <p className="text-xs text-muted-foreground mt-1">
                  For demo: use admin@example.com, staff@example.com, or user@example.com
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  For demo: use any password with at least 6 characters
                </p>
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
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
