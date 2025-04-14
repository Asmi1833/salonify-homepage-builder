
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const productsData = [
  {
    id: 1,
    name: 'Hydrating Shampoo',
    price: '₹650',
    image: '/placeholder.svg',
    description: 'Deeply hydrates and nourishes dry, damaged hair.'
  },
  {
    id: 2,
    name: 'Revitalizing Conditioner',
    price: '₹750',
    image: '/placeholder.svg',
    description: 'Repairs and strengthens damaged hair while adding shine.'
  },
  {
    id: 3,
    name: 'Styling Gel - Strong Hold',
    price: '₹450',
    image: '/placeholder.svg',
    description: 'Long-lasting hold without flaking or stiffness.'
  },
  {
    id: 4,
    name: 'Argan Oil Treatment',
    price: '₹1,200',
    image: '/placeholder.svg',
    description: 'Luxurious oil treatment for silky, smooth hair.'
  },
  {
    id: 5,
    name: 'Volumizing Mousse',
    price: '₹550',
    image: '/placeholder.svg',
    description: 'Adds volume and body to fine or limp hair.'
  },
  {
    id: 6,
    name: 'Heat Protection Spray',
    price: '₹850',
    image: '/placeholder.svg',
    description: 'Shields hair from heat styling damage up to 450°F.'
  },
  {
    id: 7,
    name: 'Curl Defining Cream',
    price: '₹950',
    image: '/placeholder.svg',
    description: 'Enhances natural curls while eliminating frizz.'
  },
  {
    id: 8,
    name: 'Hair Mask - Intensive Repair',
    price: '₹1,500',
    image: '/placeholder.svg',
    description: 'Weekly treatment for severely damaged hair.'
  }
];

const ProductsSection: React.FC = () => {
  return (
    <section className="salon-section">
      <div className="salon-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-secondary/30">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-salon font-medium mt-1">{product.price}</p>
                <p className="text-muted-foreground text-sm mt-2">{product.description}</p>
                <button className="mt-4 w-full bg-salon hover:bg-salon-dark text-white py-2 rounded-md font-medium transition-colors">
                  Add to Cart
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
