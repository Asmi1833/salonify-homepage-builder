
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingsList from '@/components/staff/BookingsList';
import TimeSlots from '@/components/staff/TimeSlots';
import StaffProfile from '@/components/staff/StaffProfile';
import { Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeekDates } from '@/components/staff/utils';

// Mock staff data for demo purposes
const MOCK_STAFF = {
  id: 'staff-1',
  name: 'Emma Johnson',
  email: 'emma.johnson@salonify.com',
  phone: '(555) 123-4567',
  profileImage: '/placeholder.svg',
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
};

const StaffPanel: React.FC = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(new Date()));
  
  // In a real app, we would check if user is authenticated as staff
  useEffect(() => {
    // For demo purposes, just set the mock staff data
    setStaff(MOCK_STAFF);
    
    // Store in localStorage for demo purposes
    localStorage.setItem('salonifyStaff', JSON.stringify(MOCK_STAFF));
  }, []);

  const handlePreviousWeek = () => {
    const newDate = new Date(weekDates[0]);
    newDate.setDate(newDate.getDate() - 7);
    setWeekDates(getWeekDates(newDate));
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekDates[0]);
    newDate.setDate(newDate.getDate() + 7);
    setWeekDates(getWeekDates(newDate));
  };

  if (!staff) {
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
                <h1 className="text-3xl md:text-4xl font-bold">Staff Panel</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {staff.name}
                </p>
              </div>
              
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={handlePreviousWeek}>
                  Previous Week
                </Button>
                <Button variant="outline" onClick={() => setWeekDates(getWeekDates(new Date()))}>
                  Current Week
                </Button>
                <Button variant="outline" onClick={handleNextWeek}>
                  Next Week
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
                <TabsTrigger value="bookings" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="time-slots" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="hidden md:inline">Time Slots</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookings">
                <BookingsList staffId={staff.id} weekDates={weekDates} />
              </TabsContent>
              
              <TabsContent value="time-slots">
                <TimeSlots 
                  staffId={staff.id} 
                  weekDates={weekDates} 
                  availability={staff.availability}
                />
              </TabsContent>
              
              <TabsContent value="profile">
                <StaffProfile staff={staff} setStaff={setStaff} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StaffPanel;
