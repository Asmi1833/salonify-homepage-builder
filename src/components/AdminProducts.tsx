import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle, SheetFooter, SheetClose 
} from '@/components/ui/sheet';
import { Plus, Edit, Trash2, Save, X, IndianRupee } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define the product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load products from localStorage or use default ones
    const storedProducts = localStorage.getItem('salonProducts');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Use the existing products from ProductsSection as initial data
      const defaultProducts = [
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
      setProducts(defaultProducts);
      localStorage.setItem('salonProducts', JSON.stringify(defaultProducts));
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('salonProducts', JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0 || !newProduct.image) {
      toast({
        title: "Invalid product details",
        description: "Please fill in all fields with valid information.",
        variant: "destructive",
      });
      return;
    }

    const newProductWithId = {
      ...newProduct,
      id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1
    };

    const updatedProducts = [...products, newProductWithId];
    saveProducts(updatedProducts);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: ''
    });
    
    toast({
      title: "Product added",
      description: `${newProduct.name} has been successfully added.`,
    });
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.map(product => 
      product.id === currentProduct.id ? currentProduct : product
    );
    
    saveProducts(updatedProducts);
    setIsEditProductOpen(false);
    setCurrentProduct(null);
    
    toast({
      title: "Product updated",
      description: `${currentProduct.name} has been successfully updated.`,
    });
  };

  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) return;
    
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
    
    toast({
      title: "Product deleted",
      description: `${productToDelete.name} has been removed from your catalog.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Product Catalog</h2>
          <Button 
            onClick={() => setIsAddProductOpen(true)}
            className="bg-salon hover:bg-salon-dark gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Table>
          <TableCaption>Your salon product inventory</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-16 w-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditProductOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add Product Sheet */}
      <Sheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>
              Add a new product to your salon's catalog
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Professional Hair Serum"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                placeholder="Brief description of the product"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  className="pl-10"
                  placeholder="1999"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              />
            </div>
            {newProduct.image && (
              <div className="border rounded p-2">
                <p className="text-sm mb-1">Image Preview:</p>
                <img 
                  src={newProduct.image} 
                  alt="Product preview" 
                  className="h-32 w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              type="button" 
              className="bg-salon hover:bg-salon-dark"
              onClick={handleAddProduct}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Product Sheet */}
      <Sheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>
              Make changes to the selected product
            </SheetDescription>
          </SheetHeader>
          {currentProduct && (
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-price" className="text-sm font-medium">
                  Price (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-price"
                    type="number"
                    className="pl-10"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-image" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="edit-image"
                  value={currentProduct.image}
                  onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                />
              </div>
              <div className="border rounded p-2">
                <p className="text-sm mb-1">Image Preview:</p>
                <img 
                  src={currentProduct.image} 
                  alt="Product preview" 
                  className="h-32 w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </SheetClose>
            <Button 
              type="button" 
              className="bg-salon hover:bg-salon-dark"
              onClick={handleEditProduct}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  );
};

export default AdminProducts;
