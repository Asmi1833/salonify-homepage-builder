import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import HairStyleRecommendations from '@/components/HairStyleRecommendations';
import HairColorRecommendations from '@/components/HairColorRecommendations';
import NailDesignRecommendations from '@/components/NailDesignRecommendations';
import { toast } from '@/components/ui/use-toast';
import { isAuthenticated, isSessionExpired } from '@/utils/auth';

const Recommendations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hairstyles');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for expired sessions
    if (isSessionExpired()) {
      localStorage.removeItem('salonifyUser');
      navigate('/login', { 
        state: { 
          from: '/recommendations',
          message: "Your session has expired. Please login again to access personalized style recommendations" 
        }
      });
      return;
    }
    
    // Check if user is logged in when component mounts
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        toast({
          title: "Authentication required",
          description: "Please sign up or login to access personalized recommendations",
          variant: "destructive"
        });
        navigate('/login', { 
          state: { 
            from: '/recommendations',
            message: "Please login to access personalized style recommendations" 
          }
        });
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow py-12">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Smart Style™ Recommendations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered recommendation system analyzes your preferences and facial features to suggest perfect styles just for you.
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="hairstyles">Hair Styles</TabsTrigger>
              <TabsTrigger value="haircolors">Hair Colors</TabsTrigger>
              <TabsTrigger value="nails">Nail Designs</TabsTrigger>
            </TabsList>
            <TabsContent value="hairstyles">
              <HairStyleRecommendations />
            </TabsContent>
            <TabsContent value="haircolors">
              <HairColorRecommendations />
            </TabsContent>
            <TabsContent value="nails">
              <NailDesignRecommendations />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recommendations;
