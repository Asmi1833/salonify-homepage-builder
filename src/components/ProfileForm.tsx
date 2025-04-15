
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import ProfileAvatar from './profile/ProfileAvatar';
import PersonalInfoFields from './profile/PersonalInfoFields';
import PreferencesFields from './profile/PreferencesFields';
import { profileFormSchema, type ProfileFormValues } from './profile/profileSchema';

interface ProfileFormProps {
  user: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthday: user.birthday ? new Date(user.birthday) : undefined,
      address: user.address || '',
      preferences: user.preferences || '',
      profileImage: user.profileImage || '',
    },
  });

  const handleImageChange = (imageDataUrl: string) => {
    setImagePreview(imageDataUrl);
    form.setValue('profileImage', imageDataUrl);
  };

  function onSubmit(values: ProfileFormValues) {
    // Update user in local storage
    const updatedUser = { ...user, ...values };
    localStorage.setItem('salonifyUser', JSON.stringify(updatedUser));
    
    toast.success('Profile updated successfully');
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
          <h3 className="text-lg font-medium mb-1">Your Profile</h3>
          <p className="text-muted-foreground text-sm">
            Manage your personal information and preferences
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <PreferencesFields form={form} />
          
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

export default ProfileForm;
