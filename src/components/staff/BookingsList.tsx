
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Check, X } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Booking {
  id: string;
  date: Date;
  time: string;
  duration: string;
  service: string;
  clientName: string;
  clientPhone: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

// Mock bookings for demo purposes
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    date: new Date(),
    time: '10:00 AM',
    duration: '45 min',
    service: 'Haircut & Styling',
    clientName: 'Sarah Parker',
    clientPhone: '(555) 987-6543',
    status: 'confirmed'
  },
  {
    id: 'booking-2',
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: '2:30 PM',
    duration: '1 hour',
    service: 'Hair Coloring',
    clientName: 'Michael Brown',
    clientPhone: '(555) 234-5678',
    status: 'confirmed'
  },
  {
    id: 'booking-3',
    date: new Date(Date.now() - 86400000), // Yesterday
    time: '11:15 AM',
    duration: '30 min',
    service: 'Beard Trim',
    clientName: 'James Wilson',
    clientPhone: '(555) 345-6789',
    status: 'completed'
  },
  {
    id: 'booking-4',
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
    time: '3:45 PM',
    duration: '1.5 hours',
    service: 'Full Hair Treatment',
    clientName: 'Emily Davis',
    clientPhone: '(555) 456-7890',
    status: 'cancelled'
  }
];

interface BookingsListProps {
  staffId: string;
  weekDates: Date[];
}

const BookingsList: React.FC<BookingsListProps> = ({ staffId, weekDates }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    // Get bookings from local storage
    const storedBookings = localStorage.getItem(`staff-bookings-${staffId}`);
    if (storedBookings) {
      // Convert date strings back to Date objects
      const parsedBookings = JSON.parse(storedBookings, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setBookings(parsedBookings);
    } else {
      // For demo purposes, set some mock bookings
      setBookings(MOCK_BOOKINGS);
      saveBookings(MOCK_BOOKINGS);
    }
  }, [staffId]);
  
  const saveBookings = (bookingsList: Booking[]) => {
    localStorage.setItem(`staff-bookings-${staffId}`, JSON.stringify(bookingsList));
  };
  
  const handleCompleteBooking = (id: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'completed' as const } : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    toast.success('Booking marked as completed');
  };
  
  const handleCancelBooking = (id: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
    );
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    toast.success('Booking cancelled');
  };
  
  // Filter bookings for the tab views
  const upcomingBookings = bookings.filter(booking => 
    (booking.status === 'confirmed' && !isPast(new Date(booking.date))) ||
    (booking.status === 'confirmed' && isToday(new Date(booking.date)))
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const todayBookings = bookings.filter(booking => 
    isToday(new Date(booking.date)) && booking.status === 'confirmed'
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  ).sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled'
  ).sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Filter bookings for the selected week
  const getWeekBookings = () => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return weekDates.some(date => 
        bookingDate.getDate() === date.getDate() && 
        bookingDate.getMonth() === date.getMonth() && 
        bookingDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const weekBookings = getWeekBookings();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Bookings</h2>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Today ({todayBookings.length})
          </TabsTrigger>
          <TabsTrigger value="this-week">
            This Week ({weekBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onComplete={handleCompleteBooking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No upcoming bookings." />
          )}
        </TabsContent>
        
        <TabsContent value="today">
          {todayBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onComplete={handleCompleteBooking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No bookings scheduled for today." />
          )}
        </TabsContent>
        
        <TabsContent value="this-week">
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing bookings for the week of {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
            </p>
          </div>
          
          {weekBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onComplete={handleCompleteBooking}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No bookings for this week." />
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          <Tabs defaultValue="completed-tab" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="completed-tab">
                Completed ({completedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled-tab">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="completed-tab">
              {completedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      readOnly
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No completed bookings yet." />
              )}
            </TabsContent>
            
            <TabsContent value="cancelled-tab">
              {cancelledBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cancelledBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      readOnly
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No cancelled bookings." />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BookingCardProps {
  booking: Booking;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  readOnly?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onComplete, 
  onCancel, 
  readOnly = false 
}) => {
  const isPastBooking = isPast(new Date(booking.date)) && !isToday(new Date(booking.date));
  
  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{booking.service}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {booking.status === 'confirmed' ? 'Confirmed' : 
             booking.status === 'completed' ? 'Completed' : 'Cancelled'}
          </div>
        </div>
        <CardDescription>
          {booking.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-salon" />
            <span>{format(new Date(booking.date), 'EEEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-salon" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-salon" />
            <span>{booking.clientName}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-salon" />
            <span>{booking.clientPhone}</span>
          </div>
        </div>
      </CardContent>
      {!readOnly && booking.status === 'confirmed' && !isPastBooking && (
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onComplete && onComplete(booking.id)}
          >
            <Check className="h-4 w-4" />
            Complete
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onCancel && onCancel(booking.id)}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-center py-12 bg-muted rounded-lg">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2">No Bookings</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default BookingsList;
