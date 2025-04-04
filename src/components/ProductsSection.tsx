
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Professional Hairdryer",
    description: "Powerful salon-grade hairdryer with multiple settings for all hair types.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035"
  },
  {
    id: 2,
    name: "Hydrating Shampoo",
    description: "Premium hydrating shampoo with natural ingredients for silky, smooth hair.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: 3,
    name: "Repairing Hair Mask",
    description: "Deep conditioning treatment to restore damaged hair and add shine.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035"
  },
  {
    id: 4,
    name: "Curl Defining Cream",
    description: "Enhance natural curls and eliminate frizz with this lightweight styling cream.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: 5,
    name: "Professional Flat Iron",
    description: "Ceramic plates for smooth, straight styles without damaging hair.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035"
  },
  {
    id: 6,
    name: "Volumizing Mousse",
    description: "Add body and volume to fine hair with this lightweight, non-sticky formula.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: 7,
    name: "Heat Protectant Spray",
    description: "Shield hair from heat damage up to 450°F while adding shine.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035"
  },
  {
    id: 8,
    name: "Scalp Treatment Oil",
    description: "Nourishing oil blend to promote healthy hair growth and soothe dry scalp.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  }
];

const ProductsSection: React.FC = () => {
  return (
    <section className="salon-section bg-secondary/50">
      <div className="salon-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-border/50 h-full flex flex-col">
              <div className="relative pt-[75%] bg-secondary overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="font-medium text-salon text-lg">${product.price.toFixed(2)}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{product.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-salon hover:bg-salon-dark gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
