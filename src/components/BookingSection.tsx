
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BookingSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !email || !phone || !service || !date) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate booking process
    setTimeout(() => {
      // Get the logged in user
      const userJson = localStorage.getItem('salonifyUser');
      const userId = userJson ? JSON.parse(userJson).email : 'guest';

      // Save appointment
      const appointments = JSON.parse(localStorage.getItem(`appointments-${userId}`) || '[]');
      const newAppointment = {
        id: `appt-${Date.now()}`,
        date: new Date(date),
        time: '10:00 AM', // Default time
        service,
        stylist: 'Emma Johnson', // Default stylist
        status: 'upcoming'
      };
      
      localStorage.setItem(`appointments-${userId}`, JSON.stringify([...appointments, newAppointment]));
      
      // Create notification
      const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
      const newNotification = {
        id: `notif-${Date.now()}`,
        title: 'New Appointment Booked',
        message: `Your ${service} appointment has been scheduled for ${new Date(date).toLocaleDateString()}`,
        date: new Date(),
        read: false
      };
      
      localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));

      toast.success("Appointment booked successfully!");
      
      // Redirect after booking
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
      setIsSubmitting(false);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setService('');
      setDate('');
    }, 1000);
  };

  return (
    <section id="booking" className="salon-section bg-salon text-white">
      <div className="salon-container">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Look?</h2>
            <p className="text-salon-foreground/90 mb-6 max-w-md">
              Book your appointment today and let our expert stylists help you achieve the look you've always wanted.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p>Experience expert hair styling</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p>Luxurious and relaxing atmosphere</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p>Premium products and techniques</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-5/12 bg-white text-foreground p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-salon-dark">Book Your Appointment</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haircut">Haircut & Styling</SelectItem>
                      <SelectItem value="coloring">Hair Coloring</SelectItem>
                      <SelectItem value="treatment">Hair Treatment</SelectItem>
                      <SelectItem value="spa">Spa Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-salon hover:bg-salon-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
