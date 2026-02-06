import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ParkingSlot } from '@/types/parking';
import { format, addHours, setHours, setMinutes, isAfter } from 'date-fns';

interface BookingModalProps {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slotId: string, startTime: Date, endTime: Date) => void;
  holdTimeRemaining: number; // in seconds
}

const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const label = format(setMinutes(setHours(new Date(), hour), minute), 'h:mm a');
      options.push({ value: time, label });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export const BookingModal = ({ slot, isOpen, onClose, onConfirm, holdTimeRemaining }: BookingModalProps) => {
  const [fromTime, setFromTime] = useState<string>('');
  const [toTime, setToTime] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Default to next hour
      const now = new Date();
      const nextHour = addHours(now, 1);
      const defaultFrom = `${String(nextHour.getHours()).padStart(2, '0')}:00`;
      const defaultTo = `${String(addHours(nextHour, 2).getHours()).padStart(2, '0')}:00`;
      setFromTime(defaultFrom);
      setToTime(defaultTo);
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!fromTime || !toTime) {
      setError('Please select both start and end times');
      return;
    }

    const today = new Date();
    const [fromHour, fromMinute] = fromTime.split(':').map(Number);
    const [toHour, toMinute] = toTime.split(':').map(Number);
    
    const startTime = setMinutes(setHours(today, fromHour), fromMinute);
    const endTime = setMinutes(setHours(today, toHour), toMinute);

    if (!isAfter(endTime, startTime)) {
      setError('End time must be after start time');
      return;
    }

    if (slot) {
      onConfirm(slot.id, startTime, endTime);
    }
  };

  const formatHoldTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Book Parking Slot {slot.id}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select your parking time. Slot is held for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hold Timer */}
          <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-yellow-800">Time remaining to confirm</p>
              <p className="text-2xl font-bold text-yellow-600 font-mono">
                {formatHoldTime(holdTimeRemaining)}
              </p>
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-time">From Time</Label>
              <Select value={fromTime} onValueChange={setFromTime}>
                <SelectTrigger id="from-time">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-time">To Time</Label>
              <Select value={toTime} onValueChange={setToTime}>
                <SelectTrigger id="to-time">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIME_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
