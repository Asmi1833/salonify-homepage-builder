
import React, { useState, useEffect } from 'react';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManagerServices from '@/components/manager/ManagerServices';
import ManagerAppointments from '@/components/manager/ManagerAppointments';
import ManagerStaff from '@/components/manager/ManagerStaff';
import ManagerClientHistory from '@/components/manager/ManagerClientHistory';
import { Scissors, Calendar, Users, History } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { getCurrentUser } from '@/utils/auth';

const ManagerPanel: React.FC = () => {
  const [manager, setManager] = useState<any>(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    setManager(user);
  }, []);

  if (!manager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow">
        <div className="salon-section pt-10 md:pt-16">
          <div className="salon-container">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Manager Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {manager.name}
              </p>
              <Alert className="mt-4 bg-salon/10 border-salon/20">
                <p>As a salon manager, you can manage services, appointments, staff schedules, and client history.</p>
              </Alert>
            </div>
            
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid grid-cols-4 md:w-[600px] mb-8">
                <TabsTrigger value="services" className="flex items-center gap-1">
                  <Scissors className="h-4 w-4" />
                  <span className="hidden md:inline">Services</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="hidden md:inline">Staff</span>
                </TabsTrigger>
                <TabsTrigger value="client-history" className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  <span className="hidden md:inline">Client History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="services">
                <ManagerServices />
              </TabsContent>
              
              <TabsContent value="appointments">
                <ManagerAppointments />
              </TabsContent>
              
              <TabsContent value="staff">
                <ManagerStaff />
              </TabsContent>
              
              <TabsContent value="client-history">
                <ManagerClientHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManagerPanel;
