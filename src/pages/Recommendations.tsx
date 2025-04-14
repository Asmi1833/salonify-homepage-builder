
import React, { useState } from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HairStyleRecommendations from '@/components/HairStyleRecommendations';
import NailDesignRecommendations from '@/components/NailDesignRecommendations';
import HairColorRecommendations from '@/components/HairColorRecommendations';

const Recommendations: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Smart Style Recommendations</h1>
            <p className="text-muted-foreground max-w-3xl mb-10">
              Our AI-powered recommendations help you find the perfect style that complements your features and preferences.
            </p>
            
            <Tabs defaultValue="hair-style" className="w-full">
              <TabsList className="mb-8 flex flex-wrap">
                <TabsTrigger value="hair-style">Hair Style</TabsTrigger>
                <TabsTrigger value="hair-color">Hair Color</TabsTrigger>
                <TabsTrigger value="nail-design">Nail Design</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hair-style">
                <HairStyleRecommendations />
              </TabsContent>
              
              <TabsContent value="hair-color">
                <HairColorRecommendations />
              </TabsContent>
              
              <TabsContent value="nail-design">
                <NailDesignRecommendations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;
