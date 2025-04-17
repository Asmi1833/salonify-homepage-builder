
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock staff data
const initialStaffMembers = [
  {
    id: 'staff-1',
    name: 'Emma Johnson',
    email: 'emma.johnson@salonify.com',
    phone: '(555) 123-4567',
    profileImage: '',
    role: 'Senior Stylist',
    bio: 'With over 8 years of experience, Emma specializes in modern haircuts and coloring techniques.',
    specialties: ['Hair Styling', 'Coloring', 'Treatments'],
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '09:00 AM', end: '12:00 PM' },
          { start: '01:00 PM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Tuesday',
        slots: [
          { start: '09:00 AM', end: '12:00 PM' },
          { start: '01:00 PM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '09:00 AM', end: '12:00 PM' },
          { start: '01:00 PM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '09:00 AM', end: '12:00 PM' },
          { start: '01:00 PM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '09:00 AM', end: '12:00 PM' },
          { start: '01:00 PM', end: '05:00 PM' }
        ]
      }
    ]
  },
  {
    id: 'staff-2',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@salonify.com',
    phone: '(555) 987-6543',
    profileImage: '',
    role: 'Nail Technician',
    bio: 'Sophia is a certified nail technician with expertise in nail art and spa treatments.',
    specialties: ['Manicures', 'Pedicures', 'Nail Art'],
    availability: [
      {
        day: 'Monday',
        slots: [
          { start: '10:00 AM', end: '06:00 PM' }
        ]
      },
      {
        day: 'Wednesday',
        slots: [
          { start: '10:00 AM', end: '06:00 PM' }
        ]
      },
      {
        day: 'Friday',
        slots: [
          { start: '10:00 AM', end: '06:00 PM' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '09:00 AM', end: '03:00 PM' }
        ]
      }
    ]
  },
  {
    id: 'staff-3',
    name: 'Daniel Kim',
    email: 'daniel.kim@salonify.com',
    phone: '(555) 456-7890',
    profileImage: '',
    role: 'Esthetician',
    bio: 'Daniel specializes in skincare treatments and has 5+ years of experience in facials and skin therapy.',
    specialties: ['Facials', 'Skin Care', 'Waxing'],
    availability: [
      {
        day: 'Tuesday',
        slots: [
          { start: '09:00 AM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Thursday',
        slots: [
          { start: '09:00 AM', end: '05:00 PM' }
        ]
      },
      {
        day: 'Saturday',
        slots: [
          { start: '10:00 AM', end: '04:00 PM' }
        ]
      }
    ]
  }
];

const ManagerStaff: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
    specialties: '',
    availability: [] as any[]
  });

  useEffect(() => {
    // Simulate loading staff data from API
    setTimeout(() => {
      const storedStaff = localStorage.getItem('salonifyStaff');
      if (storedStaff) {
        setStaffMembers(JSON.parse(storedStaff));
      } else {
        setStaffMembers(initialStaffMembers);
        localStorage.setItem('salonifyStaff', JSON.stringify(initialStaffMembers));
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
      email: '',
      phone: '',
      role: '',
      bio: '',
      specialties: '',
      availability: []
    });
    setEditingStaff(null);
    setActiveTab('general');
  };

  const openEditDialog = (staff: any) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      bio: staff.bio,
      specialties: staff.specialties.join(', '),
      availability: staff.availability
    });
    setIsDialogOpen(true);
  };

  const handleSaveStaff = () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newStaff = {
      id: editingStaff ? editingStaff.id : `staff-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      profileImage: '',
      role: formData.role,
      bio: formData.bio,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      availability: formData.availability.length ? formData.availability : [
        {
          day: 'Monday',
          slots: [
            { start: '09:00 AM', end: '05:00 PM' }
          ]
        }
      ]
    };

    let updatedStaff: any[];
    
    if (editingStaff) {
      updatedStaff = staffMembers.map(s => s.id === editingStaff.id ? newStaff : s);
      toast({
        title: "Staff updated",
        description: `${newStaff.name}'s profile has been updated successfully.`
      });
    } else {
      updatedStaff = [...staffMembers, newStaff];
      toast({
        title: "Staff added",
        description: `${newStaff.name} has been added to your team.`
      });
    }

    setStaffMembers(updatedStaff);
    localStorage.setItem('salonifyStaff', JSON.stringify(updatedStaff));
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      const updatedStaff = staffMembers.filter(s => s.id !== id);
      setStaffMembers(updatedStaff);
      localStorage.setItem('salonifyStaff', JSON.stringify(updatedStaff));
      
      toast({
        title: "Staff removed",
        description: "The staff member has been removed from your team."
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading staff members...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">Manage your salon staff and their schedules</p>
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
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
              <DialogDescription>
                {editingStaff 
                  ? 'Update the details of this staff member' 
                  : 'Fill in the details to add a new staff member to your team'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Info</TabsTrigger>
                <TabsTrigger value="availability">
                  <Calendar className="h-4 w-4 mr-2" />
                  Availability
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role/Position*</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Hair Stylist, Beautician, Nail Technician"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="specialties">Specialties (comma separated)</Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      value={formData.specialties}
                      onChange={handleInputChange}
                      placeholder="e.g. Haircuts, Coloring, Styling"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of experience and expertise"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="availability" className="py-4">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Set the default availability for this staff member. This can be customized further in the staff panel.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {editingStaff && (
                    editingStaff.availability.map((day: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <h4 className="font-medium mb-2">{day.day}</h4>
                        {day.slots.map((slot: any, slotIndex: number) => (
                          <div key={slotIndex} className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {slot.start} - {slot.end}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                  
                  {!editingStaff && (
                    <div className="text-center p-4 bg-slate-50 rounded-md">
                      <p>
                        Default availability will be set to Monday-Friday, 9:00 AM - 5:00 PM.
                        <br />
                        Staff can customize their schedule after account creation.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-salon hover:bg-salon-dark" onClick={handleSaveStaff}>
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map(staff => (
          <Card key={staff.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-salon">
                  <AvatarImage src={staff.profileImage} />
                  <AvatarFallback className="bg-salon text-white">
                    {getInitials(staff.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">{staff.bio}</p>
                
                <div>
                  <p className="text-sm font-medium mb-1">Contact Info:</p>
                  <p className="text-sm">Email: {staff.email}</p>
                  <p className="text-sm">Phone: {staff.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {staff.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button 
                variant="outline" 
                className="text-salon border-salon"
                size="sm"
                onClick={() => openEditDialog(staff)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteStaff(staff.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {staffMembers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No staff members found. Add your first team member.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerStaff;
