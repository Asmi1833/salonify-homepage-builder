
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Professional Hairdryer",
    description: "Powerful salon-grade hairdryer with multiple settings for all hair types.",
    price: 9999,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Hydrating Shampoo",
    description: "Premium hydrating shampoo with natural ingredients for silky, smooth hair.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Repairing Hair Mask",
    description: "Deep conditioning treatment to restore damaged hair and add shine.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Curl Defining Cream",
    description: "Enhance natural curls and eliminate frizz with this lightweight styling cream.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Professional Flat Iron",
    description: "Ceramic plates for smooth, straight styles without damaging hair.",
    price: 10999,
    image: "https://images.unsplash.com/photo-1522337094846-8a2d95b931a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Volumizing Mousse",
    description: "Add body and volume to fine hair with this lightweight, non-sticky formula.",
    price: 1399,
    image: "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Heat Protectant Spray",
    description: "Shield hair from heat damage up to 450°F while adding shine.",
    price: 1699,
    image: "https://images.unsplash.com/photo-1590954421068-cf8f4f5ebda5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Scalp Treatment Oil",
    description: "Nourishing oil blend to promote healthy hair growth and soothe dry scalp.",
    price: 2199,
    image: "https://images.unsplash.com/photo-1630082900894-edbd503588f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Argan Oil Hair Serum",
    description: "Luxurious serum that tames frizz and adds incredible shine to all hair types.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1604778234463-728742e733b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    name: "Salon Professional Scissors",
    description: "Premium stainless steel scissors for precise cutting and styling.",
    price: 5999,
    image: "https://images.unsplash.com/photo-1583743089695-4b816a701c52?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    name: "Hair Color Kit",
    description: "Professional-grade hair coloring kit with developer and applicator tools.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1585238342070-61e1e768b1ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    name: "Boar Bristle Brush",
    description: "Natural boar bristle brush for smoother, shinier hair with less frizz.",
    price: 2999,
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const ProductsSection: React.FC = () => {
  // Function to format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
                <p className="font-medium text-salon text-lg">{formatPrice(product.price)}</p>
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
