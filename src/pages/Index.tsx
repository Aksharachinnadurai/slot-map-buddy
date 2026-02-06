import { useState, useEffect, useCallback } from 'react';
import { FloorPlan } from '@/components/FloorPlan';
import { BookingModal } from '@/components/BookingModal';
import { ArrivalModal } from '@/components/ArrivalModal';
import { AuthModal } from '@/components/AuthModal';
import { UserDashboard } from '@/components/UserDashboard';
import { useParkingState } from '@/hooks/useParkingState';
import { ParkingSlot, User } from '@/types/parking';
import { toast } from 'sonner';

const Index = () => {
  const {
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
  } = useParkingState();

  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isArrivalModalOpen, setIsArrivalModalOpen] = useState(false);
  const [holdTimeRemaining, setHoldTimeRemaining] = useState(300);

  const userBookings = getUserBookings();
  const userSlotIds = userBookings.map(b => b.slotId);

  // Update hold timer
  useEffect(() => {
    if (!selectedSlot || !isBookingModalOpen) return;
    
    const slot = getSlotById(selectedSlot.id);
    if (!slot?.holdExpiry) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(slot.holdExpiry!).getTime() - Date.now()) / 1000));
      setHoldTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsBookingModalOpen(false);
        setSelectedSlot(null);
        toast.error('Booking time expired. Slot released.');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedSlot, isBookingModalOpen, getSlotById]);

  const handleSlotClick = useCallback((slot: ParkingSlot) => {
    if (!currentUser) return;

    if (slot.state === 'available') {
      selectSlot(slot.id, currentUser.id);
      setSelectedSlot(slot);
      setHoldTimeRemaining(300);
      setIsBookingModalOpen(true);
    } else if (slot.state === 'booked' || slot.state === 'parked') {
      // Check if this is user's slot
      const booking = userBookings.find(b => b.slotId === slot.id);
      if (booking) {
        setSelectedSlot(slot);
        setIsArrivalModalOpen(true);
      }
    } else if (slot.state === 'selected' && slot.bookedBy === currentUser.id) {
      // Re-open booking modal for held slot
      setSelectedSlot(slot);
      setIsBookingModalOpen(true);
    }
  }, [currentUser, selectSlot, userBookings]);

  const handleBookingConfirm = useCallback((slotId: string, startTime: Date, endTime: Date) => {
    confirmBooking(slotId, startTime, endTime);
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    toast.success('Parking slot booked successfully!');
  }, [confirmBooking]);

  const handleBookingCancel = useCallback(() => {
    if (selectedSlot) {
      releaseHold(selectedSlot.id);
    }
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  }, [selectedSlot, releaseHold]);

  const handleArrived = useCallback((slotId: string) => {
    markArrived(slotId);
    setIsArrivalModalOpen(false);
    setSelectedSlot(null);
    toast.success('Welcome! You are now parked.');
  }, [markArrived]);

  const handleCancelBooking = useCallback((slotId: string) => {
    cancelBooking(slotId);
    setIsArrivalModalOpen(false);
    setSelectedSlot(null);
    toast.info('Booking cancelled.');
  }, [cancelBooking]);

  const handleUserComplete = useCallback((user: User) => {
    loginUser(user);
    toast.success(`Welcome, ${user.name}!`);
  }, [loginUser]);

  const currentBooking = selectedSlot ? userBookings.find(b => b.slotId === selectedSlot.id) : undefined;
  const currentSlotForModal = selectedSlot ? getSlotById(selectedSlot.id) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Auth Modal - shown if no user */}
      <AuthModal 
        isOpen={!currentUser} 
        onComplete={handleUserComplete} 
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-foreground">S Parking</span>
          </div>
          {currentUser && (
            <div className="text-sm text-muted-foreground">
              {userBookings.length} active booking{userBookings.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* User Dashboard - Side panel on desktop, top on mobile */}
        {currentUser && (
          <aside className="lg:w-80 lg:min-h-[calc(100vh-3.5rem)] lg:border-r border-border p-4 bg-muted/30">
            <UserDashboard
              user={currentUser}
              bookings={bookings}
              slots={slots}
              onCancelBooking={handleCancelBooking}
              onLogout={logoutUser}
            />
          </aside>
        )}

        {/* Floor Plan */}
        <main className="flex-1 overflow-auto">
          <FloorPlan
            slots={slots}
            onSlotClick={handleSlotClick}
            userSlotIds={userSlotIds}
          />
        </main>
      </div>

      {/* Booking Modal */}
      <BookingModal
        slot={currentSlotForModal}
        isOpen={isBookingModalOpen}
        onClose={handleBookingCancel}
        onConfirm={handleBookingConfirm}
        holdTimeRemaining={holdTimeRemaining}
      />

      {/* Arrival Modal */}
      <ArrivalModal
        slot={currentSlotForModal}
        booking={currentBooking}
        isOpen={isArrivalModalOpen}
        onClose={() => setIsArrivalModalOpen(false)}
        onArrived={handleArrived}
        onCancel={handleCancelBooking}
      />
    </div>
  );
};

export default Index;
