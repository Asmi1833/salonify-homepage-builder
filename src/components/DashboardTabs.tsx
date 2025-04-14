
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentsList from '@/components/AppointmentsList';
import ProfileForm from '@/components/ProfileForm';
import { Clock, User, Bell } from 'lucide-react';
import NotificationList from './NotificationList';

interface DashboardTabsProps {
  user: any;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ user }) => {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
        <TabsTrigger value="appointments" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className="hidden md:inline">Appointments</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-1">
          <Bell className="h-4 w-4" />
          <span className="hidden md:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span className="hidden md:inline">Profile</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="appointments">
        <AppointmentsList userId={user.id} />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationList userId={user.id} />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileForm user={user} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
