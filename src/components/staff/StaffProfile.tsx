
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { staffProfileSchema, type StaffProfileValues } from '@/components/profile/profileSchema';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface StaffProfileProps {
  staff: any;
  setStaff: React.Dispatch<React.SetStateAction<any>>;
}

const StaffProfile: React.FC<StaffProfileProps> = ({ staff, setStaff }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(staff.profileImage || null);
  const [specialty, setSpecialty] = useState('');
  
  const form = useForm<StaffProfileValues>({
    resolver: zodResolver(staffProfileSchema),
    defaultValues: {
      id: staff.id,
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      profileImage: staff.profileImage || '',
      role: staff.role || '',
      bio: staff.bio || '',
      specialties: staff.specialties || [],
    },
  });

  const handleImageChange = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    form.setValue('profileImage', imageDataUrl);
  };

  const handleAddSpecialty = () => {
    if (!specialty.trim()) return;
    
    const currentSpecialties = form.getValues('specialties') || [];
    if (!currentSpecialties.includes(specialty)) {
      form.setValue('specialties', [...currentSpecialties, specialty]);
      setSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    const currentSpecialties = form.getValues('specialties') || [];
    form.setValue('specialties', currentSpecialties.filter(s => s !== specialtyToRemove));
  };

  function onSubmit(values: StaffProfileValues) {
    // Update staff in local storage
    const updatedStaff = { ...staff, ...values };
    localStorage.setItem('salonifyStaff', JSON.stringify(updatedStaff));
    setStaff(updatedStaff);
    
    toast.success('Staff profile updated successfully');
  }

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
        <ProfileAvatar 
          imageUrl={imagePreview}
          userName={form.watch('name')}
          onImageChange={handleImageChange}
        />
        
        <div>
          <h3 className="text-lg font-medium mb-1">Staff Profile</h3>
          <p className="text-muted-foreground text-sm">
            Manage your professional information and specialties
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Your role at the salon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell clients about your experience and expertise"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be displayed on your public profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value?.map((item) => (
                    <Badge key={item} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {item}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSpecialty(item)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleAddSpecialty}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                <FormDescription>
                  Add your areas of expertise and services you provide
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="bg-salon hover:bg-salon-dark"
          >
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StaffProfile;
