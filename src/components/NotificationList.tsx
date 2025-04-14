
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationListProps {
  userId: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Appointment Reminder',
    message: 'Don\'t forget your haircut appointment tomorrow at 10:00 AM with Emma Johnson.',
    date: new Date(Date.now() - 86400000),
    read: false
  },
  {
    id: 'notif-2',
    title: 'Special Offer',
    message: 'Enjoy 20% off on all hair treatments this weekend!',
    date: new Date(Date.now() - 86400000 * 3),
    read: true
  }
];

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(`notifications-${userId}`);
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setNotifications(parsedNotifications);
    } else {
      // For demo purposes, set default notifications
      setNotifications(DEFAULT_NOTIFICATIONS);
      saveNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [userId]);

  const saveNotifications = (notifications: Notification[]) => {
    localStorage.setItem(`notifications-${userId}`, JSON.stringify(notifications));
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => (
      { ...notification, read: true }
    ));
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-2xl font-semibold">Your Notifications</h2>
          {unreadCount > 0 && (
            <div className="ml-3 bg-salon text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unreadCount} new
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                !notification.read && "border-salon/50 bg-salon/5"
              )}
            >
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center">
                    {!notification.read && (
                      <Bell className="h-4 w-4 mr-2 text-salon fill-salon animate-pulse" />
                    )}
                    {notification.title}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(notification.date), 'PPP')}
                  </CardDescription>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notification.message}</p>
              </CardContent>
              <CardFooter className="pt-0 justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-muted rounded-lg">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! We'll notify you about upcoming appointments and special offers.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
