
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import SalonifyLogo from '@/components/SalonifyLogo';

const Login: React.FC = () => {
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
          
          <form className="mt-8 space-y-6">
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
                />
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
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-salon hover:bg-salon-dark text-white"
            >
              Sign in
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
