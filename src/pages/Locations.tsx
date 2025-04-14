
import React from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';

const Locations: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Salon Locations</h1>
            <p className="text-muted-foreground max-w-3xl mb-10">
              Find one of our premium salon locations near you. Each location offers our full range of services with experienced stylists.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
