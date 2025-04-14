
import React, { useState } from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Clock, CalendarRange, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

// Sample salon location data
const SALON_LOCATIONS = [
  {
    id: 1,
    name: 'Salonify Downtown',
    address: '123 Main St, Downtown',
    city: 'New York',
    phone: '(212) 555-1234',
    hours: 'Mon-Sat: 9am-7pm, Sun: 10am-5pm',
    area: 'Downtown',
    services: ['Haircut', 'Styling', 'Coloring', 'Spa'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500&h=350'
  },
  {
    id: 2,
    name: 'Salonify Uptown',
    address: '456 Park Ave, Uptown',
    city: 'New York',
    phone: '(212) 555-5678',
    hours: 'Mon-Sat: 10am-8pm, Sun: 10am-6pm',
    area: 'Uptown',
    services: ['Haircut', 'Styling', 'Treatment', 'Nail Care'],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=500&h=350'
  },
  {
    id: 3,
    name: 'Salonify Brooklyn',
    address: '789 Atlantic Ave, Brooklyn',
    city: 'New York',
    phone: '(718) 555-9012',
    hours: 'Mon-Sat: 9am-8pm, Sun: 11am-6pm',
    area: 'Brooklyn',
    services: ['Haircut', 'Styling', 'Coloring', 'Makeup'],
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=500&h=350'
  },
  {
    id: 4,
    name: 'Salonify Queens',
    address: '321 Queens Blvd, Queens',
    city: 'New York',
    phone: '(718) 555-3456',
    hours: 'Mon-Sat: 10am-7pm, Sun: Closed',
    area: 'Queens',
    services: ['Haircut', 'Coloring', 'Spa', 'Waxing'],
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=500&h=350'
  },
  {
    id: 5,
    name: 'Salonify Bronx',
    address: '654 Grand Concourse, Bronx',
    city: 'New York',
    phone: '(718) 555-7890',
    hours: 'Mon-Sat: 9am-6pm, Sun: Closed',
    area: 'Bronx',
    services: ['Haircut', 'Styling', 'Nail Care', 'Kids Haircut'],
    image: 'https://images.unsplash.com/photo-1610816312194-cbff3b0a6342?auto=format&fit=crop&q=80&w=500&h=350'
  },
  {
    id: 6,
    name: 'Salonify Staten Island',
    address: '987 Victory Blvd, Staten Island',
    city: 'New York',
    phone: '(718) 555-2345',
    hours: 'Mon-Sat: 10am-6pm, Sun: 11am-4pm',
    area: 'Staten Island',
    services: ['Haircut', 'Styling', 'Coloring', 'Beard Trim'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=500&h=350'
  }
];

const Locations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  
  const areas = [...new Set(SALON_LOCATIONS.map(salon => salon.area))];
  
  const filteredLocations = SALON_LOCATIONS.filter(location => {
    const matchesSearch = searchQuery === '' || 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesArea = selectedArea === '' || location.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

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
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by location name or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-[200px]">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Areas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredLocations.map(location => (
                <Card key={location.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{location.name}</CardTitle>
                    <CardDescription>{location.area}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex">
                      <MapPin className="h-5 w-5 mr-2 text-salon" />
                      <span>{location.address}, {location.city}</span>
                    </div>
                    <div className="flex">
                      <Phone className="h-5 w-5 mr-2 text-salon" />
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex">
                      <Clock className="h-5 w-5 mr-2 text-salon" />
                      <span>{location.hours}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {location.services.map(service => (
                        <span 
                          key={service} 
                          className="inline-block bg-muted px-2 py-1 text-xs rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-salon hover:bg-salon-dark">
                      <CalendarRange className="h-4 w-4 mr-2" />
                      Book at this location
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredLocations.length === 0 && (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium mb-2">No locations found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filter settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
