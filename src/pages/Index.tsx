
import React from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
