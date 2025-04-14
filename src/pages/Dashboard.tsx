
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/DashboardTabs';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
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
    
    // Check for birthday
    const today = new Date();
    if (parsedUser.birthday) {
      const birthday = new Date(parsedUser.birthday);
      if (
        today.getDate() === birthday.getDate() && 
        today.getMonth() === birthday.getMonth()
      ) {
        toast.success(
          "🎂 Happy Birthday! You've received a special 15% discount on all services today!",
          {
            duration: 5000,
          }
        );
      }
    }
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Welcome, {user.name}!</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your appointments and profile details
                </p>
              </div>
              
              {user.birthday && new Date(user.birthday).getDate() === new Date().getDate() && 
               new Date(user.birthday).getMonth() === new Date().getMonth() && (
                <div className="mt-4 md:mt-0 bg-salon/20 text-salon-dark p-3 rounded-lg flex items-center">
                  <span className="text-lg mr-2">🎂</span>
                  <span>
                    <strong>Happy Birthday!</strong> Enjoy your 15% discount on all services today.
                  </span>
                </div>
              )}
            </div>
            
            <DashboardTabs user={user} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
