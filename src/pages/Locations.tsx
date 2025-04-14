
import React, { useEffect, useState } from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SalonLocation {
  id: number;
  name: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  openingHours: string;
  image: string;
}

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<SalonLocation[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [areas, setAreas] = useState<string[]>(['All']);

  useEffect(() => {
    // Load locations from localStorage
    const storedLocations = localStorage.getItem('salonLocations');
    if (storedLocations) {
      const parsedLocations = JSON.parse(storedLocations);
      setLocations(parsedLocations);
      
      // Extract unique areas for filtering
      const uniqueAreas = ['All', ...new Set(parsedLocations.map((loc: SalonLocation) => loc.area))];
      setAreas(uniqueAreas);
    }
  }, []);

  const filteredLocations = selectedArea === 'All' 
    ? locations 
    : locations.filter(location => location.area === selectedArea);

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Salon Locations</h1>
            <p className="text-muted-foreground max-w-3xl mb-8">
              Find the Salonify branch nearest to you and experience our premium salon services in your neighborhood.
            </p>
            
            {/* Area Filter */}
            <div className="mb-10">
              <h2 className="text-lg font-medium mb-3">Filter by Area:</h2>
              <div className="flex flex-wrap gap-2">
                {areas.map(area => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedArea === area 
                        ? 'bg-salon text-white' 
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <Card key={location.id} className="overflow-hidden border border-border/50 h-full flex flex-col hover:shadow-md transition-shadow">
                    <div className="relative pt-[60%] bg-secondary overflow-hidden">
                      <img 
                        src={location.image || 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                        alt={location.name}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                      <div className="space-y-3 text-muted-foreground">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-salon shrink-0 mt-0.5" />
                          <div>
                            <p>{location.address}</p>
                            <p>{location.area}, {location.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-salon shrink-0" />
                          <p>{location.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-salon shrink-0" />
                          <p>{location.openingHours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg text-muted-foreground">No locations found in the selected area.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
