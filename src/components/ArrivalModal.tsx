import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ParkingSlot, Booking } from '@/types/parking';
import { format } from 'date-fns';
import { Car, X } from 'lucide-react';

interface ArrivalModalProps {
  slot: ParkingSlot | null;
  booking: Booking | undefined;
  isOpen: boolean;
  onClose: () => void;
  onArrived: (slotId: string) => void;
  onCancel: (slotId: string) => void;
}

export const ArrivalModal = ({ slot, booking, isOpen, onClose, onArrived, onCancel }: ArrivalModalProps) => {
  if (!slot || !booking) return null;

  const isParked = slot.state === 'parked';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isParked ? 'You are parked' : 'Have you arrived?'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Slot {slot.id} - {format(new Date(booking.startTime), 'h:mm a')} to {format(new Date(booking.endTime), 'h:mm a')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Slot Info */}
          <div className={`flex items-center justify-center p-6 rounded-lg ${
            isParked ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                isParked ? 'bg-red-500' : 'bg-green-500'
              }`}>
                <Car className="w-8 h-8 text-white" />
              </div>
              <p className={`text-lg font-semibold ${isParked ? 'text-red-700' : 'text-green-700'}`}>
                {slot.id}
              </p>
              <p className={`text-sm ${isParked ? 'text-red-600' : 'text-green-600'}`}>
                {isParked ? 'Currently Parked' : 'Booked'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!isParked && (
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                onClick={() => onArrived(slot.id)}
              >
                <Car className="w-4 h-4 mr-2" />
                I've Arrived
              </Button>
            )}
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={() => onCancel(slot.id)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          </div>

          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
