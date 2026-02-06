import { memo } from 'react';
import { ParkingSlotComponent } from './ParkingSlot';
import { ParkingSlot } from '@/types/parking';
import { FLOOR_PLAN_DIMENSIONS, STRUCTURAL_ELEMENTS } from '@/data/parkingLayout';

interface FloorPlanProps {
  slots: ParkingSlot[];
  onSlotClick: (slot: ParkingSlot) => void;
  userSlotIds: string[];
}

export const FloorPlan = memo(({ slots, onSlotClick, userSlotIds }: FloorPlanProps) => {
  const { width, height } = FLOOR_PLAN_DIMENSIONS;

  return (
    <div className="w-full overflow-auto bg-white">
      <div className="min-w-fit mx-auto p-4">
        {/* Title */}
        <div className="mb-4 pl-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">S Parking</h2>
          <p className="text-sm text-muted-foreground">Floor 2F</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 pl-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-sm" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-500 rounded-sm" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded-sm" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-red-500 border-2 border-red-600 rounded-sm" />
            <span className="text-muted-foreground">Parked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-gray-400 border-2 border-gray-500 rounded-sm" />
            <span className="text-muted-foreground">Unavailable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded-sm" />
            <span className="text-muted-foreground">Emergency</span>
          </div>
        </div>

        {/* Floor Plan Canvas */}
        <div 
          className="relative bg-white border border-gray-200 rounded-lg shadow-sm mx-auto"
          style={{ width, height }}
        >
          {/* SVG for structural elements */}
          <svg 
            className="absolute inset-0 pointer-events-none" 
            width={width} 
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Left angled wall */}
            <path
              d="M 0 180 L 70 280 L 70 750 L 0 750 Z"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Top angled wall */}
            <path
              d="M 70 0 L 600 0 L 600 50 L 560 50 L 560 85 L 290 85 L 180 85 L 70 180 Z"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Right boundary */}
            <line x1="580" y1="85" x2="580" y2="750" stroke="#374151" strokeWidth="2" />

            {/* Bottom boundary */}
            <line x1="70" y1="750" x2="580" y2="750" stroke="#374151" strokeWidth="2" />

            {/* Fire shutter zone (hatched) */}
            <rect
              x={STRUCTURAL_ELEMENTS.fireShutter.x}
              y={STRUCTURAL_ELEMENTS.fireShutter.y}
              width={STRUCTURAL_ELEMENTS.fireShutter.width}
              height={STRUCTURAL_ELEMENTS.fireShutter.height}
              fill="url(#hatch)"
              stroke="#6b7280"
              strokeWidth="1"
            />

            {/* Hatch pattern definition */}
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#9ca3af" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Central aisle markers */}
            <rect
              x="170"
              y="270"
              width="8"
              height="470"
              fill="#e5e7eb"
            />

            {/* Driving lanes (horizontal) */}
            <rect x="90" y="265" width="480" height="15" fill="#f3f4f6" />
            <rect x="90" y="700" width="480" height="15" fill="#f3f4f6" />

            {/* Service zone label */}
            <text x="380" y="75" fontSize="8" fill="#6b7280" textAnchor="middle">
              Fire Shutter Zone
            </text>
          </svg>

          {/* Parking Slots */}
          {slots.map(slot => (
            <ParkingSlotComponent
              key={slot.id}
              slot={slot}
              onClick={onSlotClick}
              isUserSlot={userSlotIds.includes(slot.id)}
            />
          ))}

          {/* Entry label */}
          <div 
            className="absolute flex items-center justify-center text-xs text-muted-foreground font-medium"
            style={{
              left: STRUCTURAL_ELEMENTS.stairsEntry.x,
              top: STRUCTURAL_ELEMENTS.stairsEntry.y,
              width: STRUCTURAL_ELEMENTS.stairsEntry.width,
              height: STRUCTURAL_ELEMENTS.stairsEntry.height,
            }}
          >
            ↓ Enter to the stairs
          </div>

          {/* Floor indicator */}
          <div className="absolute bottom-4 right-4 text-2xl font-bold text-muted-foreground/30">
            2F
          </div>

          {/* Slot count */}
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
            Total: {slots.length} slots
          </div>
        </div>
      </div>
    </div>
  );
});

FloorPlan.displayName = 'FloorPlan';
