
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ClockIcon, Trash, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import { toast } from 'sonner';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  service: string;
  stylist: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentsListProps {
  userId: string;
}

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    time: '10:00 AM',
    service: 'Haircut & Styling',
    stylist: 'Emma Johnson',
    status: 'upcoming'
  },
  {
    id: 'appt-2',
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    time: '2:30 PM',
    service: 'Hair Coloring',
    stylist: 'Michael Davis',
    status: 'upcoming'
  },
  {
    id: 'appt-3',
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    time: '11:15 AM',
    service: 'Spa Services',
    stylist: 'Sophia Lee',
    status: 'completed'
  }
];

const AVAILABLE_TIMES = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

const SERVICES = [
  'Haircut & Styling', 'Hair Coloring', 'Hair Treatment', 'Spa Services',
  'Manicure', 'Pedicure', 'Facial', 'Makeup'
];

const STYLISTS = [
  'Emma Johnson', 'Michael Davis', 'Sophia Lee', 
  'James Wilson', 'Olivia Smith', 'Daniel Brown'
];

const AppointmentsList: React.FC<AppointmentsListProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [stylist, setStylist] = useState<string>('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Fetch appointments (simulated)
  useEffect(() => {
    const savedAppointments = localStorage.getItem(`appointments-${userId}`);
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setAppointments(parsedAppointments);
    } else {
      // For demo purposes, set default appointments
      setAppointments(DEFAULT_APPOINTMENTS);
      saveAppointments(DEFAULT_APPOINTMENTS);
    }
  }, [userId]);

  const saveAppointments = (appointments: Appointment[]) => {
    localStorage.setItem(`appointments-${userId}`, JSON.stringify(appointments));
  };

  const handleBookAppointment = () => {
    if (!date || !time || !service || !stylist) {
      toast.error('Please fill out all fields');
      return;
    }

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      date,
      time,
      service,
      stylist,
      status: 'upcoming'
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    // Save notification
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Appointment Booked',
      message: `You've booked a ${service} appointment on ${format(date, 'PPP')} at ${time}`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    toast.success('Appointment booked successfully!');
    setIsBookingOpen(false);
    resetForm();
  };

  const handleUpdateAppointment = () => {
    if (!editingAppointment || !date || !time || !service || !stylist) {
      toast.error('Please fill out all fields');
      return;
    }

    const updatedAppointments = appointments.map(appointment => 
      appointment.id === editingAppointment.id 
        ? { ...appointment, date, time, service, stylist }
        : appointment
    );

    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    // Save notification
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Appointment Updated',
      message: `Your ${service} appointment has been rescheduled to ${format(date, 'PPP')} at ${time}`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    toast.success('Appointment updated successfully!');
    setEditingAppointment(null);
    resetForm();
  };

  const handleCancelAppointment = (id: string) => {
    const appointmentToCancel = appointments.find(appt => appt.id === id);
    if (!appointmentToCancel) return;

    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, status: 'cancelled' as const }
        : appointment
    );

    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
    
    // Save notification
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Appointment Cancelled',
      message: `Your ${appointmentToCancel.service} appointment on ${format(appointmentToCancel.date, 'PPP')} has been cancelled`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    toast.success('Appointment cancelled successfully');
  };

  const startEditing = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setDate(appointment.date);
    setTime(appointment.time);
    setService(appointment.service);
    setStylist(appointment.stylist);
  };

  const resetForm = () => {
    setDate(new Date());
    setTime('');
    setService('');
    setStylist('');
  };

  const upcomingAppointments = appointments.filter(appt => 
    appt.status === 'upcoming' && new Date(appt.date) >= new Date()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const pastAppointments = appointments.filter(appt => 
    appt.status === 'completed' || appt.status === 'cancelled' || new Date(appt.date) < new Date()
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Appointments</h2>
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button className="bg-salon hover:bg-salon-dark">Book New Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to book your salon appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_TIMES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stylist">Stylist</Label>
                <Select value={stylist} onValueChange={setStylist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLISTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-salon hover:bg-salon-dark"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Appointment Dialog */}
        <Dialog 
          open={editingAppointment !== null} 
          onOpenChange={(open) => !open && setEditingAppointment(null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Appointment</DialogTitle>
              <DialogDescription>
                Make changes to your appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_TIMES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stylist">Stylist</Label>
                <Select value={stylist} onValueChange={setStylist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stylist" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLISTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setEditingAppointment(null)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-salon hover:bg-salon-dark"
                onClick={handleUpdateAppointment}
              >
                Update Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {upcomingAppointments.length > 0 ? (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{appointment.service}</CardTitle>
                  <CardDescription>with {appointment.stylist}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 mr-2 text-salon" />
                    <span>{format(new Date(appointment.date), 'PPP')}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <ClockIcon className="h-4 w-4 mr-2 text-salon" />
                    <span>{appointment.time}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => startEditing(appointment)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center bg-muted rounded-lg mb-8">
          <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
          <p className="text-muted-foreground mb-4">Book a new appointment to get started</p>
          <Button 
            className="bg-salon hover:bg-salon-dark"
            onClick={() => setIsBookingOpen(true)}
          >
            Book Now
          </Button>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Past Appointments</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Stylist</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.service}</TableCell>
                    <TableCell>{format(new Date(appointment.date), 'PPP')}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.stylist}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        appointment.status === 'completed' 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      )}>
                        {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
