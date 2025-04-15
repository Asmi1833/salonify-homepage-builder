
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, isEqual } from 'date-fns';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}

interface TimeSlotsProps {
  staffId: string;
  weekDates: Date[];
  availability: DayAvailability[];
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ staffId, weekDates, availability }) => {
  const [availabilityByDay, setAvailabilityByDay] = useState<{ [key: string]: TimeSlot[] }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(weekDates[0]);
  
  useEffect(() => {
    // Convert the availability array to an object keyed by day name
    const availObj = availability.reduce((acc, day) => {
      acc[day.day] = day.slots;
      return acc;
    }, {} as { [key: string]: TimeSlot[] });
    
    setAvailabilityByDay(availObj);
  }, [availability]);
  
  const handleToggleAvailability = (date: Date, isAvailable: boolean) => {
    const dayName = format(date, 'EEEE');
    
    if (isAvailable) {
      // Default time slots for a new day
      const defaultSlots = [
        { start: '09:00 AM', end: '12:00 PM' },
        { start: '01:00 PM', end: '05:00 PM' }
      ];
      
      setAvailabilityByDay({
        ...availabilityByDay,
        [dayName]: defaultSlots
      });
      
      toast.success(`You are now available on ${dayName}s`);
    } else {
      // Remove availability for this day
      const updatedAvailability = { ...availabilityByDay };
      delete updatedAvailability[dayName];
      
      setAvailabilityByDay(updatedAvailability);
      
      toast.success(`You are now unavailable on ${dayName}s`);
    }
    
    // In a real app, we would save this to a database
    // For demo purposes, we'll just update local storage
    const updatedAvailability = Object.entries(availabilityByDay).map(([day, slots]) => ({
      day,
      slots
    }));
    
    // Get the staff object, update it, and save it back
    const staffData = JSON.parse(localStorage.getItem('salonifyStaff') || '{}');
    staffData.availability = updatedAvailability;
    localStorage.setItem('salonifyStaff', JSON.stringify(staffData));
  };
  
  const renderDays = () => {
    return weekDates.map((date) => {
      const dayName = format(date, 'EEEE');
      const isAvailable = !!availabilityByDay[dayName];
      const isSelectedDate = isEqual(date, selectedDate);
      
      return (
        <div
          key={date.toString()}
          className={`
            p-4 border rounded-lg cursor-pointer
            ${isSelectedDate ? 'border-salon bg-salon/10' : 'border-border'}
            ${isAvailable ? 'bg-green-50' : 'bg-muted'}
          `}
          onClick={() => setSelectedDate(date)}
        >
          <div className="font-medium">{format(date, 'EEEE')}</div>
          <div className="text-sm text-muted-foreground">{format(date, 'MMM d')}</div>
          <div className="mt-2">
            {isAvailable ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-green-600 border-green-300 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAvailability(date, false);
                }}
              >
                Available
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleAvailability(date, true);
                }}
              >
                Unavailable
              </Button>
            )}
          </div>
        </div>
      );
    });
  };
  
  const renderTimeSlots = () => {
    const dayName = format(selectedDate, 'EEEE');
    const slots = availabilityByDay[dayName] || [];
    
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Time Slots for {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        
        {slots.length > 0 ? (
          <div className="space-y-4">
            {slots.map((slot, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border p-4 rounded-lg"
              >
                <div>
                  <div className="font-medium">{slot.start} - {slot.end}</div>
                  <div className="text-sm text-muted-foreground">Available for bookings</div>
                </div>
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Block
                </Button>
              </div>
            ))}
            
            <Button className="w-full mt-4 bg-salon hover:bg-salon-dark">
              Add New Time Slot
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No Availability</h3>
            <p className="text-muted-foreground mb-4">
              You are not available on this day. Toggle availability to add time slots.
            </p>
            <Button 
              onClick={() => handleToggleAvailability(selectedDate, true)}
              className="bg-salon hover:bg-salon-dark"
            >
              Set as Available
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Manage Time Slots</h2>
      
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
      
      {renderTimeSlots()}
    </div>
  );
};

export default TimeSlots;
