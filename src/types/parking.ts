export type SlotState = 'available' | 'selected' | 'booked' | 'parked' | 'unavailable' | 'emergency';

export interface ParkingSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  state: SlotState;
  zone: 'available' | 'unavailable' | 'emergency';
  bookedBy?: string;
  bookingStart?: Date;
  bookingEnd?: Date;
  holdExpiry?: Date;
}

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  vehicleNumber: string;
}

export interface ParkingZone {
  id: string;
  name: string;
  type: 'parking' | 'aisle' | 'structure' | 'entry';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
