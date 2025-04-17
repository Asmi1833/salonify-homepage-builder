
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Check, X, Clock } from 'lucide-react';

// Mock appointments data
const initialAppointments = [
  {
    id: 'appt-1',
    service: 'Haircut',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    time: '10:00 AM',
    client: {
      id: 'client-1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-123-4567'
    },
    staff: {
      id: 'staff-1',
      name: 'Emma Johnson'
    },
    status: 'confirmed',
    notes: 'First time client'
  },
  {
    id: 'appt-2',
    service: 'Manicure',
    date: new Date().toISOString(),
    time: '2:30 PM',
    client: {
      id: 'client-2',
      name: 'Robert Brown',
      email: 'robert@example.com',
      phone: '555-987-6543'
    },
    staff: {
      id: 'staff-2',
      name: 'Sophia Garcia'
    },
    status: 'pending',
    notes: ''
  },
  {
    id: 'appt-3',
    service: 'Facial',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    time: '11:15 AM',
    client: {
      id: 'client-3',
      name: 'Michael Wilson',
      email: 'michael@example.com',
      phone: '555-456-7890'
    },
    staff: {
      id: 'staff-3',
      name: 'Daniel Kim'
    },
    status: 'confirmed',
    notes: 'Allergic to certain products'
  }
];

const ManagerAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading appointments from API
    setTimeout(() => {
      const storedAppointments = localStorage.getItem('salonifyAppointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        setAppointments(initialAppointments);
        localStorage.setItem('salonifyAppointments', JSON.stringify(initialAppointments));
      }
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      filterAppointments();
    }
  }, [appointments, selectedDate, statusFilter]);

  const filterAppointments = () => {
    let filtered = [...appointments];
    
    // Filter by date if selected
    if (selectedDate) {
      const dateString = selectedDate.toDateString();
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.date).toDateString();
        return apptDate === dateString;
      });
    }
    
    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }
    
    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    const updatedAppointments = appointments.map(appt => 
      appt.id === appointmentId ? { ...appt, status: newStatus } : appt
    );
    
    setAppointments(updatedAppointments);
    localStorage.setItem('salonifyAppointments', JSON.stringify(updatedAppointments));
    
    toast({
      title: "Appointment updated",
      description: `Appointment status changed to ${newStatus}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading appointments...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Filter Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="border rounded-md p-3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedDate(new Date());
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">
          {selectedDate ? (
            <>Appointments for {selectedDate.toLocaleDateString()}</>
          ) : (
            <>All Appointments</>
          )}
        </h2>
        
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg">
            <Clock className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <p className="text-muted-foreground">No appointments found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appointment => (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="flex border-l-4 border-salon">
                  <div className="flex-grow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{appointment.service}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.time} with {appointment.staff.name}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm">
                        <span className="font-medium">Client:</span> {appointment.client.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Contact:</span> {appointment.client.phone}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm mt-2 italic">
                          Note: {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex flex-col justify-center border-l p-3 space-y-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <div className="flex flex-col justify-center border-l p-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerAppointments;
