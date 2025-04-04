
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import SalonifyLogo from '@/components/SalonifyLogo';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <SalonifyLogo className="mx-auto" />
            <h2 className="mt-6 text-3xl font-extrabold">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Salonify to book appointments and more
            </p>
          </div>
          
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
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
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-salon hover:bg-salon-dark text-white"
            >
              Create account
            </Button>
            
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Already have an account?</span>{' '}
              <Link to="/login" className="text-salon hover:text-salon-dark font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
