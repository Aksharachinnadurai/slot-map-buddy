import { User, Booking, ParkingSlot } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Car, Clock, X, LogOut, User as UserIcon } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  bookings: Booking[];
  slots: ParkingSlot[];
  onCancelBooking: (slotId: string) => void;
  onLogout: () => void;
}

export const UserDashboard = ({ user, bookings, slots, onCancelBooking, onLogout }: UserDashboardProps) => {
  const activeBookings = bookings.filter(b => b.status === 'active');

  const getSlotState = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    return slot?.state || 'booked';
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{user.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{user.vehicleNumber}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Bookings</span>
            <Badge variant="secondary">{activeBookings.length}</Badge>
          </div>

          {activeBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active bookings. Tap a slot to book.
            </p>
          ) : (
            <div className="space-y-2">
              {activeBookings.map(booking => {
                const state = getSlotState(booking.slotId);
                return (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${
                        state === 'parked' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{booking.slotId}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onCancelBooking(booking.slotId)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
