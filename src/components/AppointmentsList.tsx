
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { CalendarCheck, Clock, MapPin, MoreVertical, Edit, Trash, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, UserRole } from '@/utils/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BookingType {
  id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  stylist: string;
  status: string;
  price: number;
  location_id: number;
  user_id: string;
  payment_method: string;
  notes?: string;
  created_at: string;
}

interface AppointmentsListProps {
  forRole?: UserRole;
  userId?: string;
  locationId?: number;
  limit?: number;
}

const AVAILABLE_TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const AppointmentsList: React.FC<AppointmentsListProps> = ({ 
  forRole = 'client',
  userId = '',
  locationId,
  limit
}) => {
  const [appointments, setAppointments] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingType | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editService, setEditService] = useState('');
  const [editStylist, setEditStylist] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Fetch user and appointments on component mount
  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUserId(user.id);
        setUserRole(user.role);
        
        // If no specific userId is provided, use the current user's ID
        const targetUserId = userId || user.id;
        await fetchAppointments(targetUserId);
      }
    };
    
    fetchUserAndAppointments();
  }, [userId, locationId]);

  const fetchAppointments = async (targetUserId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true });
      
      // Apply filters based on role and parameters
      if (forRole === 'client') {
        query = query.eq('user_id', targetUserId);
      } else if ((forRole === 'staff' || forRole === 'manager') && locationId) {
        query = query.eq('location_id', locationId);
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        return;
      }
      
      if (data) {
        setAppointments(data as BookingType[]);
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBooking = (booking: BookingType) => {
    setCurrentBooking(booking);
    setEditDate(booking.booking_date);
    setEditTime(booking.booking_time);
    setEditService(booking.service);
    setEditStylist(booking.stylist);
    setIsEditModalOpen(true);
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmCancel) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Appointment cancelled successfully');
      // Update the local state to reflect the cancellation
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === bookingId ? { ...appt, status: 'cancelled' } : appt
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };
  
  const saveEditedBooking = async () => {
    if (!currentBooking) return;
    
    try {
      // Format the date as a string for Supabase
      const formattedDate = format(new Date(editDate), 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: formattedDate,
          booking_time: editTime,
          service: editService,
          stylist: editStylist
        })
        .eq('id', currentBooking.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Appointment updated successfully');
      setIsEditModalOpen(false);
      
      // Refresh appointments list
      if (userId) {
        fetchAppointments(userId);
      } else {
        fetchAppointments(currentUserId);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  // Filter appointments by status for tabs
  const upcomingAppointments = appointments.filter(appt => appt.status !== 'cancelled' && appt.status !== 'completed');
  const pastAppointments = appointments.filter(appt => appt.status === 'completed');
  const cancelledAppointments = appointments.filter(appt => appt.status === 'cancelled');
  
  // Get the appropriate list based on active tab
  const getAppointmentsList = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingAppointments;
      case 'past':
        return pastAppointments;
      case 'cancelled':
        return cancelledAppointments;
      default:
        return upcomingAppointments;
    }
  };
  
  const currentList = getAppointmentsList();

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateStr);
      return dateStr;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading appointments...</div>;
  }

  return (
    <div>
      {appointments.length > 0 ? (
        <>
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upcoming">
                Upcoming
                {upcomingAppointments.length > 0 && (
                  <Badge className="ml-2 bg-salon">{upcomingAppointments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                Past
                {pastAppointments.length > 0 && (
                  <Badge className="ml-2 bg-gray-500">{pastAppointments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                {cancelledAppointments.length > 0 && (
                  <Badge className="ml-2 bg-red-500">{cancelledAppointments.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole={userRole}
                      formatDate={formatDate}
                      getStatusBadgeColor={getStatusBadgeColor}
                      onEdit={handleEditBooking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No past appointments</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pastAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole={userRole}
                      formatDate={formatDate}
                      getStatusBadgeColor={getStatusBadgeColor}
                      onEdit={handleEditBooking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {cancelledAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No cancelled appointments</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cancelledAppointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      userRole={userRole}
                      formatDate={formatDate}
                      getStatusBadgeColor={getStatusBadgeColor}
                      onEdit={handleEditBooking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Edit Appointment Dialog */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Appointment</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Select value={editTime} onValueChange={setEditTime}>
                    <SelectTrigger id="edit-time">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TIMES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-stylist">Stylist</Label>
                  <Input
                    id="edit-stylist"
                    value={editStylist}
                    onChange={(e) => setEditStylist(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-service">Service</Label>
                  <Input
                    id="edit-service"
                    value={editService}
                    onChange={(e) => setEditService(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={saveEditedBooking} className="bg-salon hover:bg-salon-dark">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">No Appointments Found</h3>
          <p className="text-muted-foreground">
            You don't have any appointments scheduled yet.
          </p>
          <Button className="mt-4 bg-salon hover:bg-salon-dark" asChild>
            <a href="/locations">Book an Appointment</a>
          </Button>
        </div>
      )}
    </div>
  );
};

// Separate AppointmentCard component for better organization
interface AppointmentCardProps {
  appointment: BookingType;
  userRole: UserRole;
  formatDate: (date: string) => string;
  getStatusBadgeColor: (status: string) => string;
  onEdit: (booking: BookingType) => void;
  onCancel: (bookingId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  userRole,
  formatDate,
  getStatusBadgeColor,
  onEdit,
  onCancel
}) => {
  return (
    <Card key={appointment.id}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{appointment.service}</CardTitle>
            <CardDescription>with {appointment.stylist}</CardDescription>
          </div>
          <Badge className={getStatusBadgeColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid gap-2">
          <div className="flex items-center">
            <CalendarCheck className="h-4 w-4 mr-2 text-salon" />
            <span>{formatDate(appointment.booking_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-salon" />
            <span>{appointment.booking_time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-salon" />
            <span>Location #{appointment.location_id}</span>
          </div>
        </div>
        {appointment.notes && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground"><strong>Notes:</strong> {appointment.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <span className="font-medium">${appointment.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground ml-1">({appointment.payment_method})</span>
        </div>
        
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(userRole === 'admin' || userRole === 'manager' || userRole === 'staff') && (
                  <DropdownMenuItem onClick={() => onEdit(appointment)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Appointment
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onCancel(appointment.id)} className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Cancel Appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentsList;
