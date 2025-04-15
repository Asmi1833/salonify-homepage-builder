
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/ProfileForm';
import LikedServices from '@/components/profile/LikedServices';
import PaymentMethods from '@/components/profile/PaymentMethods';
import ServiceHistory from '@/components/profile/ServiceHistory';
import NotificationList from '@/components/NotificationList';
import AppointmentsList from '@/components/AppointmentsList';
import { User, CreditCard, Heart, ClipboardList, Bell, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('salonifyUser');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Profile</h1>
            
            <Tabs defaultValue="personal-info" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
                <TabsTrigger value="personal-info" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Personal Info</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="liked-services" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="hidden md:inline">Liked Services</span>
                </TabsTrigger>
                <TabsTrigger value="payment-methods" className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden md:inline">Payment</span>
                </TabsTrigger>
                <TabsTrigger value="service-history" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden md:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal-info">
                <ProfileForm user={user} />
              </TabsContent>
              
              <TabsContent value="appointments">
                <AppointmentsList userId={user.id} />
              </TabsContent>
              
              <TabsContent value="liked-services">
                <LikedServices userId={user.id} />
              </TabsContent>
              
              <TabsContent value="payment-methods">
                <PaymentMethods userId={user.id} />
              </TabsContent>
              
              <TabsContent value="service-history">
                <ServiceHistory userId={user.id} />
              </TabsContent>
              
              <TabsContent value="notifications">
                <NotificationList userId={user.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
