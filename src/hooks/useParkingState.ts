import { useState, useCallback, useEffect } from 'react';
import { ParkingSlot, SlotState, Booking, User } from '@/types/parking';
import { generateParkingSlots } from '@/data/parkingLayout';

const HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const useParkingState = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>(() => generateParkingSlots());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('parking_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Check for expired holds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSlots(prev => prev.map(slot => {
        if (slot.state === 'selected' && slot.holdExpiry && new Date(slot.holdExpiry) < now) {
          return { ...slot, state: 'available' as SlotState, holdExpiry: undefined, bookedBy: undefined };
        }
        return slot;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectSlot = useCallback((slotId: string, userId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId && slot.state === 'available') {
        return {
          ...slot,
          state: 'selected' as SlotState,
          bookedBy: userId,
          holdExpiry: new Date(Date.now() + HOLD_DURATION_MS),
        };
      }
      return slot;
    }));
  }, []);

  const confirmBooking = useCallback((slotId: string, startTime: Date, endTime: Date) => {
    if (!currentUser) return;

    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      slotId,
      userId: currentUser.id,
      startTime,
      endTime,
      createdAt: new Date(),
      status: 'active',
    };

    setBookings(prev => [...prev, newBooking]);
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          state: 'booked' as SlotState,
          bookingStart: startTime,
          bookingEnd: endTime,
          holdExpiry: undefined,
        };
      }
      return slot;
    }));
  }, [currentUser]);

  const cancelBooking = useCallback((slotId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.slotId === slotId && booking.status === 'active'
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ));
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId && (slot.state === 'booked' || slot.state === 'parked')) {
        return {
          ...slot,
          state: 'available' as SlotState,
          bookedBy: undefined,
          bookingStart: undefined,
          bookingEnd: undefined,
        };
      }
      return slot;
    }));
  }, []);

  const markArrived = useCallback((slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId && slot.state === 'booked') {
        return { ...slot, state: 'parked' as SlotState };
      }
      return slot;
    }));
  }, []);

  const releaseHold = useCallback((slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId && slot.state === 'selected') {
        return {
          ...slot,
          state: 'available' as SlotState,
          bookedBy: undefined,
          holdExpiry: undefined,
        };
      }
      return slot;
    }));
  }, []);

  const loginUser = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('parking_user', JSON.stringify(user));
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('parking_user');
  }, []);

  const getUserBookings = useCallback(() => {
    if (!currentUser) return [];
    return bookings.filter(b => b.userId === currentUser.id && b.status === 'active');
  }, [bookings, currentUser]);

  const getSlotById = useCallback((slotId: string) => {
    return slots.find(s => s.id === slotId);
  }, [slots]);

  return {
    slots,
    bookings,
    currentUser,
    selectSlot,
    confirmBooking,
    cancelBooking,
    markArrived,
    releaseHold,
    loginUser,
    logoutUser,
    getUserBookings,
    getSlotById,
  };
};
