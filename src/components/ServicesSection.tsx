
import React from 'react';
import { Scissors, Heart, Star, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: <Scissors className="h-6 w-6 text-salon" />,
    title: "Hair Styling",
    description: "From classic cuts to modern styles, our experienced stylists will help you find your perfect look.",
    price: "From $45"
  },
  {
    icon: <Heart className="h-6 w-6 text-salon" />,
    title: "Hair Coloring",
    description: "Enhance your natural color or try something bold and new with our premium coloring services.",
    price: "From $85"
  },
  {
    icon: <Star className="h-6 w-6 text-salon" />,
    title: "Spa Treatments",
    description: "Indulge in our luxurious spa treatments designed to relax and rejuvenate your body and mind.",
    price: "From $75"
  },
  {
    icon: <Calendar className="h-6 w-6 text-salon" />,
    title: "Bridal Packages",
    description: "Make your special day perfect with our comprehensive bridal hair and makeup services.",
    price: "From $250"
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="salon-section bg-secondary/50">
      <div className="salon-container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Discover our range of premium salon services designed to enhance your natural beauty
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-border/50 h-full">
              <CardHeader>
                <div className="mb-4 rounded-full bg-salon/10 w-12 h-12 flex items-center justify-center">
                  {service.icon}
                </div>
                <CardTitle>{service.title}</CardTitle>
                <div className="font-medium text-salon">{service.price}</div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#" 
            className="inline-flex items-center text-salon hover:text-salon-dark font-medium"
          >
            View All Services
            <svg 
              className="ml-1 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
