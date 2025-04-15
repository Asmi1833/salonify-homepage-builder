
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, Star, MessageSquare } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ServiceRecord {
  id: string;
  date: Date;
  service: string;
  stylist: string;
  price: string;
  status: 'completed' | 'cancelled';
  hasReview: boolean;
  reviewRating?: number;
  reviewText?: string;
}

const DEFAULT_SERVICE_HISTORY: ServiceRecord[] = [
  {
    id: 'service-1',
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    service: 'Haircut & Styling',
    stylist: 'Emma Johnson',
    price: '$45',
    status: 'completed',
    hasReview: true,
    reviewRating: 5,
    reviewText: 'Emma was fantastic! My hair has never looked better.'
  },
  {
    id: 'service-2',
    date: new Date(Date.now() - 86400000 * 15), // 15 days ago
    service: 'Hair Coloring',
    stylist: 'Michael Davis',
    price: '$85',
    status: 'completed',
    hasReview: false
  },
  {
    id: 'service-3',
    date: new Date(Date.now() - 86400000 * 30), // 30 days ago
    service: 'Manicure',
    stylist: 'Sophia Lee',
    price: '$35',
    status: 'cancelled',
    hasReview: false
  },
  {
    id: 'service-4',
    date: new Date(Date.now() - 86400000 * 45), // 45 days ago
    service: 'Spa Facial',
    stylist: 'James Wilson',
    price: '$75',
    status: 'completed',
    hasReview: true,
    reviewRating: 4,
    reviewText: 'Very relaxing experience. Would come back again.'
  }
];

interface ServiceHistoryProps {
  userId: string;
}

const ServiceHistory: React.FC<ServiceHistoryProps> = ({ userId }) => {
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewService, setReviewService] = useState<ServiceRecord | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  
  useEffect(() => {
    // Get service history from local storage
    const storedHistory = localStorage.getItem(`service-history-${userId}`);
    if (storedHistory) {
      // Convert date strings back to Date objects
      const parsedHistory = JSON.parse(storedHistory, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setServiceHistory(parsedHistory);
    } else {
      // For demo purposes, set some default service history
      setServiceHistory(DEFAULT_SERVICE_HISTORY);
      saveServiceHistory(DEFAULT_SERVICE_HISTORY);
    }
  }, [userId]);
  
  const saveServiceHistory = (history: ServiceRecord[]) => {
    localStorage.setItem(`service-history-${userId}`, JSON.stringify(history));
  };
  
  const handleAddReview = () => {
    if (!reviewService) return;
    
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }
    
    const updatedHistory = serviceHistory.map(service => 
      service.id === reviewService.id 
        ? { 
            ...service, 
            hasReview: true, 
            reviewRating: rating, 
            reviewText: reviewText 
          }
        : service
    );
    
    setServiceHistory(updatedHistory);
    saveServiceHistory(updatedHistory);
    
    // Save notification for the stylist (in a real app, this would be saved to the stylist's notifications)
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Review Submitted',
      message: `You've left a ${rating}-star review for your ${reviewService.service} with ${reviewService.stylist}.`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    setIsReviewOpen(false);
    setReviewService(null);
    setRating(5);
    setReviewText('');
    toast.success('Review submitted successfully');
  };
  
  const openReviewDialog = (service: ServiceRecord) => {
    setReviewService(service);
    setIsReviewOpen(true);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Service History</h2>
      
      {serviceHistory.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Stylist</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceHistory.sort((a, b) => b.date.getTime() - a.date.getTime()).map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium">{format(record.date, 'MMM d, yyyy')}</div>
                  </TableCell>
                  <TableCell>{record.service}</TableCell>
                  <TableCell>{record.stylist}</TableCell>
                  <TableCell className="hidden md:table-cell">{record.price}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'completed' ? 'default' : 'destructive'}>
                      {record.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.status === 'completed' && !record.hasReview ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => openReviewDialog(record)}
                      >
                        <Star className="h-4 w-4" />
                        Review
                      </Button>
                    ) : record.hasReview ? (
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: record.reviewRating || 0 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    ) : <div>—</div>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Service History</h3>
          <p className="text-muted-foreground">
            You haven't had any services with us yet. Book an appointment to get started.
          </p>
        </div>
      )}
      
      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {reviewService?.service} by {reviewService?.stylist}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{reviewService && format(reviewService.date, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{reviewService?.service} with {reviewService?.stylist}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`p-1 ${star <= rating ? 'text-amber-500' : 'text-muted-foreground'}`}
                    onClick={() => setRating(star)}
                  >
                    <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Your Review
              </label>
              <Textarea
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-salon hover:bg-salon-dark"
              onClick={handleAddReview}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceHistory;
