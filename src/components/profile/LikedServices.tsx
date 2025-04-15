
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'service-1',
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling by our expert stylists.',
    price: '$45',
    image: '/placeholder.svg'
  },
  {
    id: 'service-2',
    name: 'Hair Coloring',
    description: 'Full hair coloring with premium products for vibrant results.',
    price: '$85',
    image: '/placeholder.svg'
  },
  {
    id: 'service-3',
    name: 'Manicure & Pedicure',
    description: 'Luxurious nail care for hands and feet with premium polishes.',
    price: '$65',
    image: '/placeholder.svg'
  }
];

interface LikedServicesProps {
  userId: string;
}

const LikedServices: React.FC<LikedServicesProps> = ({ userId }) => {
  const [likedServices, setLikedServices] = useState<Service[]>([]);
  
  useEffect(() => {
    // Get liked services from local storage
    const storedServices = localStorage.getItem(`liked-services-${userId}`);
    if (storedServices) {
      setLikedServices(JSON.parse(storedServices));
    } else {
      // For demo purposes, set some default liked services
      setLikedServices(DEFAULT_SERVICES);
      saveLikedServices(DEFAULT_SERVICES);
    }
  }, [userId]);
  
  const saveLikedServices = (services: Service[]) => {
    localStorage.setItem(`liked-services-${userId}`, JSON.stringify(services));
  };
  
  const handleUnlike = (serviceId: string) => {
    const updatedServices = likedServices.filter(service => service.id !== serviceId);
    setLikedServices(updatedServices);
    saveLikedServices(updatedServices);
    toast.success('Service removed from favorites');
  };
  
  const handleBookService = (serviceName: string) => {
    // Save notification
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Booking Request',
      message: `You've requested to book a ${serviceName} service. Please check your appointments to confirm.`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    toast.success(`Booking request for ${serviceName} initiated`);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Services You Love</h2>
      
      {likedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-secondary/30">
                <img
                  src={service.image || '/placeholder.svg'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{service.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-salon"
                    onClick={() => handleUnlike(service.id)}
                  >
                    <Heart className="h-5 w-5 fill-salon" />
                  </Button>
                </div>
                <div className="text-lg font-semibold text-salon">{service.price}</div>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-salon hover:bg-salon-dark flex items-center gap-2"
                  onClick={() => handleBookService(service.name)}
                >
                  <Calendar className="h-4 w-4" />
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Liked Services</h3>
          <p className="text-muted-foreground mb-6">
            You haven't liked any services yet. Browse our services and click the heart icon to add them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default LikedServices;
