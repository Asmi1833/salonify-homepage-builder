
import React from 'react';
import { Link } from 'react-router-dom';
import SalonifyLogo from './SalonifyLogo';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="salon-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <SalonifyLogo className="mb-4" />
            <p className="text-muted-foreground mb-6">
              Providing premium salon services that enhance your natural beauty and boost your confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-salon transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-salon transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-salon transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-salon transition-colors">Home</Link></li>
              <li><a href="#services" className="text-muted-foreground hover:text-salon transition-colors">Services</a></li>
              <li><Link to="/products" className="text-muted-foreground hover:text-salon transition-colors">Products</Link></li>
              <li><a href="#about" className="text-muted-foreground hover:text-salon transition-colors">About</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-salon transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-salon transition-colors">Hair Styling</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-salon transition-colors">Hair Coloring</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-salon transition-colors">Spa Treatments</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-salon transition-colors">Bridal Packages</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-salon transition-colors">Nail Services</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-salon" />
                <span className="text-muted-foreground">123 Beauty Lane, Styleville, ST 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-salon" />
                <a href="tel:+11234567890" className="text-muted-foreground hover:text-salon transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-salon" />
                <a href="mailto:info@salonify.com" className="text-muted-foreground hover:text-salon transition-colors">
                  info@salonify.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Salonify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
