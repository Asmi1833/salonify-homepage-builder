
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import SalonifyLogo from '@/components/SalonifyLogo';
import { toast } from '@/components/ui/use-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      if (email) {
        setSubmitted(true);
        toast({
          title: "Reset email sent",
          description: "Check your inbox for password reset instructions",
        });
      } else {
        toast({
          title: "Email required",
          description: "Please enter your email address",
          variant: "destructive"
        });
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
            <h2 className="mt-6 text-3xl font-extrabold">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {!submitted 
                ? "Enter your email and we'll send you reset instructions" 
                : "Check your email for reset instructions"}
            </p>
          </div>
          
          {!submitted ? (
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
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-salon hover:bg-salon-dark text-white"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset instructions'}
              </Button>
              
              <div className="text-center text-sm mt-4">
                <Link to="/login" className="text-salon hover:text-salon-dark font-medium">
                  Back to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 p-4 rounded-md text-green-800 text-center">
                We've sent recovery instructions to {email}
              </div>
              
              <Button 
                className="w-full bg-salon hover:bg-salon-dark text-white"
                onClick={() => navigate('/login')}
              >
                Return to login
              </Button>
              
              <div className="text-center text-sm mt-4">
                <Button 
                  variant="link" 
                  onClick={() => setSubmitted(false)}
                  className="text-salon hover:text-salon-dark font-medium"
                >
                  Try a different email
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
