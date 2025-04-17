
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar, Star, Clock } from 'lucide-react';

// Mock client data
const initialClients = [
  {
    id: 'client-1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-123-4567',
    profileImage: '',
    joinDate: '2023-04-15',
    preferences: ['Long hair', 'Natural products', 'Blonde highlights'],
    appointments: [
      {
        id: 'appt-101',
        service: 'Haircut & Style',
        date: '2023-11-20',
        time: '10:00 AM',
        staff: 'Emma Johnson',
        status: 'completed',
        notes: 'Trimmed 2 inches, styled with waves',
        rating: 5
      },
      {
        id: 'appt-102',
        service: 'Color Touch-up',
        date: '2023-12-18',
        time: '11:30 AM',
        staff: 'Emma Johnson',
        status: 'completed',
        notes: 'Blonde highlights, used organic color',
        rating: 4
      }
    ]
  },
  {
    id: 'client-2',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '555-987-6543',
    profileImage: '',
    joinDate: '2023-05-22',
    preferences: ['Short hair', 'Beard trim', 'Classic style'],
    appointments: [
      {
        id: 'appt-103',
        service: 'Men\'s Haircut',
        date: '2023-10-05',
        time: '2:30 PM',
        staff: 'Daniel Kim',
        status: 'completed',
        notes: 'Short on sides, textured on top',
        rating: 5
      },
      {
        id: 'appt-104',
        service: 'Beard Trim',
        date: '2023-11-07',
        time: '3:00 PM',
        staff: 'Daniel Kim',
        status: 'completed',
        notes: 'Shaped beard with straight razor',
        rating: 5
      },
      {
        id: 'appt-105',
        service: 'Men\'s Haircut & Beard Trim',
        date: '2023-12-10',
        time: '10:00 AM',
        staff: 'Daniel Kim',
        status: 'completed',
        notes: 'Maintained same style, cleaned up neck',
        rating: 4
      }
    ]
  },
  {
    id: 'client-3',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    phone: '555-321-7654',
    profileImage: '',
    joinDate: '2023-07-08',
    preferences: ['Curly hair', 'Natural style', 'Low maintenance'],
    appointments: [
      {
        id: 'appt-106',
        service: 'Curly Cut',
        date: '2023-09-12',
        time: '11:00 AM',
        staff: 'Sophia Garcia',
        status: 'completed',
        notes: 'Dry cut for curly hair, shaped layers',
        rating: 5
      },
      {
        id: 'appt-107',
        service: 'Deep Conditioning Treatment',
        date: '2023-10-17',
        time: '2:00 PM',
        staff: 'Sophia Garcia',
        status: 'completed',
        notes: 'Hydrating treatment for curls',
        rating: 5
      }
    ]
  }
];

const ManagerClientHistory: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading client data from API
    setTimeout(() => {
      const storedClients = localStorage.getItem('salonifyClients');
      if (storedClients) {
        setClients(JSON.parse(storedClients));
        setFilteredClients(JSON.parse(storedClients));
      } else {
        setClients(initialClients);
        setFilteredClients(initialClients);
        localStorage.setItem('salonifyClients', JSON.stringify(initialClients));
      }
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (clients.length > 0) {
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const selectClient = (client: any) => {
    setSelectedClient(client);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading client data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredClients.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No clients found</p>
              ) : (
                filteredClients.map(client => (
                  <div 
                    key={client.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${
                      selectedClient?.id === client.id 
                        ? 'bg-salon/10 border-salon/20 border' 
                        : 'hover:bg-slate-100 border border-transparent'
                    }`}
                    onClick={() => selectClient(client)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.profileImage} />
                      <AvatarFallback className="bg-slate-200">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.phone}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        {selectedClient ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedClient.profileImage} />
                    <AvatarFallback className="bg-salon text-white text-lg">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{selectedClient.name}</CardTitle>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                      <p>{selectedClient.email}</p>
                      <p>{selectedClient.phone}</p>
                    </div>
                    <p className="text-xs flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Client since {new Date(selectedClient.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Preferences & Notes</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedClient.preferences.map((pref: string, index: number) => (
                        <Badge key={index} variant="outline">{pref}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Appointment History</h3>
                    <div className="space-y-3">
                      {selectedClient.appointments.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No appointment history</p>
                      ) : (
                        selectedClient.appointments
                          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((appt: any) => (
                            <Card key={appt.id} className="overflow-hidden">
                              <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium">{appt.service}</h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> 
                                      {new Date(appt.date).toLocaleDateString()} at {appt.time}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" /> 
                                      with {appt.staff}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    {getStarRating(appt.rating)}
                                  </div>
                                </div>
                                
                                {appt.notes && (
                                  <p className="text-sm mt-2 p-2 bg-slate-50 rounded-md">
                                    {appt.notes}
                                  </p>
                                )}
                              </div>
                            </Card>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg p-10 text-center">
            <div>
              <Avatar className="h-16 w-16 mx-auto mb-4 bg-slate-200">
                <AvatarFallback>
                  <Users className="h-8 w-8 text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium mb-2">Client Details</h3>
              <p className="text-muted-foreground">
                Select a client from the list to view their appointment history and preferences.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerClientHistory;
