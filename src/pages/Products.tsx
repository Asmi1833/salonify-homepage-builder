
import React from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import ProductsSection from '@/components/ProductsSection';
import Footer from '@/components/Footer';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-muted-foreground max-w-3xl mb-10">
              Discover our range of premium salon products designed to maintain your style and hair health at home.
            </p>
          </div>
        </div>
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Products;
