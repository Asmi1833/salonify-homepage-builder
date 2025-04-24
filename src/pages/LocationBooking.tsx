import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SalonNavbar from '@/components/SalonNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MapPin, Phone, Clock, CalendarCheck, Scissors, User, Mail, CreditCard } from 'lucide-react';
import { isAuthenticated, getCurrentUser } from '@/utils/auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';

const SALON_LOCATIONS = [
  {
    id: 1,
    name: 'Salonify Downtown',
    address: '123 Main St, Downtown',
    city: 'New York',
    phone: '(212) 555-1234',
    hours: 'Mon-Sat: 9am-7pm, Sun: 10am-5pm',
    area: 'Downtown',
    services: ['Haircut', 'Styling', 'Coloring', 'Spa'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 1, name: 'Emma Johnson', specialty: 'Hair Stylist' },
      { id: 2, name: 'Michael Chen', specialty: 'Colorist' },
      { id: 3, name: 'Sarah Williams', specialty: 'Spa Specialist' }
    ]
  },
  {
    id: 2,
    name: 'Salonify Uptown',
    address: '456 Park Ave, Uptown',
    city: 'New York',
    phone: '(212) 555-5678',
    hours: 'Mon-Sat: 10am-8pm, Sun: 10am-6pm',
    area: 'Uptown',
    services: ['Haircut', 'Styling', 'Treatment', 'Nail Care'],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 4, name: 'David Thompson', specialty: 'Hair Stylist' },
      { id: 5, name: 'Jessica Lee', specialty: 'Treatment Specialist' },
      { id: 6, name: 'Rebecca Martinez', specialty: 'Nail Artist' }
    ]
  },
  {
    id: 3,
    name: 'Salonify Brooklyn',
    address: '789 Atlantic Ave, Brooklyn',
    city: 'New York',
    phone: '(718) 555-9012',
    hours: 'Mon-Sat: 9am-8pm, Sun: 11am-6pm',
    area: 'Brooklyn',
    services: ['Haircut', 'Styling', 'Coloring', 'Makeup'],
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 7, name: 'James Wilson', specialty: 'Hair Stylist' },
      { id: 8, name: 'Nicole Brown', specialty: 'Makeup Artist' },
      { id: 9, name: 'Daniel Garcia', specialty: 'Colorist' }
    ]
  },
  {
    id: 4,
    name: 'Salonify Queens',
    address: '321 Queens Blvd, Queens',
    city: 'New York',
    phone: '(718) 555-3456',
    hours: 'Mon-Sat: 10am-7pm, Sun: Closed',
    area: 'Queens',
    services: ['Haircut', 'Coloring', 'Spa', 'Waxing'],
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 10, name: 'Olivia Smith', specialty: 'Hair Stylist' },
      { id: 11, name: 'Robert Kim', specialty: 'Colorist' },
      { id: 12, name: 'Amanda Patel', specialty: 'Spa Specialist' }
    ]
  },
  {
    id: 5,
    name: 'Salonify Bronx',
    address: '654 Grand Concourse, Bronx',
    city: 'New York',
    phone: '(718) 555-7890',
    hours: 'Mon-Sat: 9am-6pm, Sun: Closed',
    area: 'Bronx',
    services: ['Haircut', 'Styling', 'Nail Care', 'Kids Haircut'],
    image: 'https://images.unsplash.com/photo-1610816312194-cbff3b0a6342?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 13, name: 'Thomas Clark', specialty: 'Hair Stylist' },
      { id: 14, name: 'Jennifer Lopez', specialty: 'Nail Artist' },
      { id: 15, name: 'Kevin Taylor', specialty: 'Kids Specialist' }
    ]
  },
  {
    id: 6,
    name: 'Salonify Staten Island',
    address: '987 Victory Blvd, Staten Island',
    city: 'New York',
    phone: '(718) 555-2345',
    hours: 'Mon-Sat: 10am-6pm, Sun: 11am-4pm',
    area: 'Staten Island',
    services: ['Haircut', 'Styling', 'Coloring', 'Beard Trim'],
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=500&h=350',
    stylists: [
      { id: 16, name: 'Christopher Adams', specialty: 'Hair Stylist' },
      { id: 17, name: 'Michelle Rodriguez', specialty: 'Colorist' },
      { id: 18, name: 'Brian Jackson', specialty: 'Barber' }
    ]
  }
];

