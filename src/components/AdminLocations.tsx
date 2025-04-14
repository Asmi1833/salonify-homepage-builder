
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
import { Plus, Edit, Trash2, MapPin, Phone, Clock, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define the salon location interface
interface SalonLocation {
  id: number;
  name: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  openingHours: string;
  image: string;
}

const AdminLocations: React.FC = () => {
  const [locations, setLocations] = useState<SalonLocation[]>([]);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<SalonLocation | null>(null);
  const [newLocation, setNewLocation] = useState<Omit<SalonLocation, 'id'>>({
    name: '',
    address: '',
    area: '',
    city: '',
    phone: '',
    openingHours: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load locations from localStorage or use default ones
    const storedLocations = localStorage.getItem('salonLocations');
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    } else {
      // Default salon locations
      const defaultLocations = [
        {
          id: 1,
          name: "Salonify Luxury",
          address: "123 Beauty Street, Kormangala",
          area: "Kormangala",
          city: "Bangalore",
          phone: "+91 98765 43210",
          openingHours: "10:00 AM - 8:00 PM",
          image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
          id: 2,
          name: "Salonify Premium",
          address: "456 Style Avenue, Indiranagar",
          area: "Indiranagar",
          city: "Bangalore",
          phone: "+91 87654 32109",
          openingHours: "9:30 AM - 7:30 PM",
          image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
      ];
      setLocations(defaultLocations);
      localStorage.setItem('salonLocations', JSON.stringify(defaultLocations));
    }
  }, []);

  const saveLocations = (updatedLocations: SalonLocation[]) => {
    setLocations(updatedLocations);
    localStorage.setItem('salonLocations', JSON.stringify(updatedLocations));
  };

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address || !newLocation.area || !newLocation.city) {
      toast({
        title: "Invalid location details",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newLocationWithId = {
      ...newLocation,
      id: locations.length ? Math.max(...locations.map(l => l.id)) + 1 : 1
    };

    const updatedLocations = [...locations, newLocationWithId];
    saveLocations(updatedLocations);
    setIsAddLocationOpen(false);
    setNewLocation({
      name: '',
      address: '',
      area: '',
      city: '',
      phone: '',
      openingHours: '',
      image: ''
    });
    
    toast({
      title: "Location added",
      description: `${newLocation.name} in ${newLocation.area} has been successfully added.`,
    });
  };

  const handleEditLocation = () => {
    if (!currentLocation) return;
    
    const updatedLocations = locations.map(location => 
      location.id === currentLocation.id ? currentLocation : location
    );
    
    saveLocations(updatedLocations);
    setIsEditLocationOpen(false);
    setCurrentLocation(null);
    
    toast({
      title: "Location updated",
      description: `${currentLocation.name} has been successfully updated.`,
    });
  };

  const handleDeleteLocation = (id: number) => {
    const locationToDelete = locations.find(l => l.id === id);
    if (!locationToDelete) return;
    
    const updatedLocations = locations.filter(location => location.id !== id);
    saveLocations(updatedLocations);
    
    toast({
      title: "Location deleted",
      description: `${locationToDelete.name} has been removed from your locations.`,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Salon Locations</h2>
          <Button 
            onClick={() => setIsAddLocationOpen(true)}
            className="bg-salon hover:bg-salon-dark gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>

        <Table>
          <TableCaption>Your salon locations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  <img 
                    src={location.image || 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                    alt={location.name} 
                    className="h-16 w-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.area}</TableCell>
                <TableCell>{location.city}</TableCell>
                <TableCell>{location.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentLocation(location);
                        setIsEditLocationOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLocation(location.id)}
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

      {/* Add Location Sheet */}
      <Sheet open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Location</SheetTitle>
            <SheetDescription>
              Add a new salon location to your network
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Salon Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Salonify Elite"
                value={newLocation.name}
                onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Street Address
              </label>
              <Input
                id="address"
                placeholder="Full street address"
                value={newLocation.address}
                onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">
                  Area
                </label>
                <Input
                  id="area"
                  placeholder="e.g., Jayanagar"
                  value={newLocation.area}
                  onChange={(e) => setNewLocation({...newLocation, area: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="city"
                  placeholder="e.g., Bangalore"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Contact Number
              </label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={newLocation.phone}
                onChange={(e) => setNewLocation({...newLocation, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-medium">
                Opening Hours
              </label>
              <Input
                id="hours"
                placeholder="e.g., 10:00 AM - 8:00 PM"
                value={newLocation.openingHours}
                onChange={(e) => setNewLocation({...newLocation, openingHours: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={newLocation.image}
                onChange={(e) => setNewLocation({...newLocation, image: e.target.value})}
              />
            </div>
            {newLocation.image && (
              <div className="border rounded p-2">
                <p className="text-sm mb-1">Image Preview:</p>
                <img 
                  src={newLocation.image} 
                  alt="Location preview" 
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
              onClick={handleAddLocation}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Location
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Location Sheet */}
      <Sheet open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Location</SheetTitle>
            <SheetDescription>
              Make changes to the selected salon location
            </SheetDescription>
          </SheetHeader>
          {currentLocation && (
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Salon Name
                </label>
                <Input
                  id="edit-name"
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({...currentLocation, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-address" className="text-sm font-medium">
                  Street Address
                </label>
                <Input
                  id="edit-address"
                  value={currentLocation.address}
                  onChange={(e) => setCurrentLocation({...currentLocation, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-area" className="text-sm font-medium">
                    Area
                  </label>
                  <Input
                    id="edit-area"
                    value={currentLocation.area}
                    onChange={(e) => setCurrentLocation({...currentLocation, area: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="edit-city"
                    value={currentLocation.city}
                    onChange={(e) => setCurrentLocation({...currentLocation, city: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  id="edit-phone"
                  value={currentLocation.phone}
                  onChange={(e) => setCurrentLocation({...currentLocation, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-hours" className="text-sm font-medium">
                  Opening Hours
                </label>
                <Input
                  id="edit-hours"
                  value={currentLocation.openingHours}
                  onChange={(e) => setCurrentLocation({...currentLocation, openingHours: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-image" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="edit-image"
                  value={currentLocation.image}
                  onChange={(e) => setCurrentLocation({...currentLocation, image: e.target.value})}
                />
              </div>
              <div className="border rounded p-2">
                <p className="text-sm mb-1">Image Preview:</p>
                <img 
                  src={currentLocation.image || 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                  alt="Location preview" 
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
              onClick={handleEditLocation}
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

export default AdminLocations;
