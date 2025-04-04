
import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import SalonifyLogo from './SalonifyLogo';
import { Button } from '@/components/ui/button';

const SalonNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 border-b border-border">
      <div className="salon-container">
        <div className="flex justify-between items-center">
          <Link to="/">
            <SalonifyLogo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hover:text-salon transition-colors">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-salon hover:bg-salon-dark text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLinks mobile />
              <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full hover:text-salon transition-colors">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="bg-salon hover:bg-salon-dark text-white w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLinks: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const linkClasses = mobile
    ? "block py-2 hover:text-salon transition-colors"
    : "hover:text-salon transition-colors";

  return (
    <>
      <a href="#services" className={linkClasses}>Services</a>
      <a href="#about" className={linkClasses}>About</a>
      <a href="#testimonials" className={linkClasses}>Testimonials</a>
      <a href="#contact" className={linkClasses}>Contact</a>
    </>
  );
};

export default SalonNavbar;
