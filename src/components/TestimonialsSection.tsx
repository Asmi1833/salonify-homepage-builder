
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Emma Thompson",
    role: "Regular Client",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    quote: "Salonify has transformed my hair care routine. The stylists are so knowledgeable and always make me feel beautiful!"
  },
  {
    name: "Michael Davis",
    role: "First-time Client",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    quote: "I was nervous about trying a new salon, but the team at Salonify made me feel comfortable and gave me the best haircut I've ever had."
  },
  {
    name: "Sophia Rodriguez",
    role: "Monthly Client",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    quote: "The attention to detail and personalized service at Salonify is unmatched. I wouldn't trust my hair with anyone else!"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="salon-section">
      <div className="salon-container">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Don't just take our word for it - hear from our satisfied clients
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border/50 h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-salon">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xl mb-2">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground mb-4">{testimonial.role}</div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="w-5 h-5 text-yellow-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
