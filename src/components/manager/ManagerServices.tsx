
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data
const initialServices = [
  {
    id: '1',
    name: 'Haircut',
    description: 'Professional haircut by our expert stylists',
    price: 35,
    duration: 45, // minutes
    category: 'Hair'
  },
  {
    id: '2',
    name: 'Manicure',
    description: 'Nail care for your hands including shaping, cuticle care, and polish',
    price: 25,
    duration: 30,
    category: 'Nails'
  },
  {
    id: '3',
    name: 'Facial',
    description: 'Rejuvenating facial treatment to cleanse and refresh your skin',
    price: 60,
    duration: 60,
    category: 'Skin'
  }
];

const ManagerServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: ''
  });

  useEffect(() => {
    // Simulate loading services from API
    setTimeout(() => {
      const storedServices = localStorage.getItem('salonifyServices');
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        setServices(initialServices);
        localStorage.setItem('salonifyServices', JSON.stringify(initialServices));
      }
      setIsLoading(false);
    }, 800);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: ''
    });
    setEditingService(null);
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category
    });
    setIsDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newService = {
      id: editingService ? editingService.id : `service-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category
    };

    let updatedServices: any[];
    
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? newService : s);
      toast({
        title: "Service updated",
        description: `${newService.name} has been updated successfully.`
      });
    } else {
      updatedServices = [...services, newService];
      toast({
        title: "Service added",
        description: `${newService.name} has been added to your services.`
      });
    }

    setServices(updatedServices);
    localStorage.setItem('salonifyServices', JSON.stringify(updatedServices));
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updatedServices = services.filter(s => s.id !== id);
      setServices(updatedServices);
      localStorage.setItem('salonifyServices', JSON.stringify(updatedServices));
      
      toast({
        title: "Service deleted",
        description: "The service has been removed from your catalog."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading services...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-muted-foreground">Manage your salon service offerings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-salon hover:bg-salon-dark"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              <DialogDescription>
                {editingService 
                  ? 'Update the details of this service' 
                  : 'Fill in the details to add a new service to your catalog'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category*
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Hair, Nails, Skin, etc."
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)*
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (min)*
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-salon hover:bg-salon-dark" onClick={handleSaveService}>
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{service.name}</span>
                <span className="text-salon font-bold">${service.price}</span>
              </CardTitle>
              <CardDescription>
                {service.category} · {service.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{service.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => openEditDialog(service)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteService(service.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {services.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No services found. Add your first service.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerServices;
