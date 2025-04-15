
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

interface ProfileAvatarProps {
  imageUrl: string | null;
  userName: string;
  onImageChange: (imageDataUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  imageUrl, 
  userName, 
  onImageChange 
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        onImageChange(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24 border-2 border-salon">
        <AvatarImage src={imageUrl || ''} />
        <AvatarFallback className="text-xl bg-salon text-white">
          {userName ? getInitials(userName) : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <label htmlFor="profileImage" className="cursor-pointer mt-2">
        <div className="flex items-center gap-1 text-sm text-salon hover:text-salon-dark transition-colors">
          <Upload className="h-3 w-3" />
          <span>Upload photo</span>
        </div>
        <input 
          type="file" 
          id="profileImage" 
          className="hidden" 
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
};

export default ProfileAvatar;
