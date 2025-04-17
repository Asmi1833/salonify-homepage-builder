
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, redirect to locations page
      navigate('/locations');
    }
  };

  const handleViewServices = () => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on homepage, redirect to locations page with services query
      navigate('/#services');
    }
  };

  return (
    <section className="salon-section pt-10 md:pt-16 lg:pt-20">
      <div className="salon-container">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Your <span className="text-salon">Perfect Style</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-lg">
              Experience luxury hair care and treatments designed to enhance your natural beauty at Salonify.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-salon hover:bg-salon-dark text-white px-8 py-6 text-lg"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="border-salon text-salon hover:bg-salon/10 px-8 py-6 text-lg"
                onClick={handleViewServices}
              >
                View Services
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 animate-slide-up">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035" 
                alt="Professional hair salon" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                  <p className="font-medium text-salon-dark">Our expert stylists are ready to transform your look</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