const SERVICE_PRICES = {
  'haircut': { name: 'Haircut & Styling', price: 65 },
  'coloring': { name: 'Hair Coloring', price: 120 },
  'treatment': { name: 'Hair Treatment', price: 85 },
  'spa': { name: 'Spa Services', price: 95 },
  'styling': { name: 'Hair Styling', price: 55 },
  'makeup': { name: 'Makeup', price: 75 },
  'nailcare': { name: 'Nail Care', price: 45 },
  'waxing': { name: 'Waxing', price: 40 },
  'kidshaircut': { name: 'Kids Haircut', price: 35 },
  'beardtrim': { name: 'Beard Trim', price: 25 }
};

const AVAILABLE_TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const LocationBooking: React.FC = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [stylist, setStylist] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        setName(user.name);
        setEmail(user.email);
      }
    };
    
    fetchUserData();
    
    const locationData = SALON_LOCATIONS.find(loc => loc.id === Number(locationId));
    if (locationData) {
      setLocation(locationData);
    } else {
      toast.error("Location not found");
      navigate('/locations');
    }
  }, [locationId, navigate]);

  const handleBookAppointment = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to book an appointment");
      navigate('/login', { 
        state: { 
          from: `/locations/book/${locationId}`,
          message: "Please login to book an appointment" 
        }
      });
      return;
    }

    if (!name || !email || !phone || !date || !time || !service || !stylist) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsBooking(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Authentication error");
        return;
      }

      const serviceDetails = SERVICE_PRICES[service as keyof typeof SERVICE_PRICES];
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          location_id: Number(locationId),
          service: serviceDetails.name,
          booking_date: date,
          booking_time: time,
          stylist,
          payment_method: paymentMethod,
          price: serviceDetails.price,
          notes: ''
        });

      if (error) throw error;

      toast.success("Appointment booked successfully!");
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col">
        <SalonNavbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading location details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SalonNavbar />
      <main className="flex-grow py-12">
        <div className="salon-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
            <p className="text-muted-foreground">{location.address}, {location.city}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Book Your Appointment</CardTitle>
                  <CardDescription>Fill in the details below to book your appointment at {location.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Appointment Date</Label>
                        <div className="relative">
                          <CalendarCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="date"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Appointment Time</Label>
                        <Select value={time} onValueChange={setTime}>
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_TIMES.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service">Service</Label>
                        <div className="relative">
                          <Scissors className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Select value={service} onValueChange={setService}>
                            <SelectTrigger id="service" className="pl-8">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(SERVICE_PRICES).map(([key, val]) => (
                                <SelectItem key={key} value={key}>
                                  {val.name} - ${val.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stylist">Stylist</Label>
                        <Select value={stylist} onValueChange={setStylist}>
                          <SelectTrigger id="stylist">
                            <SelectValue placeholder="Select a stylist" />
                          </SelectTrigger>
                          <SelectContent>
                            {location.stylists.map((stylist: any) => (
                              <SelectItem key={stylist.id} value={stylist.name}>
                                {stylist.name} - {stylist.specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit_card" id="credit_card" />
                            <Label htmlFor="credit_card" className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Credit Card (Pay at salon)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash">Cash (Pay at salon)</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleBookAppointment} 
                    className="w-full bg-salon hover:bg-salon-dark"
                    disabled={isBooking}
                  >
                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{location.name}</CardTitle>
                  <CardDescription>{location.area}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex">
                    <MapPin className="h-5 w-5 mr-2 text-salon" />
                    <span>{location.address}, {location.city}</span>
                  </div>
                  <div className="flex">
                    <Phone className="h-5 w-5 mr-2 text-salon" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex">
                    <Clock className="h-5 w-5 mr-2 text-salon" />
                    <span>{location.hours}</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Available Services:</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service: string) => (
                        <span
                          key={service}
                          className="inline-block bg-muted px-2 py-1 text-xs rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationBooking;
