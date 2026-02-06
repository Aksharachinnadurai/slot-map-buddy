import { memo } from 'react';
import { ParkingSlot as ParkingSlotType } from '@/types/parking';
import { cn } from '@/lib/utils';

interface ParkingSlotProps {
  slot: ParkingSlotType;
  onClick: (slot: ParkingSlotType) => void;
  isUserSlot?: boolean;
}

const stateClasses: Record<ParkingSlotType['state'], string> = {
  available: 'bg-white border-gray-300 hover:border-primary hover:shadow-md cursor-pointer',
  selected: 'bg-yellow-400 border-yellow-500 shadow-lg animate-pulse cursor-pointer',
  booked: 'bg-green-500 border-green-600 cursor-pointer',
  parked: 'bg-red-500 border-red-600 cursor-pointer',
  unavailable: 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-70',
  emergency: 'bg-blue-500 border-blue-600 cursor-not-allowed',
};

export const ParkingSlotComponent = memo(({ slot, onClick, isUserSlot }: ParkingSlotProps) => {
  const handleClick = () => {
    if (slot.state === 'unavailable' || slot.state === 'emergency') return;
    onClick(slot);
  };

  return (
    <div
      className={cn(
        'absolute flex items-center justify-center text-xs font-medium transition-all duration-300 border-2 rounded-sm',
        stateClasses[slot.state],
        isUserSlot && 'ring-2 ring-primary ring-offset-1'
      )}
      style={{
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
      }}
      onClick={handleClick}
      title={`${slot.id} - ${slot.state}`}
    >
      <span className={cn(
        'text-[9px] font-semibold leading-none',
        slot.state === 'available' && 'text-gray-600',
        slot.state === 'selected' && 'text-yellow-900',
        (slot.state === 'booked' || slot.state === 'parked' || slot.state === 'emergency') && 'text-white',
        slot.state === 'unavailable' && 'text-gray-600'
      )}>
        {slot.id}
      </span>
    </div>
  );
});

ParkingSlotComponent.displayName = 'ParkingSlot';
